let db = {}
let structuredData = {observations:{}, orphans:{}}
let data = require("../test.json")
const YAML = require('yaml');
const fs = require('fs')
// import parser = require('../../../parser/lib/main')
let fetchList = []


function populateMadiTypeField(){

    data.widgets.forEach(w=>{
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
            madiType = ["takeaway", "problem", "trend", "solution","quote", "actor", "none"][guessMatrix.indexOf(Math.max(...guessMatrix))];
        }

        if (text.length > 0 ){
            db[w.id] = {
                type:madiType,
                id,
                summary: text.replace(/(\r\n|\n|\r)/gm, "").trim(),
                source: w.hyperlink,
            }
        }

    })


}
function addArrowRelations(){
    data.widgets.forEach(w=>{
        if(w.type === 'arrow'){
            let { endRefId, startRefId } = w
            if(db[startRefId] && db[endRefId]){
                let parent
                let child
                if (db[startRefId].type === 'takeaway'){
                    parent = startRefId
                    child = endRefId
                }
                if (db[endRefId].type === 'takeaway'){
                    parent = endRefId
                    child = startRefId
                }
                if(parent && child){
                    // push the child to the right array
                    db[parent][db[child].type] = db[parent][db[child].type] || []
                    db[parent][db[child].type].push(db[child])
                    //null out the child
                    delete db[child]
                }
            }

        }
    })
}

function stripOrphans(){
    Object.keys(db).forEach(id=>{
        console.log(db[id].type)
        if(db[id].type === 'takeaway'){
            structuredData.observations[id] = db[id]
        }else{
            structuredData.orphans[id] = db[id]
        }
    })
}

// function buildFetchList(){
//     let sourceToId = {}
//     Object.keys(db).forEach(id=>{
//         let source = db[id].source
//         //check that source exists at all
//         if(source){
//             // check for duplicate
//             if(sourceToId[source]){
//                 let originalId = sourceToId[source]
//                 //mark both as duplicates
//                 db[id].duplicateSource = true
//                 db[originalId].duplicateSource = true
//             }else{
//                 sourceToId[source]=id
//             }
//         }

//     })
//     fetchList = Object.keys(sourceToId)
// }


populateMadiTypeField()
addArrowRelations()
stripOrphans()
// buildFetchList()

// console.log(fetchList)
const doc = new YAML.Document();
doc.contents = structuredData

console.log(doc.toString());

fs.writeFileSync( 'data.yml', doc.toString())

// console.log(structuredData)

