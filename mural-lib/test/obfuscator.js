const { default: Obfuscator } = require('data-obfuscator/build/src/obfuscator');
let json = require('./widgets.original.json')
const fs = require('fs')



let o = new Obfuscator()

let keys = new Set()
json.forEach(w=>{
    Object.keys(w).forEach(k=>{
        keys.add(k)
    })
})

o.ignoredFields = keys;
o.ignoredFields.delete('test')
o.ignoredFields.add('yes')
o.ignoredFields.delete("firstName");
o.ignoredFields.delete("lastName");
o.ignoredFields.delete("contentEditedBy")
o.ignoredFields.delete("createdBy")
o.ignoredFields.delete("updatedBy")
o.ignoredFields.delete("hyperlink")
o.ignoredFields.delete("text")
o.ignoredFields.delete("url")
o.ignoredFields.delete("thumbnailUrl")
o.ignoredFields.delete("link")
let results = o.obfuscate(json);

fs.writeFileSync("widgets.json",JSON.stringify(results))


console.log(results)