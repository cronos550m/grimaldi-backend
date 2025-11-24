const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const auth = require("../middleware/auth");

// public read
router.get("/", async (req, res, next) => {
  try {
    const items = await prisma.service.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
    res.json(items);
  } catch (e) {
    next(e);
  }
});

// admin: list all (por si lo querés distinto, pero con el GET / ya alcanza)
router.get("/all", auth, async (req, res, next) => {
  try {
    const items = await prisma.service.findMany({
      orderBy: { order: "asc" },
    });
    res.json(items);
  } catch (e) {
    next(e);
  }
});

// admin create
router.post("/", auth, async (req, res, next) => {
  try {
    const {
      title,
      description,
      image,
      image_mobile,
      order,
      active,
    } = req.body;

    const s = await prisma.service.create({
      data: {
        title_es: title?.es || null,
        title_en: title?.en || null,
        desc_es: description?.es || null,
        desc_en: description?.en || null,
        image: image || null,
        image_mobile: image_mobile || null,
        order: order ?? 0,
        active: active !== undefined ? !!active : true,
      },
    });

    res.json(s);
  } catch (e) {
    next(e);
  }
});

// admin update
router.put("/:id", auth, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const {
      title,
      description,
      image,
      image_mobile,
      order,
      active,
    } = req.body;

    const s = await prisma.service.update({
      where: { id },
      data: {
        title_es: title?.es || null,
        title_en: title?.en || null,
        desc_es: description?.es || null,
        desc_en: description?.en || null,
        image: image || null,
        image_mobile: image_mobile || null,
        order: order ?? 0,
        active: active !== undefined ? !!active : true,
      },
    });

    res.json(s);
  } catch (e) {
    next(e);
  }
});

// delete
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.service.delete({ where: { id } });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
