import * as path from 'path';
import { promises as fs } from 'fs';

const readFile = fs.readFile;
const writeFile = fs.writeFile;

async function main() {
  // console.log(__dirname);
  const dataBuffer = await readFile(path.join(__dirname,'../dist/js/vendor.js'));
  await writeFile(path.join(__dirname, '../dist/js/vendor.js'), dataBuffer.toString('utf8').replace('￿','\\uffff'));
}

main();


