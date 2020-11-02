console.log('Starting script...');

// Use .env variables
require('dotenv').config();
const fsNdjson = require('fs-ndjson');
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
      mountains.forEach((mtn, i) => {
        data.push({
          type: "Feature",
          id: mtn._id,
          geometry: {
            type: "Point",
            coordinates: [ parseFloat(mtn.longitude.toFixed(6)), parseFloat(mtn.latitude.toFixed(6)), mtn.elevation],
          },
          properties: {name: mtn.name},
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
