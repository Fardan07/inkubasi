import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma, isDbConnected } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'clariq-super-secret-key-2026';

// Middlewares
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// In-Memory Database Store (Fallback jika DB belum diconnect)
let userProfile = {
  id: 1,
  name: 'Putri Anindya',
  email: 'putri.anindya@gmail.com',
  emailReminders: true,
  plan: 'Free',
  workspaceName: 'Personal workspace',
  analyzedCount: 4,
  limitCount: 5,
};

let inMemoryUsers = [
  {
    id: 1,
    name: 'Putri Anindya',
    email: 'putri.anindya@gmail.com',
    passwordHash: bcrypt.hashSync('password123', 10),
    plan: 'Free',
    emailReminders: true,
    workspaceName: 'Personal workspace',
  },
];

let contracts = [
  {
    id: 1,
    name: 'Employment Agreement',
    nameId: 'Perjanjian Kerja Karyawan',
    company: 'PT Example Indonesia',
    type: 'Employment',
    typeId: 'Ketenagakerjaan',
    status: 'Needs Attention',
    statusId: 'Perlu Perhatian',
    date: 'Nov 12, 2027',
    dateId: '12 Nov 2027',
    color: 'blue',
    summary:
      'Perjanjian kerja waktu tertentu (PKWT) untuk posisi Product Designer. Menetapkan jam kerja 40 jam/minggu, remunerasi bulanan, serta ketentuan kerahasiaan. Terdapat poin perhatian penting pada klausul ganti rugi pemutusan hubungan kerja sebelum masa kontrak berakhir dan klausul perpanjangan otomatis.',
    riskScore: 72,
    riskBreakdown: { safe: 8, review: 3, attention: 1 },
    meta: {
      effectiveDate: '13 Jan 2027',
      expiryDate: '12 Jan 2028',
      noticePeriod: '30 hari',
      salary: 'Rp 12.000.000 / bulan',
      workingHours: '40 jam / minggu',
      jurisdiction: 'Hukum Republik Indonesia',
    },
    clauses: [
      {
        id: 1,
        title: 'Payment Terms',
        status: 'Safe',
        source: 'Article 3 — Remuneration',
        text: 'Your monthly salary is paid by the 25th, with clearly defined benefits.',
        meaning:
          'Gaji sebesar Rp12.000.000 dibayarkan setiap tanggal 25. Anda juga berhak menerima tunjangan kesehatan dan BPJS Ketenagakerjaan sesuai ketentuan perusahaan.',
        why: 'Jadwal pembayaran yang jelas membantu Anda merencanakan keuangan dan memastikan kewajiban perusahaan tepat waktu.',
        original:
          'The Employee shall receive a gross monthly salary of IDR 12,000,000, payable no later than the 25th day of each calendar month. Standard statutory benefits shall be administered in accordance with applicable laws.',
      },
      {
        id: 2,
        title: 'Early Termination',
        status: 'Needs Attention',
        source: 'Article 8 — Termination',
        text: 'Leaving before the contract ends may require a payment of one month’s salary.',
        meaning:
          'Jika Anda mengundurkan diri sebelum masa kontrak berakhir, Anda perlu memberikan pemberitahuan tertulis minimal 30 hari sebelumnya. Selain itu, Anda dapat diwajibkan membayar ganti rugi sebesar 1 (satu) bulan gaji pokok kotor.',
        why: 'Anda berisiko mengeluarkan biaya penalti jika ingin berpindah kerja sebelum kontrak 12 bulan selesai. Diskusikan atau negosiasikan penghapusan denda kompensasi ini sebelum menandatangani.',
        original:
          'Either party may terminate this Agreement with thirty (30) days’ prior written notice. If the Employee terminates before the agreed end date, the Employee may be required to compensate the Employer an amount equivalent to one (1) month’s gross salary.',
      },
      {
        id: 3,
        title: 'Automatic Renewal',
        status: 'Review',
        source: 'Article 9 — Renewal',
        text: 'Your contract renews automatically unless you give 30 days’ written notice.',
        meaning:
          'Kontrak akan diperpanjang secara otomatis untuk periode 12 bulan berikutnya kecuali salah satu pihak memberikan surat pemberitahuan tertulis setidaknya 30 hari sebelum tanggal kedaluwarsa.',
        why: 'Pasang pengingat tanggal jatuh tempo (paling lambat 12 Desember 2027) agar Anda tidak terkunci dalam periode kontrak baru tanpa persetujuan eksplisit.',
        original:
          'This Agreement shall automatically renew for a further twelve (12) months unless either party provides written notice at least thirty (30) days before expiry.',
      },
      {
        id: 4,
        title: 'Confidentiality',
        status: 'Safe',
        source: 'Article 6 — Confidentiality',
        text: 'Keep non-public company information confidential during and after employment.',
        meaning:
          'Anda diwajibkan menjaga kerahasiaan informasi internal, data pelanggan, dan rencana bisnis perusahaan baik selama masa kerja maupun setelah keluar.',
        why: 'Ini adalah ketentuan standar profesional. Pastikan tidak membawa file atau materi hak milik perusahaan ke tempat kerja baru.',
        original:
          'The Employee agrees not to disclose any non-public business information during or after the term of employment, except as required by law.',
      },
      {
        id: 5,
        title: 'Responsibilities',
        status: 'Safe',
        source: 'Article 2 — Duties',
        text: 'Your role, working hours, and reporting structure are clearly outlined.',
        meaning:
          'Anda bertindak sebagai Product Designer dengan beban kerja 40 jam seminggu dan melapor langsung kepada Head of Design. Segala perubahan tugas pokok harus disepakati secara tertulis.',
        why: 'Lingkup tanggung jawab yang terdefinisi dengan jelas melindungi Anda dari beban tugas di luar spesialisasi desain.',
        original:
          'The Employee shall serve as Product Designer for forty (40) hours per week and report to the Head of Design. Material changes to duties shall be agreed in writing.',
      },
    ],
  },
  {
    id: 2,
    name: 'Freelance Agreement',
    nameId: 'Kontrak Kerja Lepas (Freelance)',
    company: 'Studio XYZ',
    type: 'Freelance',
    typeId: 'Pekerja Lepas',
    status: 'Review',
    statusId: 'Perlu Tinjauan',
    date: 'Nov 10, 2027',
    dateId: '10 Nov 2027',
    color: 'lavender',
    summary:
      'Kontrak proyek pembuatan identitas merek dan materi visual. Terdapat ketentuan batas revisi maksimal 2 kali dan pembayaran bertahap (milestone) dengan tempo Net 30 hari.',
    riskScore: 84,
    riskBreakdown: { safe: 7, review: 4, attention: 0 },
    meta: {
      effectiveDate: '15 Nov 2027',
      expiryDate: '15 Jan 2028',
      noticePeriod: '14 hari',
      salary: 'Rp 28.500.000 (Fixed Project)',
      workingHours: 'Fleksibel berdasarkan Milestone',
      jurisdiction: 'Hukum Republik Indonesia',
    },
    clauses: [
      {
        id: 1,
        title: 'Payment Milestones',
        status: 'Review',
        source: 'Clause 4 — Invoicing',
        text: 'Pembayaran dibagi 3 tahap: 40% DP, 30% First Draft, 30% Final Delivery.',
        meaning: 'Pembayaran dilakukan bertahap sesuai pencapaian milestone dalam tempo pembayaran 14 hari kerja setelah invoice diterima.',
        why: 'Pastikan termin uang muka diterima sebelum memulai pengerjaan aset grafis.',
        original: 'Payments shall be disbursed in three tranches: 40% upon commencement, 30% upon approval of preliminary design, and 30% upon delivery of final assets.',
      },
      {
        id: 2,
        title: 'Intellectual Property Transfer',
        status: 'Safe',
        source: 'Clause 7 — Intellectual Property',
        text: 'Hak cipta beralih ke klien setelah seluruh pembayaran dilunasi penuh.',
        meaning: 'Klien baru memiliki hak atas karya final setelah transfer pelunasan 100% selesai.',
        why: 'Melindungi Anda dari penggunaan desain komersial tanpa pelunasan.',
        original: 'All intellectual property rights in the final approved deliverables shall transfer to the Client upon receipt of full and final payment.',
      },
    ],
  },
  {
    id: 3,
    name: 'Vendor Agreement',
    nameId: 'Perjanjian Layanan Vendor',
    company: 'Kopi Kita',
    type: 'Business',
    typeId: 'Bisnis / Vendor',
    status: 'Safe',
    statusId: 'Aman',
    date: 'Nov 8, 2027',
    dateId: '8 Nov 2027',
    color: 'mint',
    summary:
      'Perjanjian pengadaan suplai bahan baku kopi dan perlengkapan barista. Ketentuan garansi kualitas dan penggantian barang cacat dalam 48 jam tertera sangat transparan.',
    riskScore: 94,
    riskBreakdown: { safe: 11, review: 1, attention: 0 },
    meta: {
      effectiveDate: '01 Des 2027',
      expiryDate: '01 Des 2028',
      noticePeriod: '30 hari',
      salary: 'Sesuai Purchase Order (PO)',
      workingHours: 'Pengiriman Jam Kerja',
      jurisdiction: 'Jakarta Selatan',
    },
    clauses: [
      {
        id: 1,
        title: 'Quality Assurance & Returns',
        status: 'Safe',
        source: 'Section 5 — Inspection and Returns',
        text: 'Penggantian 100% untuk produk cacat dalam 48 jam pelaporan.',
        meaning: 'Vendor menjamin mutu biji kopi dengan jaminan ganti baru tanpa biaya tambahan.',
        why: 'Menjaga kepastian pasokan dan kualitas racikan di outlet.',
        original: 'The Supplier guarantees Grade A Arabica beans and agrees to replace any substandard batch within forty-eight (48) hours of written notification.',
      },
    ],
  },
  {
    id: 4,
    name: 'Apartment Lease',
    nameId: 'Perjanjian Sewa Apartemen',
    company: 'Bumi Residence',
    type: 'Rental',
    typeId: 'Sewa Menyewa',
    status: 'Safe',
    statusId: 'Aman',
    date: 'Nov 5, 2027',
    dateId: '5 Nov 2027',
    color: 'peach',
    summary:
      'Sewa unit apartemen 2 kamar tidur untuk periode 12 bulan. Termasuk ketentuan deposit keamanan yang dapat dikembalikan penuh jika tidak ada kerusakan struktural.',
    riskScore: 91,
    riskBreakdown: { safe: 9, review: 2, attention: 0 },
    meta: {
      effectiveDate: '01 Des 2027',
      expiryDate: '30 Nov 2028',
      noticePeriod: '60 hari',
      salary: 'Rp 65.000.000 / tahun',
      workingHours: 'Jam Hening: 22.00 - 07.00',
      jurisdiction: 'Tangerang Selatan',
    },
    clauses: [
      {
        id: 1,
        title: 'Security Deposit Refund',
        status: 'Safe',
        source: 'Section 4 — Security Deposit',
        text: 'Deposit keamanan dikembalikan selambatnya 14 hari kerja setelah serah terima kunci.',
        meaning: 'Uang deposit Rp 10.000.000 aman dan dikembalikan utuh dikurangi tagihan utilitas tertunggak jika ada.',
        why: 'Jaminan tertulis mencegah pemilik menahan dana sewa tanpa alasan.',
        original: 'The Security Deposit of IDR 10,000,000 shall be refunded within fourteen (14) business days following unit inspection upon move-out.',
      },
    ],
  },
];

