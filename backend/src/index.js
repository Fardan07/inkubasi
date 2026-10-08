import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// In-Memory Database Store
let userProfile = {
  name: 'Putri Anindya',
  email: 'putri.anindya@gmail.com',
  emailReminders: true,
  plan: 'Free',
  workspaceName: 'Personal workspace',
  analyzedCount: 4,
  limitCount: 5,
};

let contracts = [
  {
    id: 1,
    name: 'Employment Agreement',
    company: 'PT Example Indonesia',
    type: 'Employment',
    status: 'Needs Attention',
    date: 'Nov 12, 2027',
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
    company: 'Studio XYZ',
    type: 'Freelance',
    status: 'Review',
    date: 'Nov 10, 2027',
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
    company: 'Kopi Kita',
    type: 'Business',
    status: 'Safe',
    date: 'Nov 8, 2027',
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
    company: 'Bumi Residence',
    type: 'Rental',
    status: 'Safe',
    date: 'Nov 5, 2027',
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
// ROUTES
// ==========================================

// Health & System Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'CLARIQ AI Contract Platform Backend',
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

// Contracts List (with filter & search)
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
  
  // Intelligent mock classification based on name
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

// AI Contract Chat Engine (Ask Your Contract)
app.post(['/api/chat', '/api/contracts/:id/chat'], (req, res) => {
  const contractId = req.params.id ? parseInt(req.params.id, 10) : req.body.contractId || 1;
  const question = (req.body.question || req.body.message || '').trim();

  if (!question) {
    return res.status(400).json({ success: false, message: 'Pertanyaan tidak boleh kosong.' });
  }

  const contract = contracts.find((c) => c.id === contractId) || contracts[0];
  const q = question.toLowerCase();

  let source = 1;
  let answer = '';

  // Smart Contextual NLP Answering
  if (/gaji|salary|remunerasi|bayar|upah|uang|benefit|tunjangan/i.test(q)) {
    source = 0;
    answer = `Berdasarkan Pasal 3 (Article 3 — Remuneration) pada "${contract.name}", gaji bulanan kotor Anda adalah Rp12.000.000 dan dibayarkan paling lambat setiap tanggal 25. Tunjangan kesehatan dan BPJS diberikan sesuai kebijakan perusahaan.`;
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
    answer = `Berdasarkan analisis AI pada dokumen "${contract.name}": Pokok utama yang perlu diperhatikan meliputi ketentuan remunerasi bulanan (Pasal 3), kewajiban pemberitahuan 30 hari jika ingin keluar (Pasal 8), serta batas perpanjangan otomatis (Pasal 9). Anda dapat menanyakan detail nominal, batas waktu, atau risiko pasal tertentu secara spesifik!`;
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
app.get('/api/user', (req, res) => {
  res.json({
    success: true,
    data: userProfile,
  });
});

app.put('/api/user', (req, res) => {
  const { name, email, emailReminders, plan } = req.body;
  if (name !== undefined) userProfile.name = name.trim();
  if (email !== undefined) userProfile.email = email.trim();
  if (emailReminders !== undefined) userProfile.emailReminders = Boolean(emailReminders);
  if (plan !== undefined) userProfile.plan = plan;

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

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`⚖️  CLARIQ AI Contract Platform - Backend Service`);
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🩺 Health API: http://localhost:${PORT}/api/health`);
  console.log(`📑 Contracts API: http://localhost:${PORT}/api/contracts`);
  console.log(`===============================================`);
});
