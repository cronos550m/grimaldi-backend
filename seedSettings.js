require('dotenv').config();
const mongoose = require('mongoose');
const Settings = require('./models/Settings');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grimaldi_db';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(async ()=> {
  const translations = {
    es: {
      siteTitle: "Grimaldi - Servicios Marítimos",
      welcome: "Bienvenido a Grimaldi"
    },
    en: {
      siteTitle: "Grimaldi - Maritime Services",
      welcome: "Welcome to Grimaldi"
    }
  };
  await Settings.findOneAndUpdate({ key: 'translations' }, { value: translations }, { upsert:true });
  console.log('Seeded settings translations');
  process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });
