const {Schema, model} = require('mongoose');

const MountainSchema = new Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  elevation: { type: Number, required: true },
  // prominence: { type: Number },
  state: {
    type: Schema.Types.ObjectId,
    ref: 'state',
  },
  lists: [{
    type: Schema.Types.ObjectId,
    ref: 'list',
  }],
  optionalLists: [{
    type: Schema.Types.ObjectId,
    ref: 'list',
  }],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  status: { type: String },
  flag: { type: String },
  description: { type: String },
  resources: [{
    title: { type: String },
    url: { type: String },
  }],
  location: [{type: Number}],
  trailAccessible: {type: Boolean},
});

const Mountain = model('mountain', MountainSchema);

const StateSchema = new Schema({
  name: { type: String, required: true },
  abbreviation: { type: String, required: true },
  regions: [{
    type: Schema.Types.ObjectId,
    ref: 'region',
  }],
  mountains: [{
    type: Schema.Types.ObjectId,
    ref: 'mountain',
  }],
  peakLists: [{
    type: Schema.Types.ObjectId,
    ref: 'peakList',
  }],
});

const State = model('state', StateSchema);


const TrailSchema = new Schema({
  name: { type: String },
  osmId: { type: Number },
  relId: { type: String },
  type: { type: String },
  states: [{
    type: Schema.Types.ObjectId,
    ref: 'state',
  }],
  line: [[Number]],
  center: [{type: Number}],
  allowsBikes: { type: Boolean },
  allowsHorses: { type: Boolean },
  parents: [{
    type: Schema.Types.ObjectId,
    ref: 'trails',
  }],
  children: [{
    type: Schema.Types.ObjectId,
    ref: 'trails',
  }],
  waterCrossing: { type: String },
  skiTrail: { type: Boolean },
});

TrailSchema.index({ center: '2dsphere' });

const Trail = model('trails', TrailSchema);

const CampsiteSchema = new Schema({
  name: { type: String },
  reserveamericaId: { type: Number },
  ridbId: { type: Number },
  osmId: { type: Number },
  location: [{type: Number}],
  state: {
    type: Schema.Types.ObjectId,
    ref: 'state',
  },
  website: { type: String },
  type: { type: String },
  ownership: { type: String },
  electricity: { type: Boolean },
  toilets: { type: Boolean },
  drinking_water: { type: Boolean },
  email: { type: String },
  reservation: { type: String },
  showers: { type: Boolean },
  phone: { type: String },
  fee: { type: Boolean },
  tents: { type: Boolean },
  capacity: { type: Number },
  internet_access: { type: Boolean },
  fire: { type: Boolean },
  maxtents: { type: Number },
});

CampsiteSchema.index({ location: '2dsphere' });

const Campsite = model('campsites', CampsiteSchema);


module.exports = {
  Mountain,
  State,
  Trail,
  Campsite,
}
