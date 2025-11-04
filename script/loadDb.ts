import {DataAPIClient} from "@datastax/astra-db-ts"
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { InferenceClient } from "@huggingface/inference";
import openai from "openai"
import "dotenv/config"

type similarityMetric = "dot_product" | "cosine" | "euclidean"

const {
    ASTRA_DB_NAMESPACE, 
    ASTRA_DB_COLLECTION, 
    ASTRA_DB_ENDPOINT, 
    ASTRA_DB_APPLICATION_TOKEN, 
    OPENAI_API_KEY,
    DEEPSEEK_API_KEY,
    HF_API_KEY
} = process.env

const openAi = new openai({ baseURL: "https://router.huggingface.co/v1", apiKey: HF_API_KEY})


const f1Data = [
    'https://www.astu.edu.et/9-about-astu',
    'https://www.tuumz.com/listing/adama-science-and-technology-university-astu/',
    'https://en.wikipedia.org/wiki/Adama_Science_and_Technology_University',
    'https://en.wikipedia.org/wiki/Education_in_Ethiopia',
    'https://en.wikipedia.org/wiki/Higher_education_in_Ethiopia'

]
const client = new InferenceClient(HF_API_KEY);
const Client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = Client.db(ASTRA_DB_ENDPOINT!, {keyspace: ASTRA_DB_NAMESPACE});
const splinter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 100
}) 
const createCollection = async(similarityMetric: similarityMetric = "dot_product") =>{
    const res = await db.createCollection(ASTRA_DB_COLLECTION, {
        vector: {
            dimension: 1536,
            metric: similarityMetric
        }
    })
    console.log(res)
}


// const client = new InferenceClient(process.env.HF_TOKEN);

// const output = await client.featureExtraction({
// 	model: "Qwen/Qwen3-Embedding-0.6B",
// 	inputs: "Today is a sunny day and I will get some ice cream.",
// 	provider: "hf-inference",
// });

//console.log(output);

const loadSampleData = async() =>{
    const collection = await db.collection(ASTRA_DB_COLLECTION)
    for await (const url of f1Data){
        const content = await scrapPage(url)
        const chunks = await splinter.splitText(content)
        for await ( const chunk of chunks){
            const embedding = await client.featureExtraction({
                model: "Qwen/Qwen3-Embedding-0.6B",
                inputs: chunk,
                provider: "hf-inference",
            })
            console.log(embedding)
        }
    }
}

const scrapPage = async (url: string) =>{
    const loader = new PuppeteerWebBaseLoader(url, {
        launchOptions: {
            headless: true,

        },
        gotoOptions: {
            waitUntil: "domcontentloaded"
        },
        evaluate: async (page, browser ) =>{
            const result = await page.evaluate(() => document.body.innerHTML)
            await browser.close()
            return result
        }
    })
    return (await loader.scrape())?.replace(/<[^>]*>?/gm, '')
}


createCollection().then(() => loadSampleData())