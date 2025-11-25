const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const SECRET = process.env.JWT_SECRET || "change_this_jwt_secret";

// login
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      user: {
        username: user.username,
        role: user.role,
        email: user.email || null,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
