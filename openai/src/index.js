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


// let core = JSON.parse(fs.readFileSync('test.json', 'utf-8'))
let db = await readDB();



async function addObservation(url){
    // TODO url normalize function here
    let id = createHash('sha1').update(url).digest('hex')
    let observation = db.chain.get('observations').find({id}).value()
    // check if id exists
    if(!observation){
        // STORE THE TEXT
        observation = await getText(url)
        db.data["observations"].push({id, ...observation})
        await saveDB();
    }
    return id
}

async function addChunks(obsId){
    let observation = db.chain.get('observations').find({id:obsId}).value()
    if(!observation){
        throw new Error("observation does not exist")
    }
    let textSplits = splitText(observation.content)
    let o = optimizeSplits(textSplits)



    // STORE THE SPLITS
    return Promise.all(o.map(async text=>{
        let id = createHash('sha1').update(text).digest('hex');
        let chunk = db.chain.get('chunks').find({id}).value()
        if(!chunk){
            chunk = {
                id,
                tokens: countTokens(text),
                text,
            }
            db.data["chunks"].push(chunk)
            await saveDB()
        }

        if(!chunk.context){
            let title = observation.title || ''
            chunk.context = title + "\n\n" + chunk.text
            await saveDB()
        }

        if(!chunk.questions_raw){
            chunk.questions_raw = await getQuestions(chunk.context)
            chunk.questions = chunk.questions_raw.split("\n")
            await saveDB();
        }

        if(!chunk.answers_raw){
            chunk.answers_raw = await getAnswers(chunk.context, chunk.questions_raw)
            chunk.answers = chunk.answers_raw.split("\n")
            await saveDB();
        }
        if(!chunk.embedding){
            let {embedding, tokens} = await getEmbedding(chunk.text)
            chunk.embedding = embedding
            chunk.embedding_tokens = tokens
            await saveDB();
        }

        add(obsId+":"+chunk.id, chunk.embedding)
        return chunk

    }))
}

let obsId = await addObservation(url)
let chunks = await addChunks(obsId)

console.log(chunks)

//CREATE SEARCH EMBEDDING
let query 
try{
    query = JSON.parse(fs.readFileSync('query.json', 'utf-8'))
}catch(e){}
if(!query){
    let { embedding:query } = await getEmbedding("Who was the director of the Sabin Center?")
    fs.writeFileSync('query.json',JSON.stringify(query))
}

let results = await search(query)
console.log(JSON.stringify(results, null, 2));

