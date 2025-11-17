
GRIMALDI - Backend migrado a Prisma (Neon/Postgres ready)

Instrucciones:

1. Copia .env.example a .env y completa DATABASE_URL (Neon) y JWT_SECRET.
2. Instala dependencias:
   npm install
3. Genera prisma client:
   npx prisma generate
4. Corre migrations (opcional para dev):
   npx prisma migrate dev --name init
5. Crea admin seed:
   npm run seed
6. Ejecuta:
   npm start

Endpoints mantenidos: /api/auth, /api/services, /api/flota, /api/testimonios, /api/settings, /api/contacto, /api/uploads