let datesList = [
  {
    id: 1,
    day: '25',
    month: 'NOV',
    title: 'Monthly payment',
    contract: 'Employment Agreement',
    date: '25 November 2027',
    tag: '13 days remaining',
    kind: 'mint',
    reminderEnabled: true,
  },
  {
    id: 2,
    day: '30',
    month: 'NOV',
    title: 'Notice deadline',
    contract: 'Freelance Agreement',
    date: '30 November 2027',
    tag: '18 days remaining',
    kind: 'amber',
    reminderEnabled: true,
  },
  {
    id: 3,
    day: '12',
    month: 'DEC',
    title: 'Renewal deadline',
    contract: 'Employment Agreement',
    date: '12 December 2027',
    tag: '30 days remaining',
    kind: 'blue',
    reminderEnabled: true,
  },
  {
    id: 4,
    day: '12',
    month: 'JAN',
    title: 'Contract expiration',
    contract: 'Employment Agreement',
    date: '12 January 2028',
    tag: '61 days remaining',
    kind: 'blue',
    reminderEnabled: false,
  },
  {
    id: 5,
    day: '13',
    month: 'JAN',
    title: 'Renewed contract starts',
    contract: 'Employment Agreement',
    date: '13 January 2028',
    tag: '62 days remaining',
    kind: 'mint',
    reminderEnabled: false,
  },
];

