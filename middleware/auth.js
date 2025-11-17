
const jwt = require('jsonwebtoken');
module.exports = function(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token' });
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change_this_jwt_secret');
    req.user = decoded;
    next();
  } catch(e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
