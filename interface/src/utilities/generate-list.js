import { entities, categories, subcategories } from '../config/options'
import { loremIpsum } from "lorem-ipsum";

loremIpsum({
    count: 1,                // Number of "words", "sentences", or "paragraphs"
    format: "plain",         // "plain" or "html"
    paragraphLowerBound: 3,  // Min. number of sentences per paragraph.
    paragraphUpperBound: 7,  // Max. number of sentences per paragarph.
    random: Math.random,     // A PRNG function
    sentenceLowerBound: 5,   // Min. number of words per sentence.
    sentenceUpperBound: 15,  // Max. number of words per sentence.
    suffix: "\n",            // Line ending, defaults to "\n" or "\r\n" (win32)
    units: "sentences",      // paragraph(s), "sentence(s)", or "word(s)"
    words: ["ad", ...]       // Array of words to draw from
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

export const generateList = (count)=>{
    return [...Array(count)].map((x,i)=>{
        return {
            id: i,
            firstname: Math.random().toString(16).substr(2, 4),
            lastname: Math.random().toString(16).substr(2, 10),
            type: getRandomSubarray(entities, 1),
            category: getRandomSubarray(categories, Math.floor(Math.random()*categories.length)),
            subcategory: getRandomSubarray(subcategories, Math.floor(Math.random()*subcategories.length)),
        }
    })
}