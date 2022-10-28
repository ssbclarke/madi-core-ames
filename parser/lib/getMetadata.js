import fetch from 'node-fetch';
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
