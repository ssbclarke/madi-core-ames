import * as dotenv from 'dotenv'
dotenv.config()
import crypto from 'node:crypto'
import { 
    sendToBackend, 
    displayAIResponse, 
    clearTerminal 
} from './ui/console.ui.js'
import { Debug } from './logger.js'
import { redisClient } from './redis.js'
import { setupRecorder } from "./utils/nockRecord.js";

/**
 * @typedef {import("./types.js").Metadata} Metadata 
 * @typedef {import("./types.js").ServerResponse} ServerResponse
 */

// Common Initializations
const debug = Debug(import.meta.url)


// Boot functions
clearTerminal(); //clears terminal history so that run is clean.
await redisClient.connect()




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


let message = await displayAIResponse("Hello! I'm Madi. How can I help you?", metadata)

let i = 0
let maxIterations = 10
let enablePreBuild = true
let inputs = [
    "I'm James. How are you today?",
    "What can you do?",
    "I want to select an investigation",
    "GeoEngineering",
    "I want to add an article to my data.",
    "https://www.nytimes.com/2023/05/29/business/debt-ceiling-agreement.html"
]


while (i<maxIterations){
    // let finishRecording
    const record = setupRecorder({mode:process.env.FLOW_NOCK_MODE});
    const { completeRecording } = await record(`${i}`.padStart(2,"0")+`_${inputs[i]}`.replace(/[^a-z0-9]/gi, '_').toLowerCase());

    if(enablePreBuild){
        message = inputs[i] || message;
    }
    process.stdin.write(message)

    let [response, newMetadata] = await sendToBackend(message, metadata)
    completeRecording()

    /* should only pass the following and forget the rest
    {
        context: {}
        flowKey: "key"
        clientMemory: []
        memId: ####
    }
    */

    // message = async ()=>{
    if(enablePreBuild){
        let output = displayAIResponse(response, newMetadata)
        process.stdin.write(message)
        output.cancel()
    }else{
        message = await displayAIResponse(response, newMetadata)
    }
        // message = Promise.resolve(output)
        // message = output
    // }

    Object.assign(metadata, newMetadata)
    i++;
}


// NEXT STEP IS TO MODIFY THE formatPrompt See chain/llm_chain.js
// const promptValue = await this.prompt.formatPromptValue(valuesForPrompt);


