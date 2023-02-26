// import MDB from "mural-db/build/converter.js"
// import listToTree from "./helpers/listToTree.js";
// const MuralDb = MDB.default;
// import populateMadiTypeField from './helpers/populateMadiTypeField.js'
// import YAML from 'yaml'
// import convertToMarkdown from './helpers/convertToMarkdown.js'
// import Showdown from "showdown";
// import fs from 'fs';
// import cleanText from "./helpers/textClean.js";


// This is a skeleton for a custom service class. Remove or add the methods you need here
export class ObservationsService {
  constructor(options) {
    this.options = options
  }

  async create(data, params) {
    
  }
  
  // async convertMuralData(data, params){

  //   const db = new MuralDb()
  //   const parentField = 'arrowParent';
  //   await db.insertAsync(data)

  //   // add the arrowParents relations field
  //   await db.addRelations({ modifyOriginal: true})
  
  //   // get only the stick notes
  //   let results = await db.filterType("sticky note", {
  //     id: 1,
  //     type: 1,
  //     text: 1,
  //     hyperlink: 1,
  //     'style.backgroundColor': 1,
  //     _id: 0,
  //     arrowParent:1
  //   })

  //   // populate the entities with a guess at the type
  //   results = results.map(w => populateMadiTypeField(w))

  //   // filter empty results
  //   results = results.filter(w=>!!w)
  //   // prepopulate the errors and remove the styles
  //   results = results.map(w => ({ errors: [], ...w, style:undefined }))
  //   // add an error where no type was found
  //   results = results.map(w => { if (w.madiType == 'none') { w.errors.push('NO MATCHING TYPE') } return w; })

  //   results = results.map(w=>{ w.text = cleanText(w.text); return w })

  //   // convert list to tree
  //   let tree = listToTree(results,'arrowParent','id','children') 

  //   // find sources from parents and children and combine into array on parent
  //   tree = tree.map(p=>{
  //     // console.log('--------')
  //     p = {sources:[], ...p};
  //     let parentSource = p.hyperlink;
  //     let childSources = p.children.map(c=>{
  //       return c.hyperlink
  //     })
  //     p.sources = [...new Set([parentSource, ...childSources].filter(s=>!!s))]
  //     console.log(p.sources.length)
  //     if(p.sources.length > 1){
  //         // console.log('MISMATCH')
  //         p.errors.push("SOURCE MISMATCH")
  //         // console.log(p.errors.length)
  //     }
  //     if(p.sources.length === 0){
  //         p.errors.push("SOURCE MISSING.")
  //     }
  //     return p
  //   })
  //   // fs.writeFileSync('test.json',JSON.stringify(tree))



  //   let output = {data:tree}
  //   // if(params.query && params.query.format && params.query.format.includes('md')){
  //     output.md = convertToMarkdown(tree)
  //   // }
  //   // if(params.query && params.query.format && params.query.format.includes('yaml')){
  //     output.yaml = YAML.stringify(tree)
  //   // }
  //   // if(params.query && params.query.format && params.query.format.includes('html')){
  //     let converter = new Showdown.Converter({omitExtraWLInCodeBlocks:true})
  //     let text      = output.md || convertToMarkdown(tree)
  //     output.html = converter.makeHtml(text)//.replace(/>\n</g,"><br/><")
  //   // }
  //   fs.writeFileSync('test.md',output.md) //.replace(/\n[\n\s]{2,}\n/g,"\n"))
  //   fs.writeFileSync('test.html',output.html)

  //   return output
  // }

}

export const getOptions = (app) => {
  return { app }
}
