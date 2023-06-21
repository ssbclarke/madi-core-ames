import { buildData, askQuestion } from './actions.js'
import urls from './data/urls.json' assert {type:"json"}



console.log('\n\n**********************\n\nBUILDING DATA SET IN MEMORY')
await buildData(urls)
console.log('COMPLETE!\n\n**********************\n\n')


const print = (text)=>{
    // Dynamic Width (Build Regex)
    if(Array.isArray(text[1])){
        console.log(...text)
    }else{
        const wrap = (s, w) => s.replace(
            new RegExp(`([^\\n]{1,${w}})\\s`, 'g'), '$1\n'+' '.repeat(11)
        );
        console.log(text[0], wrap(text[1], 50))
    }
}

questions.map(async (question)=>{
    let { sources, answer } = await askQuestion(question);
        print(['QUESTION: ',question])
        print(['ANSWER:   ',answer])
        print(['SOURCES:  ',sources])
        console.log('\n')
})




// let q = [`QUESTION:`,`What was the first human-made object in space?`]
// let a = [`ANSWER:`,`The first human-made object in space was the Soviet Union's Sputnik 1 satellite, which was launched on October 4, 1957.`]



// await run()
// const [ node, file, ...args ] = process.argv;
// question = args.join(' ');
// answer = await askQuestion(question);
// console.log(`QUESTION: ${question}\nANSWER: ${answer}\n\n`)


