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
  
const launchContext = {
  launcher: puppeteerExtra,
  launchOptions: {
      headless: false,
      slowMo: 250,
  },
};

async function requestHandler({ request, page, enqueueLinks, log }){
  log.info(`Processing ${request.url}...`);
  datastorage = await archiveCheck(page);
}
const errorHandler = (context)=>{
  console.log(context)
};
const failedRequestHandler = ({ request, log })=>{
  log.error(`Request ${request.url} failed too many times.`);
};



const crawler = new PuppeteerCrawler({
    launchContext,
    maxRequestsPerCrawl: 1,
    requestHandler,
    errorHandler,
    failedRequestHandler
});



export async function runCrawler(url){
    await crawler.addRequests([url]);
    await crawler.run()
    let output = datastorage
    datastorage = null;
    return output;
}

export async function runArchiveCrawler(url){
  let datastorage = ''
  await crawler.addRequests([`https://archive.today/newest/${url}`]);
  await crawler.run()
  let output = datastorage
  datastorage = null;
  return output;
}