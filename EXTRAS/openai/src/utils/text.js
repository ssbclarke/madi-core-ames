import { encode, decode } from 'gpt-3-encoder'
import sbd  from 'sbd'
const MIN_LENGTH = 40
const MAX_LENGTH = 500
const TARGET_LENGTH = 350

/**
 * TEXT UTILITIES
 */
export function countTokens(text){
    return encode(text).length
}

export function checkLength(text, min_length=MIN_LENGTH, max_length=MAX_LENGTH){
    return countTokens(text) >= min_length && countTokens(text) <= max_length
}

// export function reduceLong(long_text, long_text_tokens = false, max_len = 590) {
//     if (!long_text_tokens) {
//         long_text_tokens = countTokens(long_text);
//     }
//     if (long_text_tokens > max_len) {
//         let sentences = long_text.replace("\n", " ").split(/\.(\s)?/); // split at period and optional space
//         let ntokens = 0;
//         for (let i = 0; i < sentences.length; i++) {
//             ntokens += 1 + countTokens(sentences[i]);
//             if (ntokens > max_len) {
//                 return sentences.slice(0, i).join(". ") + ".";
//             }
//         }
//     }
//     return long_text;
// }

export function splitText(text, max_length=MAX_LENGTH){
    text = text.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"')
    return sbd.sentences(text, {
            "newline_boundaries" : true,
            "html_boundaries"    : true,
            "html_boundaries_tags": ["p","div","ul","ol","tr","td","th"],
            "sanitize"           : true,
            "preserve_whitespace" : false,
            "abbreviations"      : null
    })
    // if any of the text is too long and has no sentence boundary, we probably want to strip it
    .filter(el=>(countTokens(el) < max_length))

}



export function optimizeSplits(arr, min_length=MIN_LENGTH, target_length=TARGET_LENGTH, max_length=MAX_LENGTH){
    return arr.reduce((acc,el)=>{
        let nextToks =  countTokens(el)
        let last = acc[acc.length-1] || ''
        let lastToks = countTokens(last)
        // if current element is less then minimum, combine with last and move on

        let combined = lastToks + nextToks
        
        if(lastToks > target_length|| nextToks > max_length){
            acc.push(el)
        }else if (nextToks < min_length || combined < max_length){
            acc.pop()
            acc.push(
                (last + ' ' + el)
                .trim()
            )
        }else{
            acc.push(el)
        }
        return acc
    },[])
}