const contractComparisonData = {
  fileA: 'Employment Agreement.pdf',
  fileB: 'Employment Agreement — revised.pdf',
  comparisons: [
    {
      clause: 'Article 3 — Remuneration',
      statusA: 'IDR 12,000,000 / month',
      statusB: 'IDR 14,500,000 / month',
      changeType: 'improved',
      note: 'Kenaikan gaji pokok sebesar +20.8% pada draf revisi.',
    },
    {
      clause: 'Article 8 — Early Termination Penalty',
      statusA: '1 month salary compensation required',
      statusB: 'Penalty waived (30 days notice only)',
      changeType: 'improved',
      note: 'Denda penalti satu bulan gaji telah dihapus sepenuhnya.',
    },
    {
      clause: 'Article 2 — Work Arrangement',
      statusA: '100% Onsite at Jakarta HQ',
      statusB: 'Hybrid (3 days office, 2 days remote)',
      changeType: 'improved',
      note: 'Fleksibilitas kerja hybrid 2 hari kerja dari rumah (WFH).',
    },
    {
      clause: 'Article 9 — Auto-Renewal Notice',
      statusA: '30 days prior notice required',
      statusB: '45 days prior notice required',
      changeType: 'modified',
      note: 'Waktu pemberitahuan pembatalan perpanjangan otomatis diperpanjang menjadi 45 hari.',
    },
    {
      clause: 'Article 7 — Intellectual Property',
      statusA: 'All inventions created during employment',
      statusB: 'Only inventions related to company business',
      changeType: 'improved',
      note: 'Proyek pribadi di luar jam kerja tidak diklaim oleh perusahaan.',
    },
  ],
  keyDifferences: [
    {
      title: 'Kompensasi Lebih Tinggi',
      badge: '+20.8% Gaji',
      summary: 'Gaji meningkat dari Rp 12.000.000 menjadi Rp 14.500.000 per bulan dengan tunjangan kesehatan lengkap.',
    },
    {
      title: 'Penalti Resign Dihapus',
      badge: 'Bebas Penalti',
      summary: 'Klausul denda 1 bulan gaji saat keluar lebih awal telah dihilangkan atas hasil negosiasi.',
    },
    {
      title: 'Skema Kerja Fleksibel',
      badge: 'Hybrid Policy',
      summary: 'Hak WFH 2 hari seminggu ditambahkan secara resmi ke dalam pasal perjanjian.',
    },
  ],
};

