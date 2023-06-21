import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { extract } from '@extractus/article-extractor'
import lodash from 'lodash'
import { createHash } from 'crypto'
import { init, search, createIndex, add } from './search.js'
import { error } from 'node:console'
import { countTokens, splitText, optimizeSplits } from './utils/text.js'
import { getQuestions, getAnswers, getEmbedding } from './qg.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const file = join(__dirname, './data/db.json')

class LowWithLodash extends Low {
    chain = lodash.chain(this).get('data')
}

export function getIdFromText(text){
    return createHash('sha1').update(text).digest('hex')
}

/**
 * DATABASE UTILITIES
 */

// fetch local data
let db
export async function readDB() {
    const adapter = new JSONFile(file)
    const defaultData = { observations: [], chunks: [] }

    db = new LowWithLodash(adapter, defaultData)
    await db.read()
    return db
}
await readDB()

// save the current DB to disk
export async function saveDB() {
    await db.write()
}

export class ServiceClass {
    constructor(type){
        this.type = type
        this.db = db
    }
    async find(query) {
      return this.db.chain.get(this.type).filter(query).value()
    }
    async get(id, params) {
        return this.db.chain.get(this.type).find({id}).value()
    }
    async create(data, params) {
        if(!data.id){
            throw new error(`Must manually set id ${id}`)
        }
        let item = this.db.chain.get(this.type).find({id: data.id}).value()
        if(!item){
            this.db.data[this.type].push(data)
            await this.db.write()
            return data
        }
        return item
    }
    async update(id, data, params) {
        let item = this.db.chain.get(this.type).find({id}).value()
        Object.keys(item).forEach(key => delete item[key]);
        Object.assign(item, {id}, data)
        await this.db.write()
        return item
    }
    async patch(id, data, params) {
        let item = this.db.chain.get(this.type).find({id}).value()
        Object.assign(item,data)
        await this.db.write()
        return item
    }
    async remove(id, params) {
        let item = this.db.chain.get(this.type).find({id}).value()
        item = undefined
        await this.db.write()
        return item
    }
    async storeVec(key, value){
        try{
            return await add(key, value)
        }catch(e){
            console.log(e)
        }
    }
}

let observations = new ServiceClass('observations')
let chunks = new ServiceClass('chunks')
let queries = new ServiceClass('queries')


observations.fetchText = async function fetchText(id, params={}){
    // TODO url normalize function here
    let observation = await this.get(id)
    if(!observation){
        throw new error(`No Observation with id ${id}`)
    }
    let url = params.url || observation.url

    // check if content already exists or force is enabled
    if(!observation.content || params.force && !observation.scrapeError){
        // STORE THE TEXT
        let additions = await extract(url)
        if(!additions){
            console.warn(`   - Could not fetch data from ${url.replace(/https?:\/\//gi,"").slice(0,50)}...`);
            observation = await store.observations.patch(observation.id, {scrapeError:true})
        }else{
            observation = await store.observations.patch(observation.id, {...additions})
        }
    }
    return observation
}

chunks.createVector = async function createVectors(chunk){
    return chunks.storeVec(chunk.parent+":"+chunk.id, chunk.embedding)
}

chunks.createKey = (chunk)=>{
    return chunk.parent+":"+chunk.id
}
chunks.splitKey = (key)=>{
    let [parent, id] = key.split(":")
    return { parent, id }
}
chunks.createVectors = async (chunk)=>{
    return chunks.storeVec(store.chunks.createKey(chunk), chunk.embedding)
}

chunks.fetchQAE = async function fetchQAE(id,params){
    let title = params.title || ''
    let chunk = await this.get(id)
    if(!chunk){
        throw new error(`No Chunk with id ${id}`)
    }
    
    let context = title + "\n\n" + chunk.text

    if(!chunk.questions_raw){
        chunk.questions_raw = await getQuestions(context)
        chunk.questions = chunk.questions_raw.split("\n")
        // await saveDB();
    }

    // if(!chunk.answers_raw){
        chunk.answers_raw = await getAnswers(context, chunk.questions_raw)
        chunk.answers = chunk.answers_raw.split("\n")
        // await saveDB();
    // }
    if(!chunk.embedding){
        let {embedding, tokens} = await getEmbedding(context)
        chunk.embedding = embedding
        chunk.embedding_tokens = tokens
        // await saveDB();
    }

    await store.chunks.update(id,{...chunk})
    return chunk
}


observations.buildChunks = async function buildChunks(id, params={}){
    let observation = await this.get(id)

    // confirms content exists and avoids repeat builds
    if(observation.content && !observation.splitStatus
    ){
        let textSplits = splitText(observation.content)
        let o = optimizeSplits(textSplits) // this is computationally expensive
        let lens = o.map(e=>countTokens(e))
        // console.log(o.map(e=>countTokens(e)))

        // STORE THE SPLITS
        return Promise.all(o.map(async text=>{
            return chunks.create({
                id: getIdFromText(text),
                parent: id,
                tokens: countTokens(text),
                text,
            }).then(c=>chunks.fetchQAE(c.id,{title:observation?.title}))
        })).then(async r=>{
            await this.patch(id,{splitStatus:true})
            return r
        })
    }else{
        let list = await chunks.find({parent:id})
        return list
    }

}




let client = await init(); //start redis 
await createIndex()


export const store = {
    observations, chunks, redis:client, queries
}


