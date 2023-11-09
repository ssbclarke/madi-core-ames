let widgets = require("../widgets.json")
const addArrowRelations = require('./addArrowRelations')
const populateMadiTypeField = require( './populateMadiTypeField')
const stripOrphans = require('./stripOrphans')
const buildSources = require('./buildSources')
const customInspectSymbol = Symbol.for('nodejs.util.inspect.custom');
const  {
    TAKEAWAY,
    PROBLEM,
    SOLUTION,
    QUOTE,
    ACTOR,
    NONE,
    CONST_ARRAY,
    SOURCE_MATCH_ERROR,
    SOURCE_MISSING_ERROR
} = require('../constants')



class Converter{
    
    constructor(db ={}){
        if(Array.isArray(db) && db[0]['id']){
            this.db = {}
            db.filter(w=>!!w.id).forEach(w=>this.db[w.id]=w)
        }else{
            this.db = db
        }
        this.raw = Object.assign(this.db)
    }

    addTypes = ()=>{
        this.db = Object.values(this.db).map(w=>populateMadiTypeField(w))
            .reduce((a, v) => (v.id?{ ...a, [v.id]: v}:a), {})
    }

    addRelations = ()=>{
        this.arrows = Object.values(this.raw)
            .filter(w=>w.type === 'arrow')
            .map(a=>({endRefId:a.endRefId, startRefId:a.startRefId }))
        
        this.db = addArrowRelations(this.arrows, this.db)
    }
    findSourceErrors = ()=>{
        Object.keys(this.db).map(wid=>{
            let source = this.db[wid].source
            if(!source){
                this.db[wid].error = this.db[wid].error || []
                this.db[wid].error.push(SOURCE_MISSING_ERROR)
            }else{
                (this.db[wid].children || []).forEach(cid=>{
                    if(this.db[cid].source && this.db[cid].source !== this.db[wid].source){
                        this.db[cid].error = this.db[cid].error || []
                        this.db[cid].error.push(SOURCE_MATCH_ERROR)
                    }
                })
            }
        })
    }
    saveToFile = (filename,data)=>{
        try {
            fs.writeFileSync(filename, JSON.stringify(data,null,2));
        } catch (err) {
            console.error(err);
        }
    }
    convertToTree = ()=>{
        let list = Object.values(this.db)
        // list = list.slice(1,4)
        // console.log(list)
        const arrayToTree = (arr, parentId = 0) =>
        arr.filter(item => {
            let itemParent = !!item.parents ? item.parents[0] : 0;
            return itemParent === parentId
        }).map(child => ({ ...child, children: 
            arrayToTree(arr, child.id )
        }));

        return arrayToTree(list)
    }

    stripOrphans = stripOrphans
    buildSources = buildSources
}




let con = new Converter(widgets) 
con.addTypes()
con.addRelations()
con.findSourceErrors()
let tree = con.convertToTree()
console.log(tree)



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

