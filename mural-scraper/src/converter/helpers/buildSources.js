const  {
    CONST_ARRAY
} = require('../constants')

function buildSources(db){
    Object.keys(db).forEach(id=>{
        db[id].sources = []
        //if the top element has a source, add it to the array
        if(!!db[id].source){
            db[id].sources.push(db[id].source)
        }
        delete db[id].source
        //if child elements have sources
        for(type in CONST_ARRAY){
            if(!!db[id][type] && !!db[id][type].source){
                db[id].sources.push(db[id][type].source)
            }
        }
        //if the sources are different
        db[id].sources = [...new Set(db[id].sources)];
        if(db[id].sources.length > 1){
            db[id].error.push("Multiple sources, but not the same.")
        }
        if(db[id].sources.length === 0){
            db[id].error.push("No source.")
        }
    })
    return db
}


module.exports = buildSources