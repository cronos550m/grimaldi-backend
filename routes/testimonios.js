
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth');

router.get('/', async (req,res,next)=> {
  try { res.json(await prisma.testimonio.findMany({ where: { active: true } })); } catch(e){ next(e); }
});

router.post('/', auth, async (req,res,next)=> {
  try {
    const p = req.body;
    const t = await prisma.testimonio.create({ data: {
      author: p.author,
      text_es: p.text?.es || p.text_es,
      text_en: p.text?.en || p.text_en,
      position: p.position,
      image: p.image,
      active: p.active ?? true
    }});
    res.json(t);
  } catch(e){ next(e); }
});

router.put('/:id', auth, async (req,res,next)=> {
  try {
    const id = parseInt(req.params.id);
    const p = req.body;
    const t = await prisma.testimonio.update({ where: { id }, data: {
      author: p.author,
      text_es: p.text?.es || p.text_es,
      text_en: p.text?.en || p.text_en,
      position: p.position,
      image: p.image,
      active: p.active
    }});
    res.json(t);
  } catch(e){ next(e); }
});

router.delete('/:id', auth, async (req,res,next)=> {
  try { const id = parseInt(req.params.id); await prisma.testimonio.delete({ where: { id }}); res.json({ ok: true }); } catch(e){ next(e); }
});

module.exports = router;
