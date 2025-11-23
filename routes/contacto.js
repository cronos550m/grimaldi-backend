const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const auth = require("../middleware/auth");

/**
 * GET /api/contacto
 * Devuelve los datos de contacto de la empresa (un solo registro).
 */
router.get("/", async (req, res) => {
  try {
    const cfg = await prisma.contact.findFirst();
    if (!cfg) {
      return res.json({});
    }
    res.json(cfg);
  } catch (e) {
    console.error("Error GET /contacto", e);
    res.status(500).json({ error: "Error leyendo datos de contacto" });
  }
});

/**
 * POST /api/contacto
 * Guarda/actualiza los datos de contacto de la empresa (admin).
 */
router.post("/", auth, async (req, res) => {
  try {
    const data = req.body || {};
    const existing = await prisma.contact.findFirst();

    const normalized = {
      company: data.company ?? null,
      email: data.email ?? null,
      phone: data.phone ?? null,
      whatsapp: data.whatsapp ?? null,
      address: data.address ?? null,
      mapUrl: data.mapUrl ?? null,
      qrImage: data.qrImage ?? null,
    };

    let saved;

    if (existing) {
      // Actualiza el registro existente
      saved = await prisma.contact.update({
        where: { id: existing.id },
        data: normalized,
      });
    } else {
      // Crea el primero. Como en tu schema el id es Int @id SIN default,
      // le forzamos id: 1 para evitar el error "Argument `id` is missing".
      saved = await prisma.contact.create({
        data: {
          id: 1,
          ...normalized,
        },
      });
    }

    res.json(saved);
  } catch (e) {
    console.error("Error POST /contacto", e);
    res.status(500).json({ error: "Error guardando datos de contacto" });
  }
});

/**
 * POST /api/contacto/message
 * Guarda un mensaje enviado desde el formulario público de contacto.
 */
router.post("/message", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body || {};

    await prisma.contactMessage.create({
      data: {
        name: name || "",
        email: email || "",
        phone: phone || "",
        message: message || "",
      },
    });

    // Si más adelante querés enviar mails, acá podrías agregar nodemailer.
    res.json({ ok: true });
  } catch (e) {
    console.error("Error POST /contacto/message", e);
    res.status(500).json({ error: "Error guardando el mensaje" });
  }
});

/**
 * GET /api/contacto/messages
 * Lista de mensajes de contacto (admin).
 */
router.get("/messages", auth, async (req, res) => {
  try {
    const items = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(items);
  } catch (e) {
    console.error("Error GET /contacto/messages", e);
    res.status(500).json({ error: "Error listando mensajes" });
  }
});

/**
 * DELETE /api/contacto/messages/:id
 * Borra un mensaje de contacto (admin).
 */
router.delete("/messages/:id", auth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    await prisma.contactMessage.delete({ where: { id } });
    res.json({ ok: true });
  } catch (e) {
    console.error("Error DELETE /contacto/messages/:id", e);
    res.status(500).json({ error: "Error borrando mensaje" });
  }
});

module.exports = router;
