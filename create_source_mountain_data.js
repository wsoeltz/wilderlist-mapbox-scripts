console.log('Starting script...');

// Use .env variables
require('dotenv').config();
const fsNdjson = require('fs-ndjson');
const _ = require('lodash');
const asyncForEach = require('./utilities/asyncForEach');

console.log('Attempting to connect to MongoDB');
// Connect to database
require('./database_connection');

// Import models
const models = require('./models');

process.on('exit', function(code) {
    return console.log(`Exiting with code ${code}`);
});



const main = async () => {
  try {
    const states =  await models.State.find({});
    console.log(states.length + ' states succsefully fetched');
    let data = [];
    await asyncForEach(states, async state => {
      console.log('Fetching mountains for ' + state.name);
      const mountains =  await models.Mountain
        .find({state: state._id})
      console.log(mountains.length + ' mountains succsefully fetched');
      const mountainsSortedByElevation = _.orderBy(mountains, ['elevation'], ['desc']);
      mountainsSortedByElevation.forEach((mtn, i) => {
        // five tiers of rank
        // 1: 5% highest && in a list     [zoom > 5]
        // 2: 5% && in a list            [zoom > 5.75]
        // 3: 10% highest || in a list    [zoom > 6.75]
        // 4: 20% highest                 [zoom > 7.75]
        // 5: everything else             [zoom > 9]
        let rank;
        if (mtn.lists && mtn.lists.length) {
          if (i < mountainsSortedByElevation.length * 0.05) {
            rank = 1;
          } else if (i < mountainsSortedByElevation.length * 0.1) {
            rank = 2;
          } else {
            rank = 3;
          }
        } else if (i < mountainsSortedByElevation.length * 0.1) {
          rank = 3;
        } else if (i < mountainsSortedByElevation.length * 0.2) {
          rank = 4;
        } else {
          rank = 5;
        }
        data.push({
          type: "Feature",
          id: mtn._id,
          geometry: {
            type: "Point",
            coordinates: [ parseFloat(mtn.longitude.toFixed(9)), parseFloat(mtn.latitude.toFixed(9))],
          },
          properties: {
            name: mtn.name,
            rank, 
          },
        })
      });
    });
    fsNdjson.writeFileSync('./output/mountain-data-test.json', data);
    console.log('Data written to file:');
    console.log('./output/mountain-data-test.json');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

console.log('Begin main script execution...');
main();
