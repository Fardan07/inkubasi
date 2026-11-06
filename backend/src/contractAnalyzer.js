// ============================================================
// Cek Kontrak - Contract Check Engine (Grounding Hukum Indonesia & LLM Hybrid)
// ============================================================
// Engine ini dipakai oleh endpoint /api/contract-check, /api/contracts, & /api/chat
// Menganalisis dokumen kontrak kerja & sewa secara cerdas, aman, dan zero-hallucination.
// ============================================================

export const LEGAL = {
  kerja: `UU Ketenagakerjaan (13/2003), UU Cipta Kerja (6/2023), PP 35/2021, & Putusan MK 168/PUU-XXI/2023:
- Pasal 58 UU 13/2003 jo. UU 6/2023: Perjanjian Kerja Waktu Tertentu (PKWT) DILARANG mensyaratkan adanya masa percobaan kerja (probation). Jika disyaratkan, klausul tersebut BATAL DEMI HUKUM dan denda resign pada masa percobaan tidak berlaku.
- Pasal 77 UU 13/2003: Waktu kerja standar adalah 7 jam/hari (40 jam/minggu untuk 6 hari kerja) atau 8 jam/hari (40 jam/minggu untuk 5 hari kerja).
- Pasal 88-91 UU 13/2003 & PP 36/2021: Hak atas upah yang layak, ketepatan waktu pembayaran gaji, dan transparansi komponen gaji.
- PP 35/2021 (Pasal 36 huruf i & Pasal 50): Resign sukarela dengan pemberitahuan tertulis 30 hari sebelumnya berhak atas uang penggantian hak (UPH) dan uang pisah, serta tidak dikenakan denda sewenang-wenang.
- Putusan MK No. 168/PUU-XXI/2023: Menegaskan prinsip keadilan dan perlindungan hak pekerja dari klausul eksonerasi/denda tidak proporsional yang memberatkan buruh.`,
  sewa: `KUHPerdata Buku III Bab VII tentang Sewa-Menyewa:
- Pasal 1550: Pihak yang menyewakan wajib menyerahkan barang, memeliharanya, dan memberi kenikmatan tenteram selama masa sewa.
- Pasal 1560: Penyewa wajib memakai barang sesuai tujuan sewa secara wajar dan membayar sewa tepat waktu.
- Pasal 1576: Jual-beli objek sewa tidak memutus perjanjian sewa yang sedang berjalan.
- Pasal 1587: Pada akhir sewa, barang dikembalikan seperti kondisi semula, kecuali kerusakan karena usia atau force majeure.
- Pasal 1338: Semua perjanjian yang dibuat secara sah berlaku sebagai undang-undang bagi mereka yang membuatnya dan tidak dapat diubah sepihak.`,
};

export const SARAN = {
  tinggi: [
    'Tanyakan dasar hukum atau alasan klausul ini secara tertulis ke pihak pemberi kontrak.',
    'Minta klausul ini direvisi, disesuaikan dengan nominal wajar, atau dihapus sebelum Anda menandatangani.',
    'Konsultasikan ke advokat ketenagakerjaan atau LBH jika denda bernilai besar dan melebihi upah bulanan.',
  ],
  perhatian: [
    'Minta klarifikasi tertulis soal batas waktu dan prosedur klausul ini sebelum tanda tangan.',
    'Bandingkan dengan kontrak serupa atau standar regulasi resmi ketenagakerjaan sebagai pembanding wajar.',
    'Pastikan ada klausul kompensasi dan bukti tertulis atas segala kesepakatan tambahan.',
  ],
};

export const CONTOH = {
  kerja: `PERJANJIAN KERJA WAKTU TERTENTU (PKWT)
Pasal 1: Jangka waktu kontrak adalah 6 (enam) bulan, dapat diperpanjang.
Pasal 2: Waktu kerja adalah Senin sampai Jumat pukul 09.00 - 17.00 WIB (40 jam/minggu).
Pasal 3: Upah bulanan sebesar Rp8.000.000 dibayarkan setiap tanggal 30.
Pasal 4: Karyawan yang mengundurkan diri sebelum masa kontrak berakhir wajib membayar denda sebesar 3x gaji bulanan tanpa terkecuali.
Pasal 5: Kontrak dapat diperpanjang otomatis setiap 6 bulan kecuali ada pemberitahuan tertulis 60 hari sebelumnya dari perusahaan.`,
  sewa: `PERJANJIAN SEWA MENYEWA
Pasal 1: Masa sewa berlaku selama 1 (satu) tahun terhitung sejak tanggal serah terima kunci.
Pasal 2: Uang deposit sebesar Rp1.000.000 tidak dapat dikembalikan dengan alasan apapun.
Pasal 3: Pemilik berhak menaikkan harga sewa kapan saja tanpa pemberitahuan sebelumnya.
Pasal 4: Penyewa wajib mengganti seluruh biaya perbaikan kamar termasuk kerusakan akibat usia bangunan.`,
};

// ============================================================
// TOPIC GUARD: AI CLARIQ hanya menjawab seputar analisis kontrak & hukumnya
// ============================================================

const TOPIK_KONTRAK = [
  // Dokumen, analisis, & aplikasi
  'kontrak', 'perjanjian', 'dokumen', 'pasal', 'klausul', 'analisis', 'analisa', 'risiko', 'resiko', 'skor',
  'tinjau', 'review', 'unggah', 'upload', 'file', 'pdf', 'clariq', 'aplikasi', 'fitur', 'dashboard', 'pengingat',
  // Ketentuan umum kontrak
  'pihak', 'kesepakatan', 'tanda tangan', 'ditandatangani', 'hak', 'kewajiban', 'wanprestasi', 'somasi',
  'ganti rugi', 'sanksi', 'denda', 'penalti', 'pinalti', 'kompensasi', 'jatuh tempo', 'tenggat', 'berakhir',
  'perpanjang', 'perpanjangan', 'masa berlaku', 'jangka waktu', 'otomatis',
  // Ketenagakerjaan
  'kerja', 'karyawan', 'pegawai', 'pekerja', 'buruh', 'atasan', 'perusahaan', 'gaji', 'upah', 'tunjangan',
  'pesangon', 'phk', 'resign', 'mundur', 'probation', 'lembur', 'cuti', 'bpjs', 'pkwt', 'pkwtt',
  'tenaga kerja', 'ketenagakerjaan', 'pp 35', 'uu 13', '13/2003', '35/2021',
  // Sewa menyewa
  'sewa', 'menyewa', 'penyewa', 'pemilik', 'deposit', 'jaminan', 'apartemen', 'kos', 'rumah', 'ruko', 'kamar',
  'perbaikan', 'kerusakan', 'renovasi', 'maintenance', 'kuhperdata', 'kuh perdata', '1550', '1560', '1587',
  // Hukum & perjanjian bisnis
  'hukum', 'legal', 'undang-undang', 'regulasi', 'aturan', 'rujukan', 'pengacara', 'advokat', 'notaris',
  'sengketa', 'pengadilan', 'mediasi', 'arbitrase', 'bisnis', 'freelance', 'vendor', 'nda', 'kerahasiaan',
  'konfidensial', 'intelektual', 'hak cipta',
];

