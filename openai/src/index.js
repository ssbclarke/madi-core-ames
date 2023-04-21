//  import { fetchDB, storeDBtoDisk, appendQuestions } from './qg.js'
import scrape from './scrape.js'

// import {snapshot, timemap} from './archive.js'
// import { gotScraping } from 'got-scraping';



let url = 'https://www.nytimes.com/2023/01/11/opinion/geoengineering-climate-change-solar.html'
// let url = 'https://arh.antoinevastel.com/bots/areyouheadless'

// let db = await fetchDB()

let result = await scrape(url)

// let result = await timemap({url})
// let { url } = result[0] || {}
// Get the HTML of a web page
// if(url){
//     const { body } = await gotScraping(result[0]);
//     return body
//     console.log(body);

// }

// await Promise.all(db.data.map(appendQuestions))

console.log(result)





