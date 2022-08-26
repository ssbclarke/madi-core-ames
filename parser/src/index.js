import db from './db'
import isAllowedByRobotsTxt from './isAllowedByRobotsTxt'
let robotsRecords = {}
const Crawler = require('crawler');


const Robots = require("parse-robots");








const c = new Crawler({
    maxConnections: 1,
    // This will be called for each crawled page
    callback: (error, res, done) => {
        if (error) {
            console.log(error);
        } else {
            const $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            console.log($('title').text());
        }
        done();
    }
});

crawlerInstance.queue('https://www.iban.com/exchange-rates');