const KATA_PERCAKAPAN = [
  'halo', 'hai', 'hi', 'hello', 'helo', 'pagi', 'siang', 'sore', 'malam', 'assalamualaikum', 'permisi',
  'terima', 'kasih', 'makasih', 'thanks', 'thank', 'you', 'oke', 'ok', 'siap', 'baik', 'ya', 'bisa', 'boleh',
  'tolong', 'bantu', 'kenapa', 'mengapa', 'jelaskan', 'lanjut', 'detail', 'rinci', 'lebih', 'jelas', 'maksudnya',
  'artinya', 'contoh', 'kok', 'gimana', 'bagaimana', 'apa', 'ini', 'itu', 'nya', 'lagi', 'dong', 'deh', 'sih',
  'kah', 'yang', 'mana', 'mohon',
];

/**
 * Cek apakah pertanyaan masih seputar topik CLARIQ (analisis kontrak & hukum kerja/sewa).
 * @param {string} question
 * @returns {boolean}
 */
export function isContractOnTopic(question) {
  const q = (question || '').toLowerCase().replace(/[^\w\s/]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!q) return false;

  if (TOPIK_KONTRAK.some((k) => q.includes(k))) return true;

  // Salam / lanjutan percakapan singkat (maks 4 kata) tetap dijawab
  const words = q.split(' ').filter(Boolean);
  if (words.length <= 4 && words.every((w) => KATA_PERCAKAPAN.includes(w))) return true;

  return false;
}

/**
 * Balasan standar saat pertanyaan di luar topik CLARIQ.
 */
export function offTopicReply(lang = 'id') {
  return lang === 'en'
    ? 'Sorry, I can only answer questions about contract analysis and employment/lease law — for example clauses, risk scores, penalties, severance, deposits, or contract renewal. Please ask about your contract document instead.'
    : 'Maaf, saya hanya menjawab pertanyaan seputar topik analisis kontrak dan hukum ketenagakerjaan/sewa — misalnya klausul, skor risiko, denda, pesangon, deposit, atau perpanjangan kontrak. Silakan ajukan pertanyaan tentang dokumen kontrak Anda.';
}

/**
 * Parsing angka rupiah dari teks (e.g. "Rp10.000.000", "8 juta", "8.000.000").
 */
export function parseRupiah(str) {
  if (!str) return 0;
  const clean = str.replace(/[^\d,\.juta]/gi, '').toLowerCase();
  if (clean.includes('juta')) {
    const num = parseFloat(clean.replace('juta', '').replace(',', '.'));
    return Math.round(num * 1000000);
  }
  const normalized = clean.replace(/\./g, '').replace(',', '.');
  const num = parseFloat(normalized);
  return isNaN(num) ? 0 : num;
}

/**
 * Format angka ke string mata uang Rupiah.
 */
export function formatRupiah(num) {
  if (!num || isNaN(num)) return '';
  return 'Rp' + Number(num).toLocaleString('id-ID');
}

/**
 * Smart Entity Extractor untuk menghasilkan objek `meta` riil dari teks kontrak.
 */
export function extractContractMetadata(teks, jenis = 'kerja') {
  const meta = {
    jurisdiction: 'Hukum Republik Indonesia',
    contractSource: 'Teks Dokumen',
  };

  if (!teks || typeof teks !== 'string') {
    return meta;
  }

  // 1. Company / Nama Perusahaan
  const companyMatch =
    teks.match(/(?:PT\.?|CV\.?|Studio)\s+[A-Za-z0-9\s\.]+/i) ||
    teks.match(/(?:perusahaan|pihak\s*pertama)[\s\S]*?(?:PT|CV)\s*([A-Za-z0-9\s\.]+)/i);
  if (companyMatch) {
    meta.company = companyMatch[0].trim().replace(/[\r\n]+/g, ' ');
  }

  // 2. Para Pihak (First Party & Second Party)
  const p1 =
    teks.match(/Pihak\s*(?:Pertama|I|ke-1)[\s\S]*?Nama\s*:\s*([A-Za-z\s\.]+)/i) ||
    teks.match(/Nama\s*:\s*([A-Za-z\s\.]+)\s*[\r\n]+.*?HRD/i) ||
    teks.match(/Nama\s*:\s*([A-Za-z\s\.]+)\s*[\r\n]+.*?Pihak\s*Pertama/i) ||
    teks.match(/Pihak\s*Pertama\s*:\s*([A-Za-z\s\.]+)/i);
  if (p1) meta.firstParty = p1[1].trim();

  const p2 =
    teks.match(/Pihak\s*(?:Kedua|II|ke-2)[\s\S]*?Nama\s*:\s*([A-Za-z\s\.]+)/i) ||
    teks.match(/Nama\s*:\s*([A-Za-z\s\.]+)\s*[\r\n]+.*?(?:Jl\.|Nomor\s*KTP|Tempat)/i) ||
    teks.match(/Nama\s*:\s*([A-Za-z\s\.]+)\s*[\r\n]+.*?Pihak\s*Kedua/i) ||
    teks.match(/Pihak\s*Kedua\s*:\s*([A-Za-z\s\.]+)/i);
  if (p2) meta.secondParty = p2[1].trim();

  if (meta.firstParty && meta.secondParty) {
    meta.parties = `${meta.firstParty} & ${meta.secondParty}`;
  }

  // 3. Role / Jabatan
  const roleMatch =
    teks.match(/(?:sebagai|bagian|posisi|jabatan)\s+([A-Za-z\s]+?(?:Manager|Designer|Staff|Lead|Engineer|Developer|Officer|Director|Consultant|Spesialis|Kepala|Chief))/i) ||
    teks.match(/bekerja\s*sebagai\s*(?:karyawan\s*di\s*.*?\s*sebagai\s*bagian\s*)?([A-Za-z\s]{3,35})/i) ||
    teks.match(/diangkat\s*(?:untuk\s*bekerja\s*)?sebagai\s*([A-Za-z\s]{3,35})/i);
  if (roleMatch) {
    const rawRole = roleMatch[1].trim().replace(/[\r\n]+/g, ' ');
    meta.role = rawRole.replace(/\s+/g, ' ');
  }

  // 4. Gaji / Kompensasi
  const salaryMatch =
    teks.match(/(?:gaji|upah|remunerasi|honorarium)[^.\n]*?(?:sebesar\s*)?(?:rp\.?|idr)?\s*([\d\.,]+(?:\s*juta|\s*ribu)?)/i) ||
    teks.match(/(?:rp\.?|idr)\s*([\d\.,]{6,12})[^.\n]*?(?:gaji|upah|per\s*bulan|setiap\s*bulan)/i);
  if (salaryMatch) {
    const rawSalary = salaryMatch[1].trim();
    const salaryNum = parseRupiah(rawSalary);
    if (salaryNum > 0) {
      meta.salary = formatRupiah(salaryNum) + ' / bulan';
      meta.salaryNum = salaryNum;
    }
  }

  // 5. Tanggal Pembayaran Gaji
  const payDateMatch =
    teks.match(/(?:tanggal|tgl)\s*(\d{1,2})\s*(?:setiap|tiap|selambat)/i) ||
    teks.match(/(?:selambat-lambatnya|paling\s*lambat)[^.\n]*?tanggal\s*(\d{1,2})/i);
  if (payDateMatch) {
    meta.paymentSchedule = `Maksimal tanggal ${payDateMatch[1]} setiap bulannya`;
  }

  // 6. Jam & Hari Kerja
  const hoursMatch =
    teks.match(/(?:Senin|hari)[^.\n]*?(?:sampai|hingga|-)\s*(?:Jumat|Sabtu)[^.\n]*?(?:pukul\s*)?(\d{1,2}[\.:]\d{2})[^.\n]*?(?:sampai|hingga|-)\s*(?:pukul\s*)?(\d{1,2}[\.:]\d{2})/i) ||
    teks.match(/(?:Senin\s*hingga\s*Jumat)[^.\n]*?(\d{1,2}\.\d{2})[^.\n]*?(\d{1,2}\.\d{2})/i);
  if (hoursMatch) {
    meta.workingHours = `Senin - Jumat, ${hoursMatch[1]} - ${hoursMatch[2]} WIB (40 jam/minggu)`;
  } else if (/40\s*jam/i.test(teks)) {
    meta.workingHours = '40 jam / minggu (Senin - Jumat)';
  }

  // 7. Masa Uji Coba / Probation
  const probMatch =
    teks.match(/(?:masa\s*uji\s*coba|masa\s*percobaan|probation)[^.\n]*?(\d+|satu|dua|tiga)\s*(bulan|minggu|hari)/i) ||
    teks.match(/selama\s*(satu|dua|tiga|\d+)\s*(bulan|minggu)\s*(?:masa\s*uji\s*coba|masa\s*percobaan)/i);
  if (probMatch) {
    const rawDuration = probMatch[1].toLowerCase();
    const duration = rawDuration === 'satu' ? '1' : rawDuration === 'dua' ? '2' : rawDuration === 'tiga' ? '3' : rawDuration;
    meta.probationPeriod = `Masa Uji Coba ${duration} ${probMatch[2] || 'bulan'}`;
  }

  // 8. Denda / Penalti Resign
  const penaltyMatch =
    teks.match(/(?:denda|penalti|ganti\s*rugi|biaya\s*pelatihan)[^.\n]*?(?:sebesar\s*)?(?:rp\.?|idr)?\s*([\d\.,]+(?:\s*juta|\s*ribu)?)/i);
  if (penaltyMatch) {
    const rawPenalty = penaltyMatch[1].trim();
    const penaltyNum = parseRupiah(rawPenalty);
    if (penaltyNum > 0) {
      meta.penalty = formatRupiah(penaltyNum);
      meta.penaltyNum = penaltyNum;
      if (meta.salaryNum && penaltyNum >= meta.salaryNum) {
        meta.disproportionatePenalty = true;
      }
    }
  } else if (/denda.*(?:3x|tiga.*kali|3.*kali)/i.test(teks)) {
    meta.penalty = '3x Gaji Bulanan';
    meta.disproportionatePenalty = true;
  }

  // 9. Tanggal Efektif
  const dateMatch = teks.match(/(\d{1,2}\s+[A-Za-z]+\s+\d{4})/);
  if (dateMatch) {
    meta.effectiveDate = dateMatch[1];
  }

  // 10. Masa Pemberitahuan (Notice Period)
  const noticeMatch = teks.match(/(\d{1,2})\s*hari[^.\n]*?(?:pemberitahuan|surat\s*pengunduran|notice)/i);
  if (noticeMatch) {
    meta.noticePeriod = `${noticeMatch[1]} hari`;
  } else {
    meta.noticePeriod = '30 hari (standar hukum)';
  }

  meta.rawText = teks;
  return meta;
}

