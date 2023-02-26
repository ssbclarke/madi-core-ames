let widgets = require("../widgets.json")
// const addArrowRelations = require('./addArrowRelations')
const populateMadiTypeField = require( './populateMadiTypeField')
const stripOrphans = require('./stripOrphans')
const buildSources = require('./buildSources')
const customInspectSymbol = Symbol.for('nodejs.util.inspect.custom');
const Datastore = require('@seald-io/nedb')

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

ensureArray = (input)=>{
    if(!Array.isArray(input)){ return [input] }
}


// Datastore
let counter = 0
class MuralDB extends Datastore{
    constructor(options ={}){
        const {
            data = [], 
            idField="id", 
            dbname="muraldb", 
            acctId, 
            muralId
        } = options
        super(options);
        this.raw = data
        this.acct = acctId
        this.mural = muralId
        this.queue = Promise.resolve()
        this.cacheDb = null;

        if(!Array.isArray(data)){
            throw ('Data must be an array of objects')
        }
    }

    then(callback) { callback(this.queue); }
    chain(callback) {
        return this.queue = this.queue
            .then(callback)
            .finally(()=>{ // this is CRITICAL or queues will continue to add, despite distinct awaits
                this.queue = Promise.resolve()
                this.cacheDb = null
            })
    }

    async runOperation(results, func, params){
        this.cacheDb = this.cacheDb || new MuralDB()
        let count = await this.cacheDb.countAsync()

        if(results){
            // console.log('--- has results')
            await this.cacheDb.insertAsync(results)
        }else if(count === 0){
            // console.log('--- count is zero')
            await this.cacheDb.insertAsync(this.getAllData())
        }
        // run the command on the new db
        let queried = this.cacheDb[func](...params)
        // this.cacheDb = null

        return queried

    }


    findAsync(query={},proj={}){
        // console.log('\nfindAsync')

        this.chain(async(results)=>{
            this.cacheDb = this.cacheDb || new MuralDB()
            let count = await this.cacheDb.countAsync()
    
            if(results){
                await this.cacheDb.insertAsync(results)
            }else if(count === 0){
                await this.cacheDb.insertAsync(this.getAllData())
            }
            return super.findAsync.apply(this.cacheDb,[query,proj])
        })
        return this
    }

    filterType(types, projection={}){
        // console.log('\nfilterType')
        types = ensureArray(types)


        // let result = this.findAsync({
        //     type:{'$in':types}
        // },projection)
        // return result


        this.chain(async(x)=>{
            let func = 'findAsync'
            let params = [{type:{'$in':types}},projection]
            return this.runOperation(x, func, params)
        })
        // console.log(this.findAsync)
        return this
    }


    textStartsWith(text, projection={}){
        // console.log('\ntextStartsWith')

        // return this.findAsync({
        //     $where: function(){return !!this.text && this.text.startsWith(text)}
        // }, projection)

        this.chain(async(x)=>{
            let func = 'findAsync'
            let params = [{
                $where: function(){return !!this.text && this.text.startsWith(text)}
            },projection]
            return this.runOperation(x, func, params)
        })
        return this
    }

    addRelations = ()=>{
        this.arrows = Object.values(this.raw)
            .filter(w=>w.type === 'arrow')
            .map(a=>({endRefId:a.endRefId, startRefId:a.startRefId }))
        
        this.db = addArrowRelations(this.arrows, this.db)
    }
    _addArrowRelations(){

        
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

    textContains(text, projection={}){
        // console.log('\ntextContains')

        // return this.findAsync({
        //     $where: function(){return !!this.text && this.text.includes(text)}
        // }, projection)

        this.chain(async(x)=>{
            let func = 'findAsync'
            let params = [{
                $where: function(){return !!this.text && this.text.includes(text)}
            },projection]
            return this.runOperation(x, func, params)
        })
        return this
    }

    textMatchesRegex(expression, projection={}){
        // console.log('\ntextMatchesRegex')

        try {
            // let regex = new RegExp(expression);
            // // regex.lastIndex = 0;
            // let result = this.findAsync({
            //     $where: function(){return !!this.text && !!this.text.match(regex)}
            // }, projection)
            // if (this._chainFlag){
            //     return resultSet(result)
            // }
            // return result

            let regex = new RegExp(expression);
            this.chain(async(x)=>{
                let func = 'findAsync'
                let params = [{
                    $where: function(){return !!this.text && !!this.text.match(regex)}
                },projection]
                return this.runOperation(x, func, params)
            })
            return this

            
        } catch(e) {
            throw "Invalid Regex expression."
        }
    }
    filterBgColor(color, projection){
        // console.log('\nfilterBgColor')
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

        this.chain(async(x)=>{

            // let result = this.findAsync({
            //     $where: function(){return !!this.style && !!this.style.backgroundColor && this.style.backgroundColor.indexOf(color)===0}
            // }, projection)
            // return result
            // if(x) console.log('color x', x.length)
            let func = 'findAsync'
            let params = [{
                $where: function(){
                    return !!this.style && !!this.style.backgroundColor && this.style.backgroundColor.indexOf(color)===0
                }
            },projection]
            return await this.runOperation(x, func, params)
        })
        return this
    }

}

module.exports = MuralDB