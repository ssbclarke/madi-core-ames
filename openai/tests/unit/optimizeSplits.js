import { describe, it } from 'node:test';
import { optimizeSplits } from '../../src/utils/text.js';
import assert from 'node:assert/strict';

let a = "Dolore duis" //5 short
let b = "In aute fugiat do ullamco ipsum" //13 under target
let c = "Non nostrud ullamco ipsum laborum duis quis fugiat qui nulla" //22 over target
let d = "Nisi velit officia duis commodo nulla. officia duis commodo nulla. Esse id ut ea nostrud exercitation cupidatat. Est " //40 long
    
describe('optimizeSplits', () => {
  it('under then short', () => {
    const arr = [a,b]
    const result = optimizeSplits(arr, 10, 20, 35);
    assert.strictEqual(result.length,1);
  });
  it('under then long', () => {
    const arr = [a,d]
    const result = optimizeSplits(arr, 10, 20, 35);
    assert.strictEqual(result.length,2);
  });
  it('under then over', () => {
    const arr = [a,d]
    const result = optimizeSplits(arr, 10, 20, 35);
    assert.strictEqual(result.length,2);
  });
  it('short then under', () => {
    const arr = [b,a]
    const result = optimizeSplits(arr, 10, 20, 35);
    assert.strictEqual(result.length,1);
  });
  it('short then short', () => {
    const arr = [b,b]
    const result = optimizeSplits(arr, 10, 20, 35);
    assert.strictEqual(result.length,1);
  });
  it('short then long', () => {
    const arr = [b,c]
    const result = optimizeSplits(arr, 10, 20, 35);
    assert.strictEqual(result.length,2);
  });
  it('short then over', () => {
    const arr = [b,d]
    const result = optimizeSplits(arr, 10, 20, 35);
    assert.strictEqual(result.length,2);
  });
  it('long then short', () => {
    const arr = [c,a]
    const result = optimizeSplits(arr, 10, 20, 35);
    assert.strictEqual(result.length,2);
  });


  

//   it('should split an array of elements with any element length > 30', () => {
//     const arr = ['this', 'is', 'a', 'test', 'sentence', 'withaverylongwordthatshouldbesplit'];
//     const result = optimizeSplits(arr, 5, 7, 10);
//     assert.strictEqual(result.length,5);
//     assert.strictEqual(result[0],'this is');
//     assert.strictEqual(result[1],'a test');
//     assert.strictEqual(result[2],'sentence');
//     assert.strictEqual(result[3],'withaverylongwordthatsh');
//     assert.strictEqual(result[4],'ouldbesplit');
//   });

//   it('should handle empty inputs', () => {
//     const arr = [];
//     const result = optimizeSplits(arr, 5, 7, 10);
//     assert.strictEqual(result.length,0);
//   });

//   it('should not modify a single element array', () => {
//     const arr = ['this'];
//     const result = optimizeSplits(arr, 5, 7, 10);
//     assert.strictEqual(result.length,1);
//     assert.strictEqual(result[0],'this');
//   });
});