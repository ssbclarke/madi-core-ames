import { PlaywrightWebBaseLoader } from "langchain/document_loaders/web/playwright";
import { extractFromHtml } from '@extractus/article-extractor'
import { getIdFromText } from "../../utils/text.js";
import { promises as fs } from 'fs';



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
