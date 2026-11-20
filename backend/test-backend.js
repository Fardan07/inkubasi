import fs from 'fs';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import {
  getGeminiApiKeys,
  callGeminiApi,
  chatWithAnalyzedContract,
} from './src/contractAnalyzer.js';

const BASE_URL = 'http://localhost:5000';
const JWT_SECRET = process.env.JWT_SECRET || 'clariq-dev-secret-key-2027';

async function runTests() {
  const results = [];
  function assert(condition, message) {
    if (!condition) {
      results.push({ pass: false, message });
      console.error(`❌ FAIL: ${message}`);
    } else {
      results.push({ pass: true, message });
      console.log(`✅ PASS: ${message}`);
    }
  }

  console.log('--- TESTING BACKEND ENDPOINTS WITH NATIVE FETCH ---');

  // 1. Health check
  try {
    const res = await fetch(`${BASE_URL}/api/health`);
    const data = await res.json();
    assert(res.status === 200, 'GET /api/health returns 200');
    assert(data.status === 'ok', 'Health status is ok');
    assert(data.database.includes('PostgreSQL Connected'), 'Neon PostgreSQL is connected');
  } catch (err) {
    assert(false, `Health check failed: ${err.message}`);
  }

  // 2. Auth: Register validation (empty body)
  try {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    assert(res.status === 400, 'POST /api/auth/register with empty body returns 400');
    assert(data.success === false, 'Register response success is false');
  } catch (err) {
    assert(false, `Register empty body failed: ${err.message}`);
  }

  // 3. Auth: Register short password
  try {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email: 'test_short@example.com', password: '123' }),
    });
    const data = await res.json();
    assert(res.status === 400, 'POST /api/auth/register with password < 6 returns 400');
  } catch (err) {
    assert(false, `Register short password failed: ${err.message}`);
  }

  // 4. Auth: Register new unique user
  const randomEmail = `test_${Date.now()}@example.com`;
  let registeredToken = null;
  try {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Budi Santoso', email: randomEmail, password: 'password123' }),
    });
    const data = await res.json();
    assert(res.status === 201, 'POST /api/auth/register creates new user (201)');
    assert(data.success === true, 'Register success is true');
    assert(typeof data.token === 'string', 'Token returned for registered user');
    registeredToken = data.token;
  } catch (err) {
    assert(false, `Register new user failed: ${err.message}`);
  }

  // 4b. Auth: Register duplicate email
  try {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Budi Santoso Duplicate', email: randomEmail, password: 'password123' }),
    });
    const data = await res.json();
    assert(res.status === 400, 'POST /api/auth/register duplicate email returns 400');
    assert(data.success === false, 'Duplicate register success is false');
  } catch (err) {
    assert(false, `Register duplicate failed: ${err.message}`);
  }

  // 5. Auth: Login demo user
  let token = null;
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'putri.anindya@gmail.com', password: 'password123' }),
    });
    const data = await res.json();
    assert(res.status === 200, 'POST /api/auth/login with demo user returns 200');
    assert(data.success === true, 'Login success is true');
    assert(typeof data.token === 'string', 'Token returned on login');
    token = data.token;
  } catch (err) {
    assert(false, `Demo login failed: ${err.message}`);
  }

  // 6. Auth: Login invalid credentials
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'putri.anindya@gmail.com', password: 'wrongpassword' }),
    });
    const data = await res.json();
    assert(res.status === 401, 'POST /api/auth/login with wrong password returns 401');
    assert(data.success === false, 'Wrong password success is false');
  } catch (err) {
    assert(false, `Wrong password test failed: ${err.message}`);
  }

  // 7. Auth: GET /api/auth/me with token
  try {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    assert(res.status === 200, 'GET /api/auth/me with valid token returns 200');
    assert(data.user.email === 'putri.anindya@gmail.com', 'Returns correct user email');
  } catch (err) {
    assert(false, `GET /api/auth/me failed: ${err.message}`);
  }

  // 8. Auth: GET /api/auth/me without token
  try {
    const res = await fetch(`${BASE_URL}/api/auth/me`);
    const data = await res.json();
    assert(res.status === 401, 'GET /api/auth/me without token returns 401');
    assert(data.success === false, 'Auth me without token success is false');
  } catch (err) {
    assert(false, `GET /api/auth/me without token failed: ${err.message}`);
  }

  // 9. User profile: GET /api/user with token
  try {
    const res = await fetch(`${BASE_URL}/api/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    assert(res.status === 200, 'GET /api/user with valid token returns 200');
    assert(data.data.email === 'putri.anindya@gmail.com', 'GET /api/user returns correct email');
  } catch (err) {
    assert(false, `GET /api/user failed: ${err.message}`);
  }

  // 10. User profile: GET /api/user without token
  try {
    const res = await fetch(`${BASE_URL}/api/user`);
    assert(res.status === 401, 'GET /api/user without token returns 401');
  } catch (err) {
    assert(false, `GET /api/user without token failed: ${err.message}`);
  }

  // 11. User profile: PUT /api/user
  try {
    const res = await fetch(`${BASE_URL}/api/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ emailReminders: false }),
    });
    const data = await res.json();
    assert(res.status === 200, 'PUT /api/user returns 200');
    assert(data.success === true, 'PUT /api/user success is true');

    // restore
    await fetch(`${BASE_URL}/api/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ emailReminders: true }),
    });
  } catch (err) {
    assert(false, `PUT /api/user failed: ${err.message}`);
  }

  // 12. Stats API with token
  try {
    const res = await fetch(`${BASE_URL}/api/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    assert(res.status === 200, 'GET /api/stats with token returns 200');
    assert(typeof data.data.totalContracts === 'number', 'totalContracts is number');
    assert(typeof data.data.needsAttention === 'number', 'needsAttention is number');
    assert(typeof data.data.inReview === 'number', 'inReview is number');
    assert(typeof data.data.safe === 'number', 'safe is number');
    console.log(`Stats: Total=${data.data.totalContracts}, NeedsAttention=${data.data.needsAttention}, InReview=${data.data.inReview}, Safe=${data.data.safe}`);
  } catch (err) {
    assert(false, `GET /api/stats failed: ${err.message}`);
  }

  // 13. Contracts API: list
  let contracts = [];
  try {
    const res = await fetch(`${BASE_URL}/api/contracts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    assert(res.status === 200, 'GET /api/contracts returns 200');
    assert(Array.isArray(data.data), 'contracts data is array');
    contracts = data.data;
    console.log(`Contracts count for demo user: ${contracts.length}`);
  } catch (err) {
    assert(false, `GET /api/contracts failed: ${err.message}`);
  }

  // 14. Contracts search and filter queries
  try {
    const resSearch = await fetch(`${BASE_URL}/api/contracts?search=Employment`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const dataSearch = await resSearch.json();
    assert(resSearch.status === 200, 'GET /api/contracts?search=Employment returns 200');
    assert(dataSearch.data.length >= 1, 'Search returns matching contract');

    const resFilter = await fetch(`${BASE_URL}/api/contracts?filter=Needs%20Attention`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const dataFilter = await resFilter.json();
    assert(resFilter.status === 200, 'GET /api/contracts?filter=Needs Attention returns 200');
  } catch (err) {
    assert(false, `Contracts search/filter failed: ${err.message}`);
  }

  // 15. Single Contract Detail
  if (contracts.length > 0) {
    const firstId = contracts[0].id;
    try {
      const res = await fetch(`${BASE_URL}/api/contracts/${firstId}`);
      const data = await res.json();
      assert(res.status === 200, `GET /api/contracts/${firstId} returns 200`);
      assert(data.data.id === firstId, 'Contract ID matches');
      assert(Array.isArray(data.data.clauses), 'Contract has clauses array');
    } catch (err) {
      assert(false, `GET single contract failed: ${err.message}`);
    }
  }

  // 16. Single Contract Detail - non-existing ID
  try {
    const res = await fetch(`${BASE_URL}/api/contracts/99999999`);
    const data = await res.json();
    assert(res.status === 404, 'GET /api/contracts/99999999 returns 404');
    assert(data.success === false, 'Non-existing contract success is false');
  } catch (err) {
    assert(false, `Non-existing contract test failed: ${err.message}`);
  }

  // 17. Contract Check Analyze Endpoint
  try {
    const res = await fetch(`${BASE_URL}/api/contract-check/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contractType: 'kerja',
        contractText: 'Karyawan yang resign sebelum masa kontrak berakhir wajib membayar denda 3x gaji bulanan. Kontrak otomatis diperpanjang setiap 6 bulan.',
      }),
    });
    const data = await res.json();
    assert(res.status === 200, 'POST /api/contract-check/analyze returns 200');
    assert(data.success === true, 'Analyze success is true');
    assert(data.data.riskScore > 50, 'Risk score indicates high risk');
    assert(Array.isArray(data.data.aiClauses), 'aiClauses returned');
    assert(typeof data.data.legalSummary === 'string', 'legalSummary is returned');
  } catch (err) {
    assert(false, `Contract check analyze failed: ${err.message}`);
  }

  // 17b. Contract Check Analyze - Sewa Menyewa
  try {
    const res = await fetch(`${BASE_URL}/api/contract-check/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contractType: 'sewa',
        contractText: 'Pasal 2: Uang deposit sebesar Rp1.000.000 tidak dapat dikembalikan dengan alasan apapun. Pemilik berhak menaikkan harga sewa kapan saja.',
      }),
    });
    const data = await res.json();
    assert(res.status === 200, 'POST /api/contract-check/analyze for sewa returns 200');
    assert(data.data.riskScore >= 60, 'Sewa with deposit non-refundable and unilateral rent hike flags high risk');
  } catch (err) {
    assert(false, `Analyze sewa failed: ${err.message}`);
  }

  // 17c. Contract Check Analyze - Missing text and fileName
  try {
    const res = await fetch(`${BASE_URL}/api/contract-check/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contractText: '   ' }),
    });
    assert(res.status === 400, 'POST /api/contract-check/analyze with empty text and no fileName returns 400');
  } catch (err) {
    assert(false, `Analyze missing text failed: ${err.message}`);
  }

  // 18. Contract Check Legal Info
  try {
    const res = await fetch(`${BASE_URL}/api/contract-check/legal/kerja`);
    const data = await res.json();
    assert(res.status === 200, 'GET /api/contract-check/legal/kerja returns 200');
    assert(data.data.type === 'kerja', 'Legal type is kerja');
    assert(typeof data.data.legal === 'string', 'Legal summary is string');
  } catch (err) {
    assert(false, `GET legal kerja failed: ${err.message}`);
  }

  // 19. Dates list & reminder toggle
  let dates = [];
  try {
    const res = await fetch(`${BASE_URL}/api/dates`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    assert(res.status === 200, 'GET /api/dates returns 200');
    assert(Array.isArray(data.data), 'Dates data is array');
    dates = data.data;
    console.log(`Dates count for demo user: ${dates.length}`);
  } catch (err) {
    assert(false, `GET /api/dates failed: ${err.message}`);
  }

  if (dates.length > 0) {
    const dateId = dates[0].id;
    const initialReminder = dates[0].reminderEnabled;
    try {
      const res = await fetch(`${BASE_URL}/api/dates/${dateId}/reminder`, {
        method: 'PUT',
      });
      const data = await res.json();
      assert(res.status === 200, `PUT /api/dates/${dateId}/reminder returns 200`);
      assert(data.data.reminderEnabled === !initialReminder, 'Reminder toggled successfully');

      // Toggle back
      await fetch(`${BASE_URL}/api/dates/${dateId}/reminder`, {
        method: 'PUT',
      });
    } catch (err) {
      assert(false, `PUT /api/dates/:id/reminder failed: ${err.message}`);
    }
  }

  // 20. Create AI Contract via POST /api/contracts
  let createdContractId = null;
  try {
    const res = await fetch(`${BASE_URL}/api/contracts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: 'Test PKWT Designer',
        company: 'PT Test Kreatif',
        contractType: 'kerja',
        contractText: 'Pasal 1: Jangka waktu 6 bulan. Pasal 2: Denda resign 3x upah.',
        useAICheck: true,
      }),
    });
    const data = await res.json();
    assert(res.status === 201, 'POST /api/contracts creates contract (201)');
    assert(data.success === true, 'Create contract success is true');
    createdContractId = data.data.id;
    console.log(`Created contract ID: ${createdContractId}`);
  } catch (err) {
    assert(false, `Create contract failed: ${err.message}`);
  }

  // 21. Chat API with the created contract
  if (createdContractId) {
    try {
      const res = await fetch(`${BASE_URL}/api/contracts/${createdContractId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: 'Apakah ada denda jika saya resign?',
          lang: 'id',
        }),
      });
      const data = await res.json();
      assert(res.status === 200, 'POST /api/contracts/:id/chat returns 200');
      assert(data.data.role === 'assistant', 'Response has assistant role');
      assert(typeof data.data.text === 'string' && data.data.text.length > 10, 'Response text is non-empty');
      console.log(`Chat response snippet: ${data.data.text.slice(0, 100)}...`);
    } catch (err) {
      assert(false, `Chat with contract failed: ${err.message}`);
    }
  }

  // 22. Compare contracts endpoint
  try {
    const res = await fetch(`${BASE_URL}/api/contracts/compare`);
    const data = await res.json();
    assert(res.status === 200, 'GET /api/contracts/compare returns 200');
    assert(Array.isArray(data.data.comparisons), 'comparisons array exists');
    assert(Array.isArray(data.data.keyDifferences), 'keyDifferences array exists');
  } catch (err) {
    assert(false, `Compare endpoint failed: ${err.message}`);
  }

  // 23. Delete the test contract
  if (createdContractId) {
    try {
      const res = await fetch(`${BASE_URL}/api/contracts/${createdContractId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      assert(res.status === 200, `DELETE /api/contracts/${createdContractId} returns 200`);
      assert(data.success === true, 'Delete contract success is true');
    } catch (err) {
      assert(false, `Delete contract failed: ${err.message}`);
    }
  }

  // 24. 404 test
  try {
    const res = await fetch(`${BASE_URL}/api/unknown-endpoint`);
    assert(res.status === 404, 'Unknown endpoint returns 404');
  } catch (err) {
    assert(false, `404 handler test failed: ${err.message}`);
  }

  // ============================================================
  // MASTER TEST SUITE: REAL-WORLD KEVIN BIROWO CONTRACT & SECURITY
  // ============================================================

  // 25. Real PDF Extraction API (/api/extract-pdf)
  try {
    const pdfPath = 'C:/Users/mafrd/.gemini/antigravity/brain/fdc150c2-b293-494e-886f-c735b0aeed69/.user_uploaded/media_1793928456847_93448970.pdf';
    let base64Payload = '';
    if (fs.existsSync(pdfPath)) {
      const pdfBuffer = fs.readFileSync(pdfPath);
      base64Payload = pdfBuffer.toString('base64');
    }

    if (base64Payload) {
      const res = await fetch(`${BASE_URL}/api/extract-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64: base64Payload,
          fileName: 'Contoh-Surat-Perjanjian-Kontrak-Kerja-Karyawan-Swasta.pdf',
        }),
      });
      const data = await res.json();
      assert(res.status === 200, 'POST /api/extract-pdf returns 200 for real uploaded PDF');
      assert(data.success === true, 'PDF extraction success is true');
      assert(data.data.charCount > 1000, `PDF extracted characters (${data.data.charCount}) > 1000`);
      assert(data.data.text.includes('Kevin Birowo'), 'Extracted text contains second party Kevin Birowo');
      assert(data.data.text.includes('PT. Bintang Maju Bersama'), 'Extracted text contains PT. Bintang Maju Bersama');
      assert(data.data.text.includes('Rp10.000.000'), 'Extracted text contains penalty Rp10.000.000');
      assert(data.data.text.includes('Rp8.000.000'), 'Extracted text contains salary Rp8.000.000');
    }

    // PDF extraction with empty payload rejected with 400
    const emptyPdfRes = await fetch(`${BASE_URL}/api/extract-pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64: '' }),
    });
    assert(emptyPdfRes.status === 400, 'POST /api/extract-pdf with empty base64 returns 400');
  } catch (err) {
    assert(false, `PDF extraction test failed: ${err.message}`);
  }

  // 26. Zero-Hallucination Policy: Empty/unreadable text rejected with 400
  try {
    const resEmpty = await fetch(`${BASE_URL}/api/contracts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fileName: 'scanned-image-without-text.pdf',
        contractType: 'kerja',
        contractText: '    ',
        useAICheck: true,
      }),
    });
    const dataEmpty = await resEmpty.json();
    assert(resEmpty.status === 400, 'POST /api/contracts with empty text returns 400 Bad Request');
    assert(dataEmpty.success === false, 'Empty contract rejected with success: false');
    assert(
      dataEmpty.message.includes('Teks dokumen tidak terbaca'),
      'Rejection message clearly mentions document unreadable / scanned PDF'
    );
  } catch (err) {
    assert(false, `Zero-hallucination contract upload test failed: ${err.message}`);
  }

  // 27. Real Contract Case: Kevin Birowo — PT. Bintang Maju Bersama
  const kevinContractText = `Surat Kontrak Perjanjian Kerja
Oleh PT. Bintang Maju Bersama
SCBD Tower Alessia No.14 Lantai 6, Jakarta Pusat
Nomor Kontrak: ARS1-12092020-BMB

Bahwa saya yang bertanda tangan di bawah ini:
Nama : Nana Pertiwi
Alamat : Jl. Pantai Indah Kapuk No.14 Jakarta Utara
Jabatan : HRD PT. Bintang Maju Bersama
Akan disebut sebagai pihak pertama.

Nama : Kevin Birowo
Alamat : Jl. Bintan Nomor 29 Fatmawati, Jakarta Selatan
Tempat dan Tanggal Lahir : Jakarta, 29 Januari 1985
Jenis Kelamin : Pria
Agama : Kristen
Nomor KTP : 1982877718217
Nomor Telepon : 0832-1193-8767
Akan disebut sebagai pihak kedua.

Pasal 1
Saya sebagai pihak pertama menyatakan bahwa pihak kedua telah diangkat untuk bekerja sebagai karyawan di PT. Bintang Maju Bersama sebagai bagian Supply Chain Manager. Oleh sebab itulah dengan ditandatanganinya surat kontrak perjanjian kerja ini membuat ketentuan akan terus berlaku selama pihak kedua masih bekerja di perusahaan ini.

Pasal 2
Pihak kedua memiliki kewajiban untuk hadir mulai dari hari Senin hingga Jumat dan diharapkan kehadirannya paling lambat pukul 09.00 pagi hari dan akan bekerja hingga pukul 17.00 di sore hari.

Pasal 3
Pihak kedua akan bertanggung jawab untuk mengurus dan melakukan rekap penjualan serta membuat pemesanan produk-produk yang ada pada PT Bintang Maju Bersama. Rekap penjualan tersebut nantinya akan dikirimkan kepada Warehouse Chief untuk dibuatkan forecast penjualannya.

Pasal 4
Pihak kedua terlebih dahulu akan melewati masa uji coba selama satu bulan dan perusahaan akan menentukan diangkat secara penuh atau tidak sebagai karyawan tetap setelah pihak kedua melewati masa uji coba tersebut. Apabila karyawan mengundurkan diri selama masa uji coba sedang berlangsung maka akan dikenakan denda sebesar Rp10.000.000 untuk membayar biaya pelatihan yang sudah dilakukan.

Pasal 5
Selama pihak kedua bekerja di perusahaan akan berhak mendapatkan gaji sebesar Rp8.000.000 yang akan dibayarkan melalui nomor rekening yang sudah diberikan oleh perusahaan selambat-lambatnya pada tanggal 30 setiap bulannya.

Demikianlah surat perjanjian kontrak kerja ini dibuat dan harap untuk diikuti sebaik-baiknya.
Jakarta, 12 Desember 2020
Pihak Pertama (Nana Pertiwi) & Pihak Kedua (Kevin Birowo)`;

  let kevinContractId = null;
  try {
    const res = await fetch(`${BASE_URL}/api/contracts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: 'Surat Kontrak Kevin Birowo',
        fileName: 'Contoh-Surat-Perjanjian-Kontrak-Kerja-Karyawan-Swasta.pdf',
        contractType: 'kerja',
        contractText: kevinContractText,
        useAICheck: true,
        lang: 'id',
      }),
    });
    const data = await res.json();
    assert(res.status === 201, 'POST /api/contracts for Kevin Birowo returns 201');
    assert(data.success === true, 'Kevin Birowo contract creation success is true');
    kevinContractId = data.data.id;

    // AI Analysis checks:
    assert(data.data.riskScore >= 65, `Kevin Birowo risk score (${data.data.riskScore}) is High Risk >= 65`);
    assert(data.data.status === 'Needs Attention' || data.data.statusId === 'Perlu Perhatian', 'Status is Needs Attention');
    assert(data.data.meta && data.data.meta.salary && data.data.meta.salary.includes('8.000.000'), 'Extracted meta.salary contains 8.000.000');
    assert(data.data.meta.workingHours && (data.data.meta.workingHours.includes('09.00') || data.data.meta.workingHours.includes('40')), 'Extracted meta.workingHours contains 09.00 / 40');
    assert(data.data.meta.probationPeriod && data.data.meta.probationPeriod.includes('1') && data.data.meta.probationPeriod.includes('bulan'), 'Extracted meta.probationPeriod contains 1 bulan');
    assert(data.data.meta.penalty && data.data.meta.penalty.includes('10.000.000'), 'Extracted meta.penalty contains 10.000.000');
    assert(data.data.meta.disproportionatePenalty === true, 'Disproportionate penalty flag is true (10M > 8M)');

    // Clause verification & Anti-Truncation across all clauses
    const penaltyClause = data.data.clauses.find((c) => /10\.000\.000|denda|pelatihan/i.test(c.text + ' ' + c.meaning));
    assert(Boolean(penaltyClause), 'Pasal 4 denda Rp10.000.000 is detected in clauses');
    assert(penaltyClause && (penaltyClause.status === 'Needs Attention' || penaltyClause.statusId === 'Perlu Perhatian' || penaltyClause.risiko === 'tinggi'), 'Pasal 4 clause is flagged as High Risk');
    assert(
      penaltyClause &&
        penaltyClause.text.includes('Rp10.000.000') &&
        !penaltyClause.text.trim().startsWith('000 untuk membayar'),
      'Penalty clause quote preserves full "Rp10.000.000" sentence without mid-number truncation'
    );
    const anyClauseTruncated = data.data.clauses.some((c) =>
      /(?<!000\.)000\s+untuk\s+membayar/i.test(`${c.text || ''} ${c.meaning || ''} ${c.why || ''}`)
    );
    assert(!anyClauseTruncated, 'Anti-Truncation: Zero clauses contain broken "000 untuk membayar" fragment');
  } catch (err) {
    assert(false, `Kevin Birowo contract analysis failed: ${err.message}`);
  }

  // 28. Contextual AI Chat Factual Accuracy on Kevin Birowo's Contract
  if (kevinContractId) {
    // Q1: Gaji & Jadwal Pembayaran
    try {
      const res = await fetch(`${BASE_URL}/api/contracts/${kevinContractId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: 'Berapa gaji saya dan kapan dibayarkan?',
          lang: 'id',
        }),
      });
      const data = await res.json();
      assert(res.status === 200, 'Chat Q1 (Gaji) returns 200');
      assert(data.data.text.includes('8.000.000'), 'Chat Q1 mentions exact salary Rp8.000.000');
      assert(data.data.text.includes('30'), 'Chat Q1 mentions payment date 30');
    } catch (err) {
      assert(false, `Chat Q1 failed: ${err.message}`);
    }

    // Q2: Masa Uji Coba & Status Hukum Pasal 58
    try {
      const res = await fetch(`${BASE_URL}/api/contracts/${kevinContractId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: 'Apakah ada masa uji coba dan bagaimana aturan hukumnya?',
          lang: 'id',
        }),
      });
      const data = await res.json();
      assert(res.status === 200, 'Chat Q2 (Uji Coba) returns 200');
      assert(data.data.text.includes('1') || data.data.text.toLowerCase().includes('satu'), 'Chat Q2 mentions 1 month duration');
      assert(data.data.text.includes('Pasal 58'), 'Chat Q2 cites Pasal 58 UU 13/2003');
      assert(data.data.text.toLowerCase().includes('batal demi hukum'), 'Chat Q2 explains probation is null and void for PKWT');
    } catch (err) {
      assert(false, `Chat Q2 failed: ${err.message}`);
    }

    // Q3: Jam & Hari Kerja (Pasal 77)
    try {
      const res = await fetch(`${BASE_URL}/api/contracts/${kevinContractId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: 'Bagaimana aturan jam kerja saya dalam seminggu?',
          lang: 'id',
        }),
      });
      const data = await res.json();
      assert(res.status === 200, 'Chat Q3 (Jam Kerja) returns 200');
      assert(data.data.text.includes('09.00') || data.data.text.includes('40 jam'), 'Chat Q3 mentions 09.00-17.00 / 40 jam');
      assert(data.data.text.includes('Pasal 77'), 'Chat Q3 cites Pasal 77 UU 13/2003 compliance');
    } catch (err) {
      assert(false, `Chat Q3 failed: ${err.message}`);
    }

    // Q4: Denda Resign & Perbandingan dengan Gaji Bulanan
    try {
      const res = await fetch(`${BASE_URL}/api/contracts/${kevinContractId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: 'Berapa denda jika saya resign saat masa percobaan?',
          lang: 'id',
        }),
      });
      const data = await res.json();
      assert(res.status === 200, 'Chat Q4 (Denda) returns 200');
      assert(data.data.text.includes('10.000.000'), 'Chat Q4 mentions exact fine Rp10.000.000');
      assert(!/(?<!000\.)000\s+untuk\s+membayar/i.test(data.data.text), 'Chat Q4 reply has no truncated "000 untuk membayar"');
      assert(data.data.text.toLowerCase().includes('melebihi') || data.data.text.toLowerCase().includes('tidak proporsional'), 'Chat Q4 flags that fine exceeds monthly salary');
      assert(data.data.text.includes('PP No. 35/2021') || data.data.text.includes('MK'), 'Chat Q4 cites PP 35/2021 / Putusan MK');
    } catch (err) {
      assert(false, `Chat Q4 failed: ${err.message}`);
    }

    // Q5: Identitas Pihak & Jabatan (Termasuk Verifikasi Urutan Pihak Pertama = Nana Pertiwi & Pihak Kedua = Kevin Birowo)
    try {
      const res = await fetch(`${BASE_URL}/api/contracts/${kevinContractId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: 'siapa pihak pertama dan pihak kedua dalam kontrak ini?',
          lang: 'id',
        }),
      });
      const data = await res.json();
      const plainQ5 = (data.data.text || '').replace(/\*\*/g, '');
      assert(res.status === 200, 'Chat Q5 (Parties & Role) returns 200');
      assert(plainQ5.includes('Pihak Pertama: Nana Pertiwi'), 'Chat Q5 accurately identifies Pihak Pertama as Nana Pertiwi');
      assert(plainQ5.includes('Pihak Kedua: Kevin Birowo'), 'Chat Q5 accurately identifies Pihak Kedua as Kevin Birowo');
      assert(!plainQ5.includes('Kevin Birowo Alamat'), 'Chat Q5 cleans "Alamat" suffix from party name');
      assert(plainQ5.includes('Supply Chain Manager'), 'Chat Q5 mentions Supply Chain Manager');
      assert(data.data.source === 0, 'Chat Q5 (contract party query) includes valid clause citation source (0)');
    } catch (err) {
      assert(false, `Chat Q5 failed: ${err.message}`);
    }

    // Q6: Greeting ("halo") Guardrail — Must return polite greeting, source === null, and NOT dump Skor Risiko
    try {
      const res = await fetch(`${BASE_URL}/api/contracts/${kevinContractId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: 'halo',
          lang: 'id',
        }),
      });
      const data = await res.json();
      assert(res.status === 200, 'Chat Q6 ("halo" greeting) returns 200');
      assert(data.data.text.startsWith('Halo!'), 'Chat Q6 ("halo") starts with "Halo!" greeting');
      assert(!data.data.text.includes('Skor Risiko:'), 'Chat Q6 ("halo") does NOT dump "Skor Risiko:" summary');
      assert(data.data.source === null, 'Chat Q6 ("halo") returns source === null so citation badge is hidden');
    } catch (err) {
      assert(false, `Chat Q6 ("halo") failed: ${err.message}`);
    }

    // Q7: Off-Topic Question ("bagaimana cara membuat kue bolu?") Guardrail
    try {
      const res = await fetch(`${BASE_URL}/api/contracts/${kevinContractId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: 'bagaimana cara membuat kue bolu?',
          lang: 'id',
        }),
      });
      const data = await res.json();
      assert(res.status === 200, 'Chat Q7 (off-topic question) returns 200');
      assert(
        data.data.text.includes('Maaf, saya tidak paham maksud Anda'),
        'Chat Q7 (off-topic) returns polite out-of-scope guardrail message'
      );
      assert(!data.data.text.includes('Skor Risiko:'), 'Chat Q7 (off-topic) does NOT dump "Skor Risiko:" summary');
      assert(data.data.source === null, 'Chat Q7 (off-topic) returns source === null');
    } catch (err) {
      assert(false, `Chat Q7 (off-topic) failed: ${err.message}`);
    }

    // Q8: Platform Feature Question & Explicit Summary Request
    try {
      const featRes = await fetch(`${BASE_URL}/api/contracts/${kevinContractId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: 'apa saja fitur di website cek kontrak ini?',
          lang: 'id',
        }),
      });
      const featData = await featRes.json();
      assert(featRes.status === 200, 'Chat Q8a (platform feature question) returns 200');
      assert(featData.data.text.includes('4 fitur utama'), 'Chat Q8a explains the 4 core platform features');
      assert(featData.data.source === null, 'Chat Q8a (platform features) returns source === null');

      const sumRes = await fetch(`${BASE_URL}/api/contracts/${kevinContractId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: 'berikan ringkasan dan skor risiko kontrak ini',
          lang: 'id',
        }),
      });
      const sumData = await sumRes.json();
      const plainSum = (sumData.data.text || '').replace(/\*\*/g, '');
      assert(sumRes.status === 200, 'Chat Q8b (explicit summary/risk request) returns 200');
      assert(/Skor Risiko\s*:/i.test(plainSum), 'Chat Q8b returns Skor Risiko summary when explicitly requested');
    } catch (err) {
      assert(false, `Chat Q8 failed: ${err.message}`);
    }

    // Q9: Strict Context-Bound Guardrail ("siapa jokowi?", "siapa brando?", "apa itu ai?", "1 + 1 = berapa?")
    try {
      const outOfScopePrompts = [
        'siapa jokowi?',
        'siapa brando?',
        'apa itu ai?',
        '1 + 1 = berapa?',
      ];
      for (const promptText of outOfScopePrompts) {
        const oosRes = await fetch(`${BASE_URL}/api/contracts/${kevinContractId}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            question: promptText,
            lang: 'id',
          }),
        });
        const oosData = await oosRes.json();
        assert(oosRes.status === 200, `Chat Q9 ("${promptText}") returns 200`);
        assert(
          oosData.data.text.includes('Maaf, saya tidak paham maksud Anda'),
          `Chat Q9 ("${promptText}") is rejected with out-of-scope message`
        );
        assert(
          oosData.data.source === null,
          `Chat Q9 ("${promptText}") returns source === null (hides citation box)`
        );
      }
    } catch (err) {
      assert(false, `Chat Q9 strict guardrail tests failed: ${err.message}`);
    }
  }

  // 29. Security & Anti-IDOR Authorization Audit
  try {
    // Register another user (User B)
    const userBEmail = `userb.${Date.now()}@example.com`;
    const regBRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'User B IDOR Tester',
        email: userBEmail,
        password: 'password123',
      }),
    });
    const regBData = await regBRes.json();
    assert(regBRes.status === 201, 'Register User B returns 201');
    const tokenB = regBData.token;

    if (kevinContractId && tokenB) {
      // User B tries to read User A's private contract
      const idorReadRes = await fetch(`${BASE_URL}/api/contracts/${kevinContractId}`, {
        headers: { Authorization: `Bearer ${tokenB}` },
      });
      assert(idorReadRes.status === 403, 'Anti-IDOR: User B cannot access User A contract (403)');

      // User B tries to chat with User A's contract
      const idorChatRes = await fetch(`${BASE_URL}/api/contracts/${kevinContractId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenB}`,
        },
        body: JSON.stringify({ question: 'Berapa gaji Kevin?' }),
      });
      assert(idorChatRes.status === 403, 'Anti-IDOR: User B cannot chat with User A contract (403)');

      // User B tries to delete User A's contract
      const idorDelRes = await fetch(`${BASE_URL}/api/contracts/${kevinContractId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${tokenB}` },
      });
      assert(idorDelRes.status === 403, 'Anti-IDOR: User B cannot delete User A contract (403)');
    }

    // Invalid numeric parameter validation (:id)
    const invalidIdRes = await fetch(`${BASE_URL}/api/contracts/invalid-id-xyz`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(invalidIdRes.status === 400, 'GET /api/contracts/:id with non-numeric ID returns 400 Bad Request');
  } catch (err) {
    assert(false, `Anti-IDOR security tests failed: ${err.message}`);
  }

  // 30. Clean up Kevin Birowo's test contract with User A's token
  if (kevinContractId) {
    try {
      const delRes = await fetch(`${BASE_URL}/api/contracts/${kevinContractId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      assert(delRes.status === 200, `Cleanup Kevin Birowo contract (${kevinContractId}) returns 200`);
    } catch (err) {
      console.warn('Cleanup error:', err.message);
    }
  }

  // 31. HRD Smart Contract Generator Endpoint (POST /api/contracts/generate)
  try {
    // 31a. Generate PKWT with probationMonths > 0 (Should trigger Pasal 58 guardrail & auto-correct to 0)
    const genPkwtRes = await fetch(`${BASE_URL}/api/contracts/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        contractSubType: 'PKWT',
        companyName: 'PT. Nusantara Teknologi Mandiri',
        hrdName: 'Rina Wijaya',
        hrdRole: 'HR Manager',
        employeeName: 'Dimas Pratama',
        employeeRole: 'Senior Frontend Engineer',
        durationMonths: 12,
        probationMonths: 3,
        salary: 15000000,
        paymentDay: 25,
        noticePeriodDays: 30,
      }),
    });
    const genPkwtData = await genPkwtRes.json();
    assert(genPkwtRes.status === 200, 'POST /api/contracts/generate for PKWT returns 200');
    assert(genPkwtData.success === true, 'HRD PKWT generation success is true');
    assert(genPkwtData.data.effectiveProbationMonths === 0, 'PKWT probationMonths: 3 auto-corrected to 0');
    assert(genPkwtData.data.probationGuardrailTriggered === true, 'PKWT probation guardrail triggered is true');
    assert(
      Array.isArray(genPkwtData.data.legalWarnings) &&
        genPkwtData.data.legalWarnings.some((w) => w.includes('Pasal 58')),
      'PKWT probation warning cites Pasal 58 UU 13/2003'
    );
    assert(genPkwtData.data.riskScore < 30, `Generated PKWT contract has Low Risk score (${genPkwtData.data.riskScore} < 30)`);
    assert(genPkwtData.data.status === 'Safe', 'Generated PKWT contract status is Safe');
    assert(
      typeof genPkwtData.data.contractText === 'string' &&
        genPkwtData.data.contractText.includes('PT. Nusantara Teknologi Mandiri') &&
        genPkwtData.data.contractText.includes('Dimas Pratama'),
      'Generated contractText includes company and employee names'
    );

    // 31b. Save generated HRD PKWT draft to My Contracts (POST /api/contracts) & verify Safe status
    const saveHrdRes = await fetch(`${BASE_URL}/api/contracts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: genPkwtData.data.title || 'Kontrak Kerja PKWT - Dimas Pratama',
        fileName: 'Kontrak-PKWT-Dimas-Pratama.pdf',
        company: 'PT. Nusantara Teknologi Mandiri',
        contractType: 'kerja',
        contractText: genPkwtData.data.contractText,
        useAICheck: true,
        lang: 'id',
      }),
    });
    const saveHrdData = await saveHrdRes.json();
    assert(saveHrdRes.status === 201, 'Saving generated HRD contract to POST /api/contracts returns 201');
    assert(saveHrdData.success === true, 'Saved HRD contract creation success is true');
    assert(saveHrdData.data.riskScore < 30, `Saved HRD contract has Low Risk score (${saveHrdData.data.riskScore} < 30)`);
    assert(
      saveHrdData.data.status === 'Safe' || saveHrdData.data.statusId === 'Aman',
      'Saved HRD contract status is Safe / Aman'
    );

    if (saveHrdData.data && saveHrdData.data.id) {
      const delHrdRes = await fetch(`${BASE_URL}/api/contracts/${saveHrdData.data.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      assert(delHrdRes.status === 200, 'Cleanup saved HRD contract returns 200');
    }

    // 31c. Generate PKWTT (Karyawan Tetap) with valid 3-month probation
    const genPkwttRes = await fetch(`${BASE_URL}/api/contracts/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        contractSubType: 'PKWTT',
        companyName: 'PT. Nusantara Teknologi Mandiri',
        employeeName: 'Siti Rahmawati',
        employeeRole: 'Product Manager',
        probationMonths: 3,
        salary: 18000000,
      }),
    });
    const genPkwttData = await genPkwttRes.json();
    assert(genPkwttRes.status === 200, 'POST /api/contracts/generate for PKWTT returns 200');
    assert(genPkwttData.data.effectiveProbationMonths === 3, 'PKWTT allows 3-month probation (Pasal 60 UU 13/2003)');
    assert(genPkwttData.data.riskScore < 30, 'Generated PKWTT contract has Low Risk / Safe score');
  } catch (err) {
    assert(false, `HRD Smart Contract Generator test failed: ${err.message}`);
  }

  // 32. Sequential Multi-Document Upload & Analysis (Document 1 Kevin Birowo -> Document 2 BKD Kaltim & PT. Powernet Indosolusi)
  try {
    // Step 32a: Upload Document 1 (Kevin Birowo Employment Contract)
    const doc1Res = await fetch(`${BASE_URL}/api/contracts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: 'Surat_Kontrak_Kevin_Birowo',
        fileName: 'Surat_Kontrak_Kevin_Birowo.pdf',
        contractType: 'kerja',
        contractText: kevinContractText,
        useAICheck: true,
        lang: 'id',
      }),
    });
    const doc1Json = await doc1Res.json();
    const doc1 = doc1Json.data;
    assert(doc1Res.status === 201 && doc1Json.success === true, 'Sequential Doc 1 (Kevin Birowo) upload returns 201');
    assert(doc1.typeId === 'Ketenagakerjaan', 'Doc 1 detected as Ketenagakerjaan');
    assert(doc1.meta.firstParty === 'Nana Pertiwi', 'Doc 1 First Party is Nana Pertiwi');
    assert(doc1.meta.secondParty === 'Kevin Birowo', 'Doc 1 Second Party is Kevin Birowo');
    assert(doc1.meta.salary.includes('8.000.000'), 'Doc 1 Salary is Rp8.000.000');
    assert(doc1.meta.penalty.includes('10.000.000') && doc1.riskScore >= 65, 'Doc 1 Penalty is Rp10.000.000 (High Risk)');

    // Step 32b: Immediately Upload Document 2 (BKD Prov. Kalimantan Timur & PT. Powernet Indosolusi)
    const bkdKaltimText = [
      'PEMERINTAH PROVINSI KALIMANTAN TIMUR - BADAN KEPEGAWAIAN DAERAH',
      'SURAT PERJANJIAN KERJASAMA',
      'Nomor : 800/I.2-45/BKD/2021',
      'Nomor : SPK.CS-01/BKD/PWR.2021',
      'Pada hari ini Senin tanggal Empat bulan Januari tahun Dua Ribu Dua Puluh Satu:',
      'I. Nama : Dra. Nina Dewi, MAP.',
      'Jabatan : Kuasa Pengguna Anggaran',
      'Kantor : Jl. M. Yamin No.1 Samarinda',
      'Dalam hal ini bertindak untuk dan atas nama BADAN KEPEGAWAIAN DAERAH PROVINSI KALIMANTAN TIMUR selanjutnya disebut PIHAK PERTAMA.',
      'II. Nama : Akbar Marwan',
      'Jabatan : Account Executive',
      'Kantor : PT. POWERNET INDOSOLUSI Jalan HR. Rasuna Said Blok X-5 Kav.2-3 Menara Kadin Jakarta 12950',
      'Dalam hal ini bertindak untuk dan atas nama PT. POWERNET INDOSOLUSI selanjutnya disebut PIHAK KEDUA.',
      '',
      'PASAL 1',
      'LINGKUP PERJANJIAN KERJASAMA',
      'Pihak Pertama menyerahkan tugas kepada Pihak Kedua untuk mengelola Server Colocation BKD yang ditempatkan pada PT. POWERNET INDOSOLUSI Menara Kadin Jakarta, Lokasi Fisik Gedung TELKOM Karet Tengsin Jakarta Pusat.',
      '',
      'PASAL 2',
      'KEWAJIBAN PIHAK KEDUA',
      '1. PIHAK KEDUA memfasilitasi serta memelihara Server sebagai Colocation Server Badan Kepegawaian Daerah Prov. Kaltim selama 1 Tahun mulai bulan Januari sampai dengan Desember 2021.',
      '2. PIHAK KEDUA menyediakan fasilitas jaringan internet untuk collocation Web Server dengan spesifikasi unlimited.',
      '',
      'PASAL 3',
      'KEWAJIBAN PIHAK PERTAMA',
      '1. PIHAK PERTAMA membayar jasa sewa untuk Colocation Server kepada PIHAK KEDUA sebesar Rp. 2.500.000,- (dua juta lima ratus ribu rupiah) per bulan sudah termasuk pajak, dilakukan per semester Rp. 2.500.000 x 6 bln = Rp. 15.000.000,- melalui transfer:',
      'BANK : BCA CABANG MARGONDA',
      'Atas Nama : AKBAR MARWAN',
      'Nomor Rekening : 869-004-6572 Jakarta Pusat;',
      '2. Beban biaya diambil dari APBD Provinsi Kalimantan Timur Tahun 2021 kode rekening 4.5.01.09.10.5.2.1.19.17.',
      '',
      'PASAL 4',
      'LAIN-LAIN',
      '1. Hal yang belum diatur akan diatur dalam Surat Perjanjian Tambahan (addendum).',
      '2. Jika PIHAK KEDUA tidak berada di tempat, wajib menunjuk wakil.',
      '3. Dibuat dalam rangkap 2 asli di atas kertas bermaterai Rp. 6000,- (enam ribu rupiah).',
      '',
      'PASAL 5',
      'PENUTUP',
      'Surat Perjanjian Kerjasama ini berlaku sejak tanggal ditandatangani oleh Dra. Nina Dewi, MAP. dan Akbar Marwan.',
    ].join('\n');

    const doc2Res = await fetch(`${BASE_URL}/api/contracts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: 'Surat Perjanjian Kerjasama BKD Kaltim & PT Powernet',
        fileName: 'SPK-BKD-Kaltim-Powernet-2021.pdf',
        contractType: 'kerja',
        contractText: bkdKaltimText,
        useAICheck: true,
        lang: 'id',
      }),
    });
    const doc2Json = await doc2Res.json();
    const doc2 = doc2Json.data;
    assert(doc2Res.status === 201 && doc2Json.success === true, 'Sequential Doc 2 (BKD Kaltim & Powernet) upload returns 201');
    assert(
      doc2.typeId === 'Perjanjian Kerjasama / Jasa' && doc2.type === 'Partnership / Service',
      `Doc 2 auto-detected as Perjanjian Kerjasama / Jasa (got: ${doc2.typeId})`
    );
    assert(
      /Nina Dewi/i.test(doc2.meta.firstParty || '') &&
        /BADAN KEPEGAWAIAN DAERAH PROVINSI KALIMANTAN TIMUR/i.test(doc2.meta.firstParty || ''),
      `Doc 2 First Party contains Dra. Nina Dewi & BKD Prov. Kaltim (got: ${doc2.meta.firstParty})`
    );
    assert(
      /Akbar Marwan/i.test(doc2.meta.secondParty || '') &&
        /PT\. POWERNET INDOSOLUSI/i.test(doc2.meta.secondParty || ''),
      `Doc 2 Second Party contains Akbar Marwan & PT. Powernet Indosolusi (got: ${doc2.meta.secondParty})`
    );
    assert(
      doc2.meta.salary.includes('2.500.000') && doc2.meta.salary.includes('15.000.000'),
      `Doc 2 Contract Value contains Rp2.500.000 and Rp15.000.000 (got: ${doc2.meta.salary})`
    );
    assert(
      !doc2.meta.workingHours.includes('Senin - Jumat (40 jam/minggu)') &&
        /1 Tahun.*Januari.*Desember 2021/i.test(doc2.meta.workingHours),
      `Doc 2 workingHours/duration is 1 Tahun (Januari - Desember 2021), NOT hardcoded 40 jam/minggu (got: ${doc2.meta.workingHours})`
    );
    assert(
      doc2.clauses.length === 5 &&
        doc2.clauses.some((c) => /PASAL 1/i.test(c.title)) &&
        doc2.clauses.some((c) => /PASAL 5/i.test(c.title)),
      `Doc 2 extracts all 5 real articles (Pasal 1 s/d Pasal 5, count=${doc2.clauses.length})`
    );
    assert(
      doc2.clauses.some((c) => /AKBAR MARWAN/i.test(c.meaning) && c.status === 'Needs Attention'),
      'Doc 2 flags High-Risk payment transfer to personal BCA account a.n. AKBAR MARWAN'
    );

    // Step 32c: Test AI Chat on Document 2 (Fee & Bank Account + Parties)
    const chatDoc2FeeRes = await fetch(`${BASE_URL}/api/contracts/${doc2.id}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        question: 'Berapa biaya sewa server colocation dan dibayar ke rekening siapa?',
        lang: 'id',
      }),
    });
    const chatDoc2FeeData = await chatDoc2FeeRes.json();
    assert(chatDoc2FeeRes.status === 200, 'Doc 2 Chat Q1 (Biaya & Rekening) returns 200');
    assert(
      chatDoc2FeeData.data.text.includes('2.500.000') &&
        chatDoc2FeeData.data.text.includes('15.000.000') &&
        /BCA.*MARGONDA/i.test(chatDoc2FeeData.data.text) &&
        /AKBAR MARWAN/i.test(chatDoc2FeeData.data.text),
      'Doc 2 Chat Q1 accurately cites Rp2.500.000/bln (Rp15.000.000/semester) and BCA Cabang Margonda a.n. Akbar Marwan'
    );

    const chatDoc2PartiesRes = await fetch(`${BASE_URL}/api/contracts/${doc2.id}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        question: 'Siapa pihak pertama dan pihak kedua?',
        lang: 'id',
      }),
    });
    const chatDoc2PartiesData = await chatDoc2PartiesRes.json();
    assert(chatDoc2PartiesRes.status === 200, 'Doc 2 Chat Q2 (Parties) returns 200');
    assert(
      /Nina Dewi/i.test(chatDoc2PartiesData.data.text) &&
        /BADAN KEPEGAWAIAN DAERAH PROVINSI KALIMANTAN TIMUR/i.test(chatDoc2PartiesData.data.text) &&
        /Akbar Marwan/i.test(chatDoc2PartiesData.data.text) &&
        /PT\. POWERNET INDOSOLUSI/i.test(chatDoc2PartiesData.data.text),
      'Doc 2 Chat Q2 accurately identifies Dra. Nina Dewi (BKD Kaltim) & Akbar Marwan (PT. Powernet Indosolusi)'
    );

    // Step 32d: Test Subscription Upgrade & Exhibition Reset Endpoints (/api/subscription/upgrade & /api/subscription/reset)
    const upgRes = await fetch(`${BASE_URL}/api/subscription/upgrade`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ promoCode: 'PAMERAN', method: 'QRIS' }),
    });
    const upgData = await upgRes.json();
    assert(upgRes.status === 200 && upgData.success === true, 'POST /api/subscription/upgrade returns 200');
    assert(upgData.data.plan === 'HRD Pro' && upgData.data.promoApplied === true && upgData.data.amountPaid === 0, 'Promo code PAMERAN sets amountPaid=0 and plan=HRD Pro');

    const rstRes = await fetch(`${BASE_URL}/api/subscription/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const rstData = await rstRes.json();
    assert(rstRes.status === 200 && rstData.success === true && rstData.data.plan === 'Free', 'POST /api/subscription/reset restores plan to Free');

    // Cleanup Sequential Test Contracts
    if (doc1 && doc1.id) {
      await fetch(`${BASE_URL}/api/contracts/${doc1.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    if (doc2 && doc2.id) {
      await fetch(`${BASE_URL}/api/contracts/${doc2.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } catch (err) {
    assert(false, `Sequential Doc 1 -> Doc 2 test failed: ${err.message}`);
  }

  // 33. JWT 24-Hour Expiry & Expired Session Auto-Logout Guardrail (SESSION_EXPIRED)
  try {
    const decoded = jwt.decode(token);
    assert(
      decoded && typeof decoded.exp === 'number' && typeof decoded.iat === 'number' && decoded.exp - decoded.iat === 86400,
      `Login JWT payload has 24-hour TTL (exp - iat === 86400, got: ${decoded ? decoded.exp - decoded.iat : 'null'})`
    );

    const expiredToken = jwt.sign(
      { id: 1, name: 'Test Expired', email: 'expired@clariq.id', plan: 'Free' },
      JWT_SECRET,
      { expiresIn: '-10s' }
    );
    const expRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${expiredToken}` },
    });
    const expData = await expRes.json();
    assert(expRes.status === 401, `Expired JWT to GET /api/auth/me returns 401 (got ${expRes.status})`);
    assert(
      expData.code === 'SESSION_EXPIRED' && /Sesi telah berakhir/i.test(expData.error || ''),
      `Expired JWT response returns code: "SESSION_EXPIRED" and Indonesian expiry message`
    );
  } catch (err) {
    assert(false, `JWT 24-hour expiry test failed: ${err.message}`);
  }

  // 34. Hybrid Multi-Key Gemini Client, Bug Fixes ("jam kerjanya", "pdf ... dendanya", "orang awam"), & Silent Local Fallback
  try {
    const keys = getGeminiApiKeys();
    assert(keys.length >= 1, `Multi-key rotation loader detected ${keys.length} unique Gemini API key(s)`);

    const liveGem = await callGeminiApi({
      contents: ['Balas satu kata saja tanpa tanda baca: SIAP'],
      timeoutMs: 8000,
    });
    assert(
      (liveGem.ok === true && liveGem.status === 200) || liveGem.status === 429,
      `Live callGeminiApi reached Google Gemini endpoint cleanly (status: ${liveGem.status}, model: ${liveGem.model || 'rate-limited-429'})`
    );

    // Create test contract with --- HALAMAN 1 --- and --- HALAMAN 2 --- markers
    const pagedKevinText = `--- HALAMAN 1 ---\n${kevinContractText.replace('Pasal 4', '--- HALAMAN 2 ---\nPasal 4')}`;
    const cRes = await fetch(`${BASE_URL}/api/contracts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: 'Kontrak_Kevin_MultiPage',
        fileName: 'Kontrak_Kevin_MultiPage.pdf',
        contractType: 'kerja',
        contractText: pagedKevinText,
        useAICheck: true,
        lang: 'id',
      }),
    });
    const cJson = await cRes.json();
    const pagedContract = cJson.data;
    assert(cRes.status === 201 && pagedContract?.id, 'Multi-page Kevin contract created (201)');

    // 34a. "Bagaimana aturan jam kerjanya?" -> Must answer working hours (NOT rejected!)
    const qJamRes = await fetch(`${BASE_URL}/api/contracts/${pagedContract.id}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        question: 'Bagaimana aturan jam kerjanya?',
        lang: 'id',
      }),
    });
    const qJamData = await qJamRes.json();
    assert(qJamRes.status === 200, 'Chat "Bagaimana aturan jam kerjanya?" returns 200');
    assert(
      !qJamData.data.text.includes('Maaf, saya tidak paham') &&
        (/09\.00|17\.00|40\s*jam|Senin/i.test(qJamData.data.text)) &&
        /Pasal\s*77/i.test(qJamData.data.text),
      'Chat "Bagaimana aturan jam kerjanya?" answers working hours & Pasal 77 accurately'
    );

    // 34b. "di halaman berapa pdf mencantumkan jumlah dendanya" -> Must answer penalty + page/article, NOT 4 platform features, and source points to penalty clause (NOT Pasal 77)
    const qPdfDendaRes = await fetch(`${BASE_URL}/api/contracts/${pagedContract.id}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        question: 'di halaman berapa pdf mencantumkan jumlah dendanya',
        lang: 'id',
      }),
    });
    const qPdfDendaData = await qPdfDendaRes.json();
    assert(qPdfDendaRes.status === 200, 'Chat "di halaman berapa pdf mencantumkan jumlah dendanya" returns 200');
    assert(
      !qPdfDendaData.data.text.includes('4 fitur utama') &&
        qPdfDendaData.data.text.includes('10.000.000') &&
        /Halaman\s*2/i.test(qPdfDendaData.data.text) &&
        /Pasal\s*4/i.test(qPdfDendaData.data.text),
      'Chat "di halaman berapa pdf mencantumkan jumlah dendanya" cites Rp10.000.000 on Halaman 2 (Pasal 4) and is NOT hijacked by platform features'
    );
    const citedClause = pagedContract.clauses?.[qPdfDendaData.data.source];
    assert(
      qPdfDendaData.data.source !== null &&
        citedClause &&
        !/Pasal\s*77/i.test(`${citedClause.source || ''} ${citedClause.sourceId || ''}`) &&
        /denda|10\.000\.000|Pasal\s*36|Putusan\s*MK/i.test(
          `${citedClause.text || ''} ${citedClause.meaning || ''} ${citedClause.source || ''}`
        ),
      `Penalty query citation source (${qPdfDendaData.data.source}) points to the Penalty clause, NOT Pasal 77`
    );

    // 34c. "ini surat apa? jelasin isinya secara singkat buat orang awam" -> Must summarize contract in plain language
    const qAwamRes = await fetch(`${BASE_URL}/api/contracts/${pagedContract.id}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        question: 'ini surat apa? jelasin isinya secara singkat buat orang awam',
        lang: 'id',
      }),
    });
    const qAwamData = await qAwamRes.json();
    assert(qAwamRes.status === 200, 'Chat "ini surat apa? jelasin isinya secara singkat buat orang awam" returns 200');
    assert(
      !qAwamData.data.text.includes('Maaf, saya tidak paham') &&
        /Nana Pertiwi|Kevin Birowo|Bintang Maju Bersama/i.test(qAwamData.data.text) &&
        /8\.000\.000|10\.000\.000/i.test(qAwamData.data.text),
      'Layman summary query clearly explains the contract parties, compensation, and key risks'
    );

    // 34d. Verify Direct Silent Local Fallback (chatWithAnalyzedContract) 100% offline accuracy
    const localJam = chatWithAnalyzedContract({
      contract: pagedContract,
      question: 'Bagaimana aturan jam kerjanya?',
      lang: 'id',
    });
    const localDendaPage = chatWithAnalyzedContract({
      contract: pagedContract,
      question: 'di halaman berapa pdf mencantumkan jumlah dendanya',
      lang: 'id',
    });
    const localAwam = chatWithAnalyzedContract({
      contract: pagedContract,
      question: 'ini surat apa? jelasin isinya secara singkat buat orang awam',
      lang: 'id',
    });
    const localOos = chatWithAnalyzedContract({
      contract: pagedContract,
      question: 'siapa jokowi?',
      lang: 'id',
    });
    const localPenaltyClause = pagedContract.clauses?.[localDendaPage.source];
    assert(
      localJam.text.includes('Pasal 77') &&
        localDendaPage.text.includes('10.000.000') &&
        /Halaman\s*2/i.test(localDendaPage.text) &&
        localDendaPage.source !== null &&
        localPenaltyClause &&
        !/Pasal\s*77/i.test(`${localPenaltyClause.source || ''} ${localPenaltyClause.sourceId || ''}`) &&
        /Kevin Birowo/i.test(localAwam.text) &&
        localOos.source === null &&
        localOos.text.includes('Maaf, saya tidak paham maksud Anda'),
      'Silent Local Fallback (chatWithAnalyzedContract) passes all 4 new test cases 100% offline'
    );

    // Cleanup
    await fetch(`${BASE_URL}/api/contracts/${pagedContract.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    assert(false, `Hybrid Gemini & Chatbot fixes test failed: ${err.message}`);
  }

  // 35. Unified Final Sprint: Ticket 4 DoD (Kasus Uji 1 Kerjasama + Hash Title + Expired Audit, Kasus Uji 2 Proyeksi Kerja, Kasus Uji 3 Unseen Sewa Ruko)
  try {
    // 35a. Kasus Uji 1 — Kontrak Kerjasama (BKD Kaltim, hash filename, --- HALAMAN --- markers, expired year 2021)
    const bkdPagedText = [
      '--- HALAMAN 1 ---',
      'PEMERINTAH PROVINSI KALIMANTAN TIMUR - BADAN KEPEGAWAIAN DAERAH',
      'SURAT PERJANJIAN KERJASAMA',
      'Nomor : 800/I.2-45/BKD/2021',
      'I. Nama : Dra. Nina Dewi, MAP.',
      'Jabatan : Kuasa Pengguna Anggaran',
      'Dalam hal ini bertindak untuk dan atas nama BADAN KEPEGAWAIAN DAERAH PROVINSI KALIMANTAN TIMUR selanjutnya disebut PIHAK PERTAMA.',
      'II. Nama : Akbar Marwan',
      'Jabatan : Account Executive',
      'Dalam hal ini bertindak untuk dan atas nama PT. POWERNET INDOSOLUSI selanjutnya disebut PIHAK KEDUA.',
      'PASAL 1\nLINGKUP PERJANJIAN KERJASAMA\nPihak Pertama menyerahkan tugas kepada Pihak Kedua untuk mengelola Server Colocation BKD.',
      'PASAL 2\nKEWAJIBAN PIHAK KEDUA\n1. PIHAK KEDUA memfasilitasi serta memelihara Server selama 1 Tahun mulai bulan Januari sampai dengan Desember 2021.',
      '--- HALAMAN 2 ---',
      'PASAL 3\nKEWAJIBAN PIHAK PERTAMA\n1. PIHAK PERTAMA membayar jasa sewa sebesar Rp. 2.500.000,- per bulan sudah termasuk pajak, dilakukan per semester Rp. 2.500.000 x 6 bln = Rp. 15.000.000,- melalui transfer:\nBANK : BCA CABANG MARGONDA\nAtas Nama : AKBAR MARWAN\nNomor Rekening : 869-004-6572;',
      'PASAL 4\nLAIN-LAIN\n1. Hal yang belum diatur akan diatur dalam Surat Perjanjian Tambahan (addendum).\n2. Dibuat di atas kertas bermaterai Rp. 6000,-.',
    ].join('\n');

    const k1Res = await fetch(`${BASE_URL}/api/contracts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fileName: '77801e1a64d6447d79328683635c1481.pdf',
        contractType: 'kerja',
        contractText: bkdPagedText,
        useAICheck: true,
        lang: 'id',
      }),
    });
    const k1Json = await k1Res.json();
    const k1 = k1Json.data;
    assert(k1Res.status === 201 && k1?.id, 'Kasus Uji 1 (BKD Kaltim hash PDF) created (201)');
    assert(
      !/77801e1a64d6447d79328683635c1481/i.test(k1.name) && /Perjanjian Kerjasama/i.test(k1.name),
      `Hash filename automatically replaced with clean title (got: ${k1.name})`
    );
    assert(
      k1.clauses.every((c) => !/---\s*HALAMAN/i.test(c.original || '') && !/---\s*HALAMAN/i.test(c.text || '')),
      'Zero "--- HALAMAN X ---" artifacts inside clauses[].original or clauses[].text'
    );
    assert(
      /telah berakhir/i.test(k1.summary || '') && k1.meta.isExpired === true,
      'Expired contract audit detects contract period has ended in summary & meta.isExpired'
    );

    const k1CostRes = await fetch(`${BASE_URL}/api/contracts/${k1.id}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ question: 'Berapa total biaya setahun?', lang: 'id' }),
    });
    const k1CostData = await k1CostRes.json();
    assert(
      k1CostRes.status === 200 &&
        k1CostData.data.text.includes('30.000.000') &&
        !k1CostData.data.text.includes('TEMUAN RISIKO TINGGI') &&
        k1CostData.data.text.includes('\n'),
      'Kasus Uji 1 Chat "Berapa total biaya setahun?" returns 30.000.000 with newlines and without dumping TEMUAN RISIKO TINGGI'
    );

    const k1ResignRes = await fetch(`${BASE_URL}/api/contracts/${k1.id}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ question: 'Apakah ada denda jika resign?', lang: 'id' }),
    });
    const k1ResignData = await k1ResignRes.json();
    assert(
      k1ResignRes.status === 200 &&
        /bukan kontrak kerja|tidak berlaku/i.test(k1ResignData.data.text) &&
        k1ResignData.data.source === null,
      'Kasus Uji 1 Chat "Apakah ada denda jika resign?" clarifies non-employment contract and returns source === null'
    );

    // 35b. Kasus Uji 2 — Proyeksi Kontrak Kerja (Kevin Birowo, Rp8.000.000/bulan, denda Rp10.000.000 sekali bayar)
    const k2Res = await fetch(`${BASE_URL}/api/contracts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: 'Kontrak Kerja Proyeksi Test',
        contractType: 'kerja',
        contractText: kevinContractText,
        useAICheck: true,
        lang: 'id',
      }),
    });
    const k2 = (await k2Res.json()).data;
    assert(k2Res.status === 201 && k2?.id, 'Kasus Uji 2 (Kevin Birowo) created (201)');

    const k2Salary5yRes = await fetch(`${BASE_URL}/api/contracts/${k2.id}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ question: 'dalam 5 tahun gajiku berapa?', lang: 'id' }),
    });
    const k2Salary5yData = await k2Salary5yRes.json();
    assert(
      k2Salary5yRes.status === 200 &&
        k2Salary5yData.data.text.includes('480.000.000') &&
        !k2Salary5yData.data.text.includes('Maaf, saya tidak paham'),
      'Kasus Uji 2 Chat "dalam 5 tahun gajiku berapa?" computes Rp480.000.000 without false refusal'
    );

    const k2PenaltyYearRes = await fetch(`${BASE_URL}/api/contracts/${k2.id}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ question: 'dalam setahun total denda berapa?', lang: 'id' }),
    });
    const k2PenaltyYearData = await k2PenaltyYearRes.json();
    assert(
      k2PenaltyYearRes.status === 200 &&
        k2PenaltyYearData.data.text.includes('10.000.000') &&
        /sekali bayar|satu kali|bukan biaya rutin|tidak bersifat tahunan/i.test(k2PenaltyYearData.data.text),
      'Kasus Uji 2 Chat "dalam setahun total denda berapa?" explains Rp10.000.000 is a one-time penalty, not annual recurring fee'
    );

    const k2PureMathRes = await fetch(`${BASE_URL}/api/contracts/${k2.id}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ question: '1 + 1 = berapa?', lang: 'id' }),
    });
    const k2PureMathData = await k2PureMathRes.json();
    assert(
      k2PureMathRes.status === 200 &&
        k2PureMathData.data.text.includes('Maaf, saya tidak paham maksud Anda') &&
        k2PureMathData.data.source === null,
      'Kasus Uji 2 Chat "1 + 1 = berapa?" (pure math without contract context) is still rejected with source === null'
    );

    // 35c. Kasus Uji 3 — Unseen Contract Generalization Test (Perjanjian Sewa Ruko Komersial Rp60.000.000/tahun)
    const unseenRukoText = [
      'PERJANJIAN SEWA RUKO KOMERSIAL',
      'Nomor : 012/SEWA-RUKO/XI/2026',
      'Pada hari ini disepakati perjanjian sewa menyewa ruko komersial antara:',
      'I. Nama : Direktur PT Maju Sejahtera',
      'Jabatan : Pemilik Ruko',
      'Dalam hal ini bertindak untuk dan atas nama PT Maju Sejahtera selanjutnya disebut PIHAK PERTAMA.',
      'II. Nama : Bapak Hendra Wijaya',
      'Jabatan : Penyewa',
      'Dalam hal ini bertindak untuk dan atas nama diri sendiri selanjutnya disebut PIHAK KEDUA.',
      'PASAL 1\nOBJEK & JANGKA WAKTU SEWA\nPihak Pertama menyewakan Ruko 2 lantai kepada Pihak Kedua selama 2 tahun mulai 1 Januari 2027 sampai dengan 31 Desember 2028.',
      'PASAL 2\nBIAYA SEWA & DEPOSIT\n1. Biaya sewa disepakati sebesar Rp60.000.000 per tahun dibayarkan di muka.\n2. Pihak Kedua menyerahkan uang deposit keamanan sebesar Rp10.000.000 yang dikembalikan pada akhir masa sewa.',
    ].join('\n');

    const k3Res = await fetch(`${BASE_URL}/api/contracts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: 'Sewa Ruko Komersial PT Maju Sejahtera',
        contractType: 'kerja',
        contractText: unseenRukoText,
        useAICheck: true,
        lang: 'id',
      }),
    });
    const k3 = (await k3Res.json()).data;
    assert(k3Res.status === 201 && k3?.id, 'Kasus Uji 3 (Unseen Ruko Lease) created (201)');
    assert(
      k3.type === 'Rental' && k3.typeId === 'Sewa Menyewa' && !/40 jam\/minggu/i.test(k3.meta.workingHours || ''),
      `Unseen Ruko Lease auto-detected as Sewa Menyewa without fake employee working hours (got: ${k3.typeId})`
    );

    const k3Rent3yRes = await fetch(`${BASE_URL}/api/contracts/${k3.id}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ question: 'Berapa total biaya sewa selama 3 tahun?', lang: 'id' }),
    });
    const k3Rent3yData = await k3Rent3yRes.json();
    assert(
      k3Rent3yRes.status === 200 && k3Rent3yData.data.text.includes('180.000.000'),
      'Kasus Uji 3 Chat "Berapa total biaya sewa selama 3 tahun?" calculates Rp180.000.000'
    );

    const k3ResignRes = await fetch(`${BASE_URL}/api/contracts/${k3.id}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ question: 'Apakah ada denda jika resign?', lang: 'id' }),
    });
    const k3ResignData = await k3ResignRes.json();
    assert(
      k3ResignRes.status === 200 && /sewa|bukan kontrak kerja|bukan perjanjian kerja/i.test(k3ResignData.data.text),
      'Kasus Uji 3 Chat "Apakah ada denda jika resign?" clarifies this is a lease agreement, not an employment contract'
    );

    // Cleanup Kasus Uji 1, 2, 3
    for (const cid of [k1.id, k2.id, k3.id]) {
      await fetch(`${BASE_URL}/api/contracts/${cid}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    // 36. Cascade Delete Important Dates & Orphan Cleanup Regression Test
    console.log('\n[36] Testing Cascade Delete Important Dates & Orphan Cleanup...');
    const cascadeCreateRes = await fetch(`${BASE_URL}/api/contracts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: 'Cascade_Test_Contract.pdf',
        contractText: 'PERJANJIAN SEWA\nMasa sewa berlaku sampai 12 Desember 2027 dengan biaya Rp10.000.000 per bulan.',
        useAICheck: false,
        lang: 'id',
      }),
    });
    const cascadeContract = (await cascadeCreateRes.json()).data;
    assert(cascadeCreateRes.status === 201 && cascadeContract?.id, 'Cascade test contract created (201)');

    const datesBeforeRes = await fetch(`${BASE_URL}/api/dates`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const datesBeforeData = await datesBeforeRes.json();
    const matchedBefore = (datesBeforeData.data || []).filter((d) => String(d.contractId) === String(cascadeContract.id));
    assert(
      datesBeforeRes.status === 200 && matchedBefore.length > 0,
      `GET /api/dates returns > 0 dates (${matchedBefore.length}) linked to new contractId=${cascadeContract.id}`
    );
    assert(
      matchedBefore.every((d) => d.contractName && !/^\d+$/.test(String(d.contract))),
      'GET /api/dates joins valid contractName/contract without exposing raw numeric contractId'
    );

    const cascadeDelRes = await fetch(`${BASE_URL}/api/contracts/${cascadeContract.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(cascadeDelRes.status === 200, 'DELETE /api/contracts/:id succeeds (200)');

    const datesAfterRes = await fetch(`${BASE_URL}/api/dates`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const datesAfterData = await datesAfterRes.json();
    const matchedAfter = (datesAfterData.data || []).filter((d) => String(d.contractId) === String(cascadeContract.id));
    assert(
      datesAfterRes.status === 200 && matchedAfter.length === 0,
      `GET /api/dates returns 0 items for deleted contractId=${cascadeContract.id} (cascade delete verified)`
    );
  } catch (err) {
    assert(false, `Unified Final Sprint Ticket 4 DoD tests failed: ${err.message}`);
  }

  console.log('\n--- TEST RESULTS SUMMARY ---');
  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;
  console.log(`Total tests: ${results.length}`);
  console.log(`Passed: ${passed}/${results.length}`);
  console.log(`Failed: ${failed}/${results.length}`);
}

runTests();
