console.log('Starting script...');

// Use .env variables
require('dotenv').config();
const fsNdjson = require('fs-ndjson');
const fs = require('fs');
const _ = require('lodash');
const asyncForEach = require('../utilities/asyncForEach');
const {lineString, featureCollection} = require('@turf/helpers');
const StreamArray = require( 'stream-json/streamers/StreamArray');

process.on('exit', function(code) {
    return console.log(`Exiting with code ${code}`);
});

const jsonStream = StreamArray.withParser();

console.log('Begin main script execution...');
//internal Node readable stream option, pipe to stream-json to convert it for us
fs.createReadStream('./assets/trails.json').pipe(jsonStream.input);

const geojsonData = [
  {},
  {},
  {},
  {},
  {},
];
const estimatedTotal = 3224200;
let progress = 0;
console.log('0%');
//You'll get json objects here
//Key is the array-index here
jsonStream.on('data', (res) => {
  try {
    if (res) {
      const {key: i, value: trail} = res;
      const id = trail._id.$oid;
      let rank;
      if (trail.name && trail.parents && trail.parents.length && trail.type !== 'road' && trail.type !== 'dirtroad') {
        rank = 1;
      } else if (trail.name && trail.type !== 'road' && trail.type !== 'dirtroad') {
        rank = 2;
      } else if (trail.type !== 'road' && trail.type !== 'dirtroad') {
        rank = 3;
      } else if (trail.name) {
        rank = 4;
      } else {
        rank = 5;
      }
      if (trail.line && trail.line.length && trail.type) {
        const properties = {type: trail.type, rank, id};
        if (trail.name !== undefined) {
          properties.name = trail.name;
        }
        const trailPoint = {...lineString(trail.line, properties), id};
        if (geojsonData[rank - 1][trail.type] === undefined) {
          geojsonData[rank - 1][trail.type] = [];
        }
        geojsonData[rank - 1][trail.type].push(trailPoint);

      } else {
        console.log({error: 'missing line data', trail})
      }
      const currentProgress = Math.round((i + 1) / estimatedTotal * 100);
      if (currentProgress !== progress) {
        progress = currentProgress;
        console.log(progress + '%')
      }
    } else {
      console.log('undefined response');
    }
  } catch (err) {
    console.log('Error caught, continuing process:')
    console.log(err);
  }
});

jsonStream.on('end', (response) => {
    console.log('Writing data to file');
    try {
      geojsonData.forEach((d, i) => {
        for (let key in d) {
          const filename  = `./output/sourceJson/trails/jsonl/${key}-${i + 1}.jsonl`;
          fsNdjson.writeFileSync(filename, geojsonData[i][key]);
          console.log('Data written to file: ' + filename);
        }
      })
    } catch(e) {
      console.log(e)
    }
    try {
      geojsonData.forEach((d, i) => {
        for (let key in d) {
          const filename  = `./output/sourceJson/trails/json/${key}-${i + 1}.json`;
          fs.writeFileSync(filename, JSON.stringify(featureCollection(geojsonData[i][key])));
          console.log('Data written to file: ' + filename);
        }
      });
    } catch(e) {
      console.log(e)
    }
    process.exit(0);
});

