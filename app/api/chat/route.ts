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

const openAi = new OpenAI({ baseURL: 'https://api.deepseek.com', apiKey: DEEPSEEK_API_KEY})

const hfClient = new InferenceClient(HF_API_KEY);

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)


const db = client.db(ASTRA_DB_ENDPOINT!, {keyspace: ASTRA_DB_NAMESPACE});


export async function POST(req: Request){
    try{
        const {messages} = await req.json()
        const lastMessage = messages[messages?.length - 1]?.content

        let docContext = "" 

        const embedding = await hfClient.featureExtraction({
            model: "intfloat/multilingual-e5-large",
            inputs: lastMessage,
            provider: "hf-inference",
        })
        
        // Flatten embedding to 1D array (1024 dimensions)
        const embeddingVector = Array.isArray(embedding) 
            ? embedding.flat(Infinity) as number[]
            : [];
        
        if (embeddingVector.length !== 1024) {
            throw new Error(`Invalid embedding dimension: expected 1024, got ${embeddingVector.length}`);
        }
        
        try{
            const collection = await db.collection(ASTRA_DB_COLLECTION)
            const cursor  = collection.find({}, {
                sort: {
                    $vector: embeddingVector,
                },
                limit: 10
            })

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

        // Build prompt from messages for text generation
        const userMessage = messages[messages.length - 1]?.content || "";
        const prompt = `${template.content}\n\nUser: ${userMessage}\n\nAssistant:`;
        
        // Use free HuggingFace text generation (works better than chatCompletion for free models)
        const response = await hfClient.textGeneration({
            model: "google/flan-t5-base",
            inputs: prompt,
            parameters: {
                max_new_tokens: 500,
                temperature: 0.7,
                return_full_text: false,
            },
        });

        // Convert to streaming response
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                const content = response.generated_text || "I'm unable to process your request.";
                const chunks = content.split(' ');
                for (const chunk of chunks) {
                    controller.enqueue(encoder.encode(chunk + ' '));
                    await new Promise(resolve => setTimeout(resolve, 20));
                }
                controller.close();
            }
        });
        
        return new StreamingTextResponse(stream);
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