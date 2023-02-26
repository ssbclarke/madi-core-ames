
function stripOrphans(db){
    let structuredData = {observations:{}, orphans:{}}
    Object.keys(db).forEach(id=>{
        console.log(db[id].type)
        if(db[id].type === 'takeaway'){
            structuredData.observations[id] = db[id]
        }else{
            structuredData.orphans[id] = db[id]
        }
    })
    return structuredData
}
module.exports = stripOrphans