// ==========================================
// AUTH UTILITIES & MIDDLEWARE
// ==========================================

const getUserFromReq = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (isDbConnected() && prisma) {
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true, email: true, plan: true, emailReminders: true, workspaceName: true },
      });
      return user;
    } else {
      const user = inMemoryUsers.find((u) => u.id === decoded.id);
      return user || null;
    }
  } catch {
    return null;
  }
};

// ==========================================
// ROUTES: AUTH (LOGIN & REGISTER)
// ==========================================

// Register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Nama lengkap, email, dan kata sandi wajib diisi.',
    });
  }

  const cleanEmail = email.trim().toLowerCase();
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Kata sandi minimal harus 6 karakter.',
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;
    if (isDbConnected() && prisma) {
      // Check existing user in Neon DB
      const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email sudah terdaftar. Silakan login.' });
      }

      newUser = await prisma.user.create({
        data: {
          name: name.trim(),
          email: cleanEmail,
          password: hashedPassword,
          plan: 'Free',
          emailReminders: true,
          workspaceName: `${name.trim()}'s workspace`,
        },
        select: { id: true, name: true, email: true, plan: true, emailReminders: true, workspaceName: true },
      });
    } else {
      // In-Memory Fallback
      const existing = inMemoryUsers.find((u) => u.email === cleanEmail);
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email sudah terdaftar. Silakan login.' });
      }

      newUser = {
        id: Date.now(),
        name: name.trim(),
        email: cleanEmail,
        passwordHash: hashedPassword,
        plan: 'Free',
        emailReminders: true,
        workspaceName: `${name.trim()}'s workspace`,
      };
      inMemoryUsers.push(newUser);
      userProfile = { ...newUser, analyzedCount: 0, limitCount: 5 };
    }

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Akun CLARIQ berhasil dibuat!',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        plan: newUser.plan,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Gagal membuat akun.', error: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email dan kata sandi wajib diisi.',
    });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    let foundUser;
    let isValidPassword = false;

    if (isDbConnected() && prisma) {
      foundUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
      if (foundUser) {
        isValidPassword = await bcrypt.compare(password, foundUser.password);
      }
    } else {
      foundUser = inMemoryUsers.find((u) => u.email === cleanEmail);
      if (foundUser) {
        isValidPassword = await bcrypt.compare(password, foundUser.passwordHash);
      }
    }

    if (!foundUser || !isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Email atau kata sandi tidak cocok. Silakan periksa kembali.',
      });
    }

    const token = jwt.sign(
      { id: foundUser.id, email: foundUser.email, name: foundUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Update session info
    userProfile.name = foundUser.name;
    userProfile.email = foundUser.email;
    userProfile.plan = foundUser.plan;

    res.json({
      success: true,
      message: 'Berhasil masuk ke CLARIQ!',
      token,
      user: {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        plan: foundUser.plan,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Gagal memproses login.', error: err.message });
  }
});

// Get Current User Profile (Me)
app.get('/api/auth/me', async (req, res) => {
  const user = await getUserFromReq(req);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Belum login atau token kedaluwarsa.' });
  }
  res.json({ success: true, user });
});

// ==========================================
// SYSTEM & HEALTH CHECK
// ==========================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'CLARIQ AI Contract Platform Backend',
    database: isDbConnected() ? 'Neon PostgreSQL Connected' : 'In-Memory Mode (DATABASE_URL ready)',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    contractsCount: contracts.length,
    nodeVersion: process.version,
  });
});

