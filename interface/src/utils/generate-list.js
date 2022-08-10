import { entities, needs, ilities, categories, subcategories } from '../config/options'
import { LoremIpsum } from "lorem-ipsum";
import data from './test_data.json'

let lorem = new LoremIpsum({
    count: 1,                // Number of "words", "sentences", or "paragraphs"
    format: "plain",         // "plain" or "html"
    paragraphLowerBound: 3,  // Min. number of sentences per paragraph.
    paragraphUpperBound: 7,  // Max. number of sentences per paragarph.
    random: Math.random,     // A PRNG function
    sentenceLowerBound: 5,   // Min. number of words per sentence.
    sentenceUpperBound: 15,  // Max. number of words per sentence.
    suffix: "\n",            // Line ending, defaults to "\n" or "\r\n" (win32)
    units: "sentences",      // paragraph(s), "sentence(s)", or "word(s)"
  })


function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

export const generateList = (count)=>{
    return [...Array(count)].map((x,i)=>{
        let date_published = randomDate(new Date(2010,0,1),new Date(2021,12,31))
        return {
            id: i,
            firstname: Math.random().toString(16).substr(2, 4),
            lastname: Math.random().toString(16).substr(2, 10),
            type: getRandomSubarray(entities, 1),
            ility: getRandomSubarray(ilities, 1),
            need: getRandomSubarray(needs, 1),
            summary: lorem.generateSentences(2),
            description: lorem.generateParagraphs(7),
            category: getRandomSubarray(categories, Math.floor(Math.random()*2)),
            subcategory: getRandomSubarray(subcategories, Math.floor(Math.random()*4)), //keywords
            date_added: randomDate(date_published, new Date(date_published.getDate() + 30)),
            date_published,
            source_name: Math.random().toString(16).substr(2, 10),
            reference_link: "https://example.com",
            initiator: "",
            relevance: lorem.generateParagraphs(3),
            raw_text: lorem.generateParagraphs(15)
        }
    })
}


// "ID": "39",
// "Title": "",
// "Topic": "",
// "Primary Factor Affected": "Technological",
// "Primary Entry Category": "Power__Energy__Storage",
// "Secondary Entry Category": "Hydrogen",
// "Entry Category": "",
// "Entry Description": "The hydrogen-powered aviation startup ZeroAvia Inc. has raised $37.7 million from the U.K. government and a group of investors that includes funds founded by Bill Gates and Amazon.com Inc.\r\nZeroAvia said it aims to use the money to advance development of technology that could cut carbon emissions from the aviation sector by replacing fossil fuel-burning propulsion with a hydrogen fuel-cell system.",
// "Keywords": "",
// "Date Added": "2020-12-01",
// "Entry Date": "2020-12-01",
// "Year": "2020",
// "Source": "Bloomberg",
// "Reference": "https://www.bloomberg.com/news/articles/2020-12-16/gates-and-bezos-funds-back-hydrogen-powered-plane-startup?srnd=premium ",
// "Initiator of Entry": "Joseph Block",
// "Why/how is the Entry an Issue? What is the relevance to NASA ARMD?": "ZeroAvia continues their massive fundraising rounds with impressive amounts of backing. Support from high-profile investors brings this topic to the center spotlight for feasability assessments and technology development. "