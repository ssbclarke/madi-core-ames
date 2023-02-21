export default function cleanText(text){
    text = text
    .replace(/^\s+/gi,"") //leading carriage returns
    .replace(/^Quote\s*[:\s-]*/gi,"")
    .replace(/^Trend\/Graphic\/Summary\s*[:\s-]*/gi,"")
    .replace(/^Trend\/Projection\s*[:\s-]*/gi,"")
    .replace(/^Trend\s*[:\s-]*/gi,"")
    .replace(/^Actor\s*[:\s-]*:/gi,"")
    .replace(/^Problem\s*[:\s-]*/gi,"")
    .replace(/^Takeaway\s*[:\s-]*/gi,"")
    .replace(/^Solution\s*[:\s-]*/gi,"")
    .replace(/^\s+/gi,"") // leading carriage returns
    .replace(/\s+$/gi,"") // ending carriage returns
    .replace(/[\r\n]|\n|\r/gi,"&&&&&") // create demarcations

    // replace demarcations based on text length
    if(text.length > 800){ 
      // if the text is long, assume \n's are paragraphs and not poor formatting.
      text = text.replace(/[&]{3,}/gi,"\n\n")
    }else{
      text = text.replace(/[&]{3,}/gi," ")
    }
    return text
}