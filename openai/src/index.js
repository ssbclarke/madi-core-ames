 import { fetchDB, storeDBtoDisk, appendQuestions } from './qg.js'
import scrape from './scrape.js'


let url = 'https://www.nytimes.com/2023/01/11/opinion/geoengineering-climate-change-solar.html'
// let url = 'https://arh.antoinevastel.com/bots/areyouheadless'

// let db = await fetchDB()

let result = await scrape(url)
console.log(result)
// await Promise.all(db.data.map(appendQuestions))
