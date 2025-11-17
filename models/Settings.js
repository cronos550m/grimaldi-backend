const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SettingsSchema = new Schema({
  key: { type: String, unique: true },
  value: { type: Schema.Types.Mixed }
}, { timestamps: true });

module.exports = mongoose.model('Settings', SettingsSchema);
