import { buildData, askQuestion } from './actions.js'
import urls from './data/urls.json' assert {type:"json"}


console.log('\n\n**********************\n\nBUILDING DATA SET IN MEMORY')
await buildData(urls)
console.log('COMPLETE!\n\n**********************\n\n')

let question
let answer

question = 'What was the first human-made object in space?'
answer = await askQuestion(question);
console.log(`QUESTION: ${question}\nANSWER: ${answer}\n\n`)

question = 'Who was the most popular host of America\'s Got Talent?'
answer = await askQuestion(question);
console.log(`QUESTION: ${question}\nANSWER: ${answer}\n\n`)


// const [ node, file, ...args ] = process.argv;
// question = args.join(' ');
// answer = await askQuestion(question);
// console.log(`QUESTION: ${question}\nANSWER: ${answer}\n\n`)


