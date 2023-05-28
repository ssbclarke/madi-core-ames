import * as dotenv from 'dotenv'
dotenv.config()
import inquirer from 'inquirer';
import { HumanChatMessage, AIChatMessage, SystemChatMessage } from "langchain/schema";
import { router } from '../agents/router.agent.js'
import chalk from 'chalk';
import { Debug } from '../logger.js'
const debug = Debug(import.meta.url)

/**
 * @typedef {import("./types.js").Metadata} Metadata 
 * @typedef {import("./types.js").ServerResponse} ServerResponse
 */

let aiColor     = (msg)=>chalk.cyan(msg)
let aiPrefix    = aiColor("AI:   ")
let humanPrefix = chalk.yellow("User: ")
let spacePrefix =             "       "


// Clears the terminal
export const clearTerminal = () =>{
    process.stdout.write("\x1B[3J"); // clear the screen and scrollback buffer
    process.stdout.write("\x1B[1J\x1B[H"); // move the cursor to the top-left corner
}

const wordWrap = (str, max, br = '\n  ') => str.replace(
    new RegExp(`(?![^\\n]{1,${max}}$)([^\\n]{1,${max}})\\s`, 'g'), '$1' + br
);

/**
 * 
 * @param {string} message 
 * @param {Metadata} metadata
 * @returns {string}
 */
export const displayAIResponse = async (message, metadata)=>{
    let {responseType, choices=[],context={}} = metadata
    let userResponse = {answer:""}
    let promptOpts = {name:'answer', prefix:aiPrefix}
    let wrapMessage = (msg)=>wordWrap(message, 60, "\n"+spacePrefix)+"\n"+humanPrefix
    Debug("INVESTIGATION")(context.investigation)
    Debug("DOCUMENT")(context.currentDocument)
    Debug("SCOPE")(context.scope)
    switch(responseType){
        case "list":
            userResponse = await inquirer.prompt([{...promptOpts, type:'list', message:aiColor(wrapMessage(message)), choices}])
            break;
        case "followup":  
            inquirer.prompt([{...promptOpts, message: wordWrap(message, 60, "\n"+spacePrefix)}])
            process.stdin.write("\n")
            userResponse = await inquirer.prompt([{...promptOpts, message: aiColor("How else can I help?"+"\n"+humanPrefix)}]);
            break;
        case "open":
        default:
            userResponse = await inquirer.prompt([{...promptOpts, message:aiColor(wrapMessage(message))}])
            break;
    }
    return [userResponse?.answer, metadata]
} 


/**
 * Sends the relevant information from the client to the backend to the initial flow function
 * @param {string} input -
 * @param {Metadata} metadata - the metadata passed between client and server
 * @return {Promise} response -
 */
export const sendToBackend = async (input, {clientMemory, memId, flowKey, context})=>{  
    debug({memId, flowKey})
    return router(input, {clientMemory, memId, flowKey, context})
}


/**
 * Client Side Memory Mgmt
 */
export const addMessageToHistory = (message, clientMemory, user="human")=>{
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
export const mergeMessageHistory = (clientMemory, serverMemory)=>{
    
    return clientMemory
}

