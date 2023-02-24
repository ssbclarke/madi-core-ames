import { KnexService } from '@feathersjs/knex'
import { BadRequest } from '@feathersjs/errors'

// Converter Specific
import MDB from "mural-db/build/converter.js"
import listToTree from "./helpers/listToTree.js";
const MuralDb = MDB.default;
import populateMadiTypeField from './helpers/populateMadiTypeField.js'
import YAML from 'yaml'
import convertToMarkdown from './helpers/convertToMarkdown.js'
import Showdown from "showdown";
import fs from 'fs';
import cleanText from "./helpers/textClean.js";

const formatOutput = (data, outputFormat)=>{
  switch(outputFormat){
    case 'md':
    case 'markdown':
      return convertToMarkdown(data)
    case 'yaml':
    case 'yml':
      return YAML.stringify(data)
    case 'html':
      let text      = convertToMarkdown(data)
      let converter = new Showdown.Converter({omitExtraWLInCodeBlocks:true})
      return converter.makeHtml(text)//.replace(/>\n</g,"><br/><")
    default:
      return data 
  }
}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class MuralsService extends KnexService {

  async convert(data, params){
    console.log('HERRRRE')
    let outputFormat = params?.query?.outputFormat
    delete params.query.outputFormat
    let id = params.query.id || data.id 
    if(!id) throw new BadRequest('Must include `id` in query in or request body.')

    let { raw, format, result } = await this.get(id,params)

    // if data has already been converted
    if(result){
      return formatOutput(result,outputFormat)
    }

    const db = new MuralDb()
    const parentField = 'arrowParent';
    await db.insertAsync(raw)

    // add the arrowParents relations field
    await db.addRelations({ modifyOriginal: true})
  
    // get only the stick notes
    let results = await db.filterType("sticky note", {
      id: 1,
      type: 1,
      text: 1,
      hyperlink: 1,
      'style.backgroundColor': 1,
      _id: 0,
      arrowParent:1
    })


    // populate the entities with a guess at the type
    results = results.map(w => populateMadiTypeField(w))

    // filter empty results
    results = results.filter(w=>!!w)
    // prepopulate the errors and remove the styles
    results = results.map(w => ({ errors: [], ...w, style:undefined }))
    // add an error where no type was found
    results = results.map(w => { if (w.madiType == 'none') { w.errors.push('NO MATCHING TYPE') } return w; })

    results = results.map(w=>{ w.text = cleanText(w.text); return w })


    // // convert list to tree
    let tree = listToTree(results,'arrowParent','id','children') 

    // find sources from parents and children and combine into array on parent
    results = tree.map(p=>{
      p = {sources:[], ...p};
      let parentSource = p.hyperlink;
      let childSources = p.children.map(c=>{
        return c.hyperlink
      })
      p.sources = [...new Set([parentSource, ...childSources].filter(s=>!!s))]
      
      if(p.sources.length > 1){
          p.errors.push("SOURCE MISMATCH")
      }
      if(p.sources.length === 0){
          p.errors.push("SOURCE MISSING.")
      }
      return p
    }).sort((a,b)=>(a.id > b.id) ? 1 : -1)

    await this.patch(id,{
      format: 'dogbone',
      result: results
    })

    return formatOutput(result,outputFormat)
  }

}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'murals',
  }
}