// Dashboard Stats
app.get('/api/stats', (req, res) => {
  const needsAttention = contracts.filter((c) => /attention/i.test(c.status)).length;
  const inReview = contracts.filter((c) => /review/i.test(c.status)).length;
  const safe = contracts.filter((c) => /safe/i.test(c.status)).length;
  res.json({
    success: true,
    data: {
      totalContracts: contracts.length,
      needsAttention,
      inReview,
      safe,
      upcomingDeadlines: datesList.filter((d) => d.reminderEnabled).length,
      activePlan: userProfile.plan,
      analyzedPercentage: '98.5%',
    },
  });
});

// Contracts List
app.get('/api/contracts', (req, res) => {
  const { search = '', filter = 'All contracts' } = req.query;
  let results = [...contracts];

  if (search.trim()) {
    const q = search.toLowerCase();
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q)
    );
  }

  if (filter && filter !== 'All contracts') {
    if (filter === 'Needs attention') {
      results = results.filter((c) => c.status === 'Needs Attention');
    } else {
      results = results.filter((c) => c.status.toLowerCase() === filter.toLowerCase());
    }
  }

  res.json({
    success: true,
    total: results.length,
    data: results,
  });
});

// Single Contract Detail
app.get('/api/contracts/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const found = contracts.find((c) => c.id === id);
  if (!found) {
    return res.status(404).json({ success: false, message: 'Kontrak tidak ditemukan.' });
  }
  res.json({
    success: true,
    data: found,
  });
});

