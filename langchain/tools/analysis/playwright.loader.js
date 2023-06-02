// import { getText, getHtml } from "langchain/tools/webbrowser";
// import * as cheerio from "cheerio";
// import { Tool } from "langchain/tools";
import { PlaywrightWebBaseLoader } from "langchain/document_loaders/web/playwright";
import { extractFromHtml } from '@extractus/article-extractor'


const loader = (options) => {
    let url = options?.url;

    return new PlaywrightWebBaseLoader(
        url,
        {
            launchOptions: {
                headless: true,
            },
            gotoOptions: {
                waitUntil: "domcontentloaded",
            }
        }
    )
};

export const scraper = async(url)=>{
    const docs  = await loader({url}).load();
    return await extractFromHtml(docs[0].pageContent, docs[0].metadata.source)
}

