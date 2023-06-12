import * as dotenv from 'dotenv'
dotenv.config()
// import inquirer from 'inquirer';
import { typeOut } from '../utils/typing.js';
import { router } from '../router/router.js'
import chalk from 'chalk';
import { Debug } from '../logger.js'
import { wordWrap } from '../utils/text.js';
import input from './input.inquirer.js';
import select from './select.inquirer.js';
import input2 from './input.js'

const debug = Debug(import.meta.url)
const UI_CHARS_PER_LINE = process.env.UI_CHARS_PER_LINE ?? 60

/**
 * @typedef {import("../types.js").Metadata} Metadata 
 * @typedef {import("../types.js").ServerResponse} ServerResponse
 * @typedef {import("./input.inquirer.js").PromptFunc} PromptFunc
 * @typedef {import("./input.inquirer.js").PromptConfig} PromptConfig
 */


let aiColor = (msg) => chalk.cyan(msg)
let aiPrefix = aiColor("AI:    ")
let humanPrefix = chalk.yellow("User:  ")
let spacePrefix = "       "




// // Clears the terminal
export const clearTerminal = () => {
    process.stdout.write("\x1B[3J"); // clear the screen and scrollback buffer
    process.stdout.write("\x1B[1J\x1B[H"); // move the cursor to the top-left corner
}








export const initializeConversation = ()=>{
    clearTerminal(); //clears terminal history so that run is clean.
}




/**
 * 
 * @param {string} message 
 * @param {Metadata} metadata
 * @returns {Promise<string>}
 */
export const displayAndCapture = async (message, metadata) => {
    let { responseType, choices = [], context = {} } = metadata
    let userResponse = {}
    // let promptOpts = { name: chalk.yellow("\nUser"), prefix:" " } //prefix: "\n"+humanPrefix }
    Debug("INVESTIGATION")(context.investigation)
    Debug("DOCUMENT")(context.currentDocument)
    Debug("SCOPE")(context.scope)

    // Display the AI Response
    let wrapMessage = (msg) => wordWrap(message, 60, spacePrefix) 
    await typeOut(aiColor(aiPrefix+wrapMessage(message)),1000,100,500)
    process.stdout.write('\n')


    // Display the User Prompt
    switch (responseType) {
        case "list":
            userResponse = input({message:"", prefix: humanPrefix})
            break;
        // case "followup":  
        //     inquirer.prompt([{...promptOpts, message: wordWrap(message, 60, spacePrefix)}])
        //     process.stdin.write("\n")
        //     userResponse = await inquirer.prompt([{...promptOpts, message: aiColor("How else can I help?"+"\n"+humanPrefix)}]);
        //     break;
        case "open":
        default:
            userResponse = input({message:"", prefix: humanPrefix})
            break;
    }
    return Promise.resolve(userResponse?.answer)



}