// Create / Upload Contract
app.post('/api/contracts', (req, res) => {
  const { name, company, type, fileName } = req.body;
  const contractName = (name || fileName || 'Uploaded Document').replace(/\.[^.]+$/, '');
  
  let docType = type || 'Other';
  let color = 'blue';
  let status = 'Review';
  let riskScore = 80;

  if (/employ|kerja|pkwt|karyawan/i.test(contractName)) {
    docType = 'Employment';
    color = 'blue';
    status = 'Needs Attention';
    riskScore = 74;
  } else if (/freelance|proyek|design|service/i.test(contractName)) {
    docType = 'Freelance';
    color = 'lavender';
    status = 'Review';
    riskScore = 82;
  } else if (/lease|sewa|kos|sewa/i.test(contractName)) {
    docType = 'Rental';
    color = 'peach';
    status = 'Safe';
    riskScore = 92;
  } else if (/nda|confidential/i.test(contractName)) {
    docType = 'Legal';
    color = 'mint';
    status = 'Safe';
    riskScore = 96;
  }

  const newContract = {
    id: Date.now(),
    name: contractName,
    company: company || 'Uploaded document · AI Analyzed',
    type: docType,
    status: status,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    color: color,
    summary: `Analisis AI berhasil mengekstrak dokumen "${contractName}". Sistem menemukan ${riskScore >= 85 ? 'tingkat risiko rendah dan aman' : 'beberapa klausul yang memerlukan peninjauan lebih teliti'}. Rangkuman pasal dan kewajiban telah dikelompokkan dengan bahasa yang mudah dipahami.`,
    riskScore: riskScore,
    riskBreakdown: { safe: 6, review: 2, attention: 1 },
    meta: {
      effectiveDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      expiryDate: '1 Tahun ke depan',
      noticePeriod: '30 hari kerja',
      salary: 'Tercantum dalam lampiran biaya',
      workingHours: 'Sesuai kesepakatan tertulis',
      jurisdiction: 'Hukum Republik Indonesia',
    },
    clauses: [
      {
        id: 1,
        title: 'Ketentuan Pembayaran & Biaya',
        status: 'Safe',
        source: 'Pasal 3 — Kompensasi',
        text: 'Jadwal dan rincian biaya dinyatakan dengan jelas tanpa biaya tersembunyi.',
        meaning: 'Pembayaran dilakukan sesuai kesepakatan tertulis dengan metode transfer bank resmi.',
        why: 'Memastikan tidak ada biaya tambahan di luar kesepakatan awal.',
        original: 'Payments shall be made pursuant to the schedule agreed upon herein without deduction.',
      },
      {
        id: 2,
        title: 'Pengakhiran Hubungan Kerja / Kontrak',
        status: status === 'Needs Attention' ? 'Needs Attention' : 'Review',
        source: 'Pasal 7 — Pengakhiran',
        text: 'Ketentuan pemberitahuan tertulis sebelum mengakhiri perjanjian.',
        meaning: 'Kedua belah pihak wajib memberikan surat pemberitahuan 30 hari sebelum pengakhiran.',
        why: 'Menghindari sengketa atau klaim sepihak jika kerjasama dihentikan sebelum masa berlaku selesai.',
        original: 'Either party may terminate upon thirty (30) days prior written notice to the other party.',
      },
      {
        id: 3,
        title: 'Kerahasiaan & Hak Cipta',
        status: 'Safe',
        source: 'Pasal 9 — Kerahasiaan',
        text: 'Kewajiban melindungi informasi rahasia dan perlindungan karya cipta.',
        meaning: 'Informasi rahasia dijaga dan hak milik intelektual terlindungi secara sah.',
        why: 'Menjaga keamanan data sensitif dan hasil kerja Anda.',
        original: 'Each party shall hold in confidence all proprietary and technical information received.',
      },
    ],
  };

  contracts.unshift(newContract);
  userProfile.analyzedCount += 1;

  res.status(201).json({
    success: true,
    message: 'Dokumen berhasil dianalisis oleh AI CLARIQ!',
    data: newContract,
  });
});

// Delete Contract
app.delete('/api/contracts/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = contracts.findIndex((c) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Kontrak tidak ditemukan.' });
  }
  const deleted = contracts.splice(index, 1)[0];
  res.json({
    success: true,
    message: `Kontrak "${deleted.name}" berhasil dihapus.`,
    data: deleted,
  });
});

