const express = require('express');
const router = express.Router();
const Testimonio = require('../models/Testimonio');
const auth = require('../middleware/auth');

router.get('/', async (req,res,next)=> {
  try { res.json(await Testimonio.find({ active: true })); } catch(e){ next(e); }
});

router.post('/', auth, async (req,res,next)=> {
  try { const t = new Testimonio(req.body); await t.save(); res.json(t); } catch(e){ next(e); }
});

router.put('/:id', auth, async (req,res,next)=> {
  try { const t = await Testimonio.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(t); } catch(e){ next(e); }
});

router.delete('/:id', auth, async (req,res,next)=> {
  try { await Testimonio.findByIdAndDelete(req.params.id); res.json({ ok: true }); } catch(e){ next(e); }
});

module.exports = router;
