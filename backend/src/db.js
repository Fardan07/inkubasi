import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

let prisma = null;
let dbConnected = false;

const dbUrl = process.env.DATABASE_URL?.trim();

if (dbUrl && (dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://'))) {
  try {
    prisma = new PrismaClient({
      log: ['error', 'warn'],
    });

    // Test connection asynchronously & seed demo user if needed
    prisma.$connect()
      .then(async () => {
        dbConnected = true;
        console.log('✅ Berhasil terhubung ke database Neon PostgreSQL!');

        try {
          const demoEmail = 'putri.anindya@gmail.com';
          const existing = await prisma.user.findUnique({ where: { email: demoEmail } });
          if (!existing) {
            const passwordHash = await bcrypt.hash('password123', 10);
            await prisma.user.create({
              data: {
                name: 'Putri Anindya',
                email: demoEmail,
                password: passwordHash,
                plan: 'Free',
                emailReminders: true,
                workspaceName: 'Personal workspace',
              },
            });
            console.log('✅ Demo user (putri.anindya@gmail.com / password123) siap digunakan!');
          }
        } catch (seedErr) {
          console.warn('⚠️ Seeding demo user skipped:', seedErr.message);
        }
      })
      .catch((err) => {
        dbConnected = false;
        console.warn('⚠️ Gagal terhubung ke Neon DB (periksa kredensial di .env):', err.message);
      });
  } catch (err) {
    console.warn('⚠️ Inisialisasi Prisma gagal:', err.message);
    prisma = null;
    dbConnected = false;
  }
} else {
  console.log('ℹ️ DATABASE_URL belum diisi atau tidak valid di .env. Menggunakan fallback in-memory store.');
}

export { prisma };
export const isDbConnected = () => dbConnected && prisma !== null;