// AI Chat
app.post(['/api/chat', '/api/contracts/:id/chat'], (req, res) => {
  const contractId = req.params.id ? parseInt(req.params.id, 10) : req.body.contractId || 1;
  const question = (req.body.question || req.body.message || '').trim();

  if (!question) {
    return res.status(400).json({ success: false, message: 'Pertanyaan tidak boleh kosong.' });
  }

  const contract = contracts.find((c) => c.id === contractId) || contracts[0];
  const q = question.toLowerCase();
  const lang = (req.body.lang || req.query.lang || 'id').toLowerCase();

  let source = 1;
  let answer = '';

  if (lang === 'en') {
    if (/pay|salary|remunerat|wage|money|benefit/i.test(q)) {
      source = 0;
      answer = `Pursuant to Article 3 (Remuneration) in "${contract.name}", your gross monthly salary is Rp12,000,000, payable no later than the 25th day of each month. Standard statutory benefits follow company policy.`;
    } else if (/resign|terminat|quit|leave|penalty|early/i.test(q)) {
      source = 1;
      answer = `Important consideration under Article 8 (Termination): Resigning before 12 January 2028 requires 30 days’ written notice and may obligate you to pay compensation equal to one month’s gross salary (Rp12,000,000). Discuss this clause with HR prior to signing.`;
    } else if (/renew|automatic|expire|duration|end|period/i.test(q)) {
      source = 2;
      answer = `Under Article 9 (Renewal), this sample agreement runs through 12 January 2028. It automatically renews for another 12 months unless either party provides written notice at least 30 days prior (by 12 December 2027).`;
    } else if (/confidential|nda|secret|data/i.test(q)) {
      source = 3;
      answer = `According to Article 6 (Confidentiality), you are obligated to protect all non-public internal information and client materials during and following your tenure.`;
    } else if (/dut|responsib|role|hour|wfh|job/i.test(q)) {
      source = 4;
      answer = `Per Article 2 (Duties), your role is Product Designer for 40 hours per week, reporting to the Head of Design. Any material modifications to duties must be mutually agreed in writing.`;
    } else if (/leave|vacation|holiday|sick/i.test(q)) {
      source = 0;
      answer = `Annual paid leave is 12 working days per year following completion of the 3-month probation period, requiring request submission at least 3 business days in advance.`;
    } else {
      source = 1;
      answer = `Based on AI analysis of "${contract.name}": Key articles to examine include monthly compensation (Article 3), 30-day resignation notice & penalty (Article 8), and automatic renewal terms (Article 9). Feel free to ask about any specific clause or numerical figure!`;
    }
  } else {
    if (/gaji|salary|remunerasi|bayar|upah|uang|benefit|tunjangan/i.test(q)) {
      source = 0;
      answer = `Berdasarkan Pasal 3 (Article 3 — Remuneration) pada "${contract.nameId || contract.name}", gaji bulanan kotor Anda adalah Rp12.000.000 dan dibayarkan paling lambat setiap tanggal 25. Tunjangan kesehatan dan BPJS diberikan sesuai kebijakan perusahaan.`;
    } else if (/keluar|resign|terminat|berhenti|denda|pinalti|putus|phk/i.test(q)) {
      source = 1;
      answer = `Perhatian penting pada Pasal 8 (Article 8 — Termination): Jika Anda mengundurkan diri sebelum tanggal 12 Januari 2028, Anda diwajibkan memberikan pemberitahuan tertulis 30 hari sebelumnya dan dapat dikenakan ganti rugi sebesar 1 (satu) bulan gaji pokok (Rp12.000.000). Sangat disarankan untuk mendiskusikan klausul ini dengan HR.`;
    } else if (/perpanjang|renew|otomatis|habis|berakhir|durasi|expire|jangka waktu|sampai kapan/i.test(q)) {
      source = 2;
      answer = `Sesuai Pasal 9 (Article 9 — Renewal), masa kontrak berlaku hingga 12 Januari 2028. Kontrak ini akan DIPERPANJANG OTOMATIS selama 12 bulan berikutnya kecuali Anda mengirimkan surat pemberitahuan tertulis paling lambat 30 hari sebelum berakhir (maksimal tanggal 12 Desember 2027).`;
    } else if (/rahasia|confidential|nda|bocor|dokumen/i.test(q)) {
      source = 3;
      answer = `Berdasarkan Pasal 6 (Article 6 — Confidentiality), Anda wajib menjaga seluruh informasi rahasia internal dan data klien perusahaan, baik selama masih bekerja maupun setelah kontrak berakhir.`;
    } else if (/tugas|tanggung jawab|posisi|duties|responsib|jam kerja|peran|wfh/i.test(q)) {
      source = 4;
      answer = `Menurut Pasal 2 (Article 2 — Duties), peran Anda adalah Product Designer dengan beban kerja 40 jam per minggu, melapor ke Head of Design. Segala perubahan deskripsi pekerjaan utama wajib disetujui secara tertulis oleh kedua belah pihak.`;
    } else if (/cuti|libur|sick|sakit/i.test(q)) {
      source = 0;
      answer = `Hak cuti tahunan diberikan sebanyak 12 hari kerja per tahun setelah melewati masa kerja 3 bulan (probation), dengan pengajuan izin minimal 3 hari kerja sebelum tanggal cuti.`;
    } else {
      source = 1;
      answer = `Berdasarkan analisis AI pada dokumen "${contract.nameId || contract.name}": Pokok utama yang perlu diperhatikan meliputi ketentuan remunerasi bulanan (Pasal 3), kewajiban pemberitahuan 30 hari jika ingin keluar (Pasal 8), serta batas perpanjangan otomatis (Pasal 9). Anda dapat menanyakan detail nominal, batas waktu, atau risiko pasal tertentu secara spesifik!`;
    }
  }

  res.json({
    success: true,
    data: {
      role: 'assistant',
      text: answer,
      source: source,
      timestamp: new Date().toISOString(),
    },
  });
});

