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
    let data = [];
    const ranked = [
      [],
      [],
      [],
      [],
    ]
    console.log('Fetching campsites');
    const campsites =  await models.Campsite.find({})
    console.log(campsites.length + ' campsites succsefully fetched');
    campsites.forEach((site, i) => {
      let rank;
      if (site.name && site.ownership === 'federal') {
        rank = 1;
      } else if (site.name && site.ownership === 'state') {
        rank = 2;
      } else if (site.name && site.ownership === 'private') {
        rank = 3;
      } else if (site.name) {
        rank = 4;
      } else {
        rank = 5;
      }
      const campsitePoint = {...point(site.location, {name: site.name !== undefined ? site.name : '', type: site.type, rank, id: site._id}), id: site._id};
      data.push(campsitePoint);
      if (rank === 1) {
        ranked[0].push(campsitePoint);
      }
      if (rank <= 2) {
        ranked[1].push(campsitePoint);
      }
      if (rank <= 3) {
        ranked[2].push(campsitePoint);
      }
      if (rank <= 4) {
        ranked[3].push(campsitePoint);
      }
    });
    fs.writeFileSync('./output/sourceJson/campsites.json', JSON.stringify(featureCollection(data)));
    ranked.forEach((d, i) => fs.writeFileSync(`./output/sourceJson/campsites-rank-${i + 1}.json`, JSON.stringify(featureCollection(d))))
    console.log('Data written to file:');
    console.log('/output/sourceJson/campsites.json');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

console.log('Begin main script execution...');
main();
