import * as dotenv from 'dotenv'
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { TypeORMVectorStore } from "langchain/vectorstores/typeorm";
dotenv.config()


// const args = {
//     postgresConnectionOptions: {
//       type: "postgres",
//       host: "localhost",
//       port: 35432,
//       username: "unicorn_user",
//       password: "magical_password",
//       database: "rainbow_database",
//     },
// };
// const typeormVectorStore = await TypeORMVectorStore.fromDataSource(
//     new OpenAIEmbeddings(),
//     args
// );


export const addDocs = async (docs)=>{
    // await typeormVectorStore.ensureTableInDatabase();
    // return typeormVectorStore.addDocuments(docs);
}

export const searchDocs = async (query, number, filter)=>{
    // return typeormVectorStore.similaritySearch(query, number, filter);

}

// await addDocs([
//     { pageContent: "what's this", metadata: { a: 2 } },
//     { pageContent: "Cat drinks milk", metadata: { a: 1 } },
// ]);

// console.log(await searchDocs("cat", 5, null, "(metadata->>'a')::int >= 2"))