const  {
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
} = require('../constants')

function populateMadiTypeField(db,raw){
    raw.widgets.forEach(w=>{
        let guessMatrix = new Array(7).fill(0);
        // [takeaway, problem, trend, solution, quote, actor, none]
        
        let text = w.text || "";
        let id = w.id
        let madiType = "none"

        if (w.type === "sticky note"){
            
            // guess the type of sticky by text
            switch (true){
                case /^\s*take\s*away\s*[:|-]*/gmi.test(text):
                    ++guessMatrix[0]
                    break;
                case /^\s*problem\s*[:|-]*/gmi.test(text):
                    ++guessMatrix[1]
                    break;
                case /^\s*[trend][\/graphic]*[\/summary]*\s*[:|-]*/gmi.test(text):
                    ++guessMatrix[2]
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
                default:
                    // guess by color as fallback
                    let color = w.style?.backgroundColor || null
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
            madiType = CONST_ARRAY[guessMatrix.indexOf(Math.max(...guessMatrix))];
        }

        if (text.length > 0 ){
            db[w.id] = {
                type:madiType,
                id,
                summary: text.replace(/(\r\n|\n|\r)/gm, "").trim(),
                source: w.hyperlink,
                error: []
            }
            if(madiType === NONE){
                db[w.id].error.push("Type could not be discerned.")
            }
        }
        
    })
    return db

}

module.exports = populateMadiTypeField