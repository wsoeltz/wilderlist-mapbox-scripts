console.log('Starting script...');

// Use .env variables
require('dotenv').config();
const fs = require('fs');
const _ = require('lodash');
const asyncForEach = require('../utilities/asyncForEach');
const {lineString, featureCollection} = require('@turf/helpers');
const mongoose = require('mongoose');

console.log('Attempting to connect to MongoDB');
// Connect to database
require('../database_connection');

// Import models
const models = require('../models');

process.on('exit', function(code) {
    return console.log(`Exiting with code ${code}`);
});

const main = async () => {
  try {
    const source = JSON.parse(fs.readFileSync('./assets/trails.json'))
    let data = [];
    // const ranked = [
    //   [],
    //   [],
    //   [],
    //   [],
    // ]
    console.log('Fetching trails');
    // ObjectId("5d5db5e67285c2a4ff69b164") = NH
    // ObjectId("5e62d6395bff660017daec45") = CA
    // ObjectId("5d5db6257285c2a4ff69b169") = RI
    const trails =  await models.Trail.find({})
    // const trails =  await models.Trail.find({states: {$in: [mongoose.Types.ObjectId("5d5db6257285c2a4ff69b169")]}})
    console.log(trails.length + ' trails succsefully fetched');
    let progress = 0;
    console.log('0%')
    trails.forEach((trail, i) => {
      let rank;
      if (trail.name && trail.parents.length && trail.type !== 'road' && trail.type !== 'dirtroad') {
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
      const trailPoint = {...lineString(trail.line, {name: trail.name, type: trail.type, rank, id: trail._id}), id: trail._id};
      data.push(trailPoint);
      // if (rank === 1) {
      //   ranked[0].push(trailPoint);
      // }
      // if (rank <= 2) {
      //   ranked[1].push(trailPoint);
      // }
      // if (rank <= 3) {
      //   ranked[2].push(trailPoint);
      // }
      // if (rank <= 4) {
      //   ranked[3].push(trailPoint);
      // }
      const currentProgress = Math.round((i + 1) / trails.length * 100);
      if (currentProgress !== progress) {
        progress = currentProgress;
        console.log(progress + '%')
      }
    });
    fs.writeFileSync('./output/sourceJson/trails.json', JSON.stringify(featureCollection(data)));
    // ranked.forEach((d, i) => fs.writeFileSync(`./output/sourceJson/trails-rank-${i + 1}.json`, JSON.stringify(featureCollection(d))))
    console.log('Data written to file:');
    console.log('/output/sourceJson/trails.json');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

console.log('Begin main script execution...');
main();
