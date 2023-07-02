import { DataSource } from "typeorm";
import { OpenAI } from "langchain/llms/openai";
import { SqlDatabase } from "langchain/sql_db";
import { SqlDatabaseChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import * as dotenv from 'dotenv'
import { GAPS_PROMPT } from "./features/gaps/gaps.prompt.js";
dotenv.config()
/**
 * This example uses Chinook database, which is a sample database available for SQL Server, Oracle, MySQL, etc.
 * To set it up follow the instructions on https://database.guide/2-sample-databases-sqlite/, placing the .db file
 * in the examples folder.
 */

let input = "What categories need more sources?"

const datasource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB
});

const db = await SqlDatabase.fromDataSourceParams({
    appDataSource: datasource,
    includesTables: ["source_sentiment"],
  });
  
const chain = new SqlDatabaseChain({
    llm: new OpenAI({ temperature: 0 }),
    database: db,
    sqlOutputKey: "sql",
});

const data = await chain.call({ query: "Make a bulleted list of the 10 categories with the fewest sources.  After each category give me the count as an integer AND as a percent of the total number of sources." });

console.log(data)

const model = new OpenAI({ temperature: 0 });
const prompt = PromptTemplate.fromTemplate(GAPS_PROMPT);
const wrapUpChain = new LLMChain({ llm: model, prompt });
const output = await wrapUpChain.call({ data, input });
if(output.text && output.text.indexOf("NO_ANSWER")>-1){
    // Attempt directly 
    const data = await chain.call({ query: input });
    console.log('BAD RESULT', data.result)
}else{
    console.log(data.text)
}


/* Expected result:
 * {
 *   result: ' There are 3503 tracks.',
 *   sql: ' SELECT COUNT(*) FROM "Track";'
 * }
 */
// There are 3503 tracks.