const Converter = require('../src/converter/helpers/converter-loki.js');
const assert = require('assert').strict;
let widgets = require('./widgets.json')
let populateMadiTypeField = require('../src/converter/helpers/populateMadiTypeField')
const Datastore = require('@seald-io/nedb')

// mutates the data object directly
const getData = ()=>{
    return widgets.map(item=>({...item}));
}
let stickyCount = 358
let quoteCount = 37
let theCount = 163
let fooCount = 92

describe('converter', () => {

    // it('instantiates empty database', async () => {
    //     let con = new Converter() 
    //     assert.deepEqual(0, con.count())
    //     assert.deepEqual(0, con.collection.count())
    // });

    // it('instantiates a database', async () => {
    //     let data = getData()
    //     let con = new Converter([data[0]]) 
    //     assert.equal(1, con.count())
    // });

    // it('filter by type', async () => {
    //     let data = getData()
    //     let con = new Converter(data) 
    //     let results = con.filterType('sticky note').data()
    //     assert.strictEqual(results.length, stickyCount)
    // });

    // it('starts with text', async () => {
    //     let data = getData()
    //     let con = new Converter(data) 
    //     let results = con.textStartsWith("Quote:").data()
    //     assert.equal( results.length, quoteCount)
    // });

    // it('text contains', async () => {
    //     let data = getData()
    //     let con = new Converter(data) 
    //     let results = con.textContains("the").data()
    //     assert.equal( results.length, theCount)
    // });

    // it('runs raw collection filter', async () => {
    //     let data = getData()
    //     let con = new Converter(data) 
    //     let results = con.collection.find({type:"sticky note"})
    //     assert.equal( results.length, stickyCount)
    // });

    // it('text matches Regex', async () => {
    //     let data = getData()
    //     let con = new Converter(data) 
    //     let results = con.textMatchesRegex(/foo*/g).data()
    //     assert.equal( results.length, fooCount)
    // });

    // it('filter by bg color', async () => {
    //     let data = getData()
    //     let con = new Converter(data) 
    //     let results1 = con.filterBgColor('#FFC2E8FF').data()
    //     let results2 = con.filterBgColor('#FFC2E8').data()
    //     let results3 = con.filterBgColor('blue').data()
    //     let results4 = con.filterBgColor('#FFC2E8asdfasdf').data()
    //     let results5 = con.filterBgColor('aquamarine').data()
    //     assert.strictEqual(results1.length,35)
    //     assert.strictEqual(results2.length,35)
    //     assert.strictEqual(results3.length,0)
    //     assert.strictEqual(results4.length,0)
    //     assert.strictEqual(results5.length,1)
    // });

    // it('chainable custom functions', async () => {
    //     let data = getData()
    //     let con = new Converter(data) 
    //     let results1 = con.filterType('image').data()
    //     let results2 = con.filterType('sticky note').data()
    //     let results3 = con.filterType('sticky note').filterType('image').data()
    //     let results4 = con.filterType('sticky note').filterBgColor('#FFC2E8FF').count()
    //     assert.strictEqual(results1.length,quoteCount)
    //     assert.strictEqual(results2.length,stickyCount)
    //     assert.strictEqual(results3.length,0)
    //     assert.strictEqual(results4,34)
    // });
    // it('chainable custom and standard functions together', async () => {
    //     let data = getData()
    //     let con = new Converter(data) 
    //     let results = con.filterType('sticky note').find({ height: { $gte: 150 } }).count()
    //     assert.strictEqual(results,4)
    // });
    
    // it('add Madi Types', async () => {
    //     let data = getData()
    //     let con = new Converter(data) 
    //     let results = con.chain().update(populateMadiTypeField).data()
    //     let takeaways = con.chain().find({madiType:'takeaway'}).count()
    //     assert.strictEqual(takeaways,80)
    //     assert.strictEqual(results[0].madiType,'solution')
    // });
    
    // it('add Relations', async () => {
    //     let data = getData()
    //     let con = new Converter(data) 
    //     let results = con.addArrowRelations().data().serializeChanges()
    //     assert.strictEqual(results.length,279)
    //     assert.strictEqual(results[0]._arrowChild[0],'45-1667868664111')
    //     let results2 = con.collection.chain().find(
    //         {"$or":[
    //             {'_arrowChild' : {'$exists': true}},
    //             {'_arrowParent' : {'$exists': true}},
    //         ]}
    //     ).data().serializeChanges()
    //     console.log(con.serializeChanges())
    //     assert.strictEqual(results2.length,279)
    // });

    it('test Saves', async () => {
        let data = getData()
        let con = new Loki() 
        let coll = con.addCollection('collection', { indices: ["id"] });
        coll.insert({yes:1})
        coll.findAndUpdate({yes:1},o=>Object.assign(o,{no:2}))
        console.log(coll.chain().find({}).data())
        console.log(con.serializeChanges())
    });
    

//   con.addTypes()
//   con.addRelations()
//   con.findSourceErrors()
//   let tree = con.convertToTree()
});
