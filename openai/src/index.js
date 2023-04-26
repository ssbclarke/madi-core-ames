import { getAnswers, getEmbedding, getQuestions } from './qg.js'
import { extract } from '@extractus/article-extractor'
import fs from 'fs'
import { countTokens, splitText, optimizeSplits } from './utils/text.js'
import { init, search, createIndex, add } from './search.js'
import { createHash } from 'crypto'
import {readDB, saveDB } from './storage.js'

await init(); //start redis 

const MIN_LENTH = 40
const MAX_LENGTH = 500
const TARGET_LENGTH = 250





let url = 'https://www.nytimes.com/2023/01/11/opinion/geoengineering-climate-change-solar.html'
// let url = 'https://www.independent.co.uk/news/world/americas/us-politics/mifepristone-ruling-supreme-court-scotus-abortion-b2324106.html'
// let url = 'https://archive.is/7CxIg'

async function getText(url){
    try {
        return await extract(url)
    } catch (err) {
        console.error(err)
    }
}


let core = JSON.parse(fs.readFileSync('test.json', 'utf-8'))
let db = await readDB();



async function addObservation(url){
    // TODO url normalize function here
    let id = createHash('sha1').update(url).digest('hex')
    let observation = db.chain.get('obsevations').find({id}).value()
    // check if id exists
    if(!observation){
        // GET THE TEXT
        let articleObj = await getText(url)
        
        // STORE THE TEXT
        db.get("observations")[id] = observation = articleObj
        saveDB();
    }
}

async function addChunks(obsId){
    let observation = db.chain.get('obsevations').find({id}).value()
    if(!observation){
        throw new Error("observation does not exist")
    }
    let textSplits = splitText(core.articleObj.content)
    let o = optimizeSplits(textSplits)



    // STORE THE SPLITS
    o.forEach(text=>{
        let id = createHash('sha1').update(text).digest('hex');
        let chunk = db.chain.get('chunks').find({id}).value()
        if(!chunk){
            db.get("chunks")[id] = {
                tokens: countTokens(text),
                text,
            }
            saveDB()
        }
    })
}


    if(!observation){
        // SPLIT THE TEXT

        // fs.writeFileSync('test.json',JSON.stringify(core, null, 2))
    }
    

}



if(!core.splits[0]?.embedding){
    // CREATE EMBEDDING PER SPLIT
    core.splits = await Promise.all(core.splits.map(async split=>{
        if(!split.embedding){
            let {embedding, tokens} = await getEmbedding(split.context)
            split.embedding = embedding
            split.embedding_tokens = tokens
        }
        return split
    }))
    fs.writeFileSync('test.json',JSON.stringify(core, null, 2))
}

// ITERATE SPLITS AND GENERATE QUESTIONS
if(!core.splits[0]?.questions_raw){
    core.splits = await Promise.all(core.splits.map(async split=>{
        let title = core.articleObj.title || ''
        split.context =  title + "\n\n" + split.text
        if(!split.questions_raw){
            split.questions_raw = await getQuestions(split.context, title.length)
        }
        return split
    }))
    // fs.writeFileSync('test.json',JSON.stringify(core, null, 2))
}


// STORE QUESTIONS
if(!core.splits[0]?.questions?.length>0){
    core.splits = core.splits.map(split=>{
        split.questions = split.questions_raw.split("\n")
        return split
    })
    // fs.writeFileSync('test.json',JSON.stringify(core, null, 2))
}

// ITERATE QUESTIONS AND GENERATE ANSWERS
if(!core.splits[0]?.answers_raw){
    core.splits = await Promise.all(core.splits.map(async split=>{
        if(!split.answers_raw){
            split.answers_raw = await getAnswers(split.context, split.questions_raw)
        }
        return split
    }))
    // fs.writeFileSync('test.json',JSON.stringify(core, null, 2))
}

// STORE ANSWERS
if(!core.splits[0]?.answers?.length>0){
    core.splits = core.splits.map(split=>{
        split.answers = split.answers_raw.split("\n")
        return split
    })
    // fs.writeFileSync('test.json',JSON.stringify(core, null, 2))

}

//CREATE SEARCH EMBEDDING
if(!core.query){
    let { embedding:query} = await getEmbedding("Who was the director of the Sabin Center?")
    core.query = query
    fs.writeFileSync('test.json',JSON.stringify(core, null, 2))
}

// CREATE KEYS
if(!core.splits[0]?.id){
    core.splits = core.splits.map(split=>{
        split.id = createHash('sha1').update(split.context).digest('hex');
        return split
    })
    // STORE EMBEDDING IN VSS
    
    await Promise.all(core.splits.map(split=>{
        return add(core.id+":"+split.id, split.embedding)
    }))
    await createIndex()
}


let results = await search(core.query)
// console.log(results)
console.log(JSON.stringify(results, null, 2));
// client.quit();


// fs.writeFileSync('test.json',JSON.stringify(core, null, 2))


