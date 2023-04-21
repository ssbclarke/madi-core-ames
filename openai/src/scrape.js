import { convert } from 'html-to-text';
import fetch from 'node-fetch';
import { URL } from 'url';
import robotsParser from 'robots-parser';
import metascraper from 'metascraper';
import metascraperUrl from 'metascraper-url';
import metascraperTitle from 'metascraper-title';
import metascraperImage from 'metascraper-image';
import metascraperDate from 'metascraper-date';
import metascraperDescription from 'metascraper-description';
import metascraperPublisher from 'metascraper-publisher';
import metascraperLogo from 'metascraper-logo';
import metascraperIframe from 'metascraper-iframe';
import metascraperLang from 'metascraper-lang';
import metascraperReadability from 'metascraper-readability';
import metascraperVideo from 'metascraper-video';
import metascraperLogoFavicon from 'metascraper-logo-favicon';
import metascraperAuthor from 'metascraper-author';
import metascraperAudio from 'metascraper-audio';
import { runArchiveCrawler, runCrawler } from './js-render-scrape.js'
import { gotScraping } from 'got-scraping';



export const getRobotsUrl = (url) => {
  const { protocol, host } = new URL(url);
  return protocol + '//' + host + '/robots.txt';
};

export const getStaticHTML = async (url) => {
  const response = await gotScraping(url)
  return response.body;
};

export const getMetadata = async (url, html) => {
  if (!html) {
    const response = await fetch(url);
    html = await response.text();
    url = response.url;
  }
  const output = await metascraper([
    metascraperUrl(),
    metascraperTitle(),
    metascraperImage(),
    metascraperDate(),
    metascraperDescription(),
    metascraperPublisher(),
    metascraperLogo(),
    metascraperIframe(),
    metascraperLang(),
    metascraperReadability(),
    metascraperVideo(),
    metascraperLogoFavicon(),
    metascraperAuthor(),
    metascraperAudio()
  ])({ html, url });
  return output;
};

export const getTextData = (raw, baseUrl)=>{
  return convert(raw, {
    wordwrap: false,
    selectors: [
      { selector: 'a', options: { baseUrl, noAnchorUrl: true } },
      { selector: 'img', options: { baseUrl } }
    ]
  });
}
export const getUrlsData=(text) =>{
    const urlRegex = /\[(http.*?)\]/gm;
    return (text.match(urlRegex)||[]).map(u => u.slice(1, -1));
}
export const textOkay=(text) =>{
  return text.length > 1000
}

export const main = async (url, options={}) => {
    const { getMeta = true, getText = true, getURLs = true, useRP = false } = options;
    const { protocol, host } = new URL(url);
    const baseUrl = protocol + '//' + host;
    const robotsUrl = getRobotsUrl(url);
  
    const robotsTxt = await getStaticHTML(robotsUrl);
  
    const isAllowed = robotsParser(robotsUrl, robotsTxt).isAllowed(url);
  
    // const urlRP = useRP ? 'https://www.removepaywall.com/'+url.replace('://',':/') : url

    let raw;
    let meta;
    let text;
    let urls;
    let status;
    let archiveUrl = url
    if (isAllowed) {
        // attempt direct
        raw   =                   await getStaticHTML(url);
        text  = getText         ? getTextData(raw, baseUrl)   : undefined;
        status = 'direct'

        // // if text is not okay, attempt archive.today
        // // this will not open any "Read more" options
        // if(!textOkay(text) && getText){
        //   raw = await runCrawler(url);
        //   text = getTextData(raw, baseUrl);
        //   status = 'puppeteer'
        //   if(!textOkay(text)){
        //     // if empty, attempt archive.submit and wait
        //     raw = await runArchiveCrawler(url)
        //     text = getTextData(raw, baseUrl);
        //     status = 'archive.direct'
        //     if(!textOkay(text)){
        //       // if empty, attempt archive.submit and wait
        //       raw = await runArchiveSubmit(url)
        //       text = getTextData(raw, baseUrl);
        //       status = 'archive.submit'
        //     }
        //   }
        // }


        // meta  = getMeta ? await getMetadata(url, raw) : undefined;
        // urls  = getURLs ? getUrlsData(text)           : undefined;    
        
    }
    return {
      url,
      allowed: isAllowed,
      meta,
      raw,
      text,
      urls
    };
  };
  
  export default main;
  
  