let widgets = require("../widgets.json")
// const addArrowRelations = require('./addArrowRelations')
const populateMadiTypeField = require( './populateMadiTypeField')
const stripOrphans = require('./stripOrphans')
const buildSources = require('./buildSources')
const customInspectSymbol = Symbol.for('nodejs.util.inspect.custom');
const Loki = require('lokijs')

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


// console.log(Loki)
class MuralLoki extends Loki{
}

ensureArray = (input)=>{
    if(!Array.isArray(input)){ return [input] }
}



function filterType(types){
    types = ensureArray(types)
    return this.find({type:{'$in':types}})
}
function textStartsWith(text) {
    return this.where((o)=>!!o.text && o.text.startsWith(text))
}
function textContains(text){
    return this.where((o)=>!!o.text && o.text.includes(text))
}
function textMatchesRegex(expression){
    try {
        let regex = new RegExp(expression);
        return this.where((o)=>!!o.text && regex.test(o.text))
    } catch(e) {
        throw "Invalid Regex expression."
    }
}
function filterBgColor(color){
    
    let validColorReg=/^#([0-9a-f]{3}){1,2}$/i;
    if(!validColorReg.test(color)){
        var colors = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
        "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
        "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
        "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
        "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
        "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
        "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
        "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
        "honeydew":"#f0fff0","hotpink":"#ff69b4","indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
        "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
        "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
        "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
        "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
        "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
        "navajowhite":"#ffdead","navy":"#000080","oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
        "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
        "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
        "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
        "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
        "violet":"#ee82ee","wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5","yellow":"#ffff00","yellowgreen":"#9acd32"};
    
        if (typeof colors[color.toLowerCase()] != 'undefined')
            color = colors[color.toLowerCase()];
    }
    color = color.toUpperCase();

    return this.where((o)=>!!o.style && !!o.style.backgroundColor && o.style.backgroundColor.indexOf(color)===0)
}


function addArrowRelations(){
    let arrows = this.find({type:'arrow'}).data()
    let collection = this.collection
    // console.log('arrows', arrows.length)
    // console.log('coll', collection.chain().find({}).data().length)
    // console.log(this.collection.chain().find({id:'723-1667868664112'}).data())

    // arrow: '100-1667868664111'
    // endRefId: '96-1667868664111'
    // startRefId: '99-1667868664111'

    arrows.forEach(({startRefId, endRefId})=>{
            // console.log('',{startRefId, endRefId})
            let parent = startRefId
            let child = endRefId

            if(parent && child){
                // push the child to the right array
                // console.log(parent)
                let parentObj = collection.findOne({id: parent})
                let childObj = collection.findOne({id: child})

                if(!!parentObj){
                    // console.log("found parent")
                    parentObj = Object.assign({_arrowChild:[]}, parentObj)
                    parentObj._arrowChild.push(child)
                    collection.update(parentObj)
                }
                if(!!childObj){
                    // console.log("found child")
                    childObj = Object.assign({_arrowParent:[]}, childObj)
                    childObj._arrowParent.push(parent)
                    collection.update(childObj)
                }
            }
    })

    // console.log(collection.chain().find({height:138}).data())
    return this.collection.chain().find(
        {"$or":[
            {'_arrowChild' : {'$exists': true}},
            {'_arrowParent' : {'$exists': true}},
        ]}
    )
}

function convertToTree(){

}

[
    filterType, 
    textStartsWith,
    textContains,
    textMatchesRegex,
    filterBgColor,
    addArrowRelations,
    convertToTree
].forEach(func=>{
    MuralLoki.Collection.prototype[func.name] = function (args) {return func.call(this.chain(),args)}
    MuralLoki.Resultset.prototype[func.name] = function (args) {return func.call(this, args)}
})


class MuralDB extends MuralLoki{
    constructor(data = [], idField="id", dbname="muraldb", acctId, muralId){
        let newDb = super(dbname);
        this.db = newDb
        this.raw = data
        this.acct = acctId
        this.mural = muralId
        this.collection = this.db.addCollection('collection', { indices: [idField] });
        if(!Array.isArray(data)){
            throw ('Data must be an array of objects')
        }
        this.collection.insert(data)
        return new Proxy(this, this);
    }
    // textContains    = (...args)=>this.collection.textContains(...args)
    // textStartsWith  = (...args)=>this.collection.textStartsWith(...args)
    // filterType      = (...args)=>this.collection.filterType(...args)
    
    async updateWidget(id, newWidget){

    }

    async getWidgetsByMural(muralId){

    }
    

    // proxies the collection object as the default output of the MuralDB class instance
    get (target, prop) {
        if(prop === 'collection'){
            return this.collection;
        }else if(prop === 'database'){
            return this.db
        }else if(prop === 'serialize'){
            delete this.db;
            return target[prop];
        }else if (typeof target.collection[prop] === 'function') {
            return target.collection[prop].bind(target.collection)
        } else {
            return target[prop];
        }
    }
}



class MuralDB2 extends Loki{
    result;
    constructor(data = [], idField="id", dbname="muraldb"){

        // super()
        // this.collection
        // loki.LokiOps.$_custom = (a,b) => {
        //     return a > b;
        // };
        // console.log(loki.Collection())
        
        let newDb = super(dbname);
        console.log('yes', super.__proto__)
        // console.log(newDb)
        this.db = newDb
        this.collection = this.db.addCollection('collection', { indices: [idField] });
        if(!Array.isArray(data)){
            throw ('DB must be an array of objects')
        }
        this.collection.insert(data)
        // this.result = this.collection.find({})

        console.log(this.collection.filterType('id'))
        // this.db = new loki(db)
        // this.collection = []
        // this.keymap = {}
        // this.idField = 'id'
        // var users = db.addCollection("users");

        // if(Array.isArray(db)){
        //     db.filter(w=>!!w.id).forEach(w=>this.db[w.id]=w)
        // }else{
        //     this.db = db
        // }
        // this.keymap = Object.assign(this.db)
        // this.arrows = Object.values(this.raw)
        //     .filter(w=>w.type === 'arrow')
        //     .map(a=>({endRefId:a.endRefId, startRefId:a.startRefId }))
    }
    chain = ()=>{
        this.collection.chain();
        return this 
    }
    data = () =>{
        let result = this.result
        this.result = this.collection.find({});
        return result
    }
    collection = ()=>{
        return this.collection
    }

    filterType = (types) => {

    }
    filterText = (text) => {
        if(typeof text === 'function'){
            this.result = this.collection.chain().where((o)=>text(o.text))
        }
        return this
    }
    textStartsWith = (text)=>{
        this.result = this.collection.chain().where((o)=>!!o.text && o.text.startsWith(text))
        return this
    }
    textContains = (text)=>{
        this.result = this.collection.chain().where((o)=>!!o.text && o.text.includes(text)>-1)
        return this
    }
    filterColor = (hex) => {

    }
    ids = () => {

    }
    values = () =>{

    }
    update = (func) => {
        this.collection = this.collection.map(func)
        return this.collection
    }
    sync = () =>{

    }
    asKeyMap = (field)=>{
        let keymap = {};
        this.collection
            .filter(w=>!!w[field])
            .forEach(w=>keymap[w[field]]=w);
        return keymap;
    }

    // addRelations = ()=>{
    //     this.arrows = Object.values(this.raw)
    //         .filter(w=>w.type === 'arrow')
    //         .map(a=>({endRefId:a.endRefId, startRefId:a.startRefId }))
    //     this.db = addArrowRelations(this.arrows, this.db)
    // }


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

module.exports = MuralDB





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

