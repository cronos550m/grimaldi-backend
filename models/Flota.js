const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FlotaSchema = new Schema({
  name: { type: Map, of: String },
  description: { type: Map, of: String },
  image: String,
  capacity: String,
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Flota', FlotaSchema);
