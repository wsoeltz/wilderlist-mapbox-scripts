const {Schema, model} = require('mongoose');

const MountainSchema = new Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  elevation: { type: Number, required: true },
  prominence: { type: Number },
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


module.exports = {
  Mountain,
  State,
}
