import * as dotenv from 'dotenv'
dotenv.config()
import crypto from 'node:crypto'
import { sendToBackend, mergeMessageHistory, displayAIResponse, clearTerminal } from './ui/console.ui.js'
let memId = crypto.randomBytes(5).toString('hex');
import { Debug } from './logger.js'
const debug = Debug(import.meta.url)
import { redisClient } from './redis.js'

/**
 * @typedef {import("./types.js").Metadata} Metadata 
 * @typedef {import("./types.js").ServerResponse} ServerResponse
 */

clearTerminal(); //clears terminal history so that run is clean.
await redisClient.connect() // connect but don't wait around


/**
 * Initialization of client side state
 */
let clientMemory = [];
let input = null;
let flowKey = "hello";
let context = {};
let metadata = {
    clientMemory,
    flowKey,
    context
}

while (true){
    let [response, newMetadata] = await sendToBackend(input, metadata)
    /* should only pass the following and forget the rest
    {
        context: {}
        flowKey: "key"
        clientMemory: []
    }
    */
    metadata = {
        context:newMetadata.context,
        flowKey:newMetadata.nextFlowKey,
        clientMemory: newMetadata.clientMemory
    }
    input = await displayAIResponse(response, metadata)
}




























// while (unresolved) {
//     let answer
//     let output
//     if(input){
//         addMessageToHistory(input, 'human')
//         let {response, serverMemory, inquiryType, choices} = await runChain(input, clientMemory, memId)
//         clientMemory = [...serverMemory?.chatHistory?.messages]
//         output = response?.output
//     }
//     switch(inquiryType){
//         case "much":
//             message = response.output
//             answer = await inquirer.prompt([{name:'answer', type:'list', message, choices}])
//             break;
//         case "close":
//             unresolved = false;
//             break;
//         case "open":
//         default:
//             answer = await inquirer.prompt([{name:'answer', message: (output ? output + "\n\nHow else can I help?\n\n": "How can I help?\n")}]);
//             break;
//     }
//     input = answer?.answer || null;
// }

// const answerQuestion = async (question) => {
//     // construct the prompt, with our question and the tools that the chain can use
//     let prompt = promptTemplate.replace("${question}", question).replace(
//       "${tools}",
//       Object.keys(tools)
//         .map((toolname) => `${toolname}: ${tools[toolname].description}`)
//         .join("\n")
//     );


//     // allow the LLM to iterate until it finds a final answer
//     while (true) {
//       const response = await completePrompt(prompt);
//       // add this to the prompt
//       prompt += response;
//       const action = response.match(/Action: (.*)/)?.[1];
//       if (action) {
//         // execute the action specified by the LLMs
//         const actionInput = response.match(/Action Input: "?(.*)"?/)?.[1];
//         const result = await tools[action.trim()].execute(actionInput);
//         prompt += `Observation: ${result}\n`;
//       } else {
//         return response.match(/Final Answer: (.*)/)?.[1];
//       }
//     }
// };

// main loop - answer the user's questions

// await redisClient.disconnect();