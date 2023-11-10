const Converter = require('../src/converter/helpers/converter-nedb.js');
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
let fooCount = 109

// class PromiseQueue {
//     queue = this.newQueue()

//     newQueue(){
//         return Promise.resolve('___')
//     }
//     then(callback) { callback(this.queue) }
//     // chain(callback) {
//     //     return this.queue = this.queue
//     //         .then((x)=>{console.log('queue x', x?.length);return x;})
//     //         .then(callback)
//     // }
//     f1(){
//         this.add(async (x)=>{
//             return x+'1';
//         })
//         return this
//     }

//     f2(){
//         this.add(async (x)=>{
//             return x+'a';
//         })
//         return this
//     }

//     async add(operation) {
//       return this.queue = this.queue
//         .then(operation)
//         .finally(()=>{
//             this.queue = this.newQueue()
//         })
//     }
//   }



describe('converter', () => {

    // afterEach(function(){
    // })
    
    //   it('instantiates empty database', async () => {
    //     let pq = new PromiseQueue()
    //     let out1 = await pq.f1().f1().f2()//.data()
    //     console.log(out1)
    //     let out2 = await pq.f2().f2()//.data()
    //     console.log(out2)
    // });
    // it('instantiates empty database', async () => {
    //     let con = new Converter() 
    //     await con.insertAsync([])
    //     let count = await con.countAsync()
    //     assert.deepEqual(0, count)
    //     // await con.dropDatabaseAsync()
    // });

    // it('instantiates a database', async () => {
    //     let data = getData()
    //     let con = new Converter() 
    //     await con.insertAsync([data[0]])
    //     let count = await con.countAsync()
    //     assert.equal(1, count)
    //     // await con.dropDatabaseAsync()
    // });

    // it('filter by type', async () => {
    //     let data = getData()
    //     let con = new Converter(data) 
    //     await con.insertAsync(data)
    //     let results = await con.filterType('sticky note')
    //     assert.strictEqual(results.length, stickyCount)
    //     // await con.dropDatabaseAsync()
    // });

    // it('starts with text', async () => {
    //     let data = getData()
    //     let con = new Converter() 
    //     await con.insertAsync(data)
    //     let results = await con.textStartsWith("Quote:")
    //     assert.equal( results.length, quoteCount)
    //     // await con.dropDatabaseAsync()
    // });

    // it('text contains', async () => {
    //     let data = getData()
    //     let con = new Converter() 
    //     await con.insertAsync(data)
    //     let results = await con.textContains("the")
    //     assert.equal( results.length, theCount)
    //     // await con.dropDatabaseAsync()
    // });

    // it('runs raw collection filter', async () => {
    //     let data = getData()
    //     let con = new Converter()
    //     await con.insertAsync(data)
    //     let results = await con.findAsync({type:"sticky note"})
    //     assert.equal( results.length, stickyCount)
    //     // await con.dropDatabaseAsync()
    // });

    // it('text matches Regex', async () => {
    //     let data = getData()
    //     let con = new Converter()
    //     await con.insertAsync(data)
    //     let results = await con.textMatchesRegex(/foo*/g)
    //     assert.equal( results.length, fooCount)
    //     // await con.dropDatabaseAsync()
    // });

    // it('filter by bg color', async () => {
    //     let data = getData()
    //     let con = new Converter() 
    //     await con.insertAsync(data)
    //     let results1 = await con.filterBgColor('#FFC2E8FF')
    //     let results2 = await con.filterBgColor('#FFC2E8')
    //     let results3 = await con.filterBgColor('blue')
    //     let results4 = await con.filterBgColor('#FFC2E8asdfasdf')
    //     let results5 = await con.filterBgColor('aquamarine')
    //     assert.strictEqual(results1.length,35)
    //     assert.strictEqual(results2.length,35)
    //     assert.strictEqual(results3.length,0)
    //     assert.strictEqual(results4.length,0)
    //     assert.strictEqual(results5.length,1)
    //     // await con.dropDatabaseAsync()
    // });

    // it('chainable custom functions', async () => {
    //     let data = getData()
    //     let con = new Converter() 
    //     await con.insertAsync(data)
    //     // let results = con.chain()
    //     // console.log(results)
    //     // console.log('*******')
    //     let results1 = await con.filterType('image').filterType('sticky note')
    //     let results2 = await con.filterType('sticky note').textStartsWith("Quote:")
    //     // let results3 = con.filterType('sticky note').filterType('image')
    //     // let results3 = con.chain().filterType('sticky note').filterType('image').data()
    //     let results3 = await con.filterType('sticky note').filterBgColor('#FFC2E8FF')
    //     assert.strictEqual(results1.length,0)
    //     assert.strictEqual(results2.length,quoteCount)
    //     assert.strictEqual(results3.length,34)
    // });

    // it('chainable custom and standard functions together', async () => {
    //     let data = getData()

    //     let con = new Converter()
    //     await con.insertAsync(data)
    //     let results1 = await con.filterType('sticky note')
    //     let results2 = await con.findAsync({ height: { $gte: 150 } })
    //     let results3 = await con.filterBgColor('#FFC2E8FF')
    //     let results4 = await con.filterType('sticky note').findAsync({ height: { $gte: 150 } })
    //     let results5 = await con.filterBgColor('#FFC2E8FF').findAsync({ height: { $gte: 100 } })
    //     let results6 = await con.filterBgColor('#FFC2E8FF').findAsync({ height: { $gte: 100 } }).filterBgColor('#FFC2EAFF')

    //     assert.strictEqual(results1.length,358)
    //     assert.strictEqual(results2.length,50)
    //     assert.strictEqual(results3.length,35)
    //     assert.strictEqual(results4.length,4)
    //     assert.strictEqual(results5.length,13)
    //     assert.strictEqual(results6.length,0)


    // });
    
    it('add Madi Types', async () => {
        let data = getData()
        let con = new Converter(data)
        await con.insertAsync(data) 
        let results = await con.update(populateMadiTypeField)
        let takeaways = await con.findAsync({madiType:'takeaway'}).countAsync()
        assert.strictEqual(takeaways,80)
        assert.strictEqual(results[0].madiType,'solution')
    });
    
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

    // it('test Saves', async () => {
    //     let data = getData()
    //     let con = new Loki() 
    //     let coll = con.addCollection('collection', { indices: ["id"] });
    //     coll.insert({yes:1})
    //     coll.findAndUpdate({yes:1},o=>Object.assign(o,{no:2}))
    //     console.log(coll.chain().find({}).data())
    //     console.log(con.serializeChanges())
    // });
    

//   con.addTypes()
//   con.addRelations()
//   con.findSourceErrors()
//   let tree = con.convertToTree()
});
