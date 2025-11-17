const express = require('express');
const router = express.Router();
const Flota = require('../models/Flota');
const auth = require('../middleware/auth');

router.get('/', async (req,res,next)=> {
  try { res.json(await Flota.find({ active: true })); } catch(e){ next(e); }
});

router.post('/', auth, async (req,res,next)=> {
  try { const f = new Flota(req.body); await f.save(); res.json(f); } catch(e){ next(e); }
});

router.put('/:id', auth, async (req,res,next)=> {
  try { const f = await Flota.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(f); } catch(e){ next(e); }
});

router.delete('/:id', auth, async (req,res,next)=> {
  try { await Flota.findByIdAndDelete(req.params.id); res.json({ ok: true }); } catch(e){ next(e); }
});

module.exports = router;
