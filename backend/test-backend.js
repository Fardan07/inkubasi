import fs from 'fs';

const BASE_URL = 'http://localhost:5000';

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

    // Clause verification
    const penaltyClause = data.data.clauses.find((c) => /10\.000\.000|denda|pelatihan/i.test(c.text + ' ' + c.meaning));
    assert(Boolean(penaltyClause), 'Pasal 4 denda Rp10.000.000 is detected in clauses');
    assert(penaltyClause && (penaltyClause.status === 'Needs Attention' || penaltyClause.statusId === 'Perlu Perhatian' || penaltyClause.risiko === 'tinggi'), 'Pasal 4 clause is flagged as High Risk');
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
      assert(data.data.text.toLowerCase().includes('melebihi') || data.data.text.toLowerCase().includes('tidak proporsional'), 'Chat Q4 flags that fine exceeds monthly salary');
      assert(data.data.text.includes('PP No. 35/2021') || data.data.text.includes('MK'), 'Chat Q4 cites PP 35/2021 / Putusan MK');
    } catch (err) {
      assert(false, `Chat Q4 failed: ${err.message}`);
    }

    // Q5: Identitas Pihak & Jabatan
    try {
      const res = await fetch(`${BASE_URL}/api/contracts/${kevinContractId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: 'Siapa para pihak dalam kontrak ini dan apa jabatan saya?',
          lang: 'id',
        }),
      });
      const data = await res.json();
      assert(res.status === 200, 'Chat Q5 (Parties & Role) returns 200');
      assert(data.data.text.includes('Nana Pertiwi') || data.data.text.includes('Bintang Maju'), 'Chat Q5 mentions Nana Pertiwi / PT. Bintang Maju Bersama');
      assert(data.data.text.includes('Kevin Birowo'), 'Chat Q5 mentions Kevin Birowo');
      assert(data.data.text.includes('Supply Chain Manager'), 'Chat Q5 mentions Supply Chain Manager');
    } catch (err) {
      assert(false, `Chat Q5 failed: ${err.message}`);
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

  console.log('\n--- TEST RESULTS SUMMARY ---');
  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;
  console.log(`Total tests: ${results.length}`);
  console.log(`Passed: ${passed}/${results.length}`);
  console.log(`Failed: ${failed}/${results.length}`);
}

runTests();
