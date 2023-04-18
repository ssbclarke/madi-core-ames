import {
    TAKEAWAY,
    PROBLEM,
    TREND,
    SOLUTION,
    QUOTE,
    ACTOR,
    NONE,
    COLOR_TAKEAWAY,
    COLOR_PROBLEM,
    COLOR_TREND,
    COLOR_SOLUTION,
    COLOR_QUOTE,
    COLOR_ACTOR,
    CONST_ARRAY
} from '../constants.js'

export default function populateMadiTypeField(widget){
    // let newWidget = {}
    let guessMatrix = new Array(7).fill(0);
    // [takeaway, problem, trend, solution, quote, actor, none]
    
    let text = widget.text || "";
    // let id = widget.id
    // let madiType = "none"

    // if (widget.type === "sticky note"){
        
        // guess the type of sticky by text
        switch (true){
            case /^\s*take\s*away\s*[:|-]*/gmi.test(text):
                ++guessMatrix[0]
                break;
            case /^\s*problem\s*[:|-]*/gmi.test(text):
                ++guessMatrix[1]
                break;
            case /^\s*solution\s*[:|-]*/gmi.test(text):
                ++guessMatrix[3]
                break;
            case /^\s*quote\s*[:|-]*/gmi.test(text):
                ++guessMatrix[4]
                break;
            case /^\s*actor\s*[:|-]*/gmi.test(text):
                ++guessMatrix[5]
                break;
            case /^\s*[trend][\/graphic]*[\/summary]*\s*[:|-]*/gmi.test(text):
                ++guessMatrix[2]
                break;
            default:
                // guess by color as fallback
                let color = widget.style?.backgroundColor || null
                switch (color){
                    case COLOR_TAKEAWAY:
                        ++guessMatrix[0]
                        break;
                    case COLOR_PROBLEM:rel
                        ++guessMatrix[1]
                        break;
                    case COLOR_TREND:
                        ++guessMatrix[2]
                        break;
                    case COLOR_SOLUTION:
                        ++guessMatrix[3]
                        break;
                    case COLOR_QUOTE:
                        ++guessMatrix[4]
                        break;
                    case COLOR_ACTOR:
                        ++guessMatrix[5]
                        break;
                    default:
                        ++guessMatrix[6]
                        break;
                }
        }
        let madiType = CONST_ARRAY[guessMatrix.indexOf(Math.max(...guessMatrix))]
        return Object.assign(widget,{madiType})
    // }
    // return 
    // if (text.length > 0 ){
    //     newWidget = {
    //         type:madiType,
    //         id,
    //         // ogType: widget.type,
    //         summary: text.replace(/(\r\n|\n|\r)/gm, "").trim(),
    //         source: widget.hyperlink,
    //         error: []
    //     }
    //     if(madiType === NONE){
    //         newWidget.error.push("Type could not be discerned.")
    //     }
    // }
    // return newWidget
    
}