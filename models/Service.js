const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServiceSchema = new Schema({
  title: { type: Map, of: String }, // multilingual { en: '', es: '' }
  description: { type: Map, of: String },
  image: String,
  order: Number,
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);
