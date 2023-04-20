import { PuppeteerCrawler } from 'crawlee';
import puppeteerExtra from 'puppeteer-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';
let datastorage = null;

puppeteerExtra.use(stealthPlugin());

const waitForDOMToSettle = (page, timeoutMs = 30000, debounceMs = 1000) =>
  page.evaluate(
    (timeoutMs, debounceMs) => {
      let debounce = (func, ms = 1000) => {
        let timeout;
        return (...args) => {
          console.log("in debounce, clearing timeout again");
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            func.apply(this, args);
          }, ms);
        };
      };
      return new Promise((resolve, reject) => {
        let mainTimeout = setTimeout(() => {
          observer.disconnect();
          reject(new Error("Timed out whilst waiting for DOM to settle"));
        }, timeoutMs);
 
        let debouncedResolve = debounce(async () => {
          observer.disconnect();
          clearTimeout(mainTimeout);
          resolve();
        }, debounceMs);
 
        const observer = new MutationObserver(() => {
          debouncedResolve();
        });
        const config = {
          attributes: true,
          childList: true,
          subtree: true,
        };
        observer.observe(document.body, config);
      });
    },
    timeoutMs,
    debounceMs
  );
 



async function archiveCheck(page){
  return await page.waitForSelector('center > #HEADER > table a[href="https://archive.today"]');
  return await page.content()
}
  








// Create an instance of the PuppeteerCrawler class - a crawler
// that automatically loads the URLs in headless Chrome / Puppeteer.
const crawler = new PuppeteerCrawler({
    launchContext: {
        // !!! You need to specify this option to tell Crawlee to use puppeteer-extra as the launcher !!!
        launcher: puppeteerExtra,
        launchOptions: {
            // Other puppeteer options work as usual
            headless: false,
            slowMo: 250,
        },
    },

    // Stop crawling after several pages
    maxRequestsPerCrawl: 1,

    async requestHandler({ request, page, enqueueLinks, log }) {
        log.info(`Processing ${request.url}...`);
        // await page.setRequestInterception(true);
        // page.on('request', (req) => {
        //     if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
        //         req.abort();
        //     }
        //     else {
        //         req.continue();
        //     }
        // })
        // if (await page.$('article') !== null) {
        //   let article = await page.$('article')
        //   datastorage = article.evaluate(el => el.textContent)
        // }
        // await page.waitForSelector('article');

        // await page.waitForSelector('main');
        // await page.waitForSelector('article');
        // await new Promise(r => setTimeout(r, 15000));

        // ARCHIVE.IS SEARCH
        // Go to the website 
        // await page.goto(`https://archive.today/newest/${request.url}`);
          // await page.waitForSelector('#row0')
          // let archiveLink = await page.$eval('#row0 a', el => el.href)
      
          // await page.goto(archiveLink); 
          await page.waitForSelector('center > #HEADER > table a[href="https://archive.today"]');
          datastorage = await page.content()
          console.log(datastorage)

        return page.content();
        
    },
    errorHandler(context) {
      console.log(context)
      // context.log.error(JSON.stringify(context));
    },
    failedRequestHandler({ request, log }) {
        log.error(`Request ${request.url} failed too many times.`);
    },
});

export async function runCrawler(url){
    await crawler.addRequests([url]);
    await crawler.run()
    let output = datastorage
    datastorage = null;
    return output;
}

export async function runArchiveCrawler(url){
  await crawler.addRequests([`https://archive.today/newest/${url}`]);
  await crawler.run()
  let output = datastorage
  datastorage = null;
  return output;
}

export default crawler