import inquirer from 'inquirer';
import { ChatMessageHistory } from "langchain/memory";
import { HumanChatMessage, AIChatMessage, SystemChatMessage } from "langchain/schema";
import { BufferMemory } from "langchain/memory"
import { flowPicker } from './chains.js'
import { redisClient } from './redis.js'
import crypto from 'node:crypto'

/**
 * @typedef {import("./types.js").Metadata} Metadata 
 * @typedef {import("./types.js").ServerResponse} ServerResponse
 */



/**
 * Initialization of client side state
 */
let clientMemory  = [];
let serverMemory;
let input = null;
let flowKey = "hello";
let context = {};
let memId = crypto.randomBytes(5).toString('hex');


/**
 * Client Side Memory Mgmt
 */
const addMessageToHistory = (message, user="human")=>{
    let added
    switch(user){
        case 'ai':
            added = new AIChatMessage(message)
            break;
        case 'system':
            added = new SystemChatMessage(message)
            break;
        case 'human':
        default:
            added = new HumanChatMessage(message)
    }
    clientMemory.push(added);
}
const setMessageHistory = (messages=[])=>{
    clientMemory = [...messages]
}



/**
 * Sends the relevant information from the client to the backend to the initial flow function
 * @param {string} input -
 * @param {Metadata} metadata - the metadata passed between client and server
 * @return {Promise} response -
 */
const sendToBackend = async (input, {clientMemory, memId, flowKey, context})=>{  
    console.log(`using memId: ${memId}`)
    console.log(`using flowKey: ${flowKey}`)
    return flowPicker(input, {clientMemory, memId, flowKey, context})
}





const displayAIResponse = async (aiResponse, type, choices)=>{
    let message = aiResponse.output
    let userResponse = {answer:""}
    switch(type){
        case "much":
            userResponse = await inquirer.prompt([{name:'answer', type:'list', message, choices}])
            break;
        case "open":
        default:
            userResponse = await inquirer.prompt([{name:'answer', message: message + "\n"}])
            // answer = await inquirer.prompt([{name:'answer', message: (output ? output + "\n\nHow else can I help?\n\n": "How can I help?\n")}]);
            break;
    }
    return userResponse?.answer
} 


while (true){
        let [response, {serverMemory, type, choices, nextFlowKey}] = await sendToBackend(input, {clientMemory, memId, flowKey, context})
        flowKey=nextFlowKey
        addMessageToHistory(response.output, 'ai')
        setMessageHistory(serverMemory?.chatHistory?.messages)
        input = await displayAIResponse(response, type, choices)
    
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