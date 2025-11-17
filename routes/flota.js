
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth');

router.get('/', async (req,res,next)=> {
  try { res.json(await prisma.flota.findMany({ where: { active: true } })); } catch(e){ next(e); }
});

router.post('/', auth, async (req,res,next)=> {
  try {
    const p = req.body;
    const f = await prisma.flota.create({ data: {
      name_es: p.name?.es || p.name_es,
      name_en: p.name?.en || p.name_en,
      desc_es: p.description?.es || p.desc_es,
      desc_en: p.description?.en || p.desc_en,
      image: p.image,
      capacity: p.capacity,
      active: p.active ?? true
    }});
    res.json(f);
  } catch(e){ next(e); }
});

router.put('/:id', auth, async (req,res,next)=> {
  try {
    const id = parseInt(req.params.id);
    const p = req.body;
    const f = await prisma.flota.update({ where: { id }, data: {
      name_es: p.name?.es || p.name_es,
      name_en: p.name?.en || p.name_en,
      desc_es: p.description?.es || p.desc_es,
      desc_en: p.description?.en || p.desc_en,
      image: p.image,
      capacity: p.capacity,
      active: p.active
    }});
    res.json(f);
  } catch(e){ next(e); }
});

router.delete('/:id', auth, async (req,res,next)=> {
  try { const id = parseInt(req.params.id); await prisma.flota.delete({ where: { id }}); res.json({ ok: true }); } catch(e){ next(e); }
});

module.exports = router;
