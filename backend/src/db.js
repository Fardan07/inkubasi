import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { initialContracts, initialDates } from './seedData.js';

dotenv.config();

let prisma = null;
let dbConnected = false;

const dbUrl = process.env.DATABASE_URL?.trim();

if (dbUrl && (dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://'))) {
  try {
    prisma = new PrismaClient({
      log: ['error', 'warn'],
    });

    // Test connection asynchronously & seed initial data if needed
    prisma.$connect()
      .then(async () => {
        dbConnected = true;
        console.log('✅ Berhasil terhubung ke database Neon PostgreSQL!');

        // 1. Seed demo user
        let demoUser = null;
        try {
          const demoEmail = 'putri.anindya@gmail.com';
          demoUser = await prisma.user.findUnique({ where: { email: demoEmail } });
          if (!demoUser) {
            const passwordHash = await bcrypt.hash('password123', 10);
            demoUser = await prisma.user.create({
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

        // 2. Seed initial contracts and clauses if empty
        try {
          const contractCount = await prisma.contract.count();
          if (contractCount === 0) {
            console.log('🌱 Seeding initial contracts into Neon PostgreSQL...');
            for (const c of initialContracts) {
              const { clauses, ...contractData } = c;
              await prisma.contract.create({
                data: {
                  ...contractData,
                  userId: demoUser ? demoUser.id : null,
                  clauses: {
                    create: (clauses || []).map((cl) => ({
                      title: cl.title,
                      titleId: cl.titleId || null,
                      status: cl.status,
                      statusId: cl.statusId || null,
                      source: cl.source,
                      sourceId: cl.sourceId || null,
                      text: cl.text,
                      textId: cl.textId || null,
                      meaning: cl.meaning,
                      meaningEn: cl.meaningEn || null,
                      why: cl.why,
                      whyEn: cl.whyEn || null,
                      original: cl.original,
                    })),
                  },
                },
              });
            }
            console.log(`✅ Berhasil seed ${initialContracts.length} kontrak awal ke PostgreSQL!`);
          }
        } catch (cErr) {
          console.warn('⚠️ Seeding contracts skipped:', cErr.message);
        }

        // 3. Seed initial important dates if empty
        try {
          const datesCount = await prisma.importantDate.count();
          if (datesCount === 0) {
            console.log('🌱 Seeding initial dates into Neon PostgreSQL...');
            for (const d of initialDates) {
              await prisma.importantDate.create({
                data: {
                  ...d,
                  userId: demoUser ? demoUser.id : null,
                },
              });
            }
            console.log(`✅ Berhasil seed ${initialDates.length} agenda tanggal ke PostgreSQL!`);
          }
        } catch (dErr) {
          console.warn('⚠️ Seeding dates skipped:', dErr.message);
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
