const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const auth = require('../middleware/auth');

// public read
router.get('/', async (req,res,next)=> {
  try {
    const items = await Service.find({ active: true }).sort({ order: 1 });
    res.json(items);
  } catch(e){ next(e); }
});

// admin create
router.post('/', auth, async (req,res,next)=> {
  try {
    const s = new Service(req.body);
    await s.save();
    res.json(s);
  } catch(e){ next(e); }
});

// update
router.put('/:id', auth, async (req,res,next)=> {
  try {
    const s = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(s);
  } catch(e){ next(e); }
});

// delete
router.delete('/:id', auth, async (req,res,next)=> {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch(e){ next(e); }
});

module.exports = router;
