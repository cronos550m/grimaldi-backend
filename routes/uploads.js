const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/auth");
const cloudinary = require("cloudinary").v2;

// Config Cloudinary desde .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Usamos memoria, no disco
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/uploads  (con auth de admin)
// Recibe field "file" como antes, pero ahora sube a Cloudinary
router.post("/", auth, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file" });

  // Por ejemplo, guardamos en la carpeta "grimaldi"
  const folder = process.env.CLOUDINARY_FOLDER || "grimaldi";

  const stream = cloudinary.uploader.upload_stream(
    {
      folder,
      resource_type: "image",
    },
    (error, result) => {
      if (error) {
        console.error("Cloudinary upload error", error);
        return res.status(500).json({ error: "Upload failed" });
      }
      // Devolvemos la URL segura de Cloudinary
      res.json({ url: result.secure_url });
    }
  );

  stream.end(req.file.buffer);
});

module.exports = router;
