const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const auth = require("../middleware/auth");

// GET /api/settings
// Devuelve un mapa plano: { key: value } con TODOS los settings.
// Ejemplo:
// {
//   "home_title_es": "...",
//   "home_title_en": "...",
//   "home_desc_es": "...",
//   "home_hero_image": "http://localhost:5000/uploads/hero.jpg",
//   "about_image": "http://localhost:5000/uploads/about.jpg",
//   "contact_title_es": "..."
// }
router.get("/", async (req, res, next) => {
  try {
    const docs = await prisma.setting.findMany();
    const map = {};

    docs.forEach((d) => {
      map[d.key] = d.value;
    });

    res.json(map);
  } catch (e) {
    next(e);
  }
});

// POST /api/settings/:key
// Guarda o actualiza un setting (ej: home_title_es, home_hero_image, etc.)
router.post("/:key", auth, async (req, res, next) => {
  try {
    const { key } = req.params;
    const value = req.body.value;

    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    res.json(setting);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
