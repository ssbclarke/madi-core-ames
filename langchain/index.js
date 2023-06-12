import * as dotenv from 'dotenv'
dotenv.config()
import crypto from 'node:crypto'
import * as ui from './ui/console.ui.js'
import { Debug } from './logger.js'
import { redisClient } from './redis.js'
import { setupRecorder } from "./utils/nockRecord.js";
import { router } from './router/router.js'
import { typeOut } from './utils/typing.js';
import chalk from 'chalk'
/**
 * @typedef {import("./types.js").Metadata} Metadata 
 * @typedef {import("./types.js").ServerResponse} ServerResponse
 */

// Common Initializations
const debug = Debug(import.meta.url)


// Boot functions
ui.initializeConversation();
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













/**
 * Sends the relevant information from the client to the backend to the initial flow function
 * @param {string} message -
 * @param {Metadata} metadata - the metadata passed between client and server
 * @return {Promise} response -
 */
export const sendToBackend = async (message, { clientMemory, memId, flowKey, context }) => {
    debug({ memId, flowKey })
    if (!clientMemory) throw new Error(JSON.stringify(clientMemory))
    return router(message, { clientMemory, memId, flowKey, context })
}










// FIRST Message
let message = await ui.displayAndCapture("Hello! I'm Madi. How can I help you?", metadata)

// Start
while (i<maxIterations){
    const record = setupRecorder({mode:process.env.FLOW_NOCK_MODE});
    const { completeRecording } = await record(`${i}`.padStart(2,"0")+`_${inputs[i]}`.replace(/[^a-z0-9]/gi, '_').toLowerCase());

    if(enablePreBuild){
        message = inputs[i] || message;
        await typeOut(chalk.yellow(message),10,10,300,4000, true)
        process.stdin.write('\n')
    }

    let [AIresponse, newMetadata] = await sendToBackend(message, metadata)
    completeRecording()

    /* should only pass the following and forget the rest
    {
        context: {}
        flowKey: "key"
        clientMemory: []
        memId: ####
    }
    */

    message = await ui.displayAndCapture(AIresponse, newMetadata)

    Object.assign(metadata, newMetadata)
    i++;
}


// NEXT STEP IS TO MODIFY THE formatPrompt See chain/llm_chain.js
// const promptValue = await this.prompt.formatPromptValue(valuesForPrompt);


