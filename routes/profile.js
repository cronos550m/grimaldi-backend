const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// Transport de nodemailer
function createTransport() {
  if (!process.env.SMTP_HOST) {
    console.warn("SMTP not configured, cannot send emails");
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
  });
}

// GET /api/profile/me
router.get("/me", auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      username: user.username,
      email: user.email || "",
    });
  } catch (e) {
    console.error("GET /profile/me error", e);
    res.status(500).json({ error: "Error getting profile" });
  }
});

// POST /api/profile/send-code
router.post("/send-code", auth, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email requerido" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        email,
        resetCode: code,
        resetCodeExpires: expires,
      },
    });

    const transporter = createTransport();
    if (!transporter) {
      console.warn("No SMTP configured, not sending email");
      return res
        .status(500)
        .json({ error: "SMTP no configurado en el servidor" });
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Código de confirmación - Panel Grimaldi",
      text: `Tu código de confirmación es: ${code}`,
      html: `<p>Tu código de confirmación es: <strong>${code}</strong></p>`,
    });

    res.json({ ok: true });
  } catch (e) {
    console.error("POST /profile/send-code error", e);
    res.status(500).json({ error: "Error enviando código" });
  }
});

// POST /api/profile/change-password
router.post("/change-password", auth, async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!code || !newPassword) {
      return res
        .status(400)
        .json({ error: "Código y nueva contraseña son requeridos" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.resetCode || !user.resetCodeExpires) {
      return res
        .status(400)
        .json({ error: "No hay un código activo para este usuario" });
    }

    const now = new Date();
    if (user.resetCode !== code) {
      return res.status(400).json({ error: "Código incorrecto" });
    }
    if (user.resetCodeExpires < now) {
      return res.status(400).json({ error: "El código ha expirado" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        password: hashed,
        email: email || user.email,
        resetCode: null,
        resetCodeExpires: null,
      },
    });

    res.json({ ok: true });
  } catch (e) {
    console.error("POST /profile/change-password error", e);
    res.status(500).json({ error: "Error cambiando contraseña" });
  }
});

module.exports = router;
