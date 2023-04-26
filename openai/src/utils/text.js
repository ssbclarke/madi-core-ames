import { encode, decode } from 'gpt-3-encoder'
import sbd  from 'sbd'
const MIN_LENTH = 40
const MAX_LENGTH = 500
const TARGET_LENGTH = 250

/**
 * TEXT UTILITIES
 */
export function countTokens(text){
    return encode(text).length
}

export function checkLength(text){
    return countTokens(text) >= MIN_LENTH && countTokens(text) <= MAX_LENGTH
}

export function reduceLong(long_text, long_text_tokens = false, max_len = 590) {
    if (!long_text_tokens) {
        long_text_tokens = countTokens(long_text);
    }
    if (long_text_tokens > max_len) {
        let sentences = long_text.replace("\n", " ").split(/\.(\s)?/); // split at period and optional space
        let ntokens = 0;
        for (let i = 0; i < sentences.length; i++) {
            ntokens += 1 + countTokens(sentences[i]);
            if (ntokens > max_len) {
                return sentences.slice(0, i).join(". ") + ".";
            }
        }
    }
    return long_text;
}

export function splitText(text){
    text = text.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"')
    return sbd.sentences(text, {
            "newline_boundaries" : true,
            "html_boundaries"    : true,
            "sanitize"           : true,
            "preserve_whitespace" : false,
            "abbreviations"      : null
    });
    
    // //if text has <p> or /n split by that
    // let textSplits = text.split(/<p>|\r?\n|\r/gm)

    // //foreach 
    // .map(el=>{
    //     if(countTokens(el)>MAX_LENGTH){

    //     }
    // })
    //     //if text is longer than 500 split by period

    // //iterate and merge to optimize length 

    // .map(i=>i.replace(/<[^>]*>/gm, "")).map(countTokens)

}



export function optimizeSplits(arr){
    return arr.reduce((acc,el,)=>{
        let nextToks = countTokens(el)
        let last = acc[acc.length-1] || ''
        let lastToks = countTokens(last)
        if(nextToks < MIN_LENTH){
            acc.pop()
            acc.push(
                (last + ' ' + el)
                .trim()
            )
        }else if(lastToks > TARGET_LENGTH || lastToks + nextToks > MAX_LENGTH){
            acc.push(el)
        }else{
            acc.pop()
            acc.push(
                (last + ' ' + el)
                .trim()
            )
        }
        return acc
    },[])
}



