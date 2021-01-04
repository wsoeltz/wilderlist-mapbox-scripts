console.log('Starting script...');

// Use .env variables
require('dotenv').config();
const fs = require('fs');
const _ = require('lodash');
const asyncForEach = require('../utilities/asyncForEach');
const {point, featureCollection} = require('@turf/helpers');

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
    const states =  await models.State.find({});
    console.log(states.length + ' states succsefully fetched');
    let data = [];
    const ranked = [
      [],
      [],
      [],
      [],
      [],
    ]
    await asyncForEach(states, async state => {
      console.log('Fetching mountains for ' + state.name);
      const mountains =  await models.Mountain
        .find({state: state._id})
      console.log(mountains.length + ' mountains succsefully fetched');
      const mountainsSortedByElevation = _.orderBy(mountains, ['elevation'], ['desc']);
      mountainsSortedByElevation.forEach((mtn, i) => {
        let rank;
        let order = 0 - mtn.elevation; // smallest number is ordered first
        if (mtn.trailAccessible) {
          order = order - 1000;
          if (i < mountainsSortedByElevation.length * 0.05) {
            rank = 1;
          } else if (i < mountainsSortedByElevation.length * 0.1) {
            rank = 2;
          } else if ((mtn.lists && mtn.lists.length) || i < mountainsSortedByElevation.length * 0.2) {
            rank = 3;
          } else {
            rank = 4;
          }
        } else if (mtn.lists && mtn.lists.length) {
          rank = 5;
        } else {
          rank = 6;
        }
        if (mtn.lists && mtn.lists.length) {
          order = order - 500;
        }
        const mountainPoint = {...point(mtn.location, {
          name: mtn.name !== undefined ? mtn.name : '',
          rank,
          ele: mtn.elevation,
          id: mtn._id,
          order,
        }), id: mtn._id};
        data.push(mountainPoint);
        if (rank === 1) {
          ranked[0].push(mountainPoint);
        }
        if (rank <= 2) {
          ranked[1].push(mountainPoint);
        }
        if (rank <= 3) {
          ranked[2].push(mountainPoint);
        }
        if (rank <= 4) {
          ranked[3].push(mountainPoint);
        }
        if (rank <= 5) {
          ranked[4].push(mountainPoint);
        }
      });
    });
    fs.writeFileSync('./output/sourceJson/mountains.json', JSON.stringify(featureCollection(data)));
    ranked.forEach((d, i) => fs.writeFileSync(`./output/sourceJson/mountains-rank-${i + 1}.json`, JSON.stringify(featureCollection(d))))
    console.log('Data written to file:');
    console.log('/output/sourceJson/mountains.json');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

console.log('Begin main script execution...');
main();
