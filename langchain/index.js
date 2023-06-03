import * as dotenv from 'dotenv'
import crypto from 'node:crypto'
import { sendToBackend, displayAIResponse, clearTerminal } from './ui/console.ui.js'
import { Debug } from './logger.js'
import { redisClient } from './redis.js'
import { setupRecorder } from "nock-record";

/**
 * @typedef {import("./types.js").Metadata} Metadata 
 * @typedef {import("./types.js").ServerResponse} ServerResponse
 */


import inquirer from 'inquirer';


// // // Common Initializations
dotenv.config()
const debug = Debug(import.meta.url)



// Boot functions
try{
    clearTerminal(); //clears terminal history so that run is clean.
    await redisClient.connect()
}catch(e){
    console.log(e)
}
// .then(()=>{
//     // debug("Client connected.");
// }) // connect but don't wait around





/**
 * Initialization of client side state
 */
let memId = crypto.randomBytes(5).toString('hex');
let clientMemory = [];
let flowKey = "hello";
let context = {};
let metadata = {
    clientMemory,
    flowKey,
    context,
    memId
}

await inquirer.prompt({name:"yes", question: "hello!"})

let message = await displayAIResponse("Hello! I'm Madi. How can I help you?", metadata)

let i = 0
let maxIterations = 10
let enableRecording = true
let enablePreBuild = true
let inputs = [
    // "I'm James. How are you today?",
    // "What can you do?",
    // "I want to select an investigation",
    // "I want to add an article to my data.",
    // "https://www.nytimes.com/2023/05/29/business/debt-ceiling-agreement.html",
    // "Can you summarize the article I just gave you?"
    "I want you to summarize this article: https://www.nytimes.com/2023/05/29/business/debt-ceiling-agreement.html "
]


while (i<maxIterations){
    let finishRecording
    if(enableRecording){
        const record = setupRecorder({mode:"record"});
        const { completeRecording } = await record(`${i}`.padStart(2,"0")+`_${inputs[i]}`.replace(/[^a-z0-9]/gi, '_').toLowerCase());
        finishRecording = completeRecording
        
    }
    if(enablePreBuild){
        message = inputs[i] || message;
    }

    let [response, newMetadata] = await sendToBackend(message, metadata)

    /* should only pass the following and forget the rest
    {
        context: {}
        flowKey: "key"
        clientMemory: []
        memId: ####
    }
    */
    message = await displayAIResponse(response, newMetadata)
    
    if(enableRecording){
        finishRecording()
    }
    i++;
}


// NEXT STEP IS TO MODIFY THE formatPrompt See chain/llm_chain.js
// const promptValue = await this.prompt.formatPromptValue(valuesForPrompt);


