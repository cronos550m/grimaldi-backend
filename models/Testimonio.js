const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TestimonioSchema = new Schema({
  author: String,
  text: { type: Map, of: String },
  position: String,
  image: String,
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Testimonio', TestimonioSchema);
