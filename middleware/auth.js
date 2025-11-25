const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "change_this_jwt_secret";

module.exports = function (req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No token" });

  const token = header.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, SECRET);
    // decoded = { id, username, role, iat, exp }
    req.user = decoded;
    next();
  } catch (e) {
    console.error("JWT error", e);
    return res.status(401).json({ error: "Invalid token" });
  }
};
