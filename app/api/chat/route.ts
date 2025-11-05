import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { InferenceClient } from "@huggingface/inference";
import { DataAPIClient } from "@datastax/astra-db-ts";
import { json } from "stream/consumers";

const {
    ASTRA_DB_NAMESPACE, 
    ASTRA_DB_COLLECTION, 
    ASTRA_DB_ENDPOINT, 
    ASTRA_DB_APPLICATION_TOKEN, 
    OPENAI_API_KEY,
    DEEPSEEK_API_KEY,
    HF_API_KEY
} = process.env

const openAi = new OpenAI({ baseURL: "https://router.huggingface.co/v1", apiKey: HF_API_KEY})

const hfClient = new InferenceClient(HF_API_KEY);

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)


const db = client.db(ASTRA_DB_ENDPOINT!, {keyspace: ASTRA_DB_NAMESPACE});


export async function POST(req: Request){
    try{
        const {messages} = await req.json()
        const lastMessage = messages[messages?.length - 1]?.content

        let docContext = "" 

        const embedding = await hfClient.featureExtraction({
            model:  "sentence-transformers/all-mpnet-base-v2",
            inputs: lastMessage,
        })
        try{
            const collection = await db.collection(ASTRA_DB_COLLECTION)
            const cursor  = collection.find( null, {
                sort: {
                    $vector: embedding.flat(2) as number[],
                },
                limit: 10
                }
            )

            const documents = await cursor.toArray()
            const docMap = documents?.map(doc=> doc.text)

            docContext = JSON.stringify(docMap)
        }catch(error){
            console.log(error.message)
        }

        const template = {
            role: 'system',
            content: `
        You are Israel's personal AI assistant. You have access to detailed information about Israel's professional background, skills, and projects.

        CONTEXT ABOUT ISRAEL:
        ${docContext}

        IMPORTANT INSTRUCTIONS:
        1. Answer questions about Israel based ONLY on the provided context above
        2. If the context contains relevant information, provide detailed and accurate answers
        3. If the question cannot be answered with the provided context, politely say:
        "I don't have enough information about that specific topic in my knowledge base. Please reach out to Israel directly via inbox for more detailed answers!"
        4. Be professional, helpful, and enthusiastic when discussing Israel's work
        5. Focus on his expertise in fullstack development, blockchain, and AI automation
        6. Never make up or hallucinate information - stick strictly to what's in the context

        Current conversation context: ${JSON.stringify(messages.slice(0, -1))}

        Now respond to the user's question: "${lastMessage}"
            `
        }

        const response = await hfClient.chatCompletion({
            model:  "microsoft/DialoGPT-large", // Use chat model here
            messages: [template, ...messages],
            max_tokens: 500,
        })

        return new Response(JSON.stringify({
            message: response.choices[0]?.message?.content
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }catch(error){
        console.log(error.message)
        return new Response(
            JSON.stringify({
                message: "An error occurred while processing your request.",
                error: error.message,
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
}