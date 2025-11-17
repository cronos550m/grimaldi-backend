
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth');

// public read
router.get('/', async (req,res,next)=> {
  try {
    const items = await prisma.service.findMany({ where: { active: true }, orderBy: { order: 'asc' }});
    res.json(items);
  } catch(e){ next(e); }
});

// admin create
router.post('/', auth, async (req,res,next)=> {
  try {
    const payload = req.body;
    const s = await prisma.service.create({ data: {
      title_es: payload.title?.es || payload.title_es,
      title_en: payload.title?.en || payload.title_en,
      desc_es: payload.description?.es || payload.desc_es,
      desc_en: payload.description?.en || payload.desc_en,
      image: payload.image,
      order: payload.order || 0,
      active: payload.active ?? true
    }});
    res.json(s);
  } catch(e){ next(e); }
});

// update
router.put('/:id', auth, async (req,res,next)=> {
  try {
    const id = parseInt(req.params.id);
    const payload = req.body;
    const s = await prisma.service.update({ where: { id }, data: {
      title_es: payload.title?.es || payload.title_es,
      title_en: payload.title?.en || payload.title_en,
      desc_es: payload.description?.es || payload.desc_es,
      desc_en: payload.description?.en || payload.desc_en,
      image: payload.image,
      order: payload.order,
      active: payload.active
    }});
    res.json(s);
  } catch(e){ next(e); }
});

// delete
router.delete('/:id', auth, async (req,res,next)=> {
  try {
    const id = parseInt(req.params.id);
    await prisma.service.delete({ where: { id }});
    res.json({ ok: true });
  } catch(e){ next(e); }
});

module.exports = router;
