const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');

// get all settings as key->value map
router.get('/', async (req,res,next)=> {
  try {
    const docs = await Settings.find({});
    const map = {};
    docs.forEach(d => map[d.key] = d.value);
    res.json(map);
  } catch(e){ next(e); }
});

// update a setting
router.post('/:key', auth, async (req,res,next)=> {
  try {
    const { key } = req.params;
    const value = req.body.value;
    const s = await Settings.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });
    res.json(s);
  } catch(e){ next(e); }
});

module.exports = router;
