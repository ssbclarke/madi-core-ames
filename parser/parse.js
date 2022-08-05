import assert from 'assert';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

const inputPath = './madi_pamo_test_data.csv'

const file = fs.readFileSync(inputPath, {encoding:'utf8'});

const records = parse(file, { bom:true,
  columns: header => header.map(column => column.trim())
})

console.log(records)

fs.writeFile('test_data.json',JSON.stringify(records),
  function (err) {
    if (err) {
        console.error('Crap happens');
    }
  })