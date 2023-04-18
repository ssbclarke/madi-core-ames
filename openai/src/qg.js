
import { Configuration, OpenAIApi } from "openai"
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { JSONFile } from 'lowdb/node'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { encode, decode } from 'gpt-3-encoder'

const MIN_LENTH = 40
const MAX_LENGTH = 500
// import transformers from "@xenova/transformers";

// import * as ort from 'onnxruntime-node';


// let { GPT2Tokenizer, pipeline, env } = transformers;
// env.remoteModels = false;
// console.log(env)
// console.log(transformers)

dotenv.config()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
console.log(process.env.OPENAI_API_KEY)
const openai = new OpenAIApi(configuration); import { Low } from 'lowdb'



const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json')
let db


// let embedder = await pipeline('embeddings', 'sentence-transformers/all-MiniLM-L6-v2')





/**
 * TEXT UTILITIES
 */
function countTokens(text){
    return encode(text).length
}

function checkLength(text){
    return countTokens(text) >= MIN_LENTH && countTokens(text) <= MAX_LENGTH
}

function reduceLong(long_text, long_text_tokens = false, max_len = 590) {
    if (!long_text_tokens) {
        long_text_tokens = countTokens(long_text);
    }
    if (long_text_tokens > max_len) {
        let sentences = long_text.replace("\n", " ").split(/\.(\s)?/); // split at period and optional space
        let ntokens = 0;
        for (let i = 0; i < sentences.length; i++) {
            ntokens += 1 + countTokens(sentences[i]);
            if (ntokens > max_len) {
                return sentences.slice(0, i).join(". ") + ".";
            }
        }
    }
    return long_text;
}










/***
 * 
 */
function addContext(line) {
    db.context = df.title + "\n" + line.heading + "\n\n" + line.content
    return db
}

async function getQuestions(context) {
    return openai.createCompletion({
        model: 'davinci-instruct-beta-v3',
        prompt: `Write questions based on the text below\n\nText: ${context}\nQuestions:\n1.`,
        temperature: 0,
        max_tokens: 257,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: ["\n\n"]
    })
    .then(response => {
        return response.data['choices'][0]['text'];
    })
    .catch(error => {
        console.log(error)
        return '';
    })
}

async function getAnswers(row) {
    return openai.createCompletion({
            engine:"davinci-instruct-beta-v3",
            prompt:`Write answer based on the text below\n\nText: ${row.context}\n\nQuestions:\n${row.questions}\n\nAnswers:\n1.`,
            temperature:0,
            max_tokens:257,
            top_p:1,
            frequency_penalty:0,
            presence_penalty:0
    })
    .then(response => {
        return response.data['choices'][0]['text'];
    })
    .catch(error => {
        console.log(error)
        return '';
    })
}










/**
 * DATABASE UTILITIES
 */

// featch local data
export async function fetchDB() {
    const adapter = new JSONFile(file)
    db = new Low(adapter)
    await db.read()
    console.log(db.data)
    return db
}

export async function storeDBtoDisk() {
    await db.write()
}





/**
 * DATA MODIFICATIONS
 * 
 */

export async function appendQuestions(line) {
    // line['questions'] = await getQuestions(line);
    // line['questions'] = "1." + line.questions;
    // console.log(line['questions']);
    
}
export async function appendAnswers(line){
    line['answers'] = await getAnswers(line);
    line['answers'] = "1." + line.answers;
}


