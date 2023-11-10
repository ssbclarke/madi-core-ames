import * as dotenv from 'dotenv'
dotenv.config()
import inquirer from 'inquirer';
import { typeOut } from '../utils/typing.js';
import { router } from '../router/router.js'
import chalk from 'chalk';
import { Debug } from '../utils/logger.js'
import { wordWrap } from '../utils/text.js';
// import Prompt from 'inquirer/lib/prompts/base.js';
const debug = Debug(import.meta.url)
const UI_CHARS_PER_LINE = process.env.UI_CHARS_PER_LINE ?? 60

/**
 * @typedef {import("../types.js").Metadata} Metadata 
 * @typedef {import("../types.js").ServerResponse} ServerResponse
 */

let aiColor = (msg) => chalk.cyan(msg)
let aiPrefix = aiColor("AI:   ")
let humanPrefix = chalk.yellow("User:")
let spacePrefix = "       "




// // Clears the terminal
export const clearTerminal = () => {
    process.stdout.write("\x1B[3J"); // clear the screen and scrollback buffer
    process.stdout.write("\x1B[1J\x1B[H"); // move the cursor to the top-left corner
}





// class ConsolePrompt extends Prompt{
//   /**
//    * Generate the prompt question string
//    * @return {String} prompt question string
//    */
//   getQuestion() {
//     let message =
//       (this.opt.prefix ? this.opt.prefix + '' : '') +
//       chalk.bold(this.opt.message) +
//       this.opt.suffix +
//       chalk.reset('');

//     // Append the default if available, and if question isn't touched/answered
//     if (
//       this.opt.default != null &&
//       this.status !== 'touched' &&
//       this.status !== 'answered'
//     ) {
//       // If default password is supplied, hide it
//       if (this.opt.type === 'password') {
//         message += chalk.italic.dim('[hidden] ');
//       } else {
//         message += chalk.dim('(' + this.opt.default + ') ');
//       }
//     }

//     return message;
//   }
// }





let message = "Hello, I'm Madi."
let wrapMessage = (msg) => wordWrap(message, 60, spacePrefix) 
await typeOut(aiColor(aiPrefix+wrapMessage(message)))
process.stdout.write('\n')
let promptOpts = { name: chalk.yellow("\nUser"), prefix:"User:" } //prefix: "\n"+humanPrefix }
let prompt =  inquirer.prompt([{ ...promptOpts, message:' '}])

await prompt












/**
 * 
 * @param {string} message 
 * @param {Metadata} metadata
 * @returns {Promise<string>}
 */
export const displayAIResponse = async (message, metadata) => {
    let { responseType, choices = [], context = {} } = metadata
    let userResponse = { answer: "" }
    let promptOpts = { name: chalk.yellow("\nUser"), prefix:" " } //prefix: "\n"+humanPrefix }
    let wrapMessage = (msg) => wordWrap(message, 60, spacePrefix) 
    Debug("INVESTIGATION")(context.investigation)
    Debug("DOCUMENT")(context.currentDocument)
    Debug("SCOPE")(context.scope)

    

    switch (responseType) {
        case "list":
            userResponse = await inquirer.prompt([{ ...promptOpts, type: 'list', message:' ', choices }])
            break;
        // case "followup":  
        //     inquirer.prompt([{...promptOpts, message: wordWrap(message, 60, spacePrefix)}])
        //     process.stdin.write("\n")
        //     userResponse = await inquirer.prompt([{...promptOpts, message: aiColor("How else can I help?"+"\n"+humanPrefix)}]);
        //     break;
        case "open":
        default:
            userResponse = await inquirer.prompt([{ ...promptOpts, message: '' }])
            break;
    }
    return Promise.resolve(userResponse?.answer)
}






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