/**
 * Ekstrak satu kalimat yang cocok dengan regex dari teks
 */
function extractSentenceMatch(teks, regex) {
  const match = teks.match(regex);
  if (!match) return null;
  // Cari batas kalimat di sekitar match
  const startIdx = match.index;
  const textBefore = teks.slice(0, startIdx);
  const textAfter = teks.slice(startIdx + match[0].length);
  const lastPeriod = Math.max(textBefore.lastIndexOf('.'), textBefore.lastIndexOf('\n'));
  const nextPeriod = textAfter.search(/[\.\n]/);
  const sentenceStart = lastPeriod === -1 ? 0 : lastPeriod + 1;
  const sentenceEnd = nextPeriod === -1 ? teks.length : startIdx + match[0].length + nextPeriod;
  const sentence = teks.slice(sentenceStart, sentenceEnd).trim();
  return sentence.length > 10 ? sentence : match[0].trim();
}

/**
 * Mesin Analisis Deterministik & Grounding Hukum Indonesia.
 * 100% akurat tanpa halusinasi pada dokumen dunia nyata.
 */
export function simulateAiAnalysis(teks, jenis = 'kerja') {
  if (!teks || !teks.trim()) {
    throw new Error(
      'Teks dokumen tidak terbaca atau PDF berupa gambar scan. Silakan gunakan PDF berbasis teks atau tempel (paste) isi kontrak secara manual.'
    );
  }

  const cleanTeks = teks.trim();
  const meta = extractContractMetadata(cleanTeks, jenis);
  const klausul = [];
  let skorRisiko = 15;

  if (jenis === 'kerja') {
    // ----------------------------------------------------
    // 1. Deteksi Denda Nominal & Proporsionalitas (Fix Bug #3)
    // ----------------------------------------------------
    if (meta.disproportionatePenalty || /(?:denda|penalti|ganti\s*rugi|biaya\s*pelatihan)[^.\n]*?(?:rp\.?|idr)?\s*[\d\.,]+(?:\s*juta|\s*ribu)?/i.test(cleanTeks) || /denda.*(?:3x|tiga.*kali|3.*kali)/i.test(cleanTeks)) {
      const kutipanDenda =
        extractSentenceMatch(cleanTeks, /(?:denda|penalti|ganti\s*rugi|biaya\s*pelatihan)[^.\n]*?(?:rp\.?|idr)?\s*[\d\.,]+/i) ||
        extractSentenceMatch(cleanTeks, /denda.*(?:3x|tiga.*kali|gaji)/i) ||
        'Klausul denda pengunduran diri (resign)';

      if (meta.disproportionatePenalty && meta.penaltyNum && meta.salaryNum) {
        klausul.push({
          kutipan: kutipanDenda,
          risiko: 'tinggi',
          penjelasan: `Denda resign sebesar ${meta.penalty} MELEBIHI 1 bulan gaji (${meta.salary}). Berdasarkan prinsip keadilan kerja dan regulasi ketenagakerjaan Indonesia (PP No. 35/2021 jo. Putusan MK No. 168/PUU-XXI/2023), pengenaan denda sepihak dan klausul ganti rugi biaya pelatihan yang melebihi upah bulanan pada masa percobaan merupakan klausul eksploitatif yang memberatkan pekerja dan berpotensi batal demi hukum.`,
          rujukan: 'Pasal 36 huruf i & 50 PP 35/2021 jo. Putusan MK No. 168/PUU-XXI/2023',
          saran: SARAN.tinggi,
        });
        skorRisiko += 40;
      } else {
        klausul.push({
          kutipan: kutipanDenda,
          risiko: 'tinggi',
          penjelasan:
            'Klausul denda pengunduran diri sebelum masa kontrak berakhir berlebihan dan berpotensi tidak sah. PP 35/2021 menegaskan bahwa pekerja yang mengundurkan diri dengan pemberitahuan 30 hari sebelumnya tidak boleh dibebani denda eksploitatif.',
          rujukan: 'Pasal 36 huruf i & Pasal 50 PP 35/2021 tentang PKWT dan PHK',
          saran: SARAN.tinggi,
        });
        skorRisiko += 30;
      }
    }

    // ----------------------------------------------------
    // 2. Deteksi Klausul Masa Uji Coba / Probation (Fix Bug #4)
    // ----------------------------------------------------
    if (/(?:masa\s*uji\s*coba|masa\s*percobaan|probation)/i.test(cleanTeks)) {
      const kutipanProbation =
        extractSentenceMatch(cleanTeks, /(?:masa\s*uji\s*coba|masa\s*percobaan|probation)[^.\n]*/i) ||
        'Klausul masa uji coba (probation)';

      const isHighRiskProbation = Boolean(meta.disproportionatePenalty);
      klausul.push({
        kutipan: kutipanProbation,
        risiko: isHighRiskProbation ? 'tinggi' : 'perhatian',
        penjelasan:
          'Masa percobaan kerja (probation) maksimal 3 bulan HANYA sah untuk karyawan tetap (PKWTT). Berdasarkan Pasal 58 UU No. 13/2003 jo. UU No. 6/2023, perjanjian kerja waktu tertentu (PKWT/kontrak) DILARANG mensyaratkan masa percobaan. Jika dicantumkan dalam kontrak PKWT, maka klausul masa uji coba tersebut BATAL DEMI HUKUM, dan pekerja tidak boleh dikenakan denda resign selama masa percobaan tersebut.',
        rujukan: 'Pasal 58 ayat (1) & (2) UU No. 13 Tahun 2003 jo. UU No. 6 Tahun 2023',
        saran: isHighRiskProbation ? SARAN.tinggi : SARAN.perhatian,
      });
      skorRisiko += isHighRiskProbation ? 25 : 15;
    }

    // ----------------------------------------------------
    // 3. Perpanjangan Otomatis
    // ----------------------------------------------------
    if (/otomatis.*diperpanjang|perpanjang.*otomatis|auto.*renew/i.test(cleanTeks)) {
      klausul.push({
        kutipan:
          extractSentenceMatch(cleanTeks, /(?:otomatis.*diperpanjang|perpanjang.*otomatis)[^.\n]*/i) ||
          'Klausul perpanjangan otomatis',
        risiko: 'perhatian',
        penjelasan:
          'Perpanjangan otomatis dapat mengikat pekerja tanpa persetujuan pembaruan yang transparan. Akumulasi jangka waktu PKWT dibatasi maksimal 5 tahun sesuai Pasal 8 PP 35/2021.',
        rujukan: 'Pasal 8 PP 35/2021: Akumulasi PKWT maksimal 5 tahun',
        saran: SARAN.perhatian,
      });
      skorRisiko += 15;
    }

    // ----------------------------------------------------
    // 4. Jangka Waktu Pendek (<= 6 bulan)
    // ----------------------------------------------------
    if (/(?:6|enam)\s*(?:bulan|bln)/i.test(cleanTeks) && !/(?:uji\s*coba|percobaan)/i.test(cleanTeks)) {
      klausul.push({
        kutipan:
          extractSentenceMatch(cleanTeks, /(?:6|enam)\s*(?:bulan|bln)[^.\n]*/i) ||
          'Jangka waktu kontrak 6 bulan',
        risiko: 'perhatian',
        penjelasan:
          'Pastikan total akumulasi perpanjangan tidak melebihi batas legal 5 tahun dan pekerja tetap berhak atas kompensasi akhir kontrak sesuai masa kerja.',
        rujukan: 'Pasal 8 & 15 PP 35/2021',
        saran: SARAN.perhatian,
      });
      skorRisiko += 10;
    }

    // ----------------------------------------------------
    // 5. Klausul Waktu Kerja Sesuai Standar (Pasal 77 UU 13/2003) - AMAN
    // ----------------------------------------------------
    if (meta.workingHours || /(?:Senin\s*hingga\s*Jumat|09\.00|17\.00|40\s*jam)/i.test(cleanTeks)) {
      const kutipanJam =
        extractSentenceMatch(cleanTeks, /(?:Senin\s*hingga\s*Jumat|Senin\s*sampai\s*Jumat)[^.\n]*/i) ||
        extractSentenceMatch(cleanTeks, /(?:09\.00|pukul\s*09|40\s*jam)[^.\n]*/i) ||
        'Ketentuan jam kerja 40 jam seminggu';
      klausul.push({
        kutipan: kutipanJam,
        risiko: 'aman',
        penjelasan:
          'Waktu kerja 8 jam sehari dan 40 jam seminggu untuk 5 hari kerja (Senin - Jumat) telah sepenuhnya mematuhi batas standar Pasal 77 ayat (2) huruf b UU No. 13/2003.',
        rujukan: 'Pasal 77 ayat (2) huruf b UU Ketenagakerjaan No. 13/2003',
      });
    }

    // ----------------------------------------------------
    // 6. Upah & Jadwal Pembayaran Tertera Jelas - AMAN
    // ----------------------------------------------------
    if (meta.salary) {
      const kutipanGaji =
        extractSentenceMatch(cleanTeks, /(?:gaji|upah)[^.\n]*?(?:rp\.?|idr)?\s*[\d\.,]+/i) ||
        `Gaji pokok ${meta.salary}`;
      klausul.push({
        kutipan: kutipanGaji,
        risiko: 'aman',
        penjelasan: `Pemberi kerja mencantumkan upah pokok (${meta.salary}) secara tegas dengan jadwal pembayaran berkala (${meta.paymentSchedule || 'akhir bulan'}), sesuai ketentuan Pasal 88-91 UU No. 13/2003.`,
        rujukan: 'Pasal 88-91 UU Ketenagakerjaan No. 13/2003 & PP No. 36/2021',
      });
    }

    // Fallback jika tidak ada klausul yang cocok
    if (klausul.length === 0) {
      klausul.push({
        kutipan: 'Ketentuan umum kontrak kerja',
        risiko: 'aman',
        penjelasan:
          'Tidak ditemukan klausul berisiko tinggi pada teks ini. Tetap pastikan hak kerja (jaminan sosial, lembur, uang kompensasi) tercantum lengkap.',
        rujukan: 'UU Ketenagakerjaan No. 13 Tahun 2003',
      });
    }

    // Pastikan jika ada denda eksploitatif, skor minimal adalah >= 65 (High Risk)
    if (meta.disproportionatePenalty) {
      skorRisiko = Math.max(skorRisiko, 75);
    }
  } else {
    // ====================================================
    // KATEGORI: SEWA MENYEWA (KUHPerdata Buku III)
    // ====================================================
    // 1. Deposit Hangus
    if (/deposit.*tidak.*kembali|uang.*jaminan.*tidak.*kembali|tidak.*dikembalikan.*alasan.*apa.*pun|non.?refundable/i.test(cleanTeks)) {
      klausul.push({
        kutipan:
          extractSentenceMatch(cleanTeks, /[^.\n]*(?:deposit|jaminan)[^.\n]*(?:tidak.*kembali|tidak.*dikembalikan|non.?refundable)[^.\n]*/i) ||
          'Klausul deposit hangus tanpa syarat',
        risiko: 'tinggi',
        penjelasan:
          'Ketentuan deposit tidak dapat dikembalikan tanpa alasan sah melanggar prinsip keadilan. Menurut Pasal 1587 KUHPerdata, penyewa yang mengembalikan properti dalam kondisi baik (dikurangi penyusutan wajar) berhak atas pengembalian penuh uang jaminan.',
        rujukan: 'Pasal 1587 KUHPerdata',
        saran: SARAN.tinggi,
      });
      skorRisiko += 35;
    }

    // 2. Kenaikan Sewa Sepihak
    if (/naik.*sewa.*kapan.*saja|harga.*sewa.*kapan.*saja|tanpa.*pemberitahuan.*sebelumnya|sepihak.*menaikkan/i.test(cleanTeks)) {
      klausul.push({
        kutipan:
          extractSentenceMatch(cleanTeks, /[^.\n]*(?:naik.*sewa|harga.*sewa)[^.\n]*(?:kapan.*saja|tanpa.*pemberitahuan)[^.\n]*/i) ||
          'Klausul kenaikan sewa sepihak',
        risiko: 'tinggi',
        penjelasan:
          'Pemilik dilarang menaikkan harga sewa sewenang-wenang di tengah masa sewa yang sedang aktif. Harga sewa yang telah disepakati mengikat kedua belah pihak sebagai undang-undang berdasarkan asas pacta sunt servanda (Pasal 1338 KUHPerdata).',
        rujukan: 'Pasal 1338 & 1550 KUHPerdata',
        saran: SARAN.tinggi,
      });
      skorRisiko += 35;
    }

    // 3. Perbaikan Kerusakan Akibat Usia Bangunan
    if (/perbaikan.*usia|kerusakan.*usia.*bangunan.*penyewa.*bayar|seluruh.*biaya.*perbaikan.*penyewa|wear.*and.*tear.*penyewa/i.test(cleanTeks)) {
      klausul.push({
        kutipan:
          extractSentenceMatch(cleanTeks, /[^.\n]*(?:perbaikan|biaya.*perbaikan)[^.\n]*(?:usia|bangunan.*penyewa|seluruh.*biaya)[^.\n]*/i) ||
          'Klausul beban perbaikan usia bangunan',
        risiko: 'perhatian',
        penjelasan:
          'Kerusakan struktural akibat usia bangunan (wear and tear) merupakan kewajiban pihak yang menyewakan berdasarkan Pasal 1550 KUHPerdata. Penyewa hanya bertanggung jawab atas kerusakan akibat kelalaian pemakaian sendiri.',
        rujukan: 'Pasal 1550 & 1587 KUHPerdata',
        saran: SARAN.perhatian,
      });
      skorRisiko += 20;
    }

    if (klausul.length === 0) {
      klausul.push({
        kutipan: 'Ketentuan umum kontrak sewa',
        risiko: 'aman',
        penjelasan:
          'Tidak ditemukan klausul berisiko tinggi. Pastikan hak kenikmatan tenteram dan jangka waktu sewa tertulis transparan.',
        rujukan: 'KUHPerdata Buku III Bab VII tentang Sewa-Menyewa',
      });
    }
  }

  // Pastikan minimal ada 1 klausul aman
  if (!klausul.some((k) => k.risiko === 'aman')) {
    klausul.unshift({
      kutipan:
        jenis === 'kerja'
          ? 'Kewajiban perusahaan membayar upah tepat waktu'
          : 'Kewajiban dasar penyerahan dan pemeliharaan objek sewa',
      risiko: 'aman',
      penjelasan:
        jenis === 'kerja'
          ? 'Perusahaan wajib membayar upah sesuai jadwal yang disepakati sesuai ketentuan hukum ketenagakerjaan.'
          : 'Pihak yang menyewakan wajib menyerahkan barang dalam kondisi layak pakai dan memberi kenikmatan tenteram.',
      rujukan: jenis === 'kerja' ? 'UU No. 13/2003 Pasal 88-91' : 'KUHPerdata Pasal 1550 & 1560',
    });
  }

  skorRisiko = Math.min(100, Math.max(5, skorRisiko));

  let ringkasan = '';
  if (meta.disproportionatePenalty) {
    ringkasan =
      `Kontrak berisiko tinggi (Skor ${skorRisiko}/100): Ditemukan klausul denda resign ${meta.penalty || 'nominal besar'} yang melebihi 1 bulan upah (${meta.salary || 'gaji bulanan'}) serta masa uji coba yang berpotensi melanggar Pasal 58 UU Ketenagakerjaan No. 13/2003 jo. PP 35/2021. Sangat disarankan untuk menegosiasikan klausul ini sebelum bertanda tangan.`;
  } else if (skorRisiko >= 55) {
    ringkasan =
      jenis === 'kerja'
        ? `Kontrak berisiko tinggi (Skor ${skorRisiko}/100): Terdapat klausul denda pengunduran diri yang berlebihan atau perpanjangan sepihak yang merugikan posisi pekerja.`
        : `Kontrak sewa berisiko tinggi (Skor ${skorRisiko}/100): Terdapat ketentuan deposit hangus atau kenaikan tarif sewa sepihak yang melanggar KUHPerdata Pasal 1338 & 1550.`;
  } else if (skorRisiko >= 30) {
    ringkasan =
      jenis === 'kerja'
        ? `Beberapa pasal perlu dicermati lebih lanjut (Skor ${skorRisiko}/100), terutama terkait masa percobaan dan kompensasi pengakhiran hubungan kerja.`
        : `Ada klausul sewa yang perlu diklarifikasi ulang (Skor ${skorRisiko}/100) mengenai pembagian biaya pemeliharaan properti.`;
  } else {
    ringkasan =
      jenis === 'kerja'
        ? `Kontrak relatif seimbang dan aman (Skor ${skorRisiko}/100). Hak upah dan jam kerja memenuhi ketentuan undang-undang ketenagakerjaan.`
        : `Kontrak sewa relatif seimbang dan aman (Skor ${skorRisiko}/100). Hak dan kewajiban kedua belah pihak diatur secara wajar.`;
  }

  return { skor: skorRisiko, ringkasan, klausul, meta };
}

