console.log('Starting script...');

const fs = require('fs');

const input_folder = './output/sourceJson/trails/jsonl/';
const output_folder = './output/sourceJson/trails/merged/';

console.log('Getting files...');

const files = fs.readdirSync(input_folder);

const trail_files = files.filter(file => !file.includes('road'));
const dirtroad_files = files.filter(file => file.includes('dirtroad-5'));
const road_files = files.filter(file => file.includes('road') && !file.includes('dirtroad-5'));

let merged_trails = '';
trail_files.forEach((file, i) => {
  console.log('Read ' + file)
  merged_trails = merged_trails + fs.readFileSync(input_folder + file);
});

console.log('Writing trails to file...')
fs.writeFileSync(output_folder + 'trails.jsonl', merged_trails);
console.log('Succesfully written to file.')


let merged_roads = '';
road_files.forEach((file, i) => {
  console.log('Read ' + file)
  merged_roads = merged_roads + fs.readFileSync(input_folder + file);
});

console.log('Writing roads to file...')
fs.writeFileSync(output_folder + 'roads.jsonl', merged_roads);
console.log('Succesfully written to file.')


let merged_dirtroads = '';
dirtroad_files.forEach((file, i) => {
  console.log('Read ' + file)
  merged_dirtroads = merged_dirtroads + fs.readFileSync(input_folder + file);
});

console.log('Writing dirtroads to file...')
fs.writeFileSync(output_folder + 'unnamed-dirtroads.jsonl', merged_dirtroads);
console.log('Succesfully written to file.')
