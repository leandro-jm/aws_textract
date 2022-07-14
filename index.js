'use strict';

const fs = require('fs');
const textract = require('aws_textract');

let rawdata = fs.readFileSync('aws_load_response.json');
let file_name = JSON.parse(rawdata);

console.log('========================================')
var tables = textract.getTable(file_name.Blocks);
var contents = textract.getCell(file_name.Blocks, tables);
var results = JSON.stringify(textract.toMatrix(contents));

console.log('Gerando resultado da extração...')
console.log('-----------------------------------------');
console.log(results);
console.log('========================================')