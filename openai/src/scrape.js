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
import { runCrawler } from './js-render-scrape.js'

export const getRobotsUrl = (url) => {
  const { protocol, host } = new URL(url);
  return protocol + '//' + host + '/robots.txt';
};

export const getStaticHTML = async (url) => {
  const response = await fetch(url);
  return await response.text();
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

export const main = async (url, options={}) => {
    const { getMeta = true, getText = true, getURLs = true } = options;
    const { protocol, host } = new URL(url);
    const baseUrl = protocol + '//' + host;
    const robotsUrl = getRobotsUrl(url);
  
    const robotsTxt = await getStaticHTML(robotsUrl);
  
    const isAllowed = robotsParser(robotsUrl, robotsTxt).isAllowed(url);
  
    let raw;
    let meta;
    let text;
    let urls;
    if (isAllowed) {
      raw = await getStaticHTML(url);
      if (getMeta) {
        meta = await getMetadata(url, raw);
      }
      if (getText) {
        text = convert(raw, {
          wordwrap: false,
          selectors: [
            { selector: 'a', options: { baseUrl, noAnchorUrl: true } },
            { selector: 'img', options: { baseUrl } }
          ]
        });
      }
      if (getURLs) {
        const urlRegex = /\[(http.*?)\]/gm;
        urls = (text.match(urlRegex)||[]).map(u => u.slice(1, -1));
      }


      if(getText && text.length < 1000){
        console.log('Text Length: ', text.length, '\n\n', text)
        raw = await runCrawler([url])
        if (getMeta) {
          meta = await getMetadata(url, raw);
        }
        meta = await getMetadata(url, raw);
        
      }


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
  
  