import { gotScraping } from 'got-scraping';

// Get the HTML of a web page
const { body } = await gotScraping({ url: 'https://archive.ph/20230112004831/https://www.nytimes.com/2023/01/11/opinion/geoengineering-climate-change-solar.html' });
console.log(body);