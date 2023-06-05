// import { DataSource, EntitySchema } from "typeorm";
import knex from 'knex';

import * as dotenv from 'dotenv'
dotenv.config()
import { VectorStore } from "langchain/vectorstores";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { KnexVectorStore, KnexVectorStoreDocument } from './knex.js';


export class KnexCustomStore extends KnexVectorStore{
    constructor(embeddings, fields){
        super(embeddings, fields)
    }
    async ensureTableInDatabase() {
        await super.ensureTableInDatabase()
        // additionally creates hash checks
        await this.knex.raw(`CREATE UNIQUE INDEX IF NOT EXISTS hash_unique ON ${this.tableName}( (metadata->>'hash') ) ;`)    
    }
    async fromDataSource(embeddings, fields){
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
}


const args = {
      upsert:true,
      conflictColumn:"metadata",
      connectionOptions: {
        migrations: {
            tableName: 'migrations'
        },
        acquireConnectionTimeout: 10000,
        pool: { min: 0, max:7 },
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
            table.specificType('embedding','vector')
            table.jsonb('metadata')
            table.text('pageContent')
            table.uuid('id')
       }
    }
    
export const DocumentStore  = await KnexCustomStore.fromDataSource(
    new OpenAIEmbeddings(),
    args
);