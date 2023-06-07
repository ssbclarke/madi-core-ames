import * as knexPkg from 'knex';
const { knex } = knexPkg.default; // workaround for typescript compatability 

import * as dotenv from 'dotenv'
dotenv.config()
import { VectorStore } from "langchain/vectorstores";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { KnexVectorStore, KnexVectorStoreDocument } from './knex.js';
import encoding from './cl100k_base.json' assert {type:"json"};
import { Tiktoken } from "js-tiktoken/lite";
import { getIdFromText } from '../utils/text.js';

export class KnexCustomStore extends KnexVectorStore{
    constructor(embeddings, fields){
        super(embeddings, fields)
        this.hashFunc = fields.hashFunc ?? null
        this.hashField = fields.hashField ?? null
        this.embeddingText = fields.embeddingText ?? null
    }

    async ensureTableInDatabase() {
        await super.ensureTableInDatabase()
        // additionally creates hash checks
        await this.knex.raw(`CREATE UNIQUE INDEX IF NOT EXISTS hash_unique ON ${this.tableName}( (metadata->>'hash') ) ;`)
        // stores schema information in object format for use later;
        this.columnInfo = await this.knex(this.tableName).columnInfo();
    }

    static async fromDataSource(embeddings, fields){
        const postgresqlVectorStore = new KnexCustomStore(embeddings, fields);
        return postgresqlVectorStore;
    }
    async similaritySearchWithOffset(query, embedding, k, filter, offset=0){
        const embeddingString = `[${embedding.join(",")}]`;
        const _filter = filter ?? "{}";
        let documents = await this.knex
            .table(this.tableName)
            .select(this.knex.raw('*, embedding <=> ? as "_distance"',embeddingString))
            .whereJsonSupersetOf('metadata',_filter)
            .orderBy('_distance', 'asc')
            .limit(k)
            .offset(offset)

        const results = [];
        for (const doc of documents) {
            if (doc._distance != null && doc.pageContent != null) {
                const document = new KnexVectorStoreDocument(doc);
                document.id = doc.id;
                results.push([document, doc._distance]);
            }
        }
        return results;
    }
    async addVectors(vectors, documents) {
        const rows = vectors.map((embedding, idx) => {
            const embeddingString = `[${embedding.join(",")}]`;
            const documentRow = {
                pageContent: documents[idx].pageContent,
                embedding: embeddingString,
                metadata: documents[idx].metadata,
            };
            return documentRow;
        });
        const chunkSize = 500;
        for (let i = 0; i < rows.length; i += chunkSize) {
            const chunk = rows.slice(i, i + chunkSize);
            try {
                let response
                if(this.upsert && this.conflictColumn){
                    response = await this.knex
                        .insert(chunk)
                        .into(this.tableName)
                        .onConflict(this.knex.raw(`(("metadata"->>'hash'))`))
                        .ignore()
                }  else{
                    response = await this.knex.insert(chunk).into(this.tableName)
                }
                return response
            }
            catch (e) {
                console.error(e);
                throw new Error(`Error inserting: ${chunk[0].pageContent}`);
            }
        }
    }

    async find(filter, limit=10, select="*", skip=0){
        return this.knex
            .table(this.tableName)
            .select(select)
            .where(filter)
            .limit(limit)
            .offset(skip)
    }

    async patch(id, data, {limit=10, select="*", skip=0}){
        return this.knex
            .table(this.tableName)
            .where({id})
            .update(data, select)
    }

    async create(items){ // 
        let allowedKeys = Object.keys(this.columnInfo)
        if(!Array.isArray(items)){
            items = [items]
        }
        items = items.map(item=>{
            item = Object.fromEntries(Object.entries(item).filter(([key, value]) => allowedKeys.includes(key)));
            item = this.hashFunc(item, true)
            return item
        })

        let texts = items.map(this.embeddingText)
        let embeddings = await this.embeddings.embedDocuments(texts)

        items = items.map((item,i)=>{
            item.embedding = `[${embeddings[i].join(",")}]`;
            return item
        })

        return this.knex
            .insert(items,'*')
            .into(this.tableName)
            .onConflict(this.hashField)
            .ignore()
    }  

    async createOrRetrieveCallback(item, preCreateCallback){

        // normalize and hash the url
        let hash = this.hashFunc(item, false)

        let response = await this.find({[this.hashField]:hash})

        // if source doesn't exist in the DB
        if(response.length === 0){
            response = preCreateCallback ? await preCreateCallback(item) : response
            return this.create(response)
        }
        return response
    }
    


    // async createOrRetrieveCallback(doc, preCreateCallback){


    //     let hash = this.hashFunc(doc, false)

    //     let response = await this.find({[this.hashField]:hash})

    //     if(!response){
    //         response = preCreateCallback ? await preCreateCallback(doc) : response
    //         await this.create({...response, urlhash:id})
    //     }

    //     // get token length and hash for each doc
    //     let tokenizer = new Tiktoken(encoding);
    //     docs.forEach(doc => {
    //         const input_ids = tokenizer.encode(doc.pageContent, this.allowedSpecial || [], this.disallowedSpecial || []);
    //         doc.metadata.tokens = input_ids.length
    //         // get token length for each doc
    //         doc.metadata.hash = 
    //         doc.hash = doc.metadata.hash
    //     });
        
    //     doc.metadata.hash = getIdFromText(doc[hashField])
    //     doc.hash = doc.metadata.hash

    //     // normalize and hash the url
    //     let id = getIdFromText(normalizeUrl(url))

    //     // fetch the url from the DB
    //     let response = await this.find({urlhash:id})

    //     // if source doesn't exist in the DB, scrape it
    //     if(response.length === 0){
    //         response = await preCreateCallback(url)
    //         await this.create({...response, urlhash:id})
    //     }
    //     return response
    // }

}


const args = {
      upsert:true,
      conflictColumn:"metadata",
      connectionOptions: {
        migrations: {
            tableName: 'migrations'
        },
        // acquireConnectionTimeout: 10000,
        // pool: { min: 0, max:7 },
        debug: true,
        // type: "postgres",
        connection:{
            host: "localhost",
            port: 35432,
            user: "unicorn_user",
            password: "magical_password",
            database: "rainbow_database",
        }
      },
      schema: (table)=>{
            table.uuid('id').primary().defaultTo(knex({client: 'pg' }).raw('uuid_generate_v4()'))
            table.string('hash').unique()
            table.jsonb('metadata')
            table.text('pageContent')
            table.specificType('embedding','vector')
      },
      hashField: 'hash',
      hashFunc: (item, returnItem=false)=>{
        let hash = getIdFromText(item.pageContent)
        return returnItem ? {...item, hash}: hash
      },
      embeddingText: (item, returnItem)=>{
        return `${item.pageContent}`
      }
    }
    

let store = KnexCustomStore.fromDataSource(
    new OpenAIEmbeddings(),
    args
);
export const DocumentStore  = async ()=>{
    let ready = await store;
    await ready.ensureTableInDatabase()
    return ready
}