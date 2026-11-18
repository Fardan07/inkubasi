import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const i18nPath = path.join(__dirname, 'src', 'i18n.ts');
const appPath = path.join(__dirname, 'src', 'App.tsx');
const cssPath = path.join(__dirname, 'src', 'index.css');

const i18nRaw = fs.readFileSync(i18nPath, 'utf8');
const appRaw = fs.readFileSync(appPath, 'utf8');
const cssRaw = fs.readFileSync(cssPath, 'utf8');

const results = [];
function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    results.push({ pass: true, message });
  } else {
    console.error(`❌ FAIL: ${message}`);
    results.push({ pass: false, message });
  }
}

console.log('--- RUNNING AUTOMATED FRONTEND INTEGRITY TEST SUITE ---');

// ============================================================================
// 1. SINKRONISASI KAMUS i18n.ts (ID vs EN Key Parity & Non-Empty Values)
// ============================================================================
const jsEvalBody = i18nRaw
  .replace(/export\s+type\s+Lang\s*=\s*["']id["']\s*\|\s*["']en["'];?/g, '')
  .replace(/export\s+const\s+translations\s*=/, 'return ');

const translations = new Function(jsEvalBody)();
const idKeys = Object.keys(translations.id || {});
const enKeys = Object.keys(translations.en || {});

const missingInEn = idKeys.filter((k) => !(k in translations.en));
const missingInId = enKeys.filter((k) => !(k in translations.id));
const emptyInId = idKeys.filter(
  (k) => typeof translations.id[k] !== 'string' || translations.id[k].trim().length === 0
);
const emptyInEn = enKeys.filter(
  (k) => typeof translations.en[k] !== 'string' || translations.en[k].trim().length === 0
);

assert(idKeys.length > 250, `i18n dictionary has ${idKeys.length} translation keys (> 250)`);
assert(
  idKeys.length === enKeys.length,
  `i18n key count matches 100% between ID (${idKeys.length}) and EN (${enKeys.length})`
);
assert(
  missingInEn.length === 0,
  `Zero keys missing in EN dictionary (missing: ${missingInEn.join(', ') || 'none'})`
);
assert(
  missingInId.length === 0,
  `Zero keys missing in ID dictionary (missing: ${missingInId.join(', ') || 'none'})`
);
assert(
  emptyInId.length === 0,
  `Zero empty/undefined string values in ID dictionary (empty: ${emptyInId.join(', ') || 'none'})`
);
assert(
  emptyInEn.length === 0,
  `Zero empty/undefined string values in EN dictionary (empty: ${emptyInEn.join(', ') || 'none'})`
);

// ============================================================================
// 2. AUDIT ANTI-EMOJI SLOP (App.tsx & i18n.ts)
// ============================================================================
const bannedEmojis = ['🎉', '✨', '💬', '⚠️', '⏳', '⏱️', '🕒', '🛡️', '🖨️', '📤', '✍️', '✒️', '🗑️'];

const i18nEmojisFound = bannedEmojis.filter((e) => i18nRaw.includes(e));
assert(
  i18nEmojisFound.length === 0,
  `Zero decorative emojis in frontend/src/i18n.ts (found: ${i18nEmojisFound.join(' ') || 'none'})`
);

// In App.tsx, check that no UI strings, chips, buttons, or toasts contain decorative emojis
// (Note: .replace(/^⚠️\s*/, "") defensive regex is stripped before scanning UI literals)
const appCleanedForLiteralScan = appRaw.replace(/\.replace\(\/\^⚠️\\s\*\/,\s*""\)/g, '');
const appEmojisFound = bannedEmojis.filter((e) => appCleanedForLiteralScan.includes(e));
assert(
  appEmojisFound.length === 0,
  `Zero decorative emojis in frontend/src/App.tsx UI text, chips, or toasts (found: ${appEmojisFound.join(' ') || 'none'})`
);

// ============================================================================
// 3. VERIFIKASI KOMPONEN KRITIS & CSS (App.tsx & index.css)
// ============================================================================

// 3a. Modal Checkout QRIS, Kode Promo Pameran (PAMERAN / GURU), & Reset ke Paket Gratis
assert(
  appRaw.includes('id="qris-checkout-box"') && appRaw.includes('QRIS Instan'),
  'QRIS & Virtual Account Checkout Box (#qris-checkout-box) is implemented in App.tsx'
);
assert(
  appRaw.includes('id="checkout-promo-input"') && /\(guru\|pameran/i.test(appRaw),
  'Exhibition promo code input (#checkout-promo-input) supporting GURU / PAMERAN is implemented in App.tsx'
);
assert(
  appRaw.includes('id="payment-verifying-state"') && appRaw.includes('Simulasikan Pembayaran Berhasil'),
  'Payment simulation button & verification animation (#payment-verifying-state) are implemented in App.tsx'
);
assert(
  appRaw.includes('id="btn-reset-free-plan"') && appRaw.includes('Reset ke Paket Gratis (Mode Pameran)'),
  'Exhibition reset to Free Plan button (#btn-reset-free-plan) is implemented in profile menu'
);

// 3b. Form HRD Contract Builder Bagian 1 s/d 7, TTD Digital, Stempel, E-Meterai, & @media print
const builderSections = [
  'builder_sec_type',
  'builder_sec_company',
  'builder_sec_employee',
  'builder_sec_duration',
  'builder_sec_comp',
  'builder_sec_duties',
  'builder_sec_signatures',
];
const allBuilderSectionsPresent = builderSections.every(
  (secKey) => appRaw.includes(`t.${secKey}`) && secKey in translations.id
);
assert(
  allBuilderSectionsPresent,
  'HRD Contract Builder Form Sections 1 through 7 are all implemented and translated'
);
assert(
  appRaw.includes('handleSigImageUpload') &&
    appRaw.includes('sigPadCanvasRef') &&
    appRaw.includes('buildCalligraphySigSvg'),
  'Digital Signature Upload, Interactive Canvas Pad, and Auto-Calligraphy Generator are implemented'
);
assert(
  appRaw.includes('corporate-stamp-seal') &&
    appRaw.includes('emeterai-seal-box') &&
    appRaw.includes('Rp10.000'),
  'Corporate Stamp overlay (.corporate-stamp-seal) and E-Meterai Rp10.000 (.emeterai-seal-box) are implemented'
);
assert(
  cssRaw.includes('@media print') &&
    cssRaw.includes('page-break-inside: avoid') &&
    cssRaw.includes('break-inside: avoid'),
  'Print stylesheet (@media print) with page-break-inside: avoid & break-inside: avoid is implemented in index.css'
);
assert(
  cssRaw.includes('.hrd-builder-grid') &&
    cssRaw.includes('height: calc(100vh - 96px)') &&
    cssRaw.includes('.preview-scroll-area'),
  'Dual-Pane Independent Scroll Workspace (.hrd-builder-grid & .preview-scroll-area) is implemented in index.css'
);

// 3c. Analysis Header Actions & Red Flag Icon Box
assert(
  appRaw.includes('className="analysis-header-actions"') &&
    cssRaw.includes('.analysis-header-actions') &&
    cssRaw.includes('flex-direction: row'),
  'Horizontal alignment container (.analysis-header-actions) for Analysis header buttons is implemented'
);
assert(
  appRaw.includes('className="red-flag-icon-box"') && cssRaw.includes('.red-flag-icon-box'),
  'Single SVG warning badge (.red-flag-icon-box) in Red Flag Alert Box is implemented'
);

// 3d. Proteksi backdropMouseDownRef pada Seluruh Modal (4 Modals: upload, planModal, authModal, contractToDelete)
const backdropMouseDownMatches = appRaw.match(/backdropMouseDownRef\.current\s*=\s*e\.target/g) || [];
const backdropClickGuardMatches =
  appRaw.match(/e\.target\s*===\s*e\.currentTarget\s*&&\s*backdropMouseDownRef\.current\s*===\s*e\.currentTarget/g) ||
  [];
assert(
  backdropMouseDownMatches.length >= 4 && backdropClickGuardMatches.length >= 4,
  `Modal drag-select protection (backdropMouseDownRef) is active on all ${backdropClickGuardMatches.length} modals`
);

// 3e. Outside-Click Handler for Notification & Profile Popovers + Centered Toast Wrapper
assert(
  appRaw.includes('notificationsRef') &&
    appRaw.includes('profileRef') &&
    appRaw.includes("document.addEventListener(\"mousedown\", handleOutsideClick)"),
  'Outside-click handler for Notification & Profile popovers is implemented in App.tsx'
);
assert(
  cssRaw.includes('.toast-wrapper') &&
    cssRaw.includes('justify-content: center') &&
    cssRaw.includes('pointer-events: none'),
  'Centered viewport Toast Wrapper (.toast-wrapper) is preserved in index.css'
);

// 3f. Verification of Latest 4 UI Refinements (2-Col Pricing, No ⌘K, No Bottom Banner, Clean Blue Pro Typography)
assert(
  !appRaw.includes('name: "Business"') &&
    cssRaw.includes('grid-template-columns: repeat(2, minmax(300px, 420px))'),
  'Business ($29) plan removed and .pricing-grid uses 2 symmetrical centered columns'
);
assert(
  !appRaw.includes('<kbd>⌘ K</kbd>') && !appRaw.includes('⌘K'),
  'Keyboard shortcut badge (⌘K) removed from topbar search input'
);
assert(
  !appRaw.includes('className="new-contract-card"'),
  'Bottom dashboard banner (.new-contract-card) removed from Dashboard page'
);
assert(
  cssRaw.includes('.workspace-avatar.pro') &&
    cssRaw.includes('.workspace-plan-pro') &&
    cssRaw.includes('background: transparent !important') &&
    cssRaw.includes('.nav-pro-badge'),
  'Sidebar Pro status uses clean blue typography (.workspace-plan-pro, .workspace-avatar.pro, .nav-pro-badge)'
);
assert(
  appRaw.includes('Nilai Kontrak & Pembayaran') &&
    appRaw.includes('Jangka Waktu & Layanan') &&
    appRaw.includes('Perubahan & Pengakhiran') &&
    appRaw.includes('Para Pihak & Objek') &&
    !translations.id.risk_clauses_count.includes('12'),
  'Analysis insight cards are dynamically adaptive for non-employment contracts and clause count is dynamic'
);
assert(
  appRaw.includes('/api/subscription/upgrade') && appRaw.includes('/api/subscription/reset'),
  'Subscription upgrade (/api/subscription/upgrade) and reset (/api/subscription/reset) endpoints are wired in App.tsx'
);

console.log('\n--- FRONTEND INTEGRITY SUMMARY ---');
const passed = results.filter((r) => r.pass).length;
const failed = results.filter((r) => !r.pass).length;
console.log(`Total checks: ${results.length}`);
console.log(`Passed: ${passed}/${results.length}`);
console.log(`Failed: ${failed}/${results.length}`);

if (failed > 0) {
  process.exit(1);
}
