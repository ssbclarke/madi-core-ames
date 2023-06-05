// import { getText, getHtml } from "langchain/tools/webbrowser";
// import * as cheerio from "cheerio";
// import { Tool } from "langchain/tools";
import { PlaywrightWebBaseLoader } from "langchain/document_loaders/web/playwright";
import { extractFromHtml } from '@extractus/article-extractor'
import { setupRecorder } from "nock-record";
import { getIdFromText } from "../../utils/text.js";
import { promises as fs } from 'fs';

// class NockablePlaywrightLoader extends PlaywrightWebBaseLoader{
//     constructor(webPath, options) {
//         super(webPath, options);
//         Object.defineProperty(this, "webPath", {
//             enumerable: true,
//             configurable: true,
//             writable: true,
//             value: webPath
//         });
//         Object.defineProperty(this, "options", {
//             enumerable: true,
//             configurable: true,
//             writable: true,
//             value: void 0
//         });
//         this.options = options ?? undefined;
//     }
//     static async _scrape(url, options) {
//         const { chromium } = await PlaywrightWebBaseLoader.imports();
//         const browser = await chromium.launch({
//             headless: true,
//             ...options?.launchOptions,
//         });
//         const page = await browser.newPage();
//         let hash = getIdFromText(url)

//         await page.route(url, async route=>{
//             // const record = setupRecorder();
//             let body = await readFile(`./___nock-fixtures__/pw_${hash}.json`,'utf8').catch(e=>null)
//             if(body){
//                 await route.fulfill({ body });
//             }else{
//                 await route.continue()
//                 // let response = await route.fetch()
//                 // await writeFile(`./___nock-fixtures__/pw_${hash}.json`,response)
//                 // await route.fulfill({response})
//             }            
//         })
        
//         // if(!page){
//             await page.goto(url, {
//                 timeout: 180000,
//                 waitUntil: "domcontentloaded",
//                 ...options?.gotoOptions,
//             }).then(async r=>{
//                 let response = await r.text()
//                 await writeFile(`./___nock-fixtures__/pw_${hash}.json`,response)
//                 console.log('in the goto')
//             })
//         // }


//         const bodyHTML = options?.evaluate
//             ? await options?.evaluate(page, browser)
//             : await page.content();
//         await browser.close();
//         return bodyHTML;
//     }
//     async scrape() {
//         return NockablePlaywrightLoader._scrape(this.webPath, this.options);
//     }


// }







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

export const scraper = async(url) => {
    let hash = getIdFromText(url);
    let page;
    let filename = `./__nock-fixtures__/pw_${hash}.json`
    try {
        page = await fs.readFile(filename, 'utf8');

    } catch (error) {
        if (error.code === 'ENOENT') {
            const docs = await loader({url}).load();
            let result = await extractFromHtml(docs[0].pageContent, docs[0].metadata.source);
            await fs.writeFile(filename, JSON.stringify(result));
            return result;

        } else {
            console.log(error);
            return null;
        }
    }

    return page ? JSON.parse(page) : null;
}
