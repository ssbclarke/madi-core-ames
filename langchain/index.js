import * as dotenv from 'dotenv'
dotenv.config()
import crypto from 'node:crypto'
import Console, * as ui from './ui/console.ui.js'
import { Debug } from './logger.js'
import { redisClient } from './redis.js'
import { setupRecorder } from "./utils/nockRecord.js";
import { router } from './router/router.js'
import { parseBoolean } from './utils/boolean.js'
import * as proxyCache from './proxycache/proxycache.js'

/**
 * @typedef {import("./types.js").Metadata} Metadata 
 * @typedef {import("./types.js").ServerResponse} ServerResponse
 */

// Common Initializations
const debug = Debug(import.meta.url)


/**
 * Initialization of client side state
 */
let memId = crypto.randomBytes(5).toString('hex');
let clientMemory = [];
let routerKey = null;
let context = {};
let metadata = {
    clientMemory,
    routerKey,
    context,
    memId
}

if(parseBoolean(process.env.USE_PROXY)){
    process.env.BASE_PATH  = `http://localhost:${process.env.PROXY_PORT}/v1`
    proxyCache.initializeProxy()
}else{
    process.env.BASE_PATH  = 'https://api.openai.com/v1'
}


let i = 0
let maxIterations = 10
let enablePreBuild = true
let enableAutoRespond = true
let inputs = [
    "I'm James. How are you today?",
    "What can you do?",
    "I want to select an investigation",
    "Health & Wellness",
    "I want to add an article to my data.",
    "https://www.hhs.gov/about/news/2023/05/23/surgeon-general-issues-new-advisory-about-effects-social-media-use-has-youth-mental-health.html",
    "Can you generate a scenario based on that article?",
    "Remind me, what investigation am I working on?"
]


let UI = new Console({
    typing:false,
    spacePrefix: "       ",
    lineSpacing:1,
    debugFunc: (message,metadata)=>{
        let { context = {} } = metadata
        Debug("INVESTIGATION")(context.investigation)
        Debug("DOCUMENT")(context.currentDocument)
        Debug("SCOPE")(context.scope)
    }
})


// Boot functions
UI.initializeConversation();
await redisClient.connect()


/**
 * Sends the relevant information from the client to the backend to the initial flow function
 * @param {string} message -
 * @param {Metadata} metadata - the metadata passed between client and server
 * @return {Promise} response -
 */
export const sendToBackend = async (message, { clientMemory, memId, routerKey, context }) => {
    debug({ memId, routerKey })
    if (!clientMemory) throw new Error(JSON.stringify(clientMemory))
    return router(message, { clientMemory, memId, routerKey, context })
}

let message = await UI.displayAndCapture("Hello! I'm Madi. How can I help you?", metadata, enableAutoRespond?inputs[0]:null)

// Start
while (i<maxIterations){
    // const record = setupRecorder({mode:process.env.FLOW_NOCK_MODE});
    // const { completeRecording } = await record(`${i}`.padStart(2,"0")+`_${inputs[i]}`.replace(/[^a-z0-9]/gi, '_').toLowerCase());

    if(enablePreBuild){
        message = inputs[i] || message;
    }

    // if(i>4){
    //     console.log('here')
    // }


    let [AIresponse, newMetadata] = await sendToBackend(message, metadata)
    // completeRecording()

    /* should only pass the following and forget the rest
    {
        context: {}
        routerKey: "key"
        clientMemory: []
        memId: ####
    }
    */
    i++;
    message = await UI.displayAndCapture(AIresponse, newMetadata, enableAutoRespond?inputs[i]:null)
    Object.assign(metadata, newMetadata)

}

