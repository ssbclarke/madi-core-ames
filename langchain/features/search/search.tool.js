import { DynamicTool } from "langchain/tools";
import { setupRecorder } from "../../utils/nockRecord.js";
import { getIdFromText } from "../../utils/text.js";
import { SourceStore } from "../../storage/source.store.js";
import { parseBoolean } from "../../utils/boolean.js";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import * as dotenv from 'dotenv'
import { SEARCH_PROMPT } from "./search.prompt.js";
import { DataSource } from "typeorm";
import { OpenAI } from "langchain/llms/openai";
import { SqlDatabase } from "langchain/sql_db";
import { SqlDatabaseChain } from "langchain/chains";
dotenv.config()

// let sourceStore = await SourceStore();

// EXAMPLE INPUT: The trend is increasing water scarcity.  The need is water for drinking.  The capability is human jetpacks.

export const SearchTool = new DynamicTool({
    name: "search",
    description: "useful for searching for information on the web or in local databases. Input should be labelled: ALL, WEB, CONFLUENCE, OBSERVATIONS, REPORTS, SOURCES, NEW and then restate the user's question exactly and the current context.",
    verbose: parseBoolean(process.env.VERBOSE) && parseBoolean(process.env.DEBUG),
    returnDirect:true,
    func: async (input) => {

        const datasource =  new DataSource({
            type: "postgres",
            host: "localhost",
            port: 35432,
            username: "unicorn_user",
            password: "magical_password",
            database: "rainbow_database",
        });

        const db = await SqlDatabase.fromDataSourceParams({
            appDataSource: datasource,
            includesTables: ["source_sentiment"],
          });
          
        const chain = new SqlDatabaseChain({
            llm: new OpenAI({ temperature: 0 },{basePath:process.env.PROXY_PATH}),
            database: db,
            sqlOutputKey: "sql",
        });

        const {result, sql} = await chain.call({ query: "Make a bulleted list of the 10 categories with the fewest sources.  After each category give me the count as an integer AND as a percent of the total number of sources." });

        // const data = await chain.call({ query: "Make a bulleted list of the 10 categories with the average sentiment and the average's distance from the mean.  After each category tell me if the category is positive or negative where >0.5 is positive and <0.5 is negative."});

        // console.log(result, sql)
        const model = new OpenAI({ temperature: 0 },{basePath:process.env.PROXY_PATH});
        const prompt = PromptTemplate.fromTemplate(GAPS_PROMPT);
        const wrapUpChain = new LLMChain({ llm: model, prompt });
        const output = await wrapUpChain.call({ data:result, input });
        // console.log(output)

        if(output.text && output.text.indexOf("NO_ANSWER")>-1){
            // Attempt directly 
            const data = await chain.call({ query: input });
            return data.result
        }else{
            return output.text
        }
    }
})
