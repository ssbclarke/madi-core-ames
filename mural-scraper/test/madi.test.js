const Converter = require('../src/converter/helpers/converter-low.js');
const assert = require('assert').strict;
let widgets = require('./widgets.json')
let populateMadiTypeField = require('../src/converter/helpers/populateMadiTypeField')
const Loki = require('lokijs')

// mutates the data object directly
const getData = ()=>{
    return widgets.map(item=>({...item}));
}

describe('converter', () => {
    
    // it('add Madi Types', async () => {
    //     let data = getData()
    //     let con = new Converter([data[0]]) 
    //     let results = con.chain().update(populateMadiTypeField).data()
    //     assert.strictEqual(results[0].madiType,'solution')
    // });
    
    // it('add Relations', async () => {
    //     let data = getData()
    //     let con = new Converter([data[0]]) 
    //     let results = con.chain().update(populateMadiTypeField).data()
    //     assert.strictEqual(results[0].madiType,'solution')
    // });
    

//   con.addTypes()
//   con.addRelations()
//   con.findSourceErrors()
//   let tree = con.convertToTree()
});
