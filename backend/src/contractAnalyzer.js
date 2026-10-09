// ============================================================
// CLARIQ - Contract Check Engine (Rule-based dengan Grounding Hukum Indonesia)
// ============================================================
// Engine ini dipakai oleh endpoint /api/contract-check & /api/contracts
// untuk menganalisis teks kontrak kerja / sewa secara offline-first.
// ============================================================

export const LEGAL = {
  kerja: `UU Ketenagakerjaan (13/2003) & PP 35/2021 tentang PKWT dan PHK:
- PKWT (kontrak waktu tertentu) maksimal 5 tahun akumulasi termasuk perpanjangan (Pasal 8 PP 35/2021).
- Saat PKWT berakhir, pekerja berhak uang kompensasi = (masa kerja/12) x upah sebulan.
- Resign baik-baik dengan surat pengunduran diri 30 hari sebelumnya: tidak wajib dapat pesangon, tapi tetap berhak uang penggantian hak dan uang pisah (Pasal 36 huruf i & Pasal 50 PP 35/2021).
- Uang pesangon PHK oleh perusahaan dihitung bertingkat sesuai masa kerja (mis. kurang dari 1 tahun = 1 bulan upah, 1-2 tahun = 2 bulan upah, dst), dikalikan faktor 0,5-2x tergantung alasan PHK (Pasal 40 PP 35/2021).
- Putusan MK 168/PUU-XXI/2023 menegaskan angka pesangon dalam aturan adalah jumlah paling sedikit, bukan batas maksimal.`,
  sewa: `KUHPerdata Buku III Bab VII tentang Sewa-Menyewa:
- Pasal 1550: pihak yang menyewakan wajib menyerahkan barang, memeliharanya, dan memberi kenikmatan tenteram selama masa sewa.
- Pasal 1560: penyewa wajib memakai barang sesuai tujuan sewa secara wajar dan membayar sewa tepat waktu.
- Pasal 1576: jual-beli objek sewa tidak memutus perjanjian sewa yang sedang berjalan.
- Pasal 1587: pada akhir sewa, barang dikembalikan seperti kondisi semula, kecuali kerusakan karena usia atau force majeure.`,
};

export const SARAN = {
  tinggi: [
    'Tanyakan dasar hukum atau alasan klausul ini secara tertulis ke pihak lain.',
    'Minta klausul ini direvisi atau dihapus sebelum kamu tanda tangan.',
    'Kalau nilainya besar, konsultasikan dulu ke pengacara atau LBH sebelum menyetujui.',
  ],
  perhatian: [
    'Minta klarifikasi tertulis soal klausul ini sebelum tanda tangan.',
    'Bandingkan dengan kontrak serupa dari tempat/sumber lain sebagai pembanding wajar.',
    'Kalau ragu, tanyakan dulu ke orang yang lebih berpengalaman di bidang ini.',
  ],
};

export const CONTOH = {
  kerja: `PERJANJIAN KERJA WAKTU TERTENTU
Pasal 1: Jangka waktu kontrak adalah 6 (enam) bulan, dapat diperpanjang.
Pasal 4: Karyawan yang mengundurkan diri sebelum masa kontrak berakhir wajib membayar denda sebesar 3x gaji bulanan tanpa terkecuali.
Pasal 6: Kontrak dapat diperpanjang otomatis setiap 6 bulan kecuali ada pemberitahuan tertulis 60 hari sebelumnya dari perusahaan.`,
  sewa: `PERJANJIAN SEWA KAMAR KOS
Pasal 2: Uang deposit sebesar Rp1.000.000 tidak dapat dikembalikan dengan alasan apapun.
Pasal 5: Pemilik berhak menaikkan harga sewa kapan saja tanpa pemberitahuan sebelumnya.
Pasal 7: Penyewa wajib mengganti seluruh biaya perbaikan kamar termasuk kerusakan akibat usia bangunan.`,
};

