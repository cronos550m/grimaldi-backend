
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
require('dotenv').config();
const prisma = new PrismaClient();

async function main(){
  const username = 'AdminGrimaldi';
  const password = 'Grim2025*Admin';
  const existing = await prisma.user.findUnique({ where: { username }});
  if (!existing) {
    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { username, password: hashed, role: 'admin' }});
    console.log('Admin user created:', username);
  } else {
    console.log('Admin exists.');
  }
}
main().catch(e => { console.error(e); process.exit(1); }).finally(()=> prisma.$disconnect());
