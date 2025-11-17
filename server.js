
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const authRoutes = require('./routes/auth');
const servicesRoutes = require('./routes/services');
const flotaRoutes = require('./routes/flota');
const testimoniosRoutes = require('./routes/testimonios');
const settingsRoutes = require('./routes/settings');
const contactoRoutes = require('./routes/contacto');
const uploadRoutes = require('./routes/uploads');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/flota', flotaRoutes);
app.use('/api/testimonios', testimoniosRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/contacto', contactoRoutes);
app.use('/api/uploads', uploadRoutes);

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

async function main(){
  await prisma.$connect();
  app.listen(PORT, ()=> console.log('Server running on port', PORT));
}

main().catch(e => { console.error(e); process.exit(1); });
