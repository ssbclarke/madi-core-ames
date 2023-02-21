function addArrowRelations(arrows, db){
    arrows.forEach(({startRefId, endRefId})=>{
        let parent
        let child
        if (db[startRefId]?.type === 'takeaway'){
            parent = startRefId
            child = endRefId
        }
        if (db[endRefId]?.type === 'takeaway'){
            parent = endRefId
            child = startRefId
        }
        if(parent && child && db[parent] && db[child]){
            // push the child to the right array
            db[parent].children = db[parent]?.children || []
            db[parent].children.push(child)
            db[child].parents = db[child]?.parents || []
            db[child].parents.push(parent)
        }
    })
    return db
}
module.exports = addArrowRelations