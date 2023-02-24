export default function listToTree(list, parentField ='parentId', idField="id", childField='children') {
    var map = {}, node, roots = [], i;

    for (i = 0; i < list.length; i += 1) {
        map[list[i][idField]] = i; // initialize the map
        list[i][childField]= []; // initialize the children
    }
    console.log(map)

    for (i = 0; i < list.length; i += 1) {
        node = list[i];
        console.log(i, list[i][idField], node, map[node[parentField]])
        if (node[parentField] && map[node[parentField]]) {
            // if you have dangling branches check that map[node.parentId] exists
            list[map[node[parentField]]][childField].push(node);
        } else {
            roots.push(node);
        }
    }
    console.log(map)
    return roots;
}