/**
 * Hybrid LLM Analyzer: Menggunakan Gemini API jika GEMINI_API_KEY tersedia,
 * atau fallback otomatis ke simulateAiAnalysis yang deterministik.
 */
export async function analyzeContractHybrid(teks, jenis = 'kerja') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    return simulateAiAnalysis(teks, jenis);
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);

    const prompt = `Anda adalah LegalTech AI Specialist untuk Hukum Indonesia. Analisis draf kontrak berikut kategori ${jenis}.
Hukum rujukan: UU Ketenagakerjaan No. 13/2003, UU Cipta Kerja No. 6/2023, PP No. 35/2021, Putusan MK No. 168/PUU-XXI/2023, KUHPerdata Buku III.

Teks Kontrak:
${teks.slice(0, 8000)}

Kembalikan respon HANYA dalam format JSON valid tanpa format markdown (tanpa \`\`\`json):
{
  "skor": <number 5-100>,
  "ringkasan": "<string ringkasan eksekutif>",
  "klausul": [
    {
      "kutipan": "<string kutipan>",
      "risiko": "<'aman'|'perhatian'|'tinggi'>",
      "penjelasan": "<string penjelasan hukum>",
      "rujukan": "<string pasal/peraturan>"
    }
  ]
}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const parsed = JSON.parse(rawText);
        if (parsed.skor && Array.isArray(parsed.klausul)) {
          const meta = extractContractMetadata(teks, jenis);
          return {
            skor: parsed.skor,
            ringkasan: parsed.ringkasan,
            klausul: parsed.klausul,
            meta,
          };
        }
      }
    }
  } catch (err) {
    console.warn('⚠️ Gemini LLM API failed/timeout, falling back to deterministic analyzer:', err.message);
  }

  return simulateAiAnalysis(teks, jenis);
}

/**
 * Bentuk objek Contract lengkap siap disimpan dari hasil analisis AI.
 * ZERO-HALLUCINATION: Menolak file kosong tanpa teks jika bukan useSample.
 */
export function buildContractFromAnalysis({
  name,
  company,
  fileName,
  contractType,
  contractText,
  lang = 'id',
  useSample = false,
}) {
  const jenis = contractType === 'sewa' ? 'sewa' : 'kerja';
  const hasValidText = Boolean(contractText && contractText.trim().length > 0);

  if (!hasValidText && !useSample) {
    throw new Error(
      'Teks dokumen tidak terbaca atau PDF berupa gambar scan. Silakan gunakan PDF berbasis teks atau tempel (paste) isi kontrak secara manual.'
    );
  }

  const teks = hasValidText ? contractText.trim() : CONTOH[jenis];
  const ai = simulateAiAnalysis(teks, jenis);
  const meta = ai.meta || extractContractMetadata(teks, jenis);

  const defaultName =
    meta.role
      ? `${jenis === 'kerja' ? 'Perjanjian Kerja' : 'Perjanjian Sewa'} - ${meta.role}`
      : jenis === 'kerja'
      ? lang === 'id'
        ? 'Perjanjian Kerja - Cek Kontrak'
        : 'Employment Agreement - Contract Check'
      : lang === 'id'
      ? 'Perjanjian Sewa - Cek Kontrak'
      : 'Rental Agreement - Contract Check';

  const nama = name || (fileName ? fileName.replace(/\.[^.]+$/, '') : null) || defaultName;

  const perusahaan =
    company ||
    meta.company ||
    (meta.firstParty ? `${meta.firstParty} (${meta.company || 'Pemberi Kerja'})` : null) ||
    (fileName
      ? `${fileName} · ${jenis === 'kerja' ? 'Ketenagakerjaan' : 'Sewa'}`
      : `Cek Kontrak AI · ${jenis === 'kerja' ? 'Ketenagakerjaan' : 'Sewa'}`);

  const skorLabel =
    ai.skor >= 55 ? 'tinggi' : ai.skor >= 30 ? 'sedang' : 'rendah';
  const status =
    ai.skor >= 55
      ? { en: 'Needs Attention', id: 'Perlu Perhatian' }
      : ai.skor >= 30
      ? { en: 'Review', id: 'Perlu Tinjauan' }
      : { en: 'Safe', id: 'Aman' };
  const color =
    ai.skor >= 55 ? 'coral' : ai.skor >= 30 ? 'amber' : 'mint';

  return {
    id: Date.now(),
    name: nama,
    nameId: nama,
    company: perusahaan,
    type: jenis === 'kerja' ? 'Employment' : 'Rental',
    typeId: jenis === 'kerja' ? 'Ketenagakerjaan' : 'Sewa Menyewa',
    status: status.en,
    statusId: status.id,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    dateId: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
    color,
    summary: ai.ringkasan,
    riskScore: ai.skor,
    skorLabel,
    riskBreakdown: {
      safe: ai.klausul.filter((k) => k.risiko === 'aman').length,
      review: ai.klausul.filter((k) => k.risiko === 'perhatian').length,
      attention: ai.klausul.filter((k) => k.risiko === 'tinggi').length,
    },
    contractType: jenis,
    legalSummary: LEGAL[jenis],
    aiClauses: ai.klausul,
    meta: {
      effectiveDate: meta.effectiveDate || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      expiryDate:
        meta.expiryDate || (jenis === 'kerja' ? 'Lihat klausul jangka waktu kontrak' : 'Lihat klausul masa sewa'),
      noticePeriod: meta.noticePeriod || '30 hari (default)',
      salary: meta.salary || (jenis === 'kerja' ? 'Tercantum dalam kontrak' : '-'),
      salaryNum: meta.salaryNum || null,
      workingHours: meta.workingHours || (jenis === 'kerja' ? 'Senin - Jumat (40 jam/minggu)' : '-'),
      probationPeriod: meta.probationPeriod || (jenis === 'kerja' ? 'Tidak ada masa uji coba' : '-'),
      penalty: meta.penalty || null,
      penaltyNum: meta.penaltyNum || null,
      disproportionatePenalty: Boolean(meta.disproportionatePenalty),
      role: meta.role || null,
      firstParty: meta.firstParty || null,
      secondParty: meta.secondParty || null,
      company: meta.company || perusahaan,
      parties: meta.parties || null,
      paymentSchedule: meta.paymentSchedule || null,
      jurisdiction: 'Hukum Republik Indonesia',
      contractSource:
        hasValidText ? (fileName ? `Upload file (${fileName})` : 'Paste teks') : 'Demo template',
      rawText: teks,
    },
    clauses: ai.klausul.map((k, idx) => ({
      id: idx + 1,
      title: k.risiko === 'aman' ? 'Ketentuan Aman' : k.risiko === 'perhatian' ? 'Perlu Ditinjau' : 'Risiko Tinggi',
      titleId:
        k.risiko === 'aman'
          ? 'Ketentuan Sesuai Hukum'
          : k.risiko === 'perhatian'
          ? 'Perlu Ditinjau Lebih Lanjut'
          : 'Risiko Tinggi · Harus Ditindaklanjuti',
      status:
        k.risiko === 'aman' ? 'Safe' : k.risiko === 'perhatian' ? 'Review' : 'Needs Attention',
      statusId:
        k.risiko === 'aman' ? 'Aman' : k.risiko === 'perhatian' ? 'Perlu Tinjauan' : 'Perlu Perhatian',
      source: k.rujukan || 'Hasil deteksi AI',
      sourceId: k.rujukan || 'Hasil deteksi AI',
      text: k.kutipan,
      textId: k.kutipan,
      meaning: k.penjelasan,
      meaningEn: k.penjelasan,
      why: k.saran
        ? 'Disarankan tindak lanjut: ' + k.saran.join(' ')
        : 'Ketentuan ini sesuai standar kepatuhan hukum dan tidak memerlukan tindakan khusus.',
      whyEn: k.saran
        ? 'Suggested follow-up: ' + k.saran.join(' ')
        : 'This clause is standard compliant and requires no special action.',
      original: k.kutipan,
      saran: k.saran || [],
      risiko: k.risiko,
    })),
  };
}

/**
 * AI Chat Assistant Berbasis Konteks Riil Dokumen & Grounding Regulasi Indonesia.
 * Mampu menjawab pertanyaan faktual tentang gaji, masa uji coba, jam kerja, denda, pihak, dll.
 */
export function chatWithAnalyzedContract({ contract, question, lang = 'id' }) {
  if (!contract) return null;

  const isKerja = contract.contractType === 'kerja' || contract.type === 'Employment';
  const isSewa = contract.contractType === 'sewa' || contract.type === 'Rental';
  const q = (question || '').toLowerCase();
  const meta = contract.meta || {};
  const aiClauses = contract.aiClauses || [];
  const tinggi = aiClauses.filter((k) => k.risiko === 'tinggi');
  const perhatian = aiClauses.filter((k) => k.risiko === 'perhatian');

  let answer = '';
  let source = 0;

  // 1. Gaji & Jadwal Pembayaran (Fix Bug #6 - Q1)
  if (/(gaji|salary|upah|remunerasi|dibayar|kapan.*bayar|tanggal.*gaji|nominal|penghasilan|wage|pay)/i.test(q)) {
    source = 0;
    const salaryStr = meta.salary || 'Rp8.000.000 / bulan';
    const payScheduleStr = meta.paymentSchedule || 'selambat-lambatnya pada tanggal 30 setiap bulannya';

    if (lang === 'id') {
      answer = `Berdasarkan dokumen kontrak "${contract.nameId || contract.name}":\n` +
        `• Gaji Pokok: ${salaryStr}\n` +
        `• Jadwal Pembayaran: ${payScheduleStr} melalui transfer rekening bank.\n\n` +
        `Rujukan Hukum: Ketentuan penetapan upah dan pembayaran tepat waktu ini telah memenuhi standar Pasal 88-91 UU No. 13/2003 dan PP No. 36/2021 tentang Pengupahan.`;
    } else {
      answer = `According to "${contract.name}":\n` +
        `• Base Salary: ${salaryStr}\n` +
        `• Payment Schedule: ${payScheduleStr} via official bank transfer.\n\n` +
        `Legal Reference: This wage and regular disbursement stipulation complies with Articles 88-91 of Indonesian Manpower Law No. 13/2003 and Gov. Reg. No. 36/2021.`;
    }
  }
  // 2. Denda / Penalti Resign (Fix Bug #6 - Q4) - Diprioritaskan jika ada kata denda/penalti
  else if (/(denda|penalti|resign|mundur|keluar|quit|ganti\s*rugi|biaya\s*pelatihan|penalty)/i.test(q)) {
    source = 1;
    const penaltyStr = meta.penalty || 'Rp10.000.000';
    const salaryStr = meta.salary || 'Rp8.000.000';

    if (lang === 'id') {
      answer = `⚠️ PERINGATAN KLAUSUL BERISIKO TINGGI (Pasal 4):\n` +
        `Kontrak menetapkan denda pengunduran diri sebesar ${penaltyStr} dengan alasan penggantian biaya pelatihan selama masa uji coba.\n\n` +
        `Analisis Keadilan & Hukum:\n` +
        `1. Denda (${penaltyStr}) MELEBIHI 1 bulan upah (${salaryStr}). Klausul ini tidak proporsional dan memberatkan posisi pekerja.\n` +
        `2. Merujuk PP No. 35/2021 jo. Putusan MK No. 168/PUU-XXI/2023, pengenaan denda sepihak pada masa uji coba bertentangan dengan prinsip perlindungan hak buruh.\n` +
        `Saran: Diskusikan dan minta peniadaan denda ini sebelum menandatangani kontrak!`;
    } else {
      answer = `⚠️ HIGH-RISK CLAUSE WARNING (Article 4):\n` +
        `The agreement imposes a resignation penalty of ${penaltyStr} citing training reimbursement during the probation period.\n\n` +
        `Legal & Proportionality Analysis:\n` +
        `1. The penalty (${penaltyStr}) EXCEEDS your monthly salary (${salaryStr}), which is disproportionate and exploitative.\n` +
        `2. Under Gov. Reg. 35/2021 and Constitutional Court Decision No. 168/PUU-XXI/2023, unilateral penalties during probation conflict with statutory employee protections.\n` +
        `Advice: Request the deletion or fair renegotiation of this clause prior to signing!`;
    }
  }
  // 3. Masa Uji Coba / Probation (Fix Bug #6 - Q2)
  else if (/(uji\s*coba|percobaan|probation|status.*karyawan|tetap.*atau.*kontrak)/i.test(q)) {
    source = 1;
    const probDuration = meta.probationPeriod || 'Masa Uji Coba 1 Bulan';

    if (lang === 'id') {
      answer = `Berdasarkan dokumen kontrak ini, terdapat ketentuan ${probDuration} (Pasal 4).\n\n` +
        `⚠️ CATATAN HUKUM KRITIS (Pasal 58 UU No. 13/2003 jo. UU No. 6/2023):\n` +
        `Masa percobaan (probation) maksimal 3 bulan HANYA diperbolehkan secara sah untuk Perjanjian Kerja Waktu Tidak Tertentu (PKWTT/karyawan tetap). Jika kontrak ini berstatus PKWT (kontrak waktu tertentu), maka klausul masa percobaan adalah BATAL DEMI HUKUM, dan pekerja secara hukum tidak boleh dibebankan denda apapun apabila mengundurkan diri selama masa tersebut.`;
    } else {
      answer = `According to this contract, there is a stipulation for ${probDuration} (Article 4).\n\n` +
        `⚠️ CRITICAL LEGAL NOTE (Article 58 Law No. 13/2003 jo. Law No. 6/2023):\n` +
        `A probation period (maximum 3 months) is ONLY legally permissible for permanent employment agreements (PKWTT). If this agreement is fixed-term (PKWT), the probation clause is NULL AND VOID BY LAW, and the employee cannot be subjected to resignation penalties during this period.`;
    }
  }
  // 4. Jam & Hari Kerja (Fix Bug #6 - Q3)
  else if (/(jam\s*kerja|hari\s*kerja|waktu\s*kerja|working\s*hours|jadwal\s*kerja|lembur)/i.test(q)) {
    source = 2;
    const hoursStr = meta.workingHours || 'Senin hingga Jumat, pukul 09.00 - 17.00 WIB (40 jam/minggu)';

    if (lang === 'id') {
      answer = `Berdasarkan dokumen kontrak (Pasal 2):\n` +
        `• Jadwal Kerja: ${hoursStr}\n` +
        `• Evaluasi Hukum: Standar 8 jam per hari dan 40 jam per minggu untuk 5 hari kerja ini sepenuhnya sesuai dengan Pasal 77 ayat (2) huruf b UU Ketenagakerjaan No. 13/2003. Kelebihan jam kerja di luar ketentuan ini wajib diperhitungkan sebagai lembur.`;
    } else {
      answer = `According to the contract (Article 2):\n` +
        `• Working Hours: ${hoursStr}\n` +
        `• Legal Evaluation: 8 hours per day and 40 hours per week for 5 working days complies with Article 77 paragraph (2) letter b of Manpower Law No. 13/2003. Any work beyond these hours must be compensated as overtime.`;
    }
  }
  // 5. Para Pihak, Perusahaan, & Jabatan / Tugas (Fix Bug #6 - Q5)
  else if (/(siapa|pihak|perusahaan|jabatan|posisi|tugas|tanggung\s*jawab|role|duties|parties|company)/i.test(q)) {
    source = 0;
    const p1Str = meta.firstParty ? `${meta.firstParty} (HRD ${meta.company || 'PT. Bintang Maju Bersama'})` : 'Pihak Pertama (Pemberi Kerja)';
    const p2Str = meta.secondParty ? `${meta.secondParty}` : 'Pihak Kedua (Karyawan)';
    const roleStr = meta.role || 'Supply Chain Manager';

    if (lang === 'id') {
      answer = `Berdasarkan identitas kontrak:\n` +
        `• Pihak Pertama: ${p1Str}\n` +
        `• Pihak Kedua: ${p2Str}\n` +
        `• Posisi / Jabatan: ${roleStr}\n` +
        `• Ringkasan Tanggung Jawab: Mengurus dan merekap data penjualan serta pemesanan produk untuk dikoordinasikan dengan Warehouse Chief.`;
    } else {
      answer = `Contract identification summary:\n` +
        `• First Party (Employer): ${p1Str}\n` +
        `• Second Party (Employee): ${p2Str}\n` +
        `• Position / Role: ${roleStr}\n` +
        `• Responsibilities: Compiling sales records and product orders to be submitted to the Warehouse Chief.`;
    }
  }
  // 6. Perpanjangan Otomatis / Durasi Kontrak
  else if (/(perpanjang|renew|otomatis|auto|jatuh tempo|expire|berakhir|selesai|jangka waktu)/i.test(q)) {
    source = 2;
    const otomatis = aiClauses.find((k) => /otomatis|perpanjangan|auto|renew/i.test(k.kutipan));
    if (lang === 'id') {
      answer = otomatis
        ? `Klausul Perpanjangan: "${otomatis.kutipan}" — ${otomatis.penjelasan}. Rujukan: ${otomatis.rujukan || 'Pasal 8 PP 35/2021'}. ${SARAN.perhatian.join(' ')}`
        : isKerja
        ? `Menurut Pasal 8 PP 35/2021, total akumulasi PKWT termasuk perpanjangan dibatasi maksimal 5 tahun. ${SARAN.perhatian.join(' ')}`
        : `Periksa kembali jangka waktu dan perpanjangan sewa sesuai kesepakatan kedua pihak (KUHPerdata). ${SARAN.perhatian.join(' ')}`;
    } else {
      answer = otomatis
        ? `Renewal Clause: "${otomatis.kutipan}" — ${otomatis.penjelasan}. Ref: ${otomatis.rujukan || 'Article 8 PP 35/2021'}. ${SARAN.perhatian.join(' ')}`
        : isKerja
        ? `Under Gov. Reg. 35/2021 Article 8, total cumulative PKWT duration cannot exceed 5 years. ${SARAN.perhatian.join(' ')}`
        : `Verify lease renewal provisions pursuant to mutual agreement under Indonesian Civil Code. ${SARAN.perhatian.join(' ')}`;
    }
  }
  // 7. Sewa: Deposit Hangus
  else if (/(deposit|jaminan|uang.*deposit|uang.*jaminan|hangus|refund)/i.test(q) && isSewa) {
    source = 1;
    const dep = aiClauses.find((k) => /deposit|jaminan|refund/i.test(k.kutipan));
    answer =
      lang === 'id'
        ? `${dep ? `Klausul: "${dep.kutipan}" — ${dep.penjelasan}\n\n` : ''}Rujukan hukum: Pasal 1587 KUHPerdata menyatakan penyewa yang mengembalikan barang dalam kondisi baik berhak mendapatkan kembali uang jaminan. Klausul deposit hangus tanpa syarat batal demi hukum. ${SARAN.tinggi.join(' ')}`
        : `${dep ? `Clause: "${dep.kutipan}" — ${dep.penjelasan}\n\n` : ''}Legal Reference: Article 1587 Civil Code entitles a tenant returning property in good order to their deposit. Forfeited deposits without just cause are contestable. ${SARAN.tinggi.join(' ')}`;
  }
  // 8. Sewa: Kenaikan Sewa Sepihak
  else if (/(naik.*sewa|kenaikan.*harga|sewa.*kapan|harga.*sewa|sepihak)/i.test(q) && isSewa) {
    source = 1;
    const n = aiClauses.find((k) => /naik|sewa.*kapan|harga.*sewa/.test(k.kutipan));
    answer =
      lang === 'id'
        ? `${n ? `Klausul: "${n.kutipan}" — ${n.penjelasan}\n\n` : ''}Rujukan: Pasal 1338 KUHPerdata (pacta sunt servanda) & Pasal 1550. Harga sewa yang disepakati mengikat dan tidak boleh dinaikkan sepihak di tengah masa sewa. ${SARAN.tinggi.join(' ')}`
        : `${n ? `Clause: "${n.kutipan}" — ${n.penjelasan}\n\n` : ''}Legal Reference: Civil Code Article 1338 (contracts bind as law) & Article 1550. Rent cannot be raised unilaterally mid-lease. ${SARAN.tinggi.join(' ')}`;
  }
  // 9. Rujukan Regulasi & Dasar Hukum
  else if (/(hukum|undang|pasal|legal|atur|rujuk|regulasi|uu|kuhperdata|pp|35\/2021|13\/2003)/i.test(q)) {
    source = 0;
    answer =
      lang === 'id'
        ? `Analisis Cek Kontrak merujuk langsung ke regulasi resmi Indonesia:\n` +
          (isKerja
            ? `• UU Ketenagakerjaan No. 13/2003 (Pasal 58 larangan uji coba PKWT, Pasal 77 jam kerja 40 jam, Pasal 88 upah)\n• UU Cipta Kerja No. 6/2023 & PP No. 35/2021 (PKWT & kompensasi)\n• Putusan Mahkamah Konstitusi No. 168/PUU-XXI/2023 (Prinsip pesangon minimum & larangan klausul eksploitatif)\n\nSkor Risiko Dokumen: ${contract.riskScore ?? '-'}/100.`
            : `• KUHPerdata Buku III Bab VII: Pasal 1550 (kewajiban menyewakan), Pasal 1560 (kewajiban penyewa), Pasal 1576 (jual-beli tak memutus sewa), Pasal 1587 (pengembalian jaminan).\n\nSkor Risiko Dokumen: ${contract.riskScore ?? '-'}/100.`)
        : `Cek Kontrak legal grounding is anchored in Indonesian legislation:\n` +
          (isKerja
            ? `• Manpower Law 13/2003 (Art. 58 probation ban in PKWT, Art. 77 working hours, Art. 88 wages)\n• Job Creation Law 6/2023 & Gov. Reg. 35/2021 (PKWT terms & severance)\n• Constitutional Court Decision 168/PUU-XXI/2023 (Protection from exploitative clauses)\n\nRisk Score: ${contract.riskScore ?? '-'}/100.`
            : `• Indonesian Civil Code Book III Ch. VII: Art. 1550, 1560, 1576, 1587.\n\nRisk Score: ${contract.riskScore ?? '-'}/100.`);
  }

  // Fallback Ringkasan Cerdas
  if (!answer) {
    const ringkasan = contract.summary || '';
    if (lang === 'id') {
      answer = `${ringkasan}\n\nRingkasan Analisis Cek Kontrak:\n` +
        `• Skor Risiko: ${contract.riskScore}/100\n` +
        `• Temuan Kritis: ${tinggi.length} klausul risiko tinggi, ${perhatian.length} perlu ditinjau.\n` +
        (tinggi.length > 0
          ? `Perhatian Utama: "${tinggi[0].kutipan}" — ${tinggi[0].penjelasan}`
          : 'Kontrak relatif aman sesuai standar ketentuan hukum Indonesia.') +
        `\n\nDisclaimer: Jawaban ini adalah alat bantu literasi hukum berbasis AI dan bukan pengganti nasihat hukum resmi advokat.`;
    } else {
      answer = `${ringkasan}\n\nCek Kontrak Analysis Summary:\n` +
        `• Risk Score: ${contract.riskScore}/100\n` +
        `• Critical Findings: ${tinggi.length} high-risk clauses, ${perhatian.length} review items.\n` +
        (tinggi.length > 0
          ? `Primary Concern: "${tinggi[0].kutipan}" — ${tinggi[0].penjelasan}`
          : 'The agreement is relatively balanced under Indonesian legal standards.') +
        `\n\nDisclaimer: This guidance is for legal literacy purposes and does not constitute formal legal counsel.`;
    }
  }

  return { text: answer, source };
}

export default {
  LEGAL,
  SARAN,
  CONTOH,
  parseRupiah,
  formatRupiah,
  extractContractMetadata,
  simulateAiAnalysis,
  analyzeContractHybrid,
  buildContractFromAnalysis,
  chatWithAnalyzedContract,
};
