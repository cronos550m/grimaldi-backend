
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// public post
router.post('/', async (req,res,next)=> {
  try {
    const c = await prisma.contact.create({ data: req.body });
    res.json({ ok: true, id: c.id });
  } catch(e){ next(e); }
});

module.exports = router;
