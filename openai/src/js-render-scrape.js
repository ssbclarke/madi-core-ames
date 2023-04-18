import { PuppeteerCrawler } from 'crawlee';
import puppeteerExtra from 'puppeteer-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';


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

// Create an instance of the PuppeteerCrawler class - a crawler
// that automatically loads the URLs in headless Chrome / Puppeteer.
const crawler = new PuppeteerCrawler({
    launchContext: {
        // !!! You need to specify this option to tell Crawlee to use puppeteer-extra as the launcher !!!
        launcher: puppeteerExtra,
        launchOptions: {
            // Other puppeteer options work as usual
            headless: true,
        },
    },

    // Stop crawling after several pages
    maxRequestsPerCrawl: 1,

    async requestHandler({ request, page, enqueueLinks, log }) {
        log.info(`Processing ${request.url}...`);
        await page.setRequestInterception(true);

        page.on('request', (req) => {
            if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
                req.abort();
            }
            else {
                req.continue();
            }
        })
        
        await page.waitForSelector('body');

        await waitForDOMToSettle(page);
        return await page.content()

    },

    failedRequestHandler({ request, log }) {
        log.error(`Request ${request.url} failed too many times.`);
    },
});

export async function runCrawler(urls){
    await crawler.addRequests(urls);
    return crawler.run()
}

export default crawler