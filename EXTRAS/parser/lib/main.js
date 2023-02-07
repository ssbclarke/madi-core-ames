import { convert } from 'html-to-text';
import fetch from 'node-fetch';
import { URL } from 'url';
import robotsParser from 'robots-parser';
import { getMetadata } from './getMetadata.js';

export const getRobotsUrl = (url) => {
  const { protocol, host } = URL(url);
  return protocol + '//' + host + '/robots.txt';
};

export const getStaticHTML = async (url) => {
  const response = await fetch(url);
  return await response.text();
};

export const main = async (url, options) => {
  const { getMeta = true, getText = true, getURLs = true } = options;
  const { protocol, host } = URL(url);
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
      urls = text.match(urlRegex).map(u => u.slice(1, -1));
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