/**
 * Simulasikan analisis AI berbasis aturan & regex untuk kontrak teks.
 * @param {string} teks - Teks kontrak (bisa hasil paste / hasil ekstraksi PDF)
 * @param {"kerja"|"sewa"} jenis - Kategori kontrak
 * @returns {{skor:number, ringkasan:string, klausul:Array<{kutipan:string, risiko:"aman"|"perhatian"|"tinggi", penjelasan:string, rujukan?:string, saran?:string[]}>}}
 */
export function simulateAiAnalysis(teks, jenis) {
  const klausul = [];
  let skorRisiko = 15;

  const matchOne = (regex) => {
    const m = teks.match(regex);
    return m ? m[0].trim() : null;
  };

  if (jenis === 'kerja') {
    // 1. Denda resign berlebihan
    if (/denda.*(?:3x|tiga.*kali|3.*kali)/i.test(teks) || /denda.*gaji.*bulan.*(?:3|tiga)/i.test(teks)) {
      klausul.push({
        kutipan: matchOne(/[^.\n]*denda[^.\n]*/i) || 'Klausul denda resign dini',
        risiko: 'tinggi',
        penjelasan:
          'Denda resign 3x gaji berlebihan dan berpotensi tidak sah. PP 35/2021 hanya mengatur kompensasi yang wajar (bukan denda) dan pekerja yang resign 30 hari sebelumnya umumnya tidak dikenakan denda.',
        rujukan: 'Pasal 36 huruf i & Pasal 50 PP 35/2021 tentang PKWT dan PHK',
        saran: SARAN.tinggi,
      });
      skorRisiko += 30;
    }
    // 2. Perpanjangan otomatis
    if (/otomatis.*diperpanjang|perpanjang.*otomatis|auto.*renew/i.test(teks)) {
      klausul.push({
        kutipan: matchOne(/[^.\n]*(?:otomatis.*diperpanjang|perpanjang.*otomatis)[^.\n]*/i) || 'Klausul perpanjangan otomatis',
        risiko: 'perhatian',
        penjelasan:
          'Perpanjangan otomatis bisa membuat Anda terikat kontrak baru tanpa menyadarinya. Ingat batas waktu pemberitahuan agar tidak terjebak.',
        rujukan: 'Pasal 8 PP 35/2021: akumulasi PKWT maksimal 5 tahun',
        saran: SARAN.perhatian,
      });
      skorRisiko += 15;
    }
    // 3. Jangka pendek (<= 6 bulan)
    if (/(?:6|enam)\s*(?:bulan|bln)/i.test(teks)) {
      klausul.push({
        kutipan: matchOne(/[^.\n]*(?:6|enam)\s*(?:bulan|bln)[^.\n]*/i) || 'Jangka waktu kontrak',
        risiko: 'perhatian',
        penjelasan:
          'Pastikan total akumulasi perpanjangan tidak melebihi 5 tahun sesuai aturan PKWT. Juga pastikan ada kompensasi akhir kontrak sesuai masa kerja.',
        rujukan: 'Pasal 8 PP 35/2021',
        saran: SARAN.perhatian,
      });
      skorRisiko += 10;
    }
    // Fallback jika tidak ada yang ketemu
    if (klausul.length === 0) {
      klausul.push({
        kutipan: 'Ketentuan umum kontrak kerja',
        risiko: 'aman',
        penjelasan:
          'Tidak ditemukan klausul berisiko tinggi pada teks singkat ini. Tetap pastikan semua hak kerja (pesangon, upah lembur, jaminan sosial) tertulis jelas.',
        rujukan: 'UU Ketenagakerjaan No. 13 Tahun 2003',
      });
    }
  } else {
    // ============== SEWA ==============
    // 1. Deposit hangus
    if (/deposit.*tidak.*kembali|uang.*jaminan.*tidak.*kembali|tidak.*dikembalikan.*alasan.*apa.*pun|non.?refundable/i.test(teks)) {
      klausul.push({
        kutipan: matchOne(/[^.\n]*(?:deposit|jaminan)[^.\n]*(?:tidak.*kembali|tidak.*dikembalikan|non.?refundable)[^.\n]*/i) || 'Klausul deposit hangus',
        risiko: 'tinggi',
        penjelasan:
          'Deposit tidak dapat dikembalikan tanpa alasan jelas tidak adil. Menurut KUHPerdata, penyewa yang mengembalikan barang dalam kondisi baik (minus usia) berhak mendapatkan kembali uang jaminan.',
        rujukan: 'Pasal 1587 KUHPerdata',
        saran: SARAN.tinggi,
      });
      skorRisiko += 30;
    }
    // 2. Kenaikan sewa sepihak
    if (/naik.*sewa.*kapan.*saja|harga.*sewa.*kapan.*saja|tanpa.*pemberitahuan.*sebelumnya|sepihak.*menaikkan/i.test(teks)) {
      klausul.push({
        kutipan: matchOne(/[^.\n]*(?:naik.*sewa|harga.*sewa)[^.\n]*(?:kapan.*saja|tanpa.*pemberitahuan)[^.\n]*/i) || 'Klausul kenaikan sewa',
        risiko: 'tinggi',
        penjelasan:
          'Pemilik tidak bisa menaikkan sewa sewenang-wenang di tengah masa sewa. Harga sewa yang disepakati mengikat kedua pihak selama masa perjanjian berjalan.',
        rujukan: 'Pasal 1550 & Kesepakatan mengikat sebagai undang-undang (Pasal 1338 KUHPerdata)',
        saran: SARAN.tinggi,
      });
      skorRisiko += 30;
    }
    // 3. Perbaikan usia bangunan
    if (/perbaikan.*usia|kerusakan.*usia.*bangunan.*penyewa.*bayar|seluruh.*biaya.*perbaikan.*penyewa|wear.*and.*tear.*penyewa/i.test(teks)) {
      klausul.push({
        kutipan: matchOne(/[^.\n]*(?:perbaikan|biaya.*perbaikan)[^.\n]*(?:usia|bangunan.*penyewa|seluruh.*biaya)[^.\n]*/i) || 'Klausul biaya perbaikan',
        risiko: 'perhatian',
        penjelasan:
          'Kerusakan karena usia bangunan (wear and tear) adalah tanggung jawab pihak yang menyewakan, bukan penyewa. Penyewa hanya bertanggung jawab atas kerusakan karena kesalahannya sendiri.',
        rujukan: 'Pasal 1550 & 1587 KUHPerdata',
        saran: SARAN.perhatian,
      });
      skorRisiko += 15;
    }
    if (klausul.length === 0) {
      klausul.push({
        kutipan: 'Ketentuan umum kontrak sewa',
        risiko: 'aman',
        penjelasan:
          'Tidak ditemukan klausul berisiko tinggi. Tetap pastikan hak dan kewajiban kedua pihak (pemeliharaan, jual-beli tidak memutus sewa, dll) tertulis jelas.',
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
          : 'Kewajiban dasar kedua pihak',
      risiko: 'aman',
      penjelasan:
        jenis === 'kerja'
          ? 'Perusahaan wajib membayar upah sesuai jadwal yang disepakati sesuai ketentuan ketenagakerjaan.'
          : 'Pihak yang menyewakan wajib menyerahkan barang dalam kondisi layak; penyewa wajib membayar sewa tepat waktu.',
      rujukan: jenis === 'kerja' ? 'UU No. 13/2003 Pasal 88-91' : 'KUHPerdata Pasal 1550 & 1560',
    });
  }

  skorRisiko = Math.min(100, Math.max(5, skorRisiko));
  const ringkasan =
    skorRisiko >= 55
      ? jenis === 'kerja'
        ? 'Kontrak berisiko tinggi: terdapat klausul denda tidak wajar dan perpanjangan otomatis yang merugikan pekerja.'
        : 'Kontrak sewa berisiko tinggi: ada klausul deposit hangus dan/atau kenaikan sewa sepihak yang tidak sesuai hukum.'
      : skorRisiko >= 30
      ? jenis === 'kerja'
        ? 'Beberapa pasal perlu diperhatikan lebih lanjut, terutama terkait jangka waktu dan kompensasi akhir kontrak.'
        : 'Ada beberapa klausul sewa yang perlu diklarifikasi ulang agar tidak merugikan penyewa di kemudian hari.'
      : jenis === 'kerja'
      ? 'Kontrak relatif aman. Tetap pastikan hak ketenagakerjaan Anda tertulis jelas dan lengkap.'
      : 'Kontrak sewa relatif seimbang. Verifikasi kembali detail masa sewa dan hak masing-masing pihak.';

  return { skor: skorRisiko, ringkasan, klausul };
}

/**
 * Bentuk objek Contract lengkap siap disimpan dari hasil analisis AI.
 */
export function buildContractFromAnalysis({
  name,
  company,
  fileName,
  contractType,
  contractText,
  lang = 'id',
}) {
  const jenis = contractType === 'sewa' ? 'sewa' : 'kerja';
  const teks = contractText?.trim()
    ? contractText
    : `[Dokumen diunggah: ${fileName || name || 'document.pdf'}] ${CONTOH[jenis]}`;

  const ai = simulateAiAnalysis(teks, jenis);

  const defaultName =
    jenis === 'kerja'
      ? lang === 'id'
        ? 'Perjanjian Kerja - Cek Kontrak'
        : 'Employment Agreement - Contract Check'
      : lang === 'id'
      ? 'Perjanjian Sewa - Cek Kontrak'
      : 'Rental Agreement - Contract Check';

  const nama = (fileName ? fileName.replace(/\.[^.]+$/, '') : name) || defaultName;

  const perusahaan =
    company ||
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
      effectiveDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      expiryDate:
        jenis === 'kerja' ? 'Lihat klausul jangka waktu kontrak' : 'Lihat klausul masa sewa',
      noticePeriod: '30 hari (default)',
      jurisdiction: 'Hukum Republik Indonesia',
      contractSource:
        contractText && contractText.trim().length > 0 ? 'Paste teks' : fileName ? 'Upload dokumen' : '-',
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
        : 'Ketentuan ini sesuai standar dan tidak memerlukan tindakan khusus.',
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
 * Jawaban chat berbasis kontrak yang sudah punya aiClauses & legalSummary.
 * Dipakai oleh endpoint /api/chat.
 */
export function chatWithAnalyzedContract({ contract, question, lang = 'id' }) {
  if (!contract?.aiClauses || contract.aiClauses.length === 0) return null;

  const isKerja = contract.contractType === 'kerja';
  const isSewa = contract.contractType === 'sewa';
  const q = (question || '').toLowerCase();
  const tinggi = contract.aiClauses.filter((k) => k.risiko === 'tinggi');
  const perhatian = contract.aiClauses.filter((k) => k.risiko === 'perhatian');

  let answer = '';
  let source = 0;

  if (/(denda|penalti|resign|mundur|keluar|quit|terminat|phk|pemutusan)/i.test(q) && isKerja) {
    const denda = contract.aiClauses.find(
      (k) => /denda|tinggi/.test(k.risiko + ' ' + k.kutipan)
    );
    answer =
      lang === 'id'
        ? `Berdasarkan hasil analisis kontrak ini: ${
            denda
              ? `Ada klausul BERISIKO TINGGI: "${denda.kutipan}" — ${denda.penjelasan}. Rujukan hukum: ${denda.rujukan || 'Pasal 36 huruf i & 50 PP 35/2021'}.`
              : 'Periksa aturan denda/resign. Menurut PP 35/2021 Pasal 36 huruf i dan Pasal 50, pekerja yang resign dengan surat pengunduran diri 30 hari sebelumnya umumnya tidak dikenakan denda.'
          } Disarankan: ${SARAN.tinggi.join(' ')}`
        : `Based on analysis: ${
            denda
              ? `There is a HIGH-RISK clause: "${denda.kutipan}" — ${denda.penjelasan}. Legal ref: ${denda.rujukan || 'Article 36i & 50 PP 35/2021'}.`
              : 'Check the resignation/penalty clauses. Per PP 35/2021 Art. 36i & 50, employees resigning properly (30 days written notice) generally do not owe penalties.'
          } Suggested: ${SARAN.tinggi.join(' ')}`;
  } else if (/(perpanjang|renew|otomatis|auto|jatuh tempo|expire|berakhir|selesai|jangka waktu)/i.test(q)) {
    const otomatis = contract.aiClauses.find((k) => /otomatis|perpanjangan|auto|renew/i.test(k.kutipan));
    answer =
      lang === 'id'
        ? `${
            otomatis
              ? `Klausul: "${otomatis.kutipan}" — ${otomatis.penjelasan}. Rujukan: ${otomatis.rujukan || 'Pasal 8 PP 35/2021 (maks 5 tahun)'}. `
              : isKerja
              ? 'Menurut Pasal 8 PP 35/2021, total akumulasi PKWT (termasuk perpanjangan) maksimal 5 tahun. Pastikan batas ini tidak terlampaui. '
              : 'Periksa kembali jangka waktu dan perpanjangan. KUHPerdata mengikat kesepakatan kedua pihak. '
          }${SARAN.perhatian.join(' ')}`
        : `${
            otomatis
              ? `Clause: "${otomatis.kutipan}" — ${otomatis.penjelasan}. Ref: ${otomatis.rujukan || 'Art. 8 PP 35/2021 (5yr max)'}. `
              : isKerja
              ? 'Under Art. 8 PP 35/2021, total time-bound contract accumulation (including renewals) is 5 years. Verify this is respected. '
              : 'Review renewal terms carefully. The Civil Code binds parties to their agreements. '
          }${SARAN.perhatian.join(' ')}`;
  } else if (/(deposit|jaminan|uang.*deposit|uang.*jaminan|hangus|refund)/i.test(q) && isSewa) {
    const dep = contract.aiClauses.find((k) => /deposit|jaminan|refund/i.test(k.kutipan));
    answer =
      lang === 'id'
        ? `${dep ? `Klausul: "${dep.kutipan}" — ${dep.penjelasan}. ` : ''}Rujukan hukum: Pasal 1587 KUHPerdata: penyewa yang mengembalikan barang dengan baik (dikurangi usia barang) berhak kembali uang jaminan. Klausul deposit hangus tanpa alasan berpotensi tidak sah. ${SARAN.tinggi.join(' ')}`
        : `${dep ? `Clause: "${dep.kutipan}" — ${dep.penjelasan}. ` : ''}Legal ref: Civil Code Art. 1587: a tenant returning the premises in good condition (minus fair wear and tear) is entitled to the deposit back. “Non-refundable deposit” clauses without clear cause are potentially invalid. ${SARAN.tinggi.join(' ')}`;
  } else if (/(naik.*sewa|kenaikan.*harga|sewa.*kapan|harga.*sewa|sepihak)/i.test(q) && isSewa) {
    const n = contract.aiClauses.find((k) => /naik|sewa.*kapan|harga.*sewa/.test(k.kutipan));
    answer =
      lang === 'id'
        ? `${n ? `Klausul: "${n.kutipan}" — ${n.penjelasan}. ` : ''}Rujukan: Pasal 1338 KUHPerdata (kesepakatan mengikat) + Pasal 1550. Harga sewa yang disepakati tidak dapat diubah sepihak di tengah masa sewa. ${SARAN.tinggi.join(' ')}`
        : `${n ? `Clause: "${n.kutipan}" — ${n.penjelasan}. ` : ''}Legal refs: Civil Code Art. 1338 (pacta sunt servanda — agreements bind) + Art. 1550. Agreed rent cannot be unilaterally raised mid-term. ${SARAN.tinggi.join(' ')}`;
  } else if (/(perbaikan|kerusakan|usia|bangunan|maintenance|repair|renov)/i.test(q) && isSewa) {
    const p = contract.aiClauses.find((k) => /perbaikan|usia|bangunan|repair|maintenance/i.test(k.kutipan));
    answer =
      lang === 'id'
        ? `${p ? `Klausul: "${p.kutipan}" — ${p.penjelasan}. ` : ''}Menurut Pasal 1550 & 1587 KUHPerdata, pemilik bertanggung jawab atas pemeliharaan dan kerusakan karena usia (wear and tear); penyewa hanya atas kerusakan akibat kesalahannya sendiri. ${SARAN.perhatian.join(' ')}`
        : `${p ? `Clause: "${p.kutipan}" — ${p.penjelasan}. ` : ''}Per Civil Code Art. 1550 & 1587, the owner/landlord is liable for maintenance and age-related wear and tear; the tenant is only liable for damage from their own fault. ${SARAN.perhatian.join(' ')}`;
  } else if (/(hukum|undang|pasal|legal|atur|rujuk|regulasi|uu|kuhperdata|pp|35\/2021)/i.test(q)) {
    answer =
      lang === 'id'
        ? `Hasil analisis kontrak ini di-grounding ke: ${
            isKerja
              ? 'UU Ketenagakerjaan No. 13 Tahun 2003 dan PP No. 35 Tahun 2021 tentang PKWT & PHK. Klaster aturan: jangka PKWT maks 5 tahun, kompensasi akhir, pesangon PHK bertingkat, dan putusan MK soal pesangon minimum.'
              : 'KUHPerdata Buku III Bab VII tentang Sewa-Menyewa: Pasal 1550 (kewajiban penyewakan), 1560 (kewajiban penyewa), 1576 (jual-beli tidak memutus sewa), 1587 (pengembalian barang).'
          } Total klausul: ${contract.aiClauses.length} (${tinggi.length} risiko tinggi · ${perhatian.length} perhatian · ${
            contract.aiClauses.length - tinggi.length - perhatian.length
          } aman). Skor risiko: ${contract.riskScore ?? '-'}/100.`
        : `This analysis is grounded to: ${
            isKerja
              ? 'Manpower Law No. 13/2003 and Gov. Reg. 35/2021 (PKWT & Severance): max 5yr accumulation, end-of-contract compensation, tiered severance, and the Constitutional Court’s minimum-severance ruling.'
              : 'Indonesian Civil Code Book III Ch. VII on Leases: Art. 1550 (lessor duties), 1560 (lessee duties), 1576 (sale does not break lease), 1587 (return of goods).'
          } Total clauses flagged: ${contract.aiClauses.length} (${tinggi.length} high · ${perhatian.length} review · ${
            contract.aiClauses.length - tinggi.length - perhatian.length
          } safe). Risk score: ${contract.riskScore ?? '-'}/100.`;
  }

  if (!answer) {
    const ringkasan = contract.summary || '';
    answer =
      lang === 'id'
        ? `${ringkasan}\n\nRingkasan analisis kamu: Skor risiko ${contract.riskScore}/100 — ${tinggi.length} klausul RISIKO TINGGI, ${perhatian.length} PERLU DITINJAU. ${
            tinggi.length > 0
              ? `Yang terpenting: "${tinggi[0].kutipan}" — ${tinggi[0].penjelasan}. Rujukan: ${
                  tinggi[0].rujukan || 'hukum ketenagakerjaan / KUHPerdata terkait.'
                }`
              : perhatian.length > 0
              ? `Perhatikan: "${perhatian[0].kutipan}" — ${perhatian[0].penjelasan}.`
              : 'Kontrak relatif aman; lanjut ke detail klausul untuk memastikan semua hak tertulis jelas.'
          }\nDisclaimer: jawaban ini bantuan umum dan bukan nasihat hukum. Konsultasikan pengacara untuk kasus spesifik.`
        : `${ringkasan}\n\nAnalysis summary: Risk score ${contract.riskScore}/100 — ${tinggi.length} HIGH-RISK clauses, ${perhatian.length} NEED REVIEW. ${
            tinggi.length > 0
              ? `Top concern: "${tinggi[0].kutipan}" — ${tinggi[0].penjelasan}. Ref: ${
                  tinggi[0].rujukan || 'relevant manpower/lease law.'
                }`
              : perhatian.length > 0
              ? `Watch item: "${perhatian[0].kutipan}" — ${perhatian[0].penjelasan}.`
              : 'The contract is relatively balanced; drill into clauses to confirm all your rights are in writing.'
          }\nDisclaimer: this is general guidance and not legal advice. Consult a qualified lawyer for specific cases.`;
  }

  return { text: answer, source };
}

export default {
  LEGAL,
  SARAN,
  CONTOH,
  simulateAiAnalysis,
  buildContractFromAnalysis,
  chatWithAnalyzedContract,
};
