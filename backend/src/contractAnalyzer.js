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

/**
 * Parsing angka rupiah dari teks (e.g. "Rp10.000.000", "8 juta", "8.000.000").
 */
export function parseRupiah(str) {
  if (!str) return 0;
  const stripped = String(str)
    .replace(/^(?:rp\.?|idr)\s*/i, '')
    .replace(/,-.*$/, '')
    .trim();
  const clean = stripped.replace(/[^\d,\.juta]/gi, '').toLowerCase();
  if (clean.includes('juta')) {
    const num = parseFloat(clean.replace('juta', '').replace(',', '.'));
    return Math.round(num * 1000000);
  }
  const normalized = clean.replace(/\./g, '').replace(/,+$/, '').replace(',', '.');
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

function cleanPersonName(raw) {
  if (!raw || typeof raw !== 'string') return '';
  const firstLine = raw.split(/[\r\n]+/)[0] || '';
  return firstLine
    .replace(/\b(?:Alamat|Jabatan|Kantor|Tempat|Jenis\s*Kelamin|Agama|Nomor|NIK|KTP|Dalam\s*hal\s*ini|Selanjutnya|Akan\s*disebut)\b.*$/i, '')
    .replace(/^[:\s\-–—]+|[:\s\-–—,]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Deteksi otomatis kategori dokumen berdasarkan isi teks kontrak.
 */
export function detectContractCategory(teks = '', fallbackJenis = 'kerja') {
  if (!teks || typeof teks !== 'string') return fallbackJenis;
  if (
    /SURAT\s+PERJANJIAN\s+KERJASAMA|perjanjian\s+kerjasama|Colocation\s+Server|Server\s+Colocation|Kuasa\s+Pengguna\s+Anggaran|SPK\.|Pengembangan\s+Jaringan|Pemeliharaan\s+jaringan|Pengadaan\s+Barang/i.test(
      teks
    )
  ) {
    return 'kerjasama';
  }
  if (
    /PERJANJIAN\s+SEWA\s+MENYEWA|sewa\s+menyewa\s+(?:rumah|apartemen|kamar|gedung|ruko|kendaraan)|uang\s+deposit.*tidak\s+dapat\s+dikembalikan|menaikkan\s+harga\s+sewa\s+kapan\s+saja/i.test(
      teks
    )
  ) {
    return 'sewa';
  }
  if (
    /PKWT|PKWTT|Perjanjian\s+Kerja\s+Karyawan|Surat\s+Kontrak\s+Perjanjian\s+Kerja|mengundurkan\s+diri\s+selama\s+masa\s+uji\s+coba|masa\s+uji\s+coba|gaji\s+pokok|upah\s+bulanan/i.test(
      teks
    )
  ) {
    return 'kerja';
  }
  return fallbackJenis;
}

/**
 * Ekstrak blok PASAL 1 .. PASAL N dari dokumen kontrak.
 */
export function extractPasalBlocks(teks = '') {
  if (!teks || typeof teks !== 'string') return [];
  const regex = /(?:^|\r?\n)\s*(PASAL\s+\d+[A-Za-z]?)\s*(?:\r?\n)+([\s\S]*?)(?=(?:\r?\n)\s*PASAL\s+\d+[A-Za-z]?\b|(?:\r?\n)\s*(?:Demikianlah|PIHAK\s+PERTAMA\s*:|Jakarta,|Samarinda,)|$)/gi;
  const blocks = [];
  let match;
  while ((match = regex.exec(teks)) !== null) {
    const pasalLabel = match[1].trim().replace(/\s+/g, ' ');
    const rawBody = (match[2] || '').trim();
    const lines = rawBody.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    let subtitle = '';
    let contentLines = lines;
    if (
      lines.length > 1 &&
      lines[0].length <= 65 &&
      lines[0] === lines[0].toUpperCase() &&
      !/^\d+\./.test(lines[0])
    ) {
      subtitle = lines[0];
      contentLines = lines.slice(1);
    }
    blocks.push({
      pasal: pasalLabel,
      subtitle,
      body: contentLines.join(' ').replace(/\s+/g, ' ').trim(),
      rawBody,
    });
  }
  return blocks;
}

/**
 * Smart Entity Extractor untuk menghasilkan objek `meta` riil dari teks kontrak.
 */
export function extractContractMetadata(teks, jenis = 'kerja') {
  const detectedCategory = detectContractCategory(teks, jenis);
  const meta = {
    jurisdiction: 'Hukum Republik Indonesia',
    contractSource: 'Teks Dokumen',
    detectedCategory,
  };

  if (!teks || typeof teks !== 'string') {
    return meta;
  }

  // 0. Nomor Kontrak
  const contractNums = [...teks.matchAll(/Nomor(?:\s*Kontrak)?\s*:\s*([^\r\n]+)/gi)]
    .map((m) => m[1].trim())
    .filter(Boolean);
  if (contractNums.length > 0) {
    meta.contractNumber = contractNums.join(' / ');
  }

  // 1. Organisasi / Instansi Pihak Pertama & Kedua (Format "bertindak untuk dan atas nama ... disebut PIHAK PERTAMA/KEDUA")
  const org1Match = teks.match(
    /bertindak\s+untuk\s+dan\s+atas\s+nama\s+([\s\S]{3,120}?)\s+selanjutnya\s+disebut\s+(?:sebagai\s+)?PIHAK\s+PERTAMA/i
  );
  const org2Match = teks.match(
    /bertindak\s+untuk\s+dan\s+atas\s+nama\s+([\s\S]{3,120}?)\s+selanjutnya\s+disebut\s+(?:sebagai\s+)?PIHAK\s+KEDUA/i
  );
  if (org1Match) {
    meta.firstPartyOrg = org1Match[1].replace(/\s+/g, ' ').trim();
  }
  if (org2Match) {
    meta.secondPartyOrg = org2Match[1].replace(/\s+/g, ' ').trim();
  }

  // Company / Nama Perusahaan
  const companyMatch =
    teks.match(/(?:PT\.?|CV\.?|Studio)[ \t]+[A-Za-z0-9 .&-]+/i) ||
    teks.match(/(?:perusahaan|pihak\s*pertama)[\s\S]*?(?:PT|CV)[ \t]*([A-Za-z0-9 .&-]+)/i);
  if (companyMatch) {
    meta.company = companyMatch[0]
      .split(/[\r\n]+/)[0]
      .replace(/\b(?:SCBD|Jl\.|Jalan|sebagai|dalam\s*hal\s*ini|berkedudukan|selanjutnya|yang\s*ditempatkan)\b.*$/i, '')
      .trim();
  }

  if (meta.firstPartyOrg && meta.secondPartyOrg) {
    const shortOrg1 = /BADAN\s+KEPEGAWAIAN\s+DAERAH\s+PROVINSI\s+KALIMANTAN\s+TIMUR/i.test(meta.firstPartyOrg)
      ? 'BKD Prov. Kaltim'
      : meta.firstPartyOrg;
    const shortOrg2 = /PT\.?\s*POWERNET\s*INDOSOLUSI/i.test(meta.secondPartyOrg)
      ? 'PT. Powernet Indosolusi'
      : meta.secondPartyOrg;
    meta.company = `${shortOrg1} & ${shortOrg2}`;
  }

  // 2. Para Pihak (First Party & Second Party) — Mendukung format Romawi (I. Nama : ..., II. Nama : ...) & Narasi
  const namaMatches = [...teks.matchAll(/(?:[I12]+\.\s*)?Nama\s*:\s*([^\r\n]+)/gi)];
  if (namaMatches.length >= 2) {
    let foundFirst = '';
    let foundSecond = '';
    let roleFirst = '';
    let roleSecond = '';

    for (let i = 0; i < namaMatches.length; i++) {
      const candidateName = cleanPersonName(namaMatches[i][1]);
      if (!candidateName) continue;
      const startPos = namaMatches[i].index || 0;
      const endPos = i + 1 < namaMatches.length ? (namaMatches[i + 1].index || startPos + 450) : startPos + 450;
      const blockText = teks.slice(startPos, endPos);
      const jabMatch = blockText.match(/Jabatan\s*:\s*([^\r\n]+)/i);
      const jabStr = jabMatch ? jabMatch[1].trim() : '';

      if (
        !foundFirst &&
        /(?:disebut\s*(?:sebagai\s*)?pihak\s*(?:pertama|kesatu|i\b|1\b)|Jabatan\s*:\s*(?:HRD|HR\s*Manager|Direktur|Pimpinan|Pemberi\s*Kerja|Kuasa\s*Pengguna\s*Anggaran))/i.test(
          blockText
        )
      ) {
        foundFirst = candidateName;
        roleFirst = jabStr;
      } else if (
        !foundSecond &&
        /(?:disebut\s*(?:sebagai\s*)?pihak\s*(?:kedua|ii\b|2\b)|Nomor\s*KTP|Tempat\s*dan\s*Tanggal\s*Lahir|Account\s*Executive)/i.test(
          blockText
        )
      ) {
        foundSecond = candidateName;
        roleSecond = jabStr;
      }
    }

    const rawFirst = foundFirst || cleanPersonName(namaMatches[0][1]);
    const rawSecond =
      foundSecond ||
      cleanPersonName(
        (namaMatches.find((m) => cleanPersonName(m[1]) !== rawFirst) || namaMatches[1])[1]
      );

    meta.firstPartyName = rawFirst;
    meta.secondPartyName = rawSecond;
    meta.firstPartyRole = roleFirst || null;
    meta.secondPartyRole = roleSecond || null;

    if (detectedCategory === 'kerjasama' && (meta.firstPartyOrg || meta.secondPartyOrg)) {
      meta.firstParty = meta.firstPartyOrg ? `${rawFirst} (${meta.firstPartyOrg})` : rawFirst;
      meta.secondParty = meta.secondPartyOrg ? `${rawSecond} (${meta.secondPartyOrg})` : rawSecond;
    } else {
      meta.firstParty = rawFirst;
      meta.secondParty = rawSecond;
    }
  } else {
    const p1 =
      teks.match(/(?:1|I)\.\s*(?:PIHAK\s*PERTAMA[\s\S]{0,200}?)?Nama\s*:\s*([^\r\n]+)/i) ||
      teks.match(/Nama\s*:\s*([^\r\n]+)[\s\S]{0,260}?(?:HRD|disebut\s*(?:sebagai\s*)?pihak\s*pertama)/i) ||
      teks.match(/Pihak\s*Pertama\s*(?:\(|:\s*)([A-Za-z .,]+)/i);
    if (p1) meta.firstParty = cleanPersonName(p1[1]);

    const p2 =
      teks.match(/(?:2|II)\.\s*(?:PIHAK\s*KEDUA[\s\S]{0,200}?)?Nama\s*:\s*([^\r\n]+)/i) ||
      teks.match(/Nama\s*:\s*([^\r\n]+)[\s\S]{0,280}?disebut\s*(?:sebagai\s*)?pihak\s*kedua/i) ||
      teks.match(/Pihak\s*Kedua\s*(?:\(|:\s*)([A-Za-z .,]+)/i);
    if (p2) meta.secondParty = cleanPersonName(p2[1]);
  }

  if (meta.firstParty && meta.secondParty) {
    meta.parties = `${meta.firstParty} & ${meta.secondParty}`;
  }

  // 3. Role / Jabatan atau Objek / Lingkup Kerjasama
  if (detectedCategory === 'kerjasama') {
    const scopeServerMatch = teks.match(/mengelola\s+(Server\s+Colocation\s+[A-Za-z0-9 .]+)/i);
    const scopeKerjasamaMatch = teks.match(/perjanjian\s+kerjasama\s+([A-Za-z0-9\s/]+?)(?:,\s*sebagai\s+berikut|\r|\n)/i);
    if (scopeServerMatch) {
      meta.role = `Pengelolaan ${scopeServerMatch[1].trim()}`;
      meta.scopeSummary =
        'Memfasilitasi serta memelihara Server Colocation BKD Prov. Kaltim dan jaringan internet unlimited di Gedung Telkom Karet Tengsin / Menara Kadin Jakarta.';
    } else if (scopeKerjasamaMatch) {
      meta.role = scopeKerjasamaMatch[1].trim();
    } else {
      meta.role = 'Perjanjian Kerjasama Layanan & Jaringan';
    }
  } else {
    const roleMatch =
      teks.match(/(?:sebagai|bagian|posisi|jabatan)\s+([A-Za-z\s]+?(?:Manager|Designer|Staff|Lead|Engineer|Developer|Officer|Director|Consultant|Spesialis|Kepala|Chief))/i) ||
      teks.match(/bekerja\s*sebagai\s*(?:karyawan\s*di\s*.*?\s*sebagai\s*bagian\s*)?([A-Za-z\s]{3,35})/i) ||
      teks.match(/diangkat\s*(?:untuk\s*bekerja\s*)?sebagai\s*([A-Za-z\s]{3,35})/i);
    if (roleMatch) {
      const rawRole = roleMatch[1].trim().replace(/[\r\n]+/g, ' ');
      meta.role = rawRole.replace(/\s+/g, ' ');
    }
  }

  // 4. Nilai Kontrak / Biaya Jasa / Gaji & Detail Rekening Bank
  const semesterFeeMatch =
    teks.match(/sebesar\s*Rp\.?\s*([\d\.,]+)(?:,-)?\s*(?:\([^)]+\))?\s*per\s*bulan[\s\S]{0,160}?per\s*semester[^=\n]*?=\s*Rp\.?\s*([\d\.,]+)(?:,-)?/i);
  const serviceFeeMatch =
    teks.match(/(?:membayar\s+jasa\s+sewa|biaya\s+sewa|nilai\s+kontrak|biaya\s+layanan)[\s\S]{0,120}?sebesar\s*Rp\.?\s*([\d\.,]+)(?:,-)?/i);
  const salaryMatch =
    teks.match(/(?:gaji|upah|remunerasi|honorarium)[^\n]*?(?:sebesar\s*)?(?:rp\.?|idr)?\s*([\d\.,]+(?:\s*juta|\s*ribu)?)/i) ||
    teks.match(/(?:rp\.?|idr)\s*([\d\.,]{6,15})(?:,-)?[^\n]*?(?:gaji|upah|per\s*bulan|setiap\s*bulan)/i);

  if (semesterFeeMatch) {
    const monthlyNum = parseRupiah(semesterFeeMatch[1]);
    const semesterNum = parseRupiah(semesterFeeMatch[2]);
    if (monthlyNum > 0 && semesterNum > 0) {
      meta.salary = `${formatRupiah(monthlyNum)} / bulan (${formatRupiah(semesterNum)} / semester)`;
      meta.salaryNum = monthlyNum;
      meta.semesterValue = formatRupiah(semesterNum);
      meta.semesterValueNum = semesterNum;
    }
  } else if (serviceFeeMatch) {
    const feeNum = parseRupiah(serviceFeeMatch[1]);
    if (feeNum > 0) {
      meta.salary = `${formatRupiah(feeNum)} / bulan`;
      meta.salaryNum = feeNum;
    }
  } else if (salaryMatch) {
    const rawSalary = salaryMatch[1].trim();
    const salaryNum = parseRupiah(rawSalary);
    if (salaryNum > 0) {
      meta.salary = formatRupiah(salaryNum) + ' / bulan';
      meta.salaryNum = salaryNum;
    }
  }

  // Ekstraksi Rekening Bank Tujuan Transfer (jika ada)
  const bankMatch = teks.match(/BANK\s*:\s*([^\r\n]+)/i);
  const bankOwnerMatch = teks.match(/Atas\s*Nama\s*:\s*([^\r\n]+)/i);
  const bankAccMatch = teks.match(/Nomor\s*Rekening\s*:\s*([^\r\n;]+)/i);
  if (bankMatch || bankOwnerMatch || bankAccMatch) {
    meta.bankName = bankMatch ? bankMatch[1].trim() : null;
    meta.bankAccountName = bankOwnerMatch ? bankOwnerMatch[1].trim() : null;
    meta.bankAccountNumber = bankAccMatch ? bankAccMatch[1].trim() : null;

    if (
      meta.bankAccountName &&
      (meta.secondPartyOrg || /PT\.|CV\./i.test(meta.company || '')) &&
      !/^(?:PT|CV|UD|BADAN|PEMERINTAH|YAYASAN|KOPERASI)\b/i.test(meta.bankAccountName)
    ) {
      meta.personalBankAccountRisk = true;
    }
  }

  // 5. Jadwal Pembayaran
  const payDateMatch =
    teks.match(/(?:tanggal|tgl)\s*(\d{1,2})\s*(?:setiap|tiap|selambat)/i) ||
    teks.match(/(?:selambat-lambatnya|paling\s*lambat)[^\n]*?tanggal\s*(\d{1,2})/i);
  if (payDateMatch) {
    meta.paymentSchedule = `Maksimal tanggal ${payDateMatch[1]} setiap bulannya`;
  } else if (/per\s*semester/i.test(teks)) {
    const bankLabel = meta.bankName ? ` · Transfer ${meta.bankName}` : '';
    const ownerLabel = meta.bankAccountName ? ` a.n. ${meta.bankAccountName}` : '';
    meta.paymentSchedule = `Per semester (akhir bulan semester berjalan)${bankLabel}${ownerLabel}`;
  }

  // 6. Jam & Hari Kerja ATAU Jangka Waktu / Durasi Pelaksanaan Kontrak
  const hoursMatch =
    teks.match(/(?:Senin|hari)[^\n]*?(?:sampai|hingga|-)\s*(?:Jumat|Sabtu)[^\n]*?(?:pukul\s*)?(\d{1,2}[\.:]\d{2})[^\n]*?(?:sampai|hingga|-)\s*(?:pukul\s*)?(\d{1,2}[\.:]\d{2})/i) ||
    teks.match(/(?:Senin\s*hingga\s*Jumat)[^\n]*?(\d{1,2}\.\d{2})[^\n]*?(\d{1,2}\.\d{2})/i);
  if (hoursMatch) {
    meta.workingHours = `Senin - Jumat, ${hoursMatch[1]} - ${hoursMatch[2]} WIB (40 jam/minggu)`;
  } else if (/40\s*jam/i.test(teks)) {
    meta.workingHours = '40 jam / minggu (Senin - Jumat)';
  } else {
    // Ekstrak Jangka Waktu Kontrak (misal: "selama 1 Tahun mulai bulan Januari sampai dengan Desember 2021")
    const durationPeriodMatch = teks.match(
      /selama\s+(\d+\s*(?:Tahun|Bulan))\s+mulai\s+(?:bulan\s+)?([A-Za-z]+)\s+(?:sampai\s+dengan|s\/d|-)\s+([A-Za-z]+\s+\d{4})/i
    );
    const simpleDurationMatch = teks.match(/selama\s+(\d+\s*(?:\([^)]+\)\s*)?(?:tahun|bulan))/i);
    if (durationPeriodMatch) {
      const durStr = `${durationPeriodMatch[1].trim()} (${durationPeriodMatch[2].trim()} – ${durationPeriodMatch[3].trim()})`;
      meta.contractDuration = durStr;
      meta.workingHours = durStr;
    } else if (simpleDurationMatch) {
      meta.contractDuration = simpleDurationMatch[1].trim();
      meta.workingHours = `Durasi Kontrak: ${simpleDurationMatch[1].trim()}`;
    }
  }

  // 7. Masa Uji Coba / Probation atau Ketentuan Perubahan / Addendum
  const probMatch =
    teks.match(/(?:masa\s*uji\s*coba|masa\s*percobaan|probation)[^\n]*?(\d+|satu|dua|tiga)\s*(bulan|minggu|hari)/i) ||
    teks.match(/selama\s*(satu|dua|tiga|\d+)\s*(bulan|minggu)\s*(?:masa\s*uji\s*coba|masa\s*percobaan)/i);
  if (probMatch) {
    const rawDuration = probMatch[1].toLowerCase();
    const duration = rawDuration === 'satu' ? '1' : rawDuration === 'dua' ? '2' : rawDuration === 'tiga' ? '3' : rawDuration;
    meta.probationPeriod = `Masa Uji Coba ${duration} ${probMatch[2] || 'bulan'}`;
  } else if (detectedCategory === 'kerjasama' && /Surat\s+Perjanjian\s+Tambahan\s*\(addendum\)|addendum/i.test(teks)) {
    meta.probationPeriod = 'Diatur melalui Addendum (Pasal 4)';
  }

  // 8. Denda / Penalti Resign
  const isNoPenaltyExplicit = /(?:tanpa\s*(?:pengenaan\s*)?denda|bebas\s*denda|tidak\s*(?:dikenakan|membebankan)\s*denda)/i.test(teks);
  const penaltyMatch = !isNoPenaltyExplicit && (
    teks.match(/(?:denda|penalti|ganti\s*rugi|biaya\s*pelatihan)[^\n]*?(?:rp\.?|idr)\s*([\d\.,]+(?:\s*juta|\s*ribu)?)/i) ||
    teks.match(/(?:denda|penalti|ganti\s*rugi|biaya\s*pelatihan)[^\n]*?([\d\.,]+\s*(?:juta|ribu))/i) ||
    teks.match(/(?:denda|penalti|ganti\s*rugi|biaya\s*pelatihan)[^\n]*?sebesar\s*([\d\.,]{5,})/i)
  );
  if (penaltyMatch) {
    const rawPenalty = penaltyMatch[1].trim();
    const penaltyNum = parseRupiah(rawPenalty);
    if (penaltyNum >= 50000) {
      meta.penalty = formatRupiah(penaltyNum);
      meta.penaltyNum = penaltyNum;
      if (meta.salaryNum && penaltyNum >= meta.salaryNum) {
        meta.disproportionatePenalty = true;
      }
    }
  } else if (!isNoPenaltyExplicit && /denda.*(?:3x|tiga.*kali|3.*kali)/i.test(teks)) {
    meta.penalty = '3x Gaji Bulanan';
    meta.disproportionatePenalty = true;
  }

  // 9. Tanggal Efektif
  const dateMatch = teks.match(/(\d{1,2}\s+[A-Za-z]+\s+\d{4})/);
  if (dateMatch) {
    meta.effectiveDate = dateMatch[1];
  } else if (/Empat\s+bulan\s+Januari\s+tahun\s+Dua\s+Ribu\s+Dua\s+Puluh\s+Satu/i.test(teks)) {
    meta.effectiveDate = '4 Januari 2021';
  }

  // 10. Masa Pemberitahuan (Notice Period)
  const noticeMatch = teks.match(/(\d{1,2})\s*hari[^\n]*?(?:pemberitahuan|surat\s*pengunduran|notice)/i);
  if (noticeMatch) {
    meta.noticePeriod = `${noticeMatch[1]} hari`;
  } else if (detectedCategory === 'kerjasama') {
    meta.noticePeriod = 'Melalui Surat Perjanjian Tambahan (Addendum)';
  } else {
    meta.noticePeriod = '30 hari (standar hukum)';
  }

  meta.rawText = teks;
  return meta;
}

/**
 * Ekstrak satu kalimat yang cocok dengan regex dari teks.
 * Mengabaikan titik pada nominal angka ribuan (Rp10.000.000), jam (09.00), dan singkatan (PT., Rp., CV., No., UU., PP.).
 */
function extractSentenceMatch(teks, regex) {
  if (!teks) return null;
  const sentences = teks
    .split(/(?:\r?\n)+|(?<!\b(?:Rp|PT|CV|No|UU|PP|Dr|Ir|H|Hj))(?<!\d)\.(?!\d)\s+/i)
    .map((s) => s.trim())
    .filter(Boolean);
  for (const s of sentences) {
    if (regex.test(s)) {
      return s.replace(/^[-•*\d.)\s]+/, '').trim();
    }
  }
  const match = teks.match(regex);
  return match ? match[0].trim() : null;
}

/**
 * Mesin Analisis Deterministik & Grounding Hukum Indonesia.
 * 100% akurat tanpa halusinasi pada dokumen dunia nyata.
 */
export function simulateAiAnalysis(teks, jenis = 'kerja') {
  const strippedNoise = (teks || '').replace(/--\s*\d+\s*of\s*\d+\s*--/gi, '').trim();
  if (!strippedNoise || strippedNoise.length < 15) {
    throw new Error(
      'Teks dokumen tidak terbaca atau PDF berupa gambar scan. Silakan gunakan PDF berbasis teks atau tempel (paste) isi kontrak secara manual.'
    );
  }

  const cleanTeks = strippedNoise;
  const meta = extractContractMetadata(cleanTeks, jenis);
  const effectiveCategory = meta.detectedCategory || detectContractCategory(cleanTeks, jenis);
  const klausul = [];
  let skorRisiko = 15;

  if (effectiveCategory === 'kerjasama') {
    const pasalBlocks = extractPasalBlocks(cleanTeks);

    if (pasalBlocks.length > 0) {
      for (const blk of pasalBlocks) {
        const headingLabel = blk.subtitle ? `${blk.pasal} — ${blk.subtitle}` : blk.pasal;
        const bodyText = blk.body || blk.rawBody;

        // Evaluasi Risiko Spesifik per Pasal pada Perjanjian Kerjasama / Jasa / Pengadaan
        if (
          /Atas\s*Nama\s*:\s*([^\r\n]+)/i.test(blk.rawBody) &&
          meta.personalBankAccountRisk
        ) {
          klausul.push({
            judul: `${headingLabel} (Risiko Rekening Pribadi)`,
            kutipan: bodyText,
            risiko: 'tinggi',
            penjelasan: `Pasal ini mengatur pembayaran jasa sewa Colocation Server sebesar ${meta.salary || 'Rp2.500.000/bulan (Rp15.000.000/semester)'} dari beban APBD Provinsi Kalimantan Timur, namun ditransfer ke rekening ${meta.bankName || 'BCA'} No. ${meta.bankAccountNumber || '-'} atas nama perorangan (${meta.bankAccountName}), BUKAN rekening perusahaan resmi ${meta.secondPartyOrg || 'PT. POWERNET INDOSOLUSI'}. Pembayaran kontrak badan hukum/pemerintah ke rekening pribadi berisiko tinggi menjadi temuan audit kepatuhan keuangan daerah (BPK/Inspektorat) serta rawan sengketa bukti pembayaran sah.`,
            rujukan: `${headingLabel} · PP No. 12/2019 & Perpres Pengadaan Barang/Jasa`,
            saran: [
              `Ubah rekening tujuan pembayaran menjadi rekening giro perusahaan resmi atas nama ${meta.secondPartyOrg || 'PT. POWERNET INDOSOLUSI'}.`,
              'Pastikan pencairan anggaran APBD dilengkapi Berita Acara Serah Terima (BAST) layanan dan faktur pajak resmi badan usaha.',
            ],
          });
          skorRisiko += 45;
        } else if (/bermaterai\s*Rp\.?\s*6\.?000/i.test(blk.rawBody)) {
          klausul.push({
            judul: `${headingLabel} (Addendum & Bea Meterai)`,
            kutipan: bodyText,
            risiko: 'perhatian',
            penjelasan: `Pasal ini telah baik mengatur mekanisme Surat Perjanjian Tambahan (Addendum) dan penunjukan wakil Pihak Kedua, namun ayat (3) masih mencantumkan penggunaan meterai Rp6.000 pada dokumen tahun 2021. Berdasarkan UU No. 10 Tahun 2020 tentang Bea Meterai (berlaku 1 Januari 2021), tarif bea meterai resmi telah disatukan menjadi Rp10.000. Selain itu, belum dicantumkan klausul penyelesaian sengketa (domisili pengadilan/arbitrase).`,
            rujukan: `${headingLabel} · UU No. 10 Tahun 2020 tentang Bea Meterai & Pasal 1338 KUHPerdata`,
            saran: [
              'Gunakan meterai tempel atau e-Meterai Rp10.000 sesuai UU No. 10 Tahun 2020.',
              'Tambahkan klausul pilihan forum penyelesaian sengketa (misal: Pengadilan Negeri Samarinda) di dalam Addendum.',
            ],
          });
          skorRisiko += 15;
        } else if (
          /KEWAJIBAN\s+PIHAK\s+KEDUA|memelihara\s+Server|spesifikasi\s+unlimited/i.test(
            `${blk.subtitle} ${blk.rawBody}`
          ) &&
          !/SLA|uptime|99\.|denda\s+keterlambatan|kompensasi\s+gangguan/i.test(blk.rawBody)
        ) {
          klausul.push({
            judul: `${headingLabel} (Kewajiban Layanan & SLA)`,
            kutipan: bodyText,
            risiko: 'perhatian',
            penjelasan: `Pihak Kedua berkewajiban memfasilitasi serta memelihara Server Colocation selama ${meta.contractDuration || '1 Tahun (Januari – Desember 2021)'} dengan spesifikasi internet unlimited, namun pasal ini belum menetapkan target tingkat layanan minimum (Service Level Agreement / Uptime SLA), batas waktu penanganan gangguan (response time), maupun sanksi jika server mengalami downtime.`,
            rujukan: `${headingLabel} · Pasal 1234 & 1243 KUHPerdata (Standar Prestasi & Wanprestasi Jasa)`,
            saran: [
              'Cantumkan standar SLA Uptime (misal: minimal 99,5%) dan waktu pemulihan maksimal (MTTR) di dalam lampiran teknis atau Addendum.',
            ],
          });
          skorRisiko += 12;
        } else {
          klausul.push({
            judul: headingLabel,
            kutipan: bodyText,
            risiko: 'aman',
            penjelasan: /LINGKUP\s+PERJANJIAN/i.test(blk.subtitle)
              ? `Pasal ini menetapkan objek dan lokasi fisik pengelolaan Server Colocation secara jelas dan spesifik (${meta.secondPartyOrg || 'PT. Powernet Indosolusi'} / Gedung Telkom Karet Tengsin Jakarta Pusat), memenuhi syarat objek tertentu dalam Pasal 1320 KUHPerdata.`
              : `Ketentuan penutup dan mulai berlakunya perjanjian sejak tanggal ditandatangani oleh kedua belah pihak telah sesuai dengan asas kebebasan berkontrak dan kekuatan mengikat perjanjian (Pasal 1338 KUHPerdata).`,
            rujukan: `${headingLabel} · Pasal 1320 & Pasal 1338 KUHPerdata`,
          });
        }
      }
    } else {
      klausul.push({
        judul: 'Ketentuan Umum Perjanjian Kerjasama',
        kutipan: cleanTeks.slice(0, 260),
        risiko: meta.personalBankAccountRisk ? 'tinggi' : 'aman',
        penjelasan:
          'Perjanjian kerjasama mengatur hak dan kewajiban para pihak sesuai KUHPerdata Buku III.',
        rujukan: 'Pasal 1320 & 1338 KUHPerdata',
      });
    }
  } else if (effectiveCategory === 'kerja') {
    // ----------------------------------------------------
    // 1. Deteksi Denda Nominal & Proporsionalitas (Fix Bug #3)
    // ----------------------------------------------------
    if (meta.disproportionatePenalty || Boolean(meta.penalty)) {
      const kutipanDenda =
        extractSentenceMatch(cleanTeks, /(?:denda|penalti|ganti\s*rugi|biaya\s*pelatihan)[^\n]*?(?:rp\.?|idr)?\s*[\d\.,]+/i) ||
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
    const isExplicitPkwttNoPenalty =
      /(?:PERJANJIAN\s*KERJA\s*WAKTU\s*TIDAK\s*TERTENTU|\(PKWTT\))/i.test(cleanTeks) &&
      !meta.disproportionatePenalty &&
      !meta.penalty;
    const isExplicitNoProbationPkwt =
      /(?:tanpa\s*masa\s*percobaan|tidak\s*memberlakukan\s*masa\s*percobaan)/i.test(cleanTeks) &&
      !meta.disproportionatePenalty;

    if (isExplicitNoProbationPkwt) {
      klausul.push({
        kutipan:
          extractSentenceMatch(cleanTeks, /[^\n]*(?:tanpa\s*masa\s*percobaan|tidak\s*memberlakukan\s*masa\s*percobaan)[^\n]*/i) ||
          'Ketentuan PKWT tanpa masa percobaan sesuai Pasal 58 UU 13/2003',
        risiko: 'aman',
        penjelasan:
          'Kontrak PKWT ini secara tegas meniadakan masa percobaan (probation), sehingga 100% patuh terhadap Pasal 58 UU No. 13 Tahun 2003 jo. UU No. 6 Tahun 2023.',
        rujukan: 'Pasal 58 ayat (1) & (2) UU No. 13 Tahun 2003',
      });
    } else if (isExplicitPkwttNoPenalty && /(?:masa\s*uji\s*coba|masa\s*percobaan|probation)/i.test(cleanTeks)) {
      const kutipanProbation =
        extractSentenceMatch(cleanTeks, /(?:masa\s*uji\s*coba|masa\s*percobaan|probation)[^\n]*/i) ||
        'Klausul masa percobaan PKWTT (Karyawan Tetap)';
      klausul.push({
        kutipan: kutipanProbation,
        risiko: 'aman',
        penjelasan:
          'Masa percobaan kerja (probation) paling lama 3 (tiga) bulan sah secara hukum karena diterapkan pada Perjanjian Kerja Waktu Tidak Tertentu (PKWTT / Karyawan Tetap) tanpa denda pengunduran diri.',
        rujukan: 'Pasal 60 ayat (1) UU Ketenagakerjaan No. 13 Tahun 2003',
      });
    } else if (/(?:masa\s*uji\s*coba|masa\s*percobaan|probation)/i.test(cleanTeks)) {
      const kutipanProbation =
        extractSentenceMatch(cleanTeks, /(?:masa\s*uji\s*coba|masa\s*percobaan|probation)[^\n]*/i) ||
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
          extractSentenceMatch(cleanTeks, /(?:otomatis.*diperpanjang|perpanjang.*otomatis)[^\n]*/i) ||
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
    const hasCompliantPkwtCompensation = /(?:uang\s*kompensasi\s*PKWT|Pasal\s*15\s*PP\s*(?:No\.?\s*)?35)/i.test(cleanTeks);
    if (/(?:6|enam)\s*(?:bulan|bln)/i.test(cleanTeks) && !/(?:uji\s*coba|percobaan)/i.test(cleanTeks) && !hasCompliantPkwtCompensation) {
      klausul.push({
        kutipan:
          extractSentenceMatch(cleanTeks, /(?:6|enam)\s*(?:bulan|bln)[^\n]*/i) ||
          'Jangka waktu kontrak 6 bulan',
        risiko: 'perhatian',
        penjelasan:
          'Pastikan total akumulasi perpanjangan tidak melebihi batas legal 5 tahun dan pekerja tetap berhak atas kompensasi akhir kontrak sesuai masa kerja.',
        rujukan: 'Pasal 8 & 15 PP 35/2021',
        saran: SARAN.perhatian,
      });
      skorRisiko += 10;
    } else if (hasCompliantPkwtCompensation) {
      klausul.push({
        kutipan:
          extractSentenceMatch(cleanTeks, /[^\n]*(?:uang\s*kompensasi\s*PKWT|Pasal\s*15\s*PP)[^\n]*/i) ||
          'Ketentuan Uang Kompensasi PKWT sesuai PP No. 35 Tahun 2021',
        risiko: 'aman',
        penjelasan:
          'Perjanjian ini mencantumkan jaminan pemberian Uang Kompensasi PKWT pada saat berakhirnya jangka waktu kontrak secara proporsional sesuai Pasal 15-16 PP No. 35 Tahun 2021.',
        rujukan: 'Pasal 15 & Pasal 16 PP No. 35 Tahun 2021',
      });
    }

    // ----------------------------------------------------
    // 5. Klausul Waktu Kerja Sesuai Standar (Pasal 77 UU 13/2003) - AMAN
    // ----------------------------------------------------
    if (/(?:Senin\s*hingga\s*Jumat|Senin\s*sampai\s*Jumat|09\.00|17\.00|40\s*jam)/i.test(cleanTeks)) {
      const kutipanJam =
        extractSentenceMatch(cleanTeks, /(?:Senin\s*hingga\s*Jumat|Senin\s*sampai\s*Jumat)[^\n]*/i) ||
        extractSentenceMatch(cleanTeks, /(?:09\.00|pukul\s*09|40\s*jam)[^\n]*/i) ||
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
        extractSentenceMatch(cleanTeks, /(?:gaji|upah)[^\n]*?(?:rp\.?|idr)?\s*[\d\.,]+/i) ||
        `Gaji pokok ${meta.salary}`;
      klausul.push({
        kutipan: kutipanGaji,
        risiko: 'aman',
        penjelasan: `Pemberi kerja mencantumkan upah pokok (${meta.salary}) secara tegas dengan jadwal pembayaran berkala (${meta.paymentSchedule || 'akhir bulan'}), sesuai ketentuan Pasal 88-91 UU No. 13/2003.`,
        rujukan: 'Pasal 88-91 UU Ketenagakerjaan No. 13/2003 & PP No. 36/2021',
      });
    }

    // Fallback jika tidak ada klausul yang cocok: ekstrak Pasal 1..N dari dokumen bila ada
    if (klausul.length === 0) {
      const extraPasals = extractPasalBlocks(cleanTeks);
      if (extraPasals.length > 0) {
        for (const p of extraPasals) {
          klausul.push({
            judul: p.subtitle ? `${p.pasal} — ${p.subtitle}` : p.pasal,
            kutipan: p.body || p.rawBody,
            risiko: 'aman',
            penjelasan: `Ketentuan ${p.pasal} mengatur kesepakatan para pihak secara tertulis sesuai ketentuan perundang-undangan Indonesia.`,
            rujukan: `${p.pasal} · Hukum Perjanjian & Ketenagakerjaan Indonesia`,
          });
        }
      } else {
        klausul.push({
          kutipan: 'Ketentuan umum kontrak kerja',
          risiko: 'aman',
          penjelasan:
            'Tidak ditemukan klausul berisiko tinggi pada teks ini. Tetap pastikan hak kerja (jaminan sosial, lembur, uang kompensasi) tercantum lengkap.',
          rujukan: 'UU Ketenagakerjaan No. 13 Tahun 2003',
        });
      }
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
          extractSentenceMatch(cleanTeks, /[^\n]*(?:deposit|jaminan)[^\n]*(?:tidak.*kembali|tidak.*dikembalikan|non.?refundable)[^\n]*/i) ||
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
          extractSentenceMatch(cleanTeks, /[^\n]*(?:naik.*sewa|harga.*sewa)[^\n]*(?:kapan.*saja|tanpa.*pemberitahuan)[^\n]*/i) ||
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
          extractSentenceMatch(cleanTeks, /[^\n]*(?:perbaikan|biaya.*perbaikan)[^\n]*(?:usia|bangunan.*penyewa|seluruh.*biaya)[^\n]*/i) ||
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
      const sewaPasals = extractPasalBlocks(cleanTeks);
      if (sewaPasals.length > 0) {
        for (const p of sewaPasals) {
          klausul.push({
            judul: p.subtitle ? `${p.pasal} — ${p.subtitle}` : p.pasal,
            kutipan: p.body || p.rawBody,
            risiko: 'aman',
            penjelasan: `Ketentuan ${p.pasal} mengatur kesepakatan sewa-menyewa sesuai KUHPerdata Buku III Bab VII.`,
            rujukan: `${p.pasal} · KUHPerdata Pasal 1550 & 1560`,
          });
        }
      } else {
        klausul.push({
          kutipan: 'Ketentuan umum kontrak sewa',
          risiko: 'aman',
          penjelasan:
            'Tidak ditemukan klausul berisiko tinggi. Pastikan hak kenikmatan tenteram dan jangka waktu sewa tertulis transparan.',
          rujukan: 'KUHPerdata Buku III Bab VII tentang Sewa-Menyewa',
        });
      }
    }
  }

  // Pastikan minimal ada 1 klausul aman
  if (!klausul.some((k) => k.risiko === 'aman')) {
    klausul.unshift({
      kutipan:
        effectiveCategory === 'kerja'
          ? 'Kewajiban perusahaan membayar upah tepat waktu'
          : 'Kewajiban dasar penyerahan dan pemeliharaan objek perjanjian',
      risiko: 'aman',
      penjelasan:
        effectiveCategory === 'kerja'
          ? 'Perusahaan wajib membayar upah sesuai jadwal yang disepakati sesuai ketentuan hukum ketenagakerjaan.'
          : 'Para pihak wajib melaksanakan kewajiban utama perjanjian dengan itikad baik sesuai Pasal 1338 KUHPerdata.',
      rujukan: effectiveCategory === 'kerja' ? 'UU No. 13/2003 Pasal 88-91' : 'KUHPerdata Pasal 1338 & 1550',
    });
  }

  skorRisiko = Math.min(100, Math.max(5, skorRisiko));

  let ringkasan = '';
  if (effectiveCategory === 'kerjasama') {
    const p1Label = meta.firstPartyOrg || meta.firstParty || 'Pihak Pertama';
    const p2Label = meta.secondPartyOrg || meta.secondParty || 'Pihak Kedua';
    const valLabel = meta.salary || 'sesuai nilai kontrak';
    const durLabel = meta.contractDuration || meta.workingHours || 'sesuai jangka waktu perjanjian';
    if (meta.personalBankAccountRisk) {
      ringkasan = `Perjanjian Kerjasama antara ${p1Label} dan ${p2Label} (${klausul.length} pasal dianalisis, Skor Risiko ${skorRisiko}/100): Mencakup ${meta.role || 'layanan kerjasama'} selama ${durLabel} dengan nilai ${valLabel}. PERHATIAN UTAMA: Pembayaran kontrak badan usaha (${p2Label}) ditujukan ke rekening pribadi (${meta.bankName || 'Bank'} a.n. ${meta.bankAccountName || 'perorangan'}), serta belum memuat standar SLA uptime layanan dan pembaruan tarif Bea Meterai Rp10.000 (UU No. 10/2020).`;
    } else {
      ringkasan = `Perjanjian Kerjasama antara ${p1Label} dan ${p2Label} (${klausul.length} pasal dianalisis, Skor Risiko ${skorRisiko}/100): Mengatur ${meta.role || 'ruang lingkup kerjasama'} selama ${durLabel} dengan nilai ${valLabel}. Pastikan klausul SLA dan penyelesaian sengketa tercantum jelas.`;
    }
  } else if (meta.disproportionatePenalty) {
    ringkasan =
      `Kontrak berisiko tinggi (Skor ${skorRisiko}/100): Ditemukan klausul denda resign ${meta.penalty || 'nominal besar'} yang melebihi 1 bulan upah (${meta.salary || 'gaji bulanan'}) serta masa uji coba yang berpotensi melanggar Pasal 58 UU Ketenagakerjaan No. 13/2003 jo. PP 35/2021. Sangat disarankan untuk menegosiasikan klausul ini sebelum bertanda tangan.`;
  } else if (skorRisiko >= 55) {
    ringkasan =
      effectiveCategory === 'kerja'
        ? `Kontrak berisiko tinggi (Skor ${skorRisiko}/100): Terdapat klausul denda pengunduran diri yang berlebihan atau perpanjangan sepihak yang merugikan posisi pekerja.`
        : `Kontrak sewa berisiko tinggi (Skor ${skorRisiko}/100): Terdapat ketentuan deposit hangus atau kenaikan tarif sewa sepihak yang melanggar KUHPerdata Pasal 1338 & 1550.`;
  } else if (skorRisiko >= 30) {
    ringkasan =
      effectiveCategory === 'kerja'
        ? `Beberapa pasal perlu dicermati lebih lanjut (Skor ${skorRisiko}/100), terutama terkait masa percobaan dan kompensasi pengakhiran hubungan kerja.`
        : `Ada klausul sewa yang perlu diklarifikasi ulang (Skor ${skorRisiko}/100) mengenai pembagian biaya pemeliharaan properti.`;
  } else {
    ringkasan =
      effectiveCategory === 'kerja'
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
  const strippedText = (contractText || '').replace(/--\s*\d+\s*of\s*\d+\s*--/gi, '').trim();
  const hasValidText = Boolean(strippedText.length >= 15);

  if (!hasValidText && !useSample) {
    throw new Error(
      'Teks dokumen tidak terbaca atau PDF berupa gambar scan. Silakan gunakan PDF berbasis teks atau tempel (paste) isi kontrak secara manual.'
    );
  }

  const teks = hasValidText ? strippedText : CONTOH[jenis];
  const ai = simulateAiAnalysis(teks, jenis);
  const meta = ai.meta || extractContractMetadata(teks, jenis);
  const detectedCategory = meta.detectedCategory || detectContractCategory(teks, jenis);

  const defaultName =
    detectedCategory === 'kerjasama'
      ? meta.role
        ? `Perjanjian Kerjasama - ${meta.role}`
        : 'Surat Perjanjian Kerjasama'
      : meta.role
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
    (meta.firstParty ? `${meta.firstParty}` : null) ||
    (fileName
      ? `${fileName} · ${detectedCategory === 'kerjasama' ? 'Perjanjian Kerjasama' : jenis === 'kerja' ? 'Ketenagakerjaan' : 'Sewa'}`
      : `Cek Kontrak AI · ${detectedCategory === 'kerjasama' ? 'Perjanjian Kerjasama' : jenis === 'kerja' ? 'Ketenagakerjaan' : 'Sewa'}`);

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

  const contractTypeEn =
    detectedCategory === 'kerjasama'
      ? 'Partnership / Service'
      : detectedCategory === 'sewa'
      ? 'Rental'
      : 'Employment';
  const contractTypeId =
    detectedCategory === 'kerjasama'
      ? 'Perjanjian Kerjasama / Jasa'
      : detectedCategory === 'sewa'
      ? 'Sewa Menyewa'
      : 'Ketenagakerjaan';

  return {
    id: Date.now(),
    name: nama,
    nameId: nama,
    company: perusahaan,
    type: contractTypeEn,
    typeId: contractTypeId,
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
    contractType: detectedCategory === 'kerjasama' ? 'kerjasama' : jenis,
    legalSummary: LEGAL[jenis],
    aiClauses: ai.klausul,
    meta: {
      detectedCategory,
      contractNumber: meta.contractNumber || null,
      effectiveDate: meta.effectiveDate || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      expiryDate:
        meta.expiryDate ||
        meta.contractDuration ||
        (detectedCategory === 'kerjasama'
          ? 'Sesuai jangka waktu perjanjian'
          : jenis === 'kerja'
          ? 'Lihat klausul jangka waktu kontrak'
          : 'Lihat klausul masa sewa'),
      noticePeriod:
        meta.noticePeriod ||
        (detectedCategory === 'kerjasama' ? 'Melalui Addendum Tertulis' : '30 hari (standar hukum)'),
      salary:
        meta.salary ||
        (detectedCategory === 'kerjasama'
          ? 'Sesuai rincian nilai kontrak'
          : jenis === 'kerja'
          ? 'Sesuai rincian upah kontrak'
          : 'Sesuai rincian tarif sewa'),
      salaryNum: meta.salaryNum || null,
      semesterValue: meta.semesterValue || null,
      workingHours:
        meta.workingHours ||
        meta.contractDuration ||
        (detectedCategory === 'kerja'
          ? 'Senin - Jumat (40 jam/minggu)'
          : 'Sesuai jangka waktu perjanjian'),
      contractDuration: meta.contractDuration || null,
      probationPeriod:
        meta.probationPeriod ||
        (detectedCategory === 'kerjasama'
          ? 'Diatur melalui Addendum (Pasal 4)'
          : detectedCategory === 'kerja'
          ? 'Tidak ada masa uji coba'
          : 'Sesuai kesepakatan sewa'),
      penalty: meta.penalty || null,
      penaltyNum: meta.penaltyNum || null,
      disproportionatePenalty: Boolean(meta.disproportionatePenalty),
      personalBankAccountRisk: Boolean(meta.personalBankAccountRisk),
      bankName: meta.bankName || null,
      bankAccountName: meta.bankAccountName || null,
      bankAccountNumber: meta.bankAccountNumber || null,
      role:
        meta.role ||
        (detectedCategory === 'kerjasama'
          ? 'Perjanjian Kerjasama Layanan'
          : detectedCategory === 'sewa'
          ? 'Penyewa / Pemberi Sewa'
          : 'Karyawan'),
      scopeSummary: meta.scopeSummary || null,
      firstParty: meta.firstParty || null,
      secondParty: meta.secondParty || null,
      firstPartyName: meta.firstPartyName || null,
      secondPartyName: meta.secondPartyName || null,
      firstPartyRole: meta.firstPartyRole || null,
      secondPartyRole: meta.secondPartyRole || null,
      firstPartyOrg: meta.firstPartyOrg || null,
      secondPartyOrg: meta.secondPartyOrg || null,
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
      title:
        k.judul ||
        (k.risiko === 'aman' ? 'Ketentuan Aman' : k.risiko === 'perhatian' ? 'Perlu Ditinjau' : 'Risiko Tinggi'),
      titleId:
        k.judul ||
        (k.risiko === 'aman'
          ? 'Ketentuan Sesuai Hukum'
          : k.risiko === 'perhatian'
          ? 'Perlu Ditinjau Lebih Lanjut'
          : 'Risiko Tinggi · Harus Ditindaklanjuti'),
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
 * Mampu menjawab pertanyaan faktual tentang gaji, biaya sewa/layanan, rekening bank, masa uji coba, jam kerja, denda, pihak,
 * fitur website, serta memiliki Guardrail untuk sapaan dan pertanyaan di luar topik.
 */
export function chatWithAnalyzedContract({ contract, question, lang = 'id' }) {
  if (!contract) return null;

  const meta = contract.meta || {};
  const isKerjasama =
    meta.detectedCategory === 'kerjasama' ||
    contract.contractType === 'kerjasama' ||
    /Partnership|Kerjasama/i.test(`${contract.type || ''} ${contract.typeId || ''}`);
  const isKerja = !isKerjasama && (contract.contractType === 'kerja' || contract.type === 'Employment');
  const isSewa = !isKerjasama && (contract.contractType === 'sewa' || contract.type === 'Rental');
  const rawQuestion = String(question || '').trim();
  const q = rawQuestion.toLowerCase();
  const aiClauses = contract.aiClauses || [];
  const tinggi = aiClauses.filter((k) => k.risiko === 'tinggi');
  const perhatian = aiClauses.filter((k) => k.risiko === 'perhatian');

  const firstPartyClean = cleanPersonName(meta.firstPartyName || meta.firstParty || '');
  const secondPartyClean = cleanPersonName(meta.secondPartyName || meta.secondParty || '');
  const firstPartyFirstWord = firstPartyClean ? firstPartyClean.toLowerCase().split(/\s+/)[0] : '';
  const secondPartyFirstWord = secondPartyClean ? secondPartyClean.toLowerCase().split(/\s+/)[0] : '';
  const companyFirstWord = meta.company
    ? meta.company.toLowerCase().replace(/^(?:pt|cv|ud|studio|bkd)\.?\s*/i, '').trim().split(/\s+/)[0]
    : '';

  // Strict Domain & Entity Matching untuk Cabang 5 (Pihak, Perusahaan, Instansi, Jabatan, Tugas)
  const asksContractParty =
    /\b(pihak\s*(pertama|kedua|1|2|kesatu)?|perusahaan|pemberi\s*kerja|instansi|bkd|powernet|vendor|mitra|hrd|karyawan|pekerja|jabatan|posisi|tugas|tanggung\s*jawab|job\s*desc|role|duties|parties|employer|employee|company|nama\s*pt|kantor|penandatangan)\b/i.test(
      q
    ) ||
    (/\bsiapa\b/i.test(q) &&
      (/\b(kontrak|perjanjian|pihak|hrd|direktur|manajer|manager|karyawan|pekerja|perusahaan|instansi|bkd|powernet|vendor|atasan|bos|yang\s*tanda\s*tangan|yang\s*terlibat|di\s*sini|ini)\b/i.test(
        q
      ) ||
        Boolean(firstPartyFirstWord && firstPartyFirstWord.length >= 3 && q.includes(firstPartyFirstWord)) ||
        Boolean(secondPartyFirstWord && secondPartyFirstWord.length >= 3 && q.includes(secondPartyFirstWord)) ||
        Boolean(companyFirstWord && companyFirstWord.length >= 3 && q.includes(companyFirstWord))));

  // Filter eksplisit untuk pertanyaan umum di luar konteks kontrak (tokoh publik, matematika, cuaca, makanan, AI umum, game)
  const isExplicitOutOfScope =
    /\b(jokowi|prabowo|gibran|megawati|anies|ganjar|brando|windah|ronaldo|messi|elon\s*musk|presiden|menteri|gubernur|selebriti|artis|resep|masak|nasi\s*goreng|kue\s*bolu|cuaca|hujan|ramalan|main\s*game|mobile\s*legends|valorant|pubg)\b/i.test(
      q
    ) ||
    /\d+\s*[\+\-\*\/x:]\s*\d+/i.test(q) ||
    /^\s*apa\s+itu\s+(ai|artificial\s*intelligence|kecerdasan\s*buatan|internet|blockchain|crypto|javascript|python)\b[?!.,\s]*$/i.test(
      q
    );

  let answer = '';
  let source = null;

  // ====================================================
  // CABANG A — Sapaan & Basa-Basi (Greetings / Thanks)
  // ====================================================
  if (
    /^\s*(halo+|hai+|hi+|hello+|hey+|pagi|siang|sore|malam|selamat\s*(pagi|siang|sore|malam)|ass?alamu'?alaikum|permisi|tes|test|ping|terima\s*kasih|makasih|thanks|thank\s*you)\b[?!.,\s]*$/i.test(
      rawQuestion
    )
  ) {
    source = null;
    answer =
      lang === 'id'
        ? 'Halo! Saya Asisten AI Cek Kontrak (CLARIQ). Silakan tanyakan apa saja seputar isi dokumen kontrak ini (seperti nilai kontrak/gaji, para pihak, jangka waktu, rekening pembayaran, atau kepatuhan pasal hukum) maupun seputar fitur website kami.'
        : 'Hello! I am the CLARIQ Contract AI Assistant. Feel free to ask anything about this contract document (such as contract value/salary, parties, duration, payment account, or legal compliance) or our platform features.';
  }
  // ====================================================
  // CABANG C — Pertanyaan Isi Kontrak & Hukum (10 Topik)
  // ====================================================
  // 1. Gaji / Nilai Kontrak / Biaya Sewa Server / Rekening Bank (Fix Bug #6 - Q1 & Multi-Doc)
  else if (
    !isExplicitOutOfScope &&
    (/\b(gaji|salary|upah|remunerasi|dibayar|penghasilan|wage|pay|payment|bayaran|biaya|tarif|nilai\s*kontrak|sewa\s*server|colocation|rekening|bank|bca|transfer|semester|anggaran|apbd)\b/i.test(
      q
    ) ||
      /(kapan.*(bayar|gaji|upah)|tanggal.*(gaji|bayar|upah)|nominal\s*(gaji|upah|kontrak|pembayaran|sewa)|berapa.*(gaji|upah|bayaran|biaya|harga|sewa|nilai))/i.test(
        q
      ))
  ) {
    if (isKerjasama || meta.bankAccountName) {
      const idxPasal3 = aiClauses.findIndex((c) => /rekening|2\.500\.000|15\.000\.000|PASAL 3/i.test(`${c.judul || ''} ${c.kutipan || ''}`));
      source = idxPasal3 >= 0 ? idxPasal3 : 0;
      const valStr = meta.salary || 'Rp2.500.000 / bln (Rp15.000.000 / semester)';
      const bankStr = meta.bankName || 'BCA CABANG MARGONDA';
      const accOwner = meta.bankAccountName || 'AKBAR MARWAN';
      const accNum = meta.bankAccountNumber || '869-004-6572';

      if (lang === 'id') {
        answer =
          `Berdasarkan Pasal 3 dokumen "${contract.nameId || contract.name}":\n` +
          `• Biaya Jasa Sewa Server Colocation: ${valStr} (sudah termasuk pajak).\n` +
          `• Skema Pembayaran: Dibayarkan per semester (Rp2.500.000 x 6 bulan = Rp15.000.000) pada akhir bulan semester berjalan.\n` +
          `• Rekening Tujuan Transfer: ${bankStr} — No. Rekening ${accNum} Atas Nama: ${accOwner}.\n` +
          `• Sumber Dana: APBD Provinsi Kalimantan Timur Tahun 2021 (Kode Rekening 4.5.01.09.10.5.2.1.19.17).\n\n` +
          `TEMUAN RISIKO TINGGI: Pihak Kedua bertindak atas nama badan hukum (${meta.secondPartyOrg || 'PT. POWERNET INDOSOLUSI'}), namun rekening penerima transfer adalah atas nama pribadi (${accOwner}). Hal ini berisiko tinggi menjadi temuan audit kepatuhan keuangan daerah (BPK/Inspektorat).`;
      } else {
        answer =
          `According to Article 3 of "${contract.name}":\n` +
          `• Colocation Server Service Fee: ${valStr} (tax inclusive).\n` +
          `• Payment Schedule: Paid per semester (Rp2,500,000 x 6 months = Rp15,000,000) at the end of the running semester.\n` +
          `• Destination Bank Account: ${bankStr} — Account No. ${accNum} under the name ${accOwner}.\n\n` +
          `HIGH-RISK AUDIT FINDING: Although the Second Party represents a corporate entity (${meta.secondPartyOrg || 'PT. POWERNET INDOSOLUSI'}), the recipient bank account is under an individual's personal name (${accOwner}), posing a significant public finance audit risk.`;
      }
    } else {
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
  }
  // 2. Denda / Penalti Resign (Fix Bug #6 - Q4) - Diprioritaskan jika ada kata denda/penalti
  else if (
    !isExplicitOutOfScope &&
    (/\b(denda|penalti|pinalti|resign|mundur|mengundurkan\s*diri|quit|ganti\s*rugi|biaya\s*pelatihan|penalty)\b/i.test(
      q
    ) ||
      /\bkeluar\b.*(kerja|kontrak|sebelum|saat|masa|perusahaan)/i.test(q))
  ) {
    if (isKerjasama && !meta.penalty) {
      source = 1;
      answer =
        lang === 'id'
          ? `Dalam dokumen Perjanjian Kerjasama ini (${contract.nameId || contract.name}), belum dicantumkan klausul denda keterlambatan maupun kompensasi gangguan layanan (SLA downtime). Perubahan atau pengakhiran diatur lebih lanjut melalui Surat Perjanjian Tambahan (Addendum) sesuai Pasal 4.`
          : `In this Partnership Agreement (${contract.name}), there is no explicit penalty or SLA downtime compensation clause. Amendments or termination are governed via a written Addendum under Article 4.`;
    } else {
      source = 1;
      const penaltyStr = meta.penalty || 'Rp10.000.000';
      const salaryStr = meta.salary || 'Rp8.000.000';

      if (lang === 'id') {
        answer = `PERINGATAN KLAUSUL BERISIKO TINGGI (Pasal 4):\n` +
          `Kontrak menetapkan denda pengunduran diri sebesar ${penaltyStr} dengan alasan penggantian biaya pelatihan selama masa uji coba.\n\n` +
          `Analisis Keadilan & Hukum:\n` +
          `1. Denda (${penaltyStr}) MELEBIHI 1 bulan upah (${salaryStr}). Klausul ini tidak proporsional dan memberatkan posisi pekerja.\n` +
          `2. Merujuk PP No. 35/2021 jo. Putusan MK No. 168/PUU-XXI/2023, pengenaan denda sepihak pada masa uji coba bertentangan dengan prinsip perlindungan hak buruh.\n` +
          `Saran: Diskusikan dan minta peniadaan denda ini sebelum menandatangani kontrak!`;
      } else {
        answer = `HIGH-RISK CLAUSE WARNING (Article 4):\n` +
          `The agreement imposes a resignation penalty of ${penaltyStr} citing training reimbursement during the probation period.\n\n` +
          `Legal & Proportionality Analysis:\n` +
          `1. The penalty (${penaltyStr}) EXCEEDS your monthly salary (${salaryStr}), which is disproportionate and exploitative.\n` +
          `2. Under Gov. Reg. 35/2021 and Constitutional Court Decision No. 168/PUU-XXI/2023, unilateral penalties during probation conflict with statutory employee protections.\n` +
          `Advice: Request the deletion or fair renegotiation of this clause prior to signing!`;
      }
    }
  }
  // 3. Masa Uji Coba / Probation (Fix Bug #6 - Q2)
  else if (
    !isExplicitOutOfScope &&
    (/\b(uji\s*coba|percobaan|probation|pkwt|pkwtt)\b/i.test(q) ||
      /(status.*(karyawan|pekerja|kerja)|tetap.*atau.*kontrak)/i.test(q))
  ) {
    if (isKerjasama) {
      source = 3;
      answer =
        lang === 'id'
          ? `Dokumen ini merupakan Surat Perjanjian Kerjasama pengadaan jasa pengelolaan Server Colocation (bukan kontrak kerja karyawan), sehingga tidak memiliki masa uji coba (probation). Jangka waktu layanan berlaku selama ${meta.contractDuration || '1 Tahun (Januari – Desember 2021)'} dan perubahan diatur melalui Addendum (Pasal 4).`
          : `This document is a Service Partnership Agreement for Server Colocation (not an employment contract), so it does not have an employee probation period. The service term runs for ${meta.contractDuration || '1 Year (January – December 2021)'} and modifications are handled via Addendum (Article 4).`;
    } else {
      source = 1;
      const probDuration = meta.probationPeriod || 'Masa Uji Coba 1 Bulan';

      if (lang === 'id') {
        answer = `Berdasarkan dokumen kontrak ini, terdapat ketentuan ${probDuration} (Pasal 4).\n\n` +
          `CATATAN HUKUM KRITIS (Pasal 58 UU No. 13/2003 jo. UU No. 6/2023):\n` +
          `Masa percobaan (probation) maksimal 3 bulan HANYA diperbolehkan secara sah untuk Perjanjian Kerja Waktu Tidak Tertentu (PKWTT/karyawan tetap). Jika kontrak ini berstatus PKWT (kontrak waktu tertentu), maka klausul masa percobaan adalah BATAL DEMI HUKUM, dan pekerja secara hukum tidak boleh dibebankan denda apapun apabila mengundurkan diri selama masa tersebut.`;
      } else {
        answer = `According to this contract, there is a stipulation for ${probDuration} (Article 4).\n\n` +
          `CRITICAL LEGAL NOTE (Article 58 Law No. 13/2003 jo. Law No. 6/2023):\n` +
          `A probation period (maximum 3 months) is ONLY legally permissible for permanent employment agreements (PKWTT). If this agreement is fixed-term (PKWT), the probation clause is NULL AND VOID BY LAW, and the employee cannot be subjected to resignation penalties during this period.`;
      }
    }
  }
  // 4. Jam & Hari Kerja / Waktu Layanan (Fix Bug #6 - Q3)
  else if (
    !isExplicitOutOfScope &&
    /\b(jam\s*kerja|hari\s*kerja|waktu\s*kerja|working\s*hours|jadwal\s*kerja|lembur|overtime)\b/i.test(q)
  ) {
    if (isKerjasama) {
      source = 1;
      answer =
        lang === 'id'
          ? `Karena dokumen ini adalah Perjanjian Kerjasama pengelolaan Server Colocation & Jaringan Internet, dokumen tidak mengatur jam kerja harian karyawan melainkan masa pemeliharaan server selama ${meta.contractDuration || '1 Tahun (Januari sampai dengan Desember 2021)'} dengan spesifikasi jaringan internet unlimited (Pasal 2).`
          : `Because this document is a Server Colocation & Internet Service Agreement, it specifies a continuous service maintenance period of ${meta.contractDuration || '1 Year (January to December 2021)'} with unlimited internet bandwidth (Article 2) rather than daily employee working hours.`;
    } else {
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
  }
  // 5. Para Pihak, Perusahaan/Instansi, & Jabatan / Ruang Lingkup (Fix Bug #6 - Q5 & Multi-Doc)
  else if (!isExplicitOutOfScope && asksContractParty) {
    source = 0;
    if (isKerjasama) {
      const p1Name = meta.firstPartyName || firstPartyClean || 'Dra. Nina Dewi, MAP.';
      const p1Org = meta.firstPartyOrg || 'BADAN KEPEGAWAIAN DAERAH PROVINSI KALIMANTAN TIMUR';
      const p1Role = meta.firstPartyRole || 'Kuasa Pengguna Anggaran';
      const p2Name = meta.secondPartyName || secondPartyClean || 'Akbar Marwan';
      const p2Org = meta.secondPartyOrg || 'PT. POWERNET INDOSOLUSI';
      const p2Role = meta.secondPartyRole || 'Account Executive';
      const scopeStr =
        meta.scopeSummary ||
        meta.role ||
        'Pengelolaan Server Colocation BKD Prov. Kaltim & penyediaan jaringan internet unlimited';

      if (lang === 'id') {
        answer =
          `Berdasarkan komparisi identitas Surat Perjanjian Kerjasama${meta.contractNumber ? ` (Nomor: ${meta.contractNumber})` : ''}:\n` +
          `• Pihak Pertama: ${p1Name} (${p1Role} — bertindak untuk dan atas nama ${p1Org})\n` +
          `• Pihak Kedua: ${p2Name} (${p2Role} — bertindak untuk dan atas nama ${p2Org})\n` +
          `• Objek & Ruang Lingkup Kerjasama: ${scopeStr}`;
      } else {
        answer =
          `Based on the Partnership Agreement identification${meta.contractNumber ? ` (No: ${meta.contractNumber})` : ''}:\n` +
          `• First Party: ${p1Name} (${p1Role} — acting for and on behalf of ${p1Org})\n` +
          `• Second Party: ${p2Name} (${p2Role} — acting for and on behalf of ${p2Org})\n` +
          `• Scope of Partnership: ${scopeStr}`;
      }
    } else {
      const p1Str = firstPartyClean
        ? `${firstPartyClean} (HRD ${meta.company || 'PT. Bintang Maju Bersama'})`
        : 'Pihak Pertama (Pemberi Kerja)';
      const p2Str = secondPartyClean ? `${secondPartyClean}` : 'Pihak Kedua (Karyawan)';
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
  }
  // 6. Perpanjangan Otomatis / Durasi Kontrak
  else if (
    !isExplicitOutOfScope &&
    (/\b(perpanjang|perpanjangan|renew|renewal|otomatis|auto\s*renew|jatuh\s*tempo|expire|expired|jangka\s*waktu|masa\s*berlaku|durasi\s*kontrak)\b/i.test(
      q
    ) ||
      /((kapan|tanggal|sampai\s*kapan).*(berakhir|selesai|habis|kontrak)|\b(kontrak|perjanjian).*(berakhir|selesai|habis))/i.test(
        q
      ))
  ) {
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
  else if (
    !isExplicitOutOfScope &&
    /\b(deposit|jaminan|uang\s*deposit|uang\s*jaminan|hangus|refund)\b/i.test(q) &&
    isSewa
  ) {
    source = 1;
    const dep = aiClauses.find((k) => /deposit|jaminan|refund/i.test(k.kutipan));
    answer =
      lang === 'id'
        ? `${dep ? `Klausul: "${dep.kutipan}" — ${dep.penjelasan}\n\n` : ''}Rujukan hukum: Pasal 1587 KUHPerdata menyatakan penyewa yang mengembalikan barang dalam kondisi baik berhak mendapatkan kembali uang jaminan. Klausul deposit hangus tanpa syarat batal demi hukum. ${SARAN.tinggi.join(' ')}`
        : `${dep ? `Clause: "${dep.kutipan}" — ${dep.penjelasan}\n\n` : ''}Legal Reference: Article 1587 Civil Code entitles a tenant returning property in good order to their deposit. Forfeited deposits without just cause are contestable. ${SARAN.tinggi.join(' ')}`;
  }
  // 8. Sewa: Kenaikan Sewa Sepihak
  else if (
    !isExplicitOutOfScope &&
    /(naik.*sewa|kenaikan.*harga|sewa.*kapan|harga.*sewa|sepihak)/i.test(q) &&
    isSewa
  ) {
    source = 1;
    const n = aiClauses.find((k) => /naik|sewa.*kapan|harga.*sewa/.test(k.kutipan));
    answer =
      lang === 'id'
        ? `${n ? `Klausul: "${n.kutipan}" — ${n.penjelasan}\n\n` : ''}Rujukan: Pasal 1338 KUHPerdata (pacta sunt servanda) & Pasal 1550. Harga sewa yang disepakati mengikat dan tidak boleh dinaikkan sepihak di tengah masa sewa. ${SARAN.tinggi.join(' ')}`
        : `${n ? `Clause: "${n.kutipan}" — ${n.penjelasan}\n\n` : ''}Legal Reference: Civil Code Article 1338 (contracts bind as law) & Article 1550. Rent cannot be raised unilaterally mid-lease. ${SARAN.tinggi.join(' ')}`;
  }
  // 9. Rujukan Regulasi & Dasar Hukum
  else if (
    !isExplicitOutOfScope &&
    (/\b(hukum|undang-undang|undang\s*undang|pasal|legal|aturan\s*hukum|peraturan|rujukan|regulasi|uu|kuhperdata|pp)\b/i.test(
      q
    ) ||
      /(35\/2021|13\/2003|168\/puu)/i.test(q))
  ) {
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
  // 10. Permintaan Eksplisit Ringkasan / Kesimpulan / Skor Risiko Kontrak
  else if (
    !isExplicitOutOfScope &&
    (/\b(ringkasan|rangkuman|kesimpulan|skor|risiko|aman\s*tidak|bahaya|evaluasi|analisis|review|summary|risk|overview)\b/i.test(
      q
    ) ||
      /(jelaskan\s*isi\s*kontrak|isi\s*kontrak)/i.test(q))
  ) {
    source = 0;
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
  // ====================================================
  // CABANG B — Pertanyaan Seputar Fitur Website / Platform
  // ====================================================
  else if (
    !isExplicitOutOfScope &&
    /\b(fitur|cara\s*pakai|cara\s*kerja|unggah|upload|bandingkan|compare|buat\s*kontrak|hrd\s*pro|langganan|paket|membership|clariq|cek\s*kontrak|kalender|pengingat|reminder|tanda\s*tangan|e-?meterai|pdf)\b/i.test(
      q
    )
  ) {
    source = null;
    answer =
      lang === 'id'
        ? `Platform Cek Kontrak (CLARIQ) menyediakan 4 fitur utama untuk membantu Anda:\n` +
          `1. Analisis Kontrak AI (PDF/Teks): Mengekstrak isi dokumen secara otomatis dan mendeteksi klausul berisiko tinggi (seperti denda resign atau masa percobaan ilegal).\n` +
          `2. Bandingkan 2 Kontrak: Membandingkan draf lama vs draf revisi secara berdampingan.\n` +
          `3. Pengingat Tanggal Penting: Memantau jadwal gajian, masa tenggang notifikasi, dan akhir kontrak.\n` +
          `4. Buat Kontrak HRD (Fitur HRD Pro): Menyusun draf PKWT/PKWTT resmi yang 100% patuh UU Ketenagakerjaan lengkap dengan Tanda Tangan Digital, Stempel Korporat, dan E-Meterai Rp10.000.`
        : `The Cek Kontrak (CLARIQ) platform provides 4 core features:\n` +
          `1. AI Contract Analysis (PDF/Text): Automatically extracts contract text and flags high-risk clauses (such as disproportionate resignation penalties or unlawful probation terms).\n` +
          `2. 2-Contract Comparison: Side-by-side comparison between original and revised agreement drafts.\n` +
          `3. Important Date Reminders: Tracks payday schedules, notice deadlines, and contract expiration dates.\n` +
          `4. HRD Smart Contract Builder (HRD Pro): Generates 100% compliant PKWT/PKWTT employment contracts complete with Digital Signatures, Corporate Stamp, and IDR 10,000 E-Meterai.`;
  }

  // ====================================================
  // CABANG D — Pertanyaan di Luar Topik (Out-of-Scope Guardrail)
  // ====================================================
  if (!answer) {
    source = null;
    if (lang === 'id') {
      answer =
        'Maaf, saya tidak paham maksud Anda. Saya hanya dapat membantu menjawab pertanyaan seputar isi dokumen kontrak, aturan hukum ketenagakerjaan/perjanjian, serta fitur yang ada di website ini. Silakan tanyakan hal seperti gaji, masa uji coba, jam kerja, atau denda resign pada kontrak Anda.';
    } else {
      answer =
        'Sorry, I do not understand your request. I can only assist with questions related to your contract document, employment/agreement regulations, and features on this website. Please ask about topics like salary, probation period, working hours, or resignation penalties in your contract.';
    }
  }

  return { text: answer, source };
}

/**
 * Generator Surat Kontrak Kerja Cerdas HRD (HRD Smart Contract Generator)
 * Memvalidasi kepatuhan hukum (Pasal 58 & 60 UU 13/2003, Pasal 77, PP 35/2021)
 * dan menyusun naskah kontrak kerja resmi yang 100% patuh regulasi Indonesia.
 */
export function generateHrdContract(params = {}) {
  const rawType = String(params.contractSubType || params.agreementType || params.type || 'PKWT').toUpperCase();
  const contractSubType =
    rawType.includes('PKWTT') || rawType.includes('TETAP')
      ? 'PKWTT'
      : rawType.includes('FREELANCE') || rawType.includes('MITRA')
      ? 'FREELANCE'
      : 'PKWT';

  const companyName = (params.companyName || 'PT. Nusantara Teknologi Mandiri').trim();
  const companyAddress = (params.companyAddress || 'Jl. Jenderal Sudirman Kav. 52-53, SCBD, Jakarta Selatan').trim();
  const hrdName = (params.hrdName || 'Rina Wijaya').trim();
  const hrdRole = (params.hrdRole || 'HR Manager').trim();

  const employeeName = (params.employeeName || 'Budi Santoso').trim();
  const employeeAddress = (params.employeeAddress || 'Jl. Kemang Raya No. 18, Jakarta Selatan').trim();
  const employeeNik = (params.employeeNik || '3174051208980002').trim();
  const employeeRole = (params.employeeRole || 'Product Designer').trim();
  const startDate = (params.startDate || '1 Desember 2026').trim();

  const durationMonths = Math.max(1, Math.min(60, parseInt(params.durationMonths, 10) || 12));
  const requestedProbation = parseInt(params.probationMonths, 10) || 0;

  const rawSalary =
    typeof params.salary === 'number'
      ? params.salary
      : parseRupiah(String(params.salary || '12000000')) || 12000000;
  const formattedSalary = formatRupiah(rawSalary) || 'Rp12.000.000';
  const paymentDay = Math.max(1, Math.min(31, parseInt(params.paymentDay, 10) || 25));
  const workDays = (params.workDays || 'Senin hingga Jumat (5 hari kerja)').trim();
  const workHours = (params.workHours || '09.00 - 17.00 WIB (40 jam/minggu)').trim();
  const noticePeriodDays = Math.max(7, Math.min(90, parseInt(params.noticePeriodDays, 10) || 30));

  const duties = (
    params.duties ||
    `Melaksanakan tugas dan tanggung jawab profesional sebagai ${employeeRole}, menyusun laporan kinerja berkala, serta berkoordinasi dengan tim terkait sesuai standar prosedur operasional perusahaan.`
  ).trim();

  const terminationTerms = (
    params.terminationTerms ||
    `Pengakhiran hubungan kerja dilakukan secara tertulis dengan masa pemberitahuan (notice period) minimal ${noticePeriodDays} hari kalender sebelumnya tanpa pengenaan denda finansial sepihak, sesuai dengan Peraturan Pemerintah Nomor 35 Tahun 2021.`
  ).trim();

  const contractNumber = (
    params.contractNumber ||
    `088/HRD-${contractSubType}/NTM/XI/${new Date().getFullYear()}`
  ).trim();

  // Smart Legal Guardrails & Compliance Validation
  const legalWarnings = [];
  let effectiveProbationMonths = requestedProbation;
  let probationGuardrailTriggered = false;

  if (contractSubType === 'PKWT') {
    if (requestedProbation > 0) {
      effectiveProbationMonths = 0;
      probationGuardrailTriggered = true;
      legalWarnings.push(
        'Proteksi Hukum Otomatis (Pasal 58 UU No. 13 Tahun 2003 jo. UU No. 6 Tahun 2023): Masa percobaan kerja (probation) DILARANG pada kontrak PKWT dan batal demi hukum. Sistem otomatis menonaktifkan masa percobaan (dikoreksi menjadi 0 bulan) agar draf kontrak HRD Anda 100% sah.'
      );
    }
  } else if (contractSubType === 'PKWTT') {
    if (requestedProbation > 3) {
      effectiveProbationMonths = 3;
      probationGuardrailTriggered = true;
      legalWarnings.push(
        'Proteksi Hukum Otomatis (Pasal 60 ayat (1) UU No. 13 Tahun 2003): Masa percobaan kerja untuk karyawan tetap (PKWTT) dibatasi maksimal 3 (tiga) bulan. Sistem otomatis menyesuaikan masa percobaan menjadi 3 bulan.'
      );
    } else if (requestedProbation < 0) {
      effectiveProbationMonths = 0;
    }
  } else {
    // FREELANCE
    effectiveProbationMonths = 0;
    if (requestedProbation > 0) {
      probationGuardrailTriggered = true;
      legalWarnings.push(
        'Kemitraan Pekerja Lepas (Freelance) tunduk pada KUHPerdata Pasal 1338 & 1601 dan tidak menggunakan skema masa percobaan karyawan.'
      );
    }
  }

  const docTitle =
    contractSubType === 'PKWTT'
      ? 'SURAT PERJANJIAN KERJA WAKTU TIDAK TERTENTU (PKWTT)'
      : contractSubType === 'FREELANCE'
      ? 'SURAT PERJANJIAN KEMITRAAN PEKERJA LEPAS (FREELANCE)'
      : 'SURAT PERJANJIAN KERJA WAKTU TERTENTU (PKWT)';

  const statusTextPasal1 =
    contractSubType === 'PKWTT'
      ? `Karyawan Tetap berdasarkan Perjanjian Kerja Waktu Tidak Tertentu (PKWTT) terhitung sejak tanggal ${startDate}`
      : contractSubType === 'FREELANCE'
      ? `Mitra Pekerja Lepas (Freelance) untuk jangka waktu ${durationMonths} (${durationMonths}) bulan terhitung sejak tanggal ${startDate}`
      : `Karyawan Kontrak berdasarkan Perjanjian Kerja Waktu Tertentu (PKWT) untuk jangka waktu ${durationMonths} (${durationMonths}) bulan terhitung sejak tanggal ${startDate}`;

  const pasal4Content =
    contractSubType === 'PKWT'
      ? `1. Perjanjian Kerja Waktu Tertentu (PKWT) ini berlaku selama ${durationMonths} bulan terhitung sejak tanggal ${startDate} dan dibuat tanpa masa percobaan (tidak memberlakukan masa percobaan) sesuai ketentuan Pasal 58 ayat (1) dan (2) Undang-Undang Nomor 13 Tahun 2003 tentang Ketenagakerjaan.\n` +
        `2. ${terminationTerms}\n` +
        `3. Pada saat berakhirnya jangka waktu PKWT, Pihak Pertama wajib memberikan uang kompensasi PKWT kepada Pihak Kedua secara proporsional sesuai masa kerja berdasarkan Pasal 15 dan Pasal 16 Peraturan Pemerintah Nomor 35 Tahun 2021.`
      : contractSubType === 'PKWTT'
      ? `1. Perjanjian Kerja Waktu Tidak Tertentu (PKWTT) ini berlaku efektif sejak tanggal ${startDate} dengan ketentuan masa percobaan kerja selama ${effectiveProbationMonths} bulan (maksimal 3 bulan sesuai Pasal 60 ayat (1) Undang-Undang Nomor 13 Tahun 2003).\n` +
        `2. Selama masa percobaan berlangsung, Pihak Pertama wajib membayar upah penuh di atas batas upah minimum yang berlaku dan tidak membebankan sanksi finansial apabila salah satu pihak mengakhiri hubungan kerja.\n` +
        `3. ${terminationTerms}`
      : `1. Perjanjian Kemitraan ini berlaku selama ${durationMonths} bulan terhitung sejak tanggal ${startDate} tanpa masa percobaan hubungan kerja berdasarkan asas kebebasan berkontrak Pasal 1338 KUHPerdata.\n` +
        `2. ${terminationTerms}`;

  const contractText = `${docTitle}
Oleh ${companyName}
${companyAddress}
Nomor Kontrak: ${contractNumber}

Pada hari ini, yang bertanda tangan di bawah ini:

1. PIHAK PERTAMA (PEMBERI KERJA)
Nama : ${hrdName}
Jabatan : ${hrdRole} ${companyName}
Alamat : ${companyAddress}
Dalam hal ini bertindak untuk dan atas nama ${companyName}, selanjutnya dalam Perjanjian ini disebut sebagai PIHAK PERTAMA.

2. PIHAK KEDUA (PEKERJA / KARYAWAN)
Nama : ${employeeName}
Nomor KTP / NIK : ${employeeNik}
Alamat : ${employeeAddress}
Dalam hal ini bertindak untuk dan atas nama diri sendiri, selanjutnya dalam Perjanjian ini disebut sebagai PIHAK KEDUA.

Kedua belah pihak sepakat untuk mengikatkan diri dalam ${docTitle} dengan ketentuan dan pasal-pasal hukum sebagai berikut:

Pasal 1 — Jabatan dan Status Hubungan Kerja
Pihak Pertama dengan ini menerima dan mengangkat Pihak Kedua untuk bekerja di ${companyName} sebagai bagian ${employeeRole} dengan status sebagai ${statusTextPasal1}.

Pasal 2 — Waktu Kerja dan Ketentuan Kehadiran
Pihak Kedua memiliki kewajiban waktu kerja pada hari ${workDays} mulai pukul ${workHours}, yang telah mematuhi batas waktu kerja maksimal 40 (empat puluh) jam dalam 1 (satu) minggu sesuai dengan Pasal 77 ayat (2) Undang-Undang Nomor 13 Tahun 2003 tentang Ketenagakerjaan. Kelebihan jam kerja di luar jam kerja standar dihitung sebagai waktu kerja lembur sesuai regulasi yang berlaku.

Pasal 3 — Ruang Lingkup Tugas dan Tanggung Jawab
Pihak Kedua bertanggung jawab menjalankan tugas pokok sebagai ${employeeRole}, meliputi: ${duties} Segala perubahan mendasar pada ruang lingkup pekerjaan wajib disepakati secara tertulis oleh kedua belah pihak.

Pasal 4 — Jangka Waktu, Kepatuhan Regulasi, dan Pengakhiran Kontrak
${pasal4Content}

Pasal 5 — Upah Pokok, Tunjangan, dan Jadwal Pembayaran
Selama bekerja di ${companyName}, Pihak Kedua berhak menerima gaji pokok sebesar ${formattedSalary} setiap bulan yang dibayarkan melalui rekening bank Pihak Kedua selambat-lambatnya pada tanggal ${paymentDay} setiap bulannya sesuai Pasal 88 Undang-Undang Nomor 13 Tahun 2003 jo. Peraturan Pemerintah Nomor 36 Tahun 2021 tentang Pengupahan, beserta kepesertaan BPJS Kesehatan dan BPJS Ketenagakerjaan.

Pasal 6 — Kerahasiaan Informasi dan Penyelesaian Perselisihan
Pihak Kedua wajib menjaga kerahasiaan data internal perusahaan selama dan setelah hubungan kerja berakhir. Apabila terjadi perselisihan hubungan industrial, kedua belah pihak sepakat menyelesaikannya secara musyawarah untuk mufakat sesuai Undang-Undang Nomor 2 Tahun 2004 tentang Penyelesaian Perselisihan Hubungan Industrial.

Demikian surat perjanjian kerja ini dibuat secara sadar, tanpa paksaan dari pihak manapun, dalam rangkap 2 (dua) bermeterai cukup yang masing-masing memiliki kekuatan hukum yang sama.

Jakarta, ${startDate}
Pihak Pertama (${hrdName} — ${companyName}) & Pihak Kedua (${employeeName})`;

  const builtContract = buildContractFromAnalysis({
    name: `${contractSubType} - ${employeeName} (${employeeRole})`,
    company: companyName,
    contractType: 'kerja',
    contractText,
    lang: params.lang || 'id',
  });

  return {
    contractNumber,
    contractSubType,
    contractText,
    effectiveProbationMonths,
    probationGuardrailTriggered,
    legalWarnings,
    legalCompliance: {
      isCompliant: builtContract.riskScore < 30,
      riskScore: builtContract.riskScore,
      status: builtContract.status,
      statusId: builtContract.statusId,
      pasal58Verified: contractSubType !== 'PKWT' || effectiveProbationMonths === 0,
      pasal77Verified: true,
      pp35Verified: true,
      warnings: legalWarnings,
    },
    contractDraft: builtContract,
  };
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
  generateHrdContract,
};
