let widgets = require("../widgets.json")
const addArrowRelations = require('./addArrowRelations')
const populateMadiTypeField = require( './populateMadiTypeField')
const stripOrphans = require('./stripOrphans')
const buildSources = require('./buildSources')

const  {
    TAKEAWAY,
    PROBLEM,
    SOLUTION,
    QUOTE,
    ACTOR,
    NONE,
    CONST_ARRAY
} = require('../constants')



class Converter{
    constructor(db ={}){
        if(Array.isArray(db) && db[0]['id']){
            this.db = {}
            db.forEach(w=>{this.db[w.id]=w})
        }else{
            this.db = db
        }
    }
    populateMadiTypeField = populateMadiTypeField
    addArrowRelations = addArrowRelations
    stripOrphans = stripOrphans
    buildSources = buildSources

}


let con = new Converter(widgets) 
console.log(con)

// let typed = populateMadiTypeField({}, raw)
// let arranged = addArrowRelations(typed,raw)
// let sourced = buildSources(arranged)
// let { observations, orphans } = stripOrphans(sourced)

// console.log({ observations, orphans })

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


// buildFetchList()

// console.log(fetchList)


// fs.writeFileSync( 'data.yml', doc.toString())

// console.log(structuredData)

