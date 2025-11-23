const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');

// Configuración de Multer: guarda en la carpeta /uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// POST /api/uploads  (con auth de admin)
router.post('/', auth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });

  // Base de la URL donde corre el backend
  const baseUrl = process.env.FILE_BASE_URL || 'http://localhost:5000';

  // URL COMPLETA que va a usar el frontend
  const url = `${baseUrl}/uploads/${req.file.filename}`;

  res.json({ url });
});

module.exports = router;
