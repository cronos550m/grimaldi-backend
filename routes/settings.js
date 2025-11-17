
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth');

router.get('/', async (req,res,next)=> {
  try {
    const docs = await prisma.setting.findMany();
    const map = {};
    docs.forEach(d => map[d.key] = d.value);
    res.json(map);
  } catch(e){ next(e); }
});

router.post('/:key', auth, async (req,res,next)=> {
  try {
    const { key } = req.params;
    const value = req.body.value;
    const s = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
    res.json(s);
  } catch(e){ next(e); }
});

module.exports = router;
