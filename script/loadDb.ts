import {DataAPIClient} from "@datastax/astra-db-ts"
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import openai from "openai"
import "dotenv/config"

const {
    ASTRA_DB_NAMESPACE, 
    ASTRA_DB_COLLECTION, 
    ASTRA_DB_ENDPOINT, 
    ASTRA_DB_APPLICATION_TOKEN, 
    OPENAI_API_KEY
} = process.env

const openAi = new openai({apiKey: OPENAI_API_KEY})


const f1Data = [
    'https://www.astu.edu.et/9-about-astu',
    'https://www.tuumz.com/listing/adama-science-and-technology-university-astu/',
    'https://en.wikipedia.org/wiki/Adama_Science_and_Technology_University',
    'https://en.wikipedia.org/wiki/Education_in_Ethiopia',
    'https://en.wikipedia.org/wiki/Higher_education_in_Ethiopia'
]

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_ENDPOINT!, {keyspace: ASTRA_DB_NAMESPACE});