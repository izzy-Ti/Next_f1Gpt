import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { DataAPIClient } from "@datastax/astra-db-ts";

const {
    ASTRA_DB_NAMESPACE, 
    ASTRA_DB_COLLECTION, 
    ASTRA_DB_ENDPOINT, 
    ASTRA_DB_APPLICATION_TOKEN, 
    OPENAI_API_KEY,
    DEEPSEEK_API_KEY,
    HF_API_KEY
} = process.env

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
})


const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)