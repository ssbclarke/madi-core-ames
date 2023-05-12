
import { Configuration, OpenAIApi } from "openai"
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { fileURLToPath } from 'url';
import { RateLimiter } from "limiter-es6-compat";
import { dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const limiter = new RateLimiter({ tokensPerInterval: 2000, interval: "minute" });

// import transformers from "@xenova/transformers";

// import * as ort from 'onnxruntime-node';


// let { GPT2Tokenizer, pipeline, env } = transformers;
// env.remoteModels = false;
// console.log(env)
// console.log(transformers)

dotenv.config({
    path: __dirname + `/../.env`
})

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
// console.log(process.env.OPENAI_API_KEY)
export const openai = new OpenAIApi(configuration); 


// let embedder = await pipeline('embeddings', 'sentence-transformers/all-MiniLM-L6-v2')













/***
 * 
 */


export async function getQuestions(context) {
    // console.log(`\n GENERATING QUESTIONS FOR: `,context.slice(start+2,start+50))
    const remainingRequests = await limiter.removeTokens(1);
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
        let questions = "1." + response.data['choices'][0]['text'];
        // console.log(questions)
        return questions
    })
    .catch(error => {
        console.log('\n\n********* ERROR\n', `Write questions based on the text below\n\nText: ${context}\nQuestions:\n1.`)
        console.log(error?.response?.status,error?.response?.statusText)
        console.log(error?.response?.data?.error?.message)
        return '';
    })
}

export async function getAnswers(context, questions) {
    const remainingRequests = await limiter.removeTokens(1);
    return openai.createCompletion({
            model:"davinci-instruct-beta-v3",
            prompt:`Write answer based on the text below\n\nText: ${context}\n\nQuestions:\n${questions}\n\nAnswers:\n1.`,
            temperature:0,
            max_tokens:257,
            top_p:1,
            frequency_penalty:0,
            presence_penalty:0,
            stop: ["\n\n"]
    })
    .then(response => {
        let answers = "1." + response.data['choices'][0]['text'];
        // console.log(answers)
        return answers
    })
    .catch(error => {
        console.log(error)
        return '';
    })
}



export async function getEmbedding(input, model = "text-embedding-ada-002") {
    const remainingRequests = await limiter.removeTokens(1);
    return openai.createEmbedding({
        model,
        input
    })
    .then(response => {
        // console.log(response)
        return {embedding: response.data.data[0].embedding, tokens: response.data.usage.prompt_tokens}
    })
    .catch(error => {
        console.log(error)
        return '';
    })
}


export async function addToFineTuneModel(input, model = "text-embedding-ada-002") {
    const remainingRequests = await limiter.removeTokens(1);
    return openai.createEmbedding({
        model,
        input
    })
    .then(response => {
        // console.log(response)
        return {embedding: response.data.data[0].embedding, tokens: response.data.usage.prompt_tokens}
    })
    .catch(error => {
        console.log(error)
        return '';
    })
}








