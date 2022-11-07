function addArrowRelations(db, raw){
    raw.widgets.forEach(w=>{
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
    return db
}
module.exports = addArrowRelations