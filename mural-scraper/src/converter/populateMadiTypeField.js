const  {
    TAKEAWAY,
    PROBLEM,
    TREND,
    SOLUTION,
    QUOTE,
    ACTOR,
    NONE,
    CONST_ARRAY
} = require('./constants')

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
                        case "#FCFE7DFF":
                            ++guessMatrix[0]
                            break;
                        case "#FCFE7DFF":
                            ++guessMatrix[1]
                            break;
                        case "#9BEDFDFF":
                            ++guessMatrix[2]
                            break;
                        case "#FFC2E8FF":
                            ++guessMatrix[3]
                            break;
                        case "#FFE08AFF":
                            ++guessMatrix[4]
                            break;
                        case "#C7FE80FF":
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