// Compare Contracts API
app.get('/api/contracts/compare', (req, res) => {
  res.json({
    success: true,
    data: contractComparisonData,
  });
});

// Important Dates & Reminders
app.get('/api/dates', (req, res) => {
  res.json({
    success: true,
    total: datesList.length,
    data: datesList,
  });
});

app.put('/api/dates/:id/reminder', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const found = datesList.find((d) => d.id === id);
  if (!found) {
    return res.status(404).json({ success: false, message: 'Tanggal tidak ditemukan.' });
  }
  found.reminderEnabled = !found.reminderEnabled;
  res.json({
    success: true,
    message: `Pengingat untuk "${found.title}" ${found.reminderEnabled ? 'diaktifkan' : 'dinonaktifkan'}.`,
    data: found,
  });
});

// User Profile & Settings
app.get('/api/user', async (req, res) => {
  const loggedUser = await getUserFromReq(req);
  if (loggedUser) {
    return res.json({ success: true, data: loggedUser });
  }
  res.json({
    success: true,
    data: userProfile,
  });
});

app.put('/api/user', async (req, res) => {
  const { name, email, emailReminders, plan } = req.body;
  if (name !== undefined) userProfile.name = name.trim();
  if (email !== undefined) userProfile.email = email.trim();
  if (emailReminders !== undefined) userProfile.emailReminders = Boolean(emailReminders);
  if (plan !== undefined) userProfile.plan = plan;

  const loggedUser = await getUserFromReq(req);
  if (loggedUser && isDbConnected() && prisma) {
    try {
      const updated = await prisma.user.update({
        where: { id: loggedUser.id },
        data: {
          name: name ? name.trim() : undefined,
          emailReminders: emailReminders !== undefined ? Boolean(emailReminders) : undefined,
          plan: plan || undefined,
        },
      });
      return res.json({ success: true, message: 'Profil berhasil diperbarui di database!', data: updated });
    } catch {}
  }

  res.json({
    success: true,
    message: 'Pengaturan profil berhasil diperbarui!',
    data: userProfile,
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.url} tidak ditemukan di server backend CLARIQ.`,
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('CLARIQ Backend Error:', err);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan pada internal server.',
    error: err.message,
  });
});

app.listen(PORT, async () => {
  console.log(`===============================================`);
  console.log(`⚖️  CLARIQ AI Contract Platform - Backend Service`);
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🔐 Auth Endpoints: /api/auth/register & /api/auth/login`);
  console.log(`🩺 Health API: http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);

  // Auto-seed demo user & sync profile with Neon DB if connected
  try {
    if (isDbConnected() && prisma) {
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
    }
  } catch (err) {
    console.warn('⚠️ Seeding demo user skipped:', err.message);
  }
});
