const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// public post
router.post('/', async (req,res,next)=> {
  try {
    const c = new Contact(req.body);
    await c.save();
    res.json({ ok: true });
  } catch(e){ next(e); }
});

module.exports = router;
