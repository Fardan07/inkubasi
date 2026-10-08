import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { translations, type Lang } from "./i18n"

type IconName = "grid" | "file" | "compare" | "calendar" | "settings" | "search" | "bell" | "chevron" | "arrow" | "plus" | "upload" | "check" | "shield" | "spark" | "clock" | "close" | "menu" | "help" | "logout" | "chat" | "download" | "external" | "warning" | "send" | "lock" | "dots"
function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: IconName
  size?: number
  className?: string
}) {
  const paths: Record<IconName, ReactNode> = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    file: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6M8 13h8M8 17h5" />
      </>
    ),
    compare: (
      <>
        <rect x="2" y="4" width="7" height="16" rx="2" />
        <rect x="15" y="4" width="7" height="16" rx="2" />
        <path d="m10 8 2-2 2 2m-2-2v12m-2-2 2 2 2-2" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 11h18m-13 4h2m4 0h2m-8 3h2" />
      </>
    ),
    settings: (
      <>
        <path d="m9 3-1 3-3 1-2 4 2 2v4l4 2 3-1 3 1 4-2v-4l2-2-2-4-3-1-1-3Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 5 5" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" />
      </>
    ),
    chevron: <path d="m9 6 6 6-6 6" />,
    arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
    plus: <path d="M12 5v14M5 12h14" />,
    upload: (
      <>
        <path d="M12 16V3m-5 5 5-5 5 5M4 15v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    shield: (
      <>
        <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    spark: (
      <>
        <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5ZM20 2v4m-2-2h4" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5m0 3h.01" />
      </>
    ),
    logout: (
      <>
        <path d="M9 3H4v18h5m5-15 6 6-6 6m-6-6h12" />
      </>
    ),
    chat: (
      <>
        <path d="M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 1 1 17-5Z" />
        <path d="M8 10h8m-8 4h5" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" />
      </>
    ),
    external: (
      <>
        <path d="M14 3h7v7m0-7L10 14M10 3H4v17h17v-6" />
      </>
    ),
    warning: (
      <>
        <path d="m12 3 10 18H2Z" />
        <path d="M12 9v5m0 3h.01" />
      </>
    ),
    send: (
      <>
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="m22 2-11 11" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3" />
      </>
    ),
    dots: (
      <>
        <circle cx="5" cy="12" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
      </>
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}
function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button className="brand" onClick={onClick} aria-label="CLARIQ home">
      <span className="brand-symbol">
        <svg width="25" height="29" viewBox="0 0 25 29" fill="none">
          <path
            d="M4 2h11l6 6v17H4V2Z"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinejoin="round"
          />
          <path
            d="M14 2v7h7M8 16l3 3 7-7"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      CLARIQ<span className="brand-period">.</span>
    </button>
  )
}
function IndonesiaFlag({ size = 15 }: { size?: number }) {
  const w = Math.round(size * 1.35)
  const h = Math.round((w * 2) / 3)
  return (
    <svg
      viewBox="0 0 24 16"
      width={w}
      height={h}
      style={{
        borderRadius: "2px",
        overflow: "hidden",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.18)",
        display: "inline-block",
        verticalAlign: "middle",
        flexShrink: 0,
      }}
      aria-label="Lambang Bendera Indonesia"
    >
      <rect width="24" height="8" fill="#E70011" />
      <rect y="8" width="24" height="8" fill="#FFFFFF" />
    </svg>
  )
}
function UKFlag({ size = 15 }: { size?: number }) {
  const w = Math.round(size * 1.35)
  const h = Math.round((w * 2) / 3)
  return (
    <svg
      viewBox="0 0 60 40"
      width={w}
      height={h}
      style={{
        borderRadius: "2px",
        overflow: "hidden",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.18)",
        display: "inline-block",
        verticalAlign: "middle",
        flexShrink: 0,
      }}
      aria-label="Lambang Bendera Inggris"
    >
      <clipPath id="uk-flag-clip-path">
        <rect width="60" height="40" />
      </clipPath>
      <g clipPath="url(#uk-flag-clip-path)">
        <path d="M0 0h60v40H0z" fill="#012169" />
        <path d="M0 0L60 40M60 0L0 40" stroke="#FFFFFF" strokeWidth="8" />
        <path d="M0 0L60 40" stroke="#C8102E" strokeWidth="4.5" />
        <path d="M60 0L0 40" stroke="#C8102E" strokeWidth="4.5" />
        <path d="M30 0v40M0 20h60" stroke="#FFFFFF" strokeWidth="13" />
        <path d="M30 0v40M0 20h60" stroke="#C8102E" strokeWidth="7.5" />
      </g>
    </svg>
  )
}
function LanguageSwitcher({
  lang,
  onChange,
}: {
  lang: Lang
  onChange: (next: Lang) => void
}) {
  const isId = lang === "id"
  return (
    <button
      type="button"
      className="lang-single-btn"
      onClick={() => onChange(isId ? "en" : "id")}
      title={isId ? "Ganti ke English" : "Ganti ke Bahasa Indonesia"}
      aria-label={isId ? "Beralih ke Bahasa Inggris" : "Switch to Indonesian"}
    >
      <span className="lang-flip-box">
        <span className={`lang-flip-face ${isId ? "active" : "inactive"}`}>
          <IndonesiaFlag size={14} />
          <span className="lang-code-text">ID</span>
        </span>
        <span className={`lang-flip-face ${!isId ? "active" : "inactive"}`}>
          <UKFlag size={14} />
          <span className="lang-code-text">EN</span>
        </span>
      </span>
      <span className="lang-swap-hint" aria-hidden="true">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 10h14l-4-4" />
          <path d="M17 14H3l4 4" />
        </svg>
      </span>
    </button>
  )
}
function Button({
  children,
  onClick,
  variant = "primary",
  icon,
  type = "button",
  disabled = false,
  className = "",
  style,
}: {
  children: ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "text" | "white"
  icon?: IconName
  type?: "button" | "submit"
  disabled?: boolean
  className?: string
  style?: CSSProperties
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {icon && <Icon name={icon} size={17} />}
      {children}
    </button>
  )
}
function Badge({ status }: { status: string }) {
  const kind = /safe|complete|active|aman|selesai|aktif/i.test(status)
    ? "safe"
    : /attention|perhatian|bahaya|risiko/i.test(status)
      ? "attention"
      : /review|remaining|due|tinjau|sisa|jatuh tempo/i.test(status)
        ? "review"
        : "neutral"
  return (
    <span className={`badge ${kind}`}>
      <span />
      {status}
    </span>
  )
}
function SectionTitle({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children?: ReactNode
}) {
  return (
    <div className="section-title">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

type Page = "dashboard" | "contracts" | "analysis" | "chat" | "compare" | "dates" | "settings" | "pricing" | "landing"
type Clause = {
  id?: number
  title: string
  titleId?: string
  status: string
  statusId?: string
  source: string
  sourceId?: string
  text: string
  textId?: string
  meaning: string
  meaningEn?: string
  why: string
  whyEn?: string
  original: string
}
type Contract = {
  id: number
  name: string
  nameId?: string
  company: string
  type: string
  typeId?: string
  status: string
  statusId?: string
  date: string
  dateId?: string
  color: string
  summary?: string
  riskScore?: number
  riskBreakdown?: { safe: number; review: number; attention: number }
  meta?: Record<string, string>
  clauses?: Clause[]
}

function getContractType(type?: string, currentLang: Lang = "id"): string {
  if (!type) return ""
  const lower = type.toLowerCase()
  if (currentLang === "id") {
    if (lower.includes("employ") || lower.includes("kerja") || lower.includes("tenaga")) return "Ketenagakerjaan"
    if (lower.includes("freelance") || lower.includes("lepas")) return "Pekerja Lepas"
    if (lower.includes("business") || lower.includes("vendor") || lower.includes("bisnis")) return "Bisnis / Vendor"
    if (lower.includes("rental") || lower.includes("lease") || lower.includes("sewa")) return "Sewa Menyewa"
    if (lower.includes("other") || lower.includes("lain")) return "Lainnya"
    return type
  } else {
    if (lower.includes("ketenagakerjaan") || lower.includes("tenaga") || lower.includes("employ")) return "Employment"
    if (lower.includes("pekerja lepas") || lower.includes("lepas") || lower.includes("freelance")) return "Freelance"
    if (lower.includes("bisnis") || lower.includes("business")) return "Business"
    if (lower.includes("sewa") || lower.includes("rental") || lower.includes("lease")) return "Rental"
    if (lower.includes("lain") || lower.includes("other")) return "Other"
    return type
  }
}

function getContractStatus(status?: string, currentLang: Lang = "id"): string {
  if (!status) return ""
  const lower = status.toLowerCase()
  if (currentLang === "id") {
    if (lower.includes("attention") || lower.includes("perhatian") || lower.includes("bahaya")) return "Perlu Perhatian"
    if (lower.includes("review") || lower.includes("tinjau")) return "Perlu Tinjauan"
    if (lower.includes("safe") || lower.includes("aman")) return "Aman"
    if (lower.includes("complete") || lower.includes("selesai")) return "Selesai"
    return status
  } else {
    if (lower.includes("perhatian") || lower.includes("attention")) return "Needs Attention"
    if (lower.includes("tinjau") || lower.includes("review")) return "Review"
    if (lower.includes("aman") || lower.includes("safe")) return "Safe"
    if (lower.includes("selesai") || lower.includes("complete")) return "Complete"
    return status
  }
}

function getContractName(c?: Contract, currentLang: Lang = "id"): string {
  if (!c) return ""
  if (currentLang === "id") {
    if (c.nameId) return c.nameId
    if (c.id === 1 || /employment/i.test(c.name)) return "Perjanjian Kerja Karyawan"
    if (c.id === 2 || /freelance/i.test(c.name)) return "Kontrak Kerja Lepas (Freelance)"
    if (c.id === 3 || /vendor/i.test(c.name)) return "Perjanjian Layanan Vendor"
    if (c.id === 4 || /apartment|lease/i.test(c.name)) return "Perjanjian Sewa Apartemen"
    return c.name
  } else {
    if (c.id === 1 || /perjanjian kerja/i.test(c.name)) return "Employment Agreement"
    if (c.id === 2 || /kerja lepas/i.test(c.name)) return "Freelance Agreement"
    if (c.id === 3 || /layanan vendor/i.test(c.name)) return "Vendor Agreement"
    if (c.id === 4 || /sewa apartemen/i.test(c.name)) return "Apartment Lease"
    return c.name
  }
}

function getContractDate(dateStr?: string, currentLang: Lang = "id"): string {
  if (!dateStr) return ""
  if (currentLang === "id") {
    const match = dateStr.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/)
    if (match) {
      const monthMap: Record<string, string> = {
        Jan: "Jan", Feb: "Feb", Mar: "Mar", Apr: "Apr", May: "Mei", Jun: "Jun",
        Jul: "Jul", Aug: "Agu", Sep: "Sep", Oct: "Okt", Nov: "Nov", Dec: "Des"
      }
      const m = monthMap[match[1]] || match[1]
      return `${match[2]} ${m} ${match[3]}`
    }
    return dateStr
  } else {
    const match = dateStr.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/)
    if (match) {
      const revMonthMap: Record<string, string> = {
        Mei: "May", Agu: "Aug", Okt: "Oct", Des: "Dec"
      }
      const m = revMonthMap[match[2]] || match[2]
      return `${m} ${match[1]}, ${match[3]}`
    }
    return dateStr
  }
}

const initialContracts: Contract[] = [
  {
    id: 1,
    name: "Employment Agreement",
    nameId: "Perjanjian Kerja Karyawan",
    company: "PT Example Indonesia",
    type: "Employment",
    typeId: "Ketenagakerjaan",
    status: "Needs Attention",
    statusId: "Perlu Perhatian",
    date: "Nov 12, 2027",
    dateId: "12 Nov 2027",
    color: "blue",
  },
  {
    id: 2,
    name: "Freelance Agreement",
    nameId: "Kontrak Kerja Lepas (Freelance)",
    company: "Studio XYZ",
    type: "Freelance",
    typeId: "Pekerja Lepas",
    status: "Review",
    statusId: "Perlu Tinjauan",
    date: "Nov 10, 2027",
    dateId: "10 Nov 2027",
    color: "lavender",
  },
  {
    id: 3,
    name: "Vendor Agreement",
    nameId: "Perjanjian Layanan Vendor",
    company: "Kopi Kita",
    type: "Business",
    typeId: "Bisnis / Vendor",
    status: "Safe",
    statusId: "Aman",
    date: "Nov 8, 2027",
    dateId: "8 Nov 2027",
    color: "mint",
  },
  {
    id: 4,
    name: "Apartment Lease",
    nameId: "Perjanjian Sewa Apartemen",
    company: "Bumi Residence",
    type: "Rental",
    typeId: "Sewa Menyewa",
    status: "Safe",
    statusId: "Aman",
    date: "Nov 5, 2027",
    dateId: "5 Nov 2027",
    color: "peach",
  },
]
const clauses = [
  {
    title: "Payment Terms",
    titleId: "Ketentuan Pembayaran",
    status: "Safe",
    statusId: "Aman",
    source: "Article 3 — Remuneration",
    sourceId: "Pasal 3 — Remunerasi",
    text: "Your monthly salary is paid by the 25th, with clearly defined benefits.",
    textId: "Gaji bulanan dibayarkan paling lambat tanggal 25, dengan tunjangan yang jelas.",
    meaning:
      "Gaji sebesar Rp12.000.000 dibayarkan setiap tanggal 25. Anda juga berhak menerima tunjangan sesuai ketentuan perusahaan.",
    meaningEn:
      "A salary of IDR 12,000,000 is paid on the 25th of each month. You are also entitled to standard employee benefits.",
    why: "Jadwal pembayaran yang jelas membantu Anda merencanakan keuangan dan memastikan kewajiban perusahaan.",
    whyEn: "A clear payment schedule ensures financial predictability and confirms employer obligations.",
    original:
      "The Employee shall receive a gross monthly salary of IDR 12,000,000, payable no later than the 25th day of each calendar month.",
  },
  {
    title: "Early Termination",
    titleId: "Pengakhiran Kontrak Dini",
    status: "Needs Attention",
    statusId: "Perlu Perhatian",
    source: "Article 8 — Termination",
    sourceId: "Pasal 8 — Pengakhiran",
    text: "Leaving before the contract ends may require a payment of one month’s salary.",
    textId: "Resign sebelum masa kontrak selesai dapat mewajibkan kompensasi 1 bulan gaji.",
    meaning:
      "Jika Anda mengundurkan diri sebelum kontrak berakhir, Anda perlu memberikan pemberitahuan tertulis 30 hari sebelumnya. Anda juga dapat diwajibkan membayar kompensasi sebesar satu bulan gaji.",
    meaningEn:
      "Resigning before the contract ends requires 30 days’ written notice and you may be obligated to compensate the company with 1 month’s gross salary.",
    why: "Anda mungkin perlu menyiapkan biaya tambahan jika ingin berpindah pekerjaan sebelum masa kontrak selesai. Diskusikan ketentuan ini dengan perusahaan sebelum menandatangani.",
    whyEn: "You may need to prepare funds if switching jobs before completion. Clarify this clause before signing.",
    original:
      "Either party may terminate this Agreement with thirty (30) days’ prior written notice. If the Employee terminates before the agreed end date, the Employee may be required to compensate the Employer an amount equivalent to one (1) month’s gross salary.",
  },
  {
    title: "Automatic Renewal",
    titleId: "Perpanjangan Otomatis",
    status: "Review",
    statusId: "Perlu Ditinjau",
    source: "Article 9 — Renewal",
    sourceId: "Pasal 9 — Perpanjangan",
    text: "Your contract renews automatically unless you give 30 days’ written notice.",
    textId: "Kontrak diperpanjang otomatis jika Anda tidak memberi surat pemberitahuan 30 hari sebelum selesai.",
    meaning:
      "Kontrak akan diperpanjang secara otomatis selama 12 bulan jika tidak ada pemberitahuan tertulis paling lambat 30 hari sebelum tanggal berakhir.",
    meaningEn:
      "The agreement renews automatically for 12 months unless either party provides written notice 30 days prior to expiry.",
    why: "Catat batas waktu pemberitahuan agar Anda tidak terikat masa kontrak baru tanpa menyadarinya.",
    whyEn: "Keep track of deadlines so you do not enter a new commitment without realizing it.",
    original:
      "This Agreement shall automatically renew for a further twelve (12) months unless either party provides written notice at least thirty (30) days before expiry.",
  },
  {
    title: "Confidentiality",
    titleId: "Kerahasiaan Informasi",
    status: "Safe",
    statusId: "Aman",
    source: "Article 6 — Confidentiality",
    sourceId: "Pasal 6 — Kerahasiaan",
    text: "Keep non-public company information confidential during and after employment.",
    textId: "Jaga kerahasiaan data internal perusahaan selama dan setelah masa kerja.",
    meaning:
      "Anda harus menjaga kerahasiaan informasi perusahaan yang tidak tersedia untuk umum, termasuk setelah hubungan kerja berakhir.",
    meaningEn:
      "You are required to protect non-public business information both during and after your employment.",
    why: "Hindari membagikan dokumen internal atau informasi klien tanpa izin tertulis dari perusahaan.",
    whyEn: "Avoid sharing proprietary documents or client data without written consent.",
    original:
      "The Employee agrees not to disclose any non-public business information during or after the term of employment, except as required by law.",
  },
  {
    title: "Responsibilities",
    titleId: "Tanggung Jawab & Jam Kerja",
    status: "Safe",
    statusId: "Aman",
    source: "Article 2 — Duties",
    sourceId: "Pasal 2 — Tugas",
    text: "Your role, working hours, and reporting structure are clearly outlined.",
    textId: "Peran, 40 jam kerja per minggu, dan jalur pelaporan kerja tertera jelas.",
    meaning:
      "Anda bekerja sebagai Product Designer selama 40 jam per minggu dan melapor kepada Head of Design. Perubahan tanggung jawab harus disepakati secara tertulis.",
    meaningEn:
      "You work as a Product Designer for 40 hours per week reporting to the Head of Design. Changes must be agreed in writing.",
    why: "Ruang lingkup pekerjaan yang jelas membantu mencegah tugas tambahan di luar kesepakatan awal.",
    whyEn: "Clear scopes prevent unsolicited out-of-scope work beyond agreed expectations.",
    original:
      "The Employee shall serve as Product Designer for forty (40) hours per week and report to the Head of Design. Material changes to duties shall be agreed in writing.",
  },
]
const dateItems = [
  {
    day: "25",
    month: "NOV",
    title: "Monthly payment",
    titleId: "Pembayaran gaji bulanan",
    contract: "Employment Agreement",
    contractId: "Perjanjian Kerja",
    date: "25 November 2027",
    dateId: "25 November 2027",
    tag: "13 days remaining",
    tagId: "Sisa 13 hari",
    kind: "mint",
  },
  {
    day: "30",
    month: "NOV",
    title: "Notice deadline",
    titleId: "Batas pemberitahuan resign",
    contract: "Freelance Agreement",
    contractId: "Perjanjian Freelance",
    date: "30 November 2027",
    dateId: "30 November 2027",
    tag: "18 days remaining",
    tagId: "Sisa 18 hari",
    kind: "amber",
  },
  {
    day: "12",
    month: "DEC",
    title: "Renewal deadline",
    titleId: "Batas waktu perpanjangan",
    contract: "Employment Agreement",
    contractId: "Perjanjian Kerja",
    date: "12 December 2027",
    dateId: "12 Desember 2027",
    tag: "30 days remaining",
    tagId: "Sisa 30 hari",
    kind: "blue",
  },
  {
    day: "12",
    month: "JAN",
    title: "Contract expiration",
    titleId: "Masa kontrak berakhir",
    contract: "Employment Agreement",
    contractId: "Perjanjian Kerja",
    date: "12 January 2028",
    dateId: "12 Januari 2028",
    tag: "61 days remaining",
    tagId: "Sisa 61 hari",
    kind: "blue",
  },
  {
    day: "13",
    month: "JAN",
    title: "Renewed contract starts",
    titleId: "Kontrak baru dimulai",
    contract: "Employment Agreement",
    contractId: "Perjanjian Kerja",
    date: "13 January 2028",
    dateId: "13 Januari 2028",
    tag: "62 days remaining",
    tagId: "Sisa 62 hari",
    kind: "mint",
  },
]
function DocumentArt({ lang = "id" }: { lang?: Lang }) {
  return (
    <div className="document-art" aria-hidden="true">
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="art-dot dot-one" />
      <div className="art-dot dot-two" />
      <div className="paper paper-back">
        <span />
        <span />
        <span />
      </div>
      <div className="paper paper-front">
        <div className="paper-header">
          <div className="mini-symbol">
            <Icon name="file" size={20} />
          </div>
          <div>
            <b>{lang === "id" ? "KONTRAK ANDA" : "YOUR CONTRACT"}</b>
            <span className="paper-short" />
          </div>
        </div>
        <div className="paper-lines">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="paper-highlight">
          <Icon name="check" size={13} />
          <span />
        </div>
        <div className="paper-lines bottom-lines">
          <span />
          <span />
        </div>
      </div>
      <div className="art-label">
        <span className="art-check">
          <Icon name="check" size={13} />
        </span>
        {lang === "id" ? "Kejelasan terwujud." : "Clarity, delivered."}
      </div>
      <div className="art-spark">
        <Icon name="spark" size={20} />
      </div>
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState<Page>(() => {
    const hash = window.location.hash.slice(1) as Page
    return [
      "dashboard",
      "contracts",
      "analysis",
      "chat",
      "compare",
      "dates",
      "settings",
      "pricing",
      "landing",
    ].includes(hash)
      ? hash
      : "dashboard"
  })
  const [mobileNav, setMobileNav] = useState(false)
  const [contracts, setContracts] = useState(initialContracts)
  const [selected, setSelected] = useState(initialContracts[0])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState("")
  const [dragging, setDragging] = useState(false)
  const [clause, setClause] = useState<number | null>(null)
  const [original, setOriginal] = useState(false)
  const [notifications, setNotifications] = useState(false)
  const [profile, setProfile] = useState(false)
  const [toast, setToast] = useState("")
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState<{
    role: string
    text: string
    source?: number
  }[]>([])
  const [compareFiles, setCompareFiles] = useState<string[]>([
    "Employment Agreement.pdf",
    "Employment Agreement — revised.pdf",
  ])
  const [compared, setCompared] = useState(true)
  const [reminders, setReminders] = useState<number[]>([0, 1, 2])
  const [dateMonth, setDateMonth] = useState(10)
  const [name, setName] = useState("Putri Anindya")
  const [email, setEmail] = useState("putri.anindya@gmail.com")
  const [emailReminders, setEmailReminders] = useState(true)
  const [plan, setPlan] = useState("Free")
  const [planModal, setPlanModal] = useState<string | null>(null)
  const [authModal, setAuthModal] = useState<"login" | "register" | null>(null)
  const [authName, setAuthName] = useState("")
  const [authEmail, setAuthEmail] = useState("")
  const [authPassword, setAuthPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [authLoading, setAuthLoading] = useState(false)
  const [token, setToken] = useState<string>(() => localStorage.getItem("clariq_token") || "")
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("clariq_lang") as Lang) || "id")
  const t = translations[lang]

  useEffect(() => {
    localStorage.setItem("clariq_lang", lang)
    document.documentElement.lang = lang
  }, [lang])

  const fileInput = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const chatBottom = useRef<HTMLDivElement>(null)

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    setAuthLoading(true)
    const endpoint = authModal === "login" ? "/api/auth/login" : "/api/auth/register"
    const payload =
      authModal === "login"
        ? { email: authEmail, password: authPassword }
        : { name: authName, email: authEmail, password: authPassword }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setAuthError(data.message || "Terjadi kesalahan saat otentikasi.")
        setAuthLoading(false)
        return
      }

      setToken(data.token)
      localStorage.setItem("clariq_token", data.token)
      if (data.user?.name) setName(data.user.name)
      if (data.user?.email) setEmail(data.user.email)
      if (data.user?.plan) setPlan(data.user.plan)
      setAuthModal(null)
      setAuthEmail("")
      setAuthPassword("")
      setAuthName("")
      setToast(data.message || "Selamat datang di CLARIQ!")
      if (page === "landing") navigate("dashboard")
    } catch {
      setAuthError("Gagal terhubung ke server backend.")
    } finally {
      setAuthLoading(false)
    }
  }

  const handleLogout = () => {
    setToken("")
    localStorage.removeItem("clariq_token")
    setProfile(false)
    setToast("Anda telah keluar akun.")
  }

  const activeClauses: Clause[] =
    selected && selected.clauses && selected.clauses.length > 0
      ? selected.clauses
      : clauses

  useEffect(() => {
    fetch("/api/contracts")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const enriched = json.data.map((c: any) => ({
            ...c,
            nameId: c.nameId || (c.id === 1 ? "Perjanjian Kerja Karyawan" : c.id === 2 ? "Kontrak Kerja Lepas (Freelance)" : c.id === 3 ? "Perjanjian Layanan Vendor" : c.id === 4 ? "Perjanjian Sewa Apartemen" : c.name),
            typeId: c.typeId || (c.type === "Employment" ? "Ketenagakerjaan" : c.type === "Freelance" ? "Pekerja Lepas" : c.type === "Business" ? "Bisnis / Vendor" : c.type === "Rental" ? "Sewa Menyewa" : c.type),
            statusId: c.statusId || (c.status === "Needs Attention" ? "Perlu Perhatian" : c.status === "Review" ? "Perlu Tinjauan" : c.status === "Safe" ? "Aman" : c.status),
            dateId: c.dateId || (c.date === "Nov 12, 2027" ? "12 Nov 2027" : c.date === "Nov 10, 2027" ? "10 Nov 2027" : c.date === "Nov 8, 2027" ? "8 Nov 2027" : c.date === "Nov 5, 2027" ? "5 Nov 2027" : c.date),
          }))
          setContracts(enriched)
          setSelected((prev) => enriched.find((c: any) => c.id === prev.id) || enriched[0])
        }
      })
      .catch(() => {})

    fetch("/api/user")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          if (json.data.name) setName(json.data.name)
          if (json.data.email) setEmail(json.data.email)
          if (json.data.emailReminders !== undefined) setEmailReminders(json.data.emailReminders)
          if (json.data.plan) setPlan(json.data.plan)
        }
      })
      .catch(() => {})
  }, [])
  const navigate = (next: Page) => {
    setPage(next)
    window.location.hash = next
    setMobileNav(false)
    setNotifications(false)
    setProfile(false)
    setSearch("")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
  useEffect(() => {
    const titles: Record<Page, string> = {
      dashboard: "Dashboard",
      contracts: "My Contracts",
      analysis: "Contract Analysis",
      chat: "Ask Your Contract",
      compare: "Compare Contracts",
      dates: "Important Dates",
      settings: "Settings",
      pricing: "Pricing",
      landing: "Understand what you sign",
    }
    document.title = `${titles[page]} · CLARIQ`
    document.documentElement.lang = "en"
  }, [page])
  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        navigate("contracts")
        window.requestAnimationFrame(() => {
          document
            .querySelector<HTMLInputElement>(".local-search input")
            ?.focus()
        })
      }
      if (event.key === "Escape") {
        setMobileNav(false)
        setProfile(false)
        setNotifications(false)
      }
    }
    window.addEventListener("keydown", onShortcut)
    return () => window.removeEventListener("keydown", onShortcut)
  }, [])
  useEffect(() => {
    const handler = () => {
      const hash = window.location.hash.slice(1) as Page
      if (
        [
          "dashboard",
          "contracts",
          "analysis",
          "chat",
          "compare",
          "dates",
          "settings",
          "pricing",
          "landing",
        ].includes(hash)
      )
        setPage(hash)
    }
    window.addEventListener("hashchange", handler)
    return () => window.removeEventListener("hashchange", handler)
  }, [])
  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(""), 4500)
    return () => window.clearTimeout(id)
  }, [toast])
  const modalOpen = uploadOpen || clause !== null || planModal !== null || authModal !== null
  useEffect(() => {
    if (!modalOpen) return
    const previous = document.activeElement as HTMLElement
    const el = modalRef.current
    const nodes = el?.querySelectorAll<HTMLElement>(
      'button, input, select, textarea, [tabindex="0"]',
    )
    nodes?.[0]?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setUploadOpen(false)
        setClause(null)
        setPlanModal(null)
        setAuthModal(null)
      }
      if (e.key === "Tab" && nodes?.length) {
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener("keydown", onKey)
    const old = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = old
      previous?.focus()
    }
  }, [modalOpen, original, uploadFile])
  useEffect(() => {
    if (messages.length)
      chatBottom.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      })
  }, [messages])
  const openContract = (contract: Contract) => {
    setSelected(contract)
    navigate("analysis")
  }
  const openClause = (index: number) => {
    setClause(index)
    setOriginal(false)
  }
  const selectFile = (file?: File) => {
    if (!file) return
    if (!/\.(pdf|docx|jpg|jpeg|png)$/i.test(file.name)) {
      setUploadError(
        lang === "id"
          ? "Silakan pilih dokumen dengan format PDF, DOCX, JPG, atau PNG."
          : "Please choose a PDF, DOCX, JPG, or PNG document."
      )
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      setUploadError(
        lang === "id"
          ? "Ukuran file harus lebih kecil dari 20 MB."
          : "Your file must be smaller than 20 MB."
      )
      return
    }
    setUploadFile(file)
    setUploadError("")
  }
  const openUpload = () => {
    setUploadFile(null)
    setUploadError("")
    setUploadOpen(true)
  }
  const analyzeUpload = async () => {
    if (!uploadFile) return
    try {
      const res = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: uploadFile.name.replace(/\.[^.]+$/, ""),
          fileName: uploadFile.name,
        }),
      })
      if (res.ok) {
        const json = await res.json()
        if (json.success && json.data) {
          setContracts((prev) => [json.data, ...prev])
          setSelected(json.data)
          setUploadOpen(false)
          navigate("analysis")
          setToast("Dokumen berhasil dianalisis oleh AI! Hasil telaah telah siap.")
          return
        }
      }
    } catch {
      // Local fallback in case backend is offline
    }
    const item: Contract = {
      id: Date.now(),
      name: uploadFile.name.replace(/\.[^.]+$/, ""),
      company: "Uploaded document · sample analysis",
      type: "Other",
      status: "Review",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      color: "blue",
    }
    setContracts([item, ...contracts])
    setSelected(item)
    setUploadOpen(false)
    navigate("analysis")
    setToast(
      "Document added. Showing sample analysis.",
    )
  }
  const ask = async (text = question) => {
    if (!text.trim()) return
    const userMsg = { role: "user", text }
    setMessages((prev) => [...prev, userMsg])
    setQuestion("")

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: text,
          contractId: selected?.id || 1,
        }),
      })
      if (res.ok) {
        const json = await res.json()
        if (json.success && json.data) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              text: json.data.text,
              source: json.data.source,
            },
          ])
          return
        }
      }
    } catch {
      // Local fallback
    }

    let source = 1
    let answer =
      lang === "id"
        ? "Jika Anda mengundurkan diri sebelum 12 Januari 2028, Anda perlu memberikan pemberitahuan tertulis 30 hari sebelumnya. Anda juga dapat dikenakan ganti rugi sebesar satu bulan gaji kotor (Rp12.000.000). Diskusikan ketentuan ini dengan perusahaan Anda."
        : "If you resign before 12 January 2028, you need to give 30 days’ written notice. You may also owe compensation equal to one month’s gross salary (Rp12,000,000). Consider discussing this condition with your employer before making a decision."
    if (/end|expire|duration|berakhir|selesai|jangka/i.test(text)) {
      source = 2
      answer =
        lang === "id"
          ? "Perjanjian contoh ini berlaku dari 13 Januari 2027 hingga 12 Januari 2028 (12 bulan). Kontrak akan diperpanjang secara otomatis jika tidak ada pemberitahuan tertulis setidaknya 30 hari sebelum masa berlaku habis."
          : "The sample agreement runs from 13 January 2027 to 12 January 2028. It automatically renews for another 12 months unless either party gives written notice at least 30 days before expiry."
    } else if (/renew|perpanjang/i.test(text)) {
      source = 2
      answer =
        lang === "id"
          ? "Ya. Kontrak ini diperpanjang otomatis selama 12 bulan. Untuk menghindari perpanjangan otomatis, kirimkan pemberitahuan tertulis paling lambat 12 Desember 2027—yaitu 30 hari sebelum kontrak berakhir."
          : "Yes. The sample agreement renews automatically for 12 months. To avoid renewal, submit written notice by 12 December 2027—30 days before the contract expires."
    } else if (/responsib|duties|tugas|tanggung jawab|peran/i.test(text)) {
      source = 4
      answer =
        lang === "id"
          ? "Tanggung jawab utama Anda adalah sebagai Product Designer, 40 jam per minggu, melapor kepada Head of Design. Setiap perubahan tugas signifikan harus disepakati secara tertulis."
          : "Your main responsibility is working as a Product Designer, 40 hours per week, reporting to the Head of Design. Any material changes to your role must be agreed in writing."
    } else if (/pay|salary|gaji|upah|uang/i.test(text)) {
      source = 0
      answer =
        lang === "id"
          ? "Gaji kotor bulanan Anda adalah Rp12.000.000, dibayarkan paling lambat tanggal 25 setiap bulannya. Tunjangan mengikuti ketentuan tertulis perusahaan."
          : "Your gross monthly salary is Rp12,000,000, paid no later than the 25th of each month. Benefits follow the company’s written policies."
    } else if (!/resign|early|terminat|quit|keluar|mundur/i.test(text)) {
      answer =
        lang === "id"
          ? "CLARIQ AI dapat menjelaskan klausul pembayaran, pengakhiran kontrak, perpanjangan otomatis, dan tanggung jawab kerja. Terkait pertanyaan Anda, pasal rujukan utama adalah Pasal 8: masing-masing pihak harus memberikan pemberitahuan tertulis 30 hari."
          : "This prototype can explain the sample agreement’s payment, termination, renewal, and responsibilities clauses. For your question, the relevant starting point is Article 8: either party must give 30 days’ written notice to end the agreement."
    }
    setMessages((prev) => [
      ...prev,
      { role: "assistant", text: answer, source },
    ])
  }
  const navItems: {
    label: string
    icon: IconName
    page: Page
    count?: string
  }[] = [
    { label: t.nav_dashboard, icon: "grid", page: "dashboard" },
    {
      label: t.nav_contracts,
      icon: "file",
      page: "contracts",
      count: String(contracts.length),
    },
    { label: t.nav_compare, icon: "compare", page: "compare" },
    { label: t.nav_dates, icon: "calendar", page: "dates", count: "3" },
  ]
  const filteredContracts = contracts.filter((c) => {
    const displayName = getContractName(c, lang)
    const displayType = getContractType(c.typeId || c.type, lang)
    const matchesSearch = `${displayName} ${c.company} ${displayType}`
      .toLowerCase()
      .includes(search.toLowerCase())
    if (!matchesSearch) return false
    if (filter === "all") return true
    const st = (c.status || "").toLowerCase()
    const stId = (c.statusId || "").toLowerCase()
    if (filter === "attention") return st.includes("attention") || stId.includes("perhatian")
    if (filter === "review") return st.includes("review") || stId.includes("tinjau")
    if (filter === "safe") return st.includes("safe") || stId.includes("aman")
    return true
  })
  const isLanding = page === "landing"
  const contractTable = (all = false) => (
    <div className="table-scroll">
      <table className="contracts-table">
        <thead>
          <tr>
            <th>{t.table_contract}</th>
            <th>{t.table_type}</th>
            <th>{t.table_status}</th>
            <th>{t.table_last_analyzed}</th>
            <th aria-label={t.table_actions} />
          </tr>
        </thead>
        <tbody>
          {(all ? filteredContracts : contracts.slice(0, 4)).map((c) => (
            <tr key={c.id} onClick={() => openContract(c)}>
              <td>
                <div className="contract-cell">
                  <span className={`file-icon ${c.color}`}>
                    <Icon name="file" size={20} />
                  </span>
                  <div>
                    <button
                      className="contract-name"
                      onClick={(e) => {
                        e.stopPropagation()
                        openContract(c)
                      }}
                    >
                      {getContractName(c, lang)}
                    </button>
                    <span>{c.company}</span>
                  </div>
                </div>
              </td>
              <td>
                <span className="type-label">{getContractType(c.typeId || c.type, lang)}</span>
              </td>
              <td>
                <Badge status={getContractStatus(c.statusId || c.status, lang)} />
              </td>
              <td className="date-cell">{getContractDate(c.dateId || c.date, lang)}</td>
              <td>
                <button
                  className="icon-button table-arrow"
                  aria-label={`Open ${getContractName(c, lang)}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    openContract(c)
                  }}
                >
                  <Icon name="chevron" size={17} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {all && !filteredContracts.length && (
        <div className="empty-state">
          <Icon name="search" size={30} />
          <h3>{t.table_no_contracts}</h3>
          <p>{lang === "id" ? "Coba kata kunci pencarian atau filter lain." : "Try a different search or filter."}</p>
          <Button
            variant="secondary"
            onClick={() => {
              setSearch("")
              setFilter("all")
            }}
          >
            {t.table_clear_filter}
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <div className={`app ${isLanding ? "public-app" : ""}`}>
      {!isLanding && (
        <>
          <div
            className={`sidebar-overlay ${mobileNav ? "visible" : ""}`}
            onClick={() => setMobileNav(false)}
          />
          <aside className={`sidebar ${mobileNav ? "open" : ""}`}>
            <div className="sidebar-brand">
              <Logo onClick={() => navigate("landing")} />
              <button
                className="icon-button mobile-close"
                onClick={() => setMobileNav(false)}
                aria-label="Close navigation"
              >
                <Icon name="close" />
              </button>
            </div>
            <button className="workspace" onClick={() => setProfile(!profile)}>
              <span className="workspace-avatar">P</span>
              <span>
                <b>{t.nav_personal_workspace}</b>
                <small>{plan} {t.nav_plan_suffix}</small>
              </span>
              <span className="workspace-chevron">
                <Icon name="chevron" size={14} />
              </span>
            </button>
            <div className="nav-label">{t.nav_workspace}</div>
            <nav className="main-nav" aria-label="Main navigation">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => navigate(item.page)}
                  className={`nav-item ${
                    page === item.page ||
                    (item.page === "contracts" &&
                      ["analysis", "chat"].includes(page))
                      ? "active"
                      : ""
                  }`}
                >
                  <Icon name={item.icon} size={19} />
                  <span>{item.label}</span>
                  {item.count && <small>{item.count}</small>}
                </button>
              ))}
            </nav>
            <div className="sidebar-bottom">
              <div className="upgrade-card">
                <span className="upgrade-icon">
                  <Icon name="spark" size={19} />
                </span>
                <h3>{t.nav_upgrade_title}</h3>
                <p>
                  {t.nav_upgrade_desc}
                </p>
                <button onClick={() => navigate("pricing")}>
                  {t.nav_explore_plans}
                  <Icon name="arrow" size={15} />
                </button>
              </div>
              <button
                className={`nav-item ${page === "settings" ? "active" : ""}`}
                onClick={() => navigate("settings")}
              >
                <Icon name="settings" size={19} />
                <span>{t.nav_settings}</span>
              </button>
              <button
                className="nav-item"
                onClick={() =>
                  setToast(
                    lang === "id"
                      ? "Butuh bantuan? Hubungi hello@clariq.example. Ini adalah demo resmi."
                      : "Need a hand? Contact hello@clariq.example. This is a demo support address."
                  )
                }
              >
                <Icon name="help" size={19} />
                <span>{t.nav_help}</span>
                <Icon name="external" size={14} />
              </button>
              <div className="sidebar-footer">
                <span className="tiny-brand">CLARIQ</span>
                <span>{t.nav_footer_tagline}</span>
              </div>
            </div>
          </aside>
        </>
      )}
      <div className="main-shell">
        {isLanding ? (
          <header className="landing-nav">
            <Logo onClick={() => navigate("landing")} />
            <nav>
              <a href="#product">{lang === "id" ? "Fitur" : "Product"}</a>
              <a href="#how-it-works">{lang === "id" ? "Cara Kerja" : "How it works"}</a>
              <button onClick={() => navigate("pricing")}>{lang === "id" ? "Untuk Bisnis" : "For Business"}</button>
              <button onClick={() => navigate("pricing")}>{lang === "id" ? "Harga & Paket" : "Pricing"}</button>
            </nav>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <LanguageSwitcher lang={lang} onChange={setLang} />
              <Button
                variant="text"
                onClick={() => {
                  setAuthModal("login")
                  setAuthError("")
                }}
              >
                {lang === "id" ? "Masuk" : "Sign In"}
              </Button>
              <Button
                onClick={() => {
                  setAuthModal("register")
                  setAuthError("")
                }}
              >
                {lang === "id" ? "Mulai Sekarang" : "Get Started"}
                <Icon name="arrow" size={16} />
              </Button>
            </div>
            <button
              className="icon-button landing-mobile"
              onClick={() => setMobileNav(!mobileNav)}
              aria-label="Toggle navigation"
            >
              <Icon name="menu" />
            </button>
            {mobileNav && (
              <div className="public-mobile-menu">
                <button onClick={() => navigate("dashboard")}>
                  {lang === "id" ? "Jelajahi Produk" : "Explore product"}
                </button>
                <a href="#how-it-works" onClick={() => setMobileNav(false)}>
                  {lang === "id" ? "Cara Kerja" : "How it works"}
                </a>
                <button onClick={() => navigate("pricing")}>
                  {lang === "id" ? "Harga & Bisnis" : "Pricing & Business"}
                </button>
                <button
                  onClick={() => {
                    setAuthModal("login")
                    setAuthError("")
                    setMobileNav(false)
                  }}
                >
                  {lang === "id" ? "Masuk Akun" : "Sign in"}
                </button>
                <button
                  onClick={() => {
                    setAuthModal("register")
                    setAuthError("")
                    setMobileNav(false)
                  }}
                >
                  {lang === "id" ? "Mulai Sekarang" : "Get started"}
                </button>
              </div>
            )}
          </header>
        ) : (
          <header className="topbar">
            <div className="topbar-left">
              <button
                className="icon-button hamburger"
                onClick={() => setMobileNav(true)}
                aria-label="Open navigation"
              >
                <Icon name="menu" />
              </button>
              <span className="breadcrumb">
                {t.topbar_workspace}
                <Icon name="chevron" size={13} />
                <b>
                  {
                    {
                      dashboard: t.breadcrumb_dashboard,
                      contracts: t.breadcrumb_contracts,
                      analysis: t.breadcrumb_analysis,
                      chat: t.breadcrumb_chat,
                      compare: t.breadcrumb_compare,
                      dates: t.breadcrumb_dates,
                      settings: t.breadcrumb_settings,
                      pricing: t.breadcrumb_pricing,
                      landing: "",
                    }[page]
                  }
                </b>
              </span>
            </div>
            <div className="topbar-right">
              <LanguageSwitcher lang={lang} onChange={setLang} />
              <div className="global-search">
                <Icon name="search" size={17} />
                <input
                  aria-label="Search contracts"
                  placeholder={t.topbar_search_placeholder}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    if (page !== "contracts") {
                      setPage("contracts")
                      window.location.hash = "contracts"
                    }
                  }}
                />
                <kbd>⌘ K</kbd>
              </div>
              <div className="popover-container">
                <button
                  className={`icon-button notification-button ${
                    notifications ? "selected" : ""
                  }`}
                  aria-label="Notifications"
                  aria-expanded={notifications}
                  onClick={() => {
                    setNotifications(!notifications)
                    setProfile(false)
                  }}
                >
                  <Icon name="bell" size={21} />
                  <span className="notification-dot" />
                </button>
                {notifications && (
                  <div className="popover notifications">
                    <h3>
                      {t.notifications_title} <span>{t.notifications_unread}</span>
                    </h3>
                    <button onClick={() => navigate("analysis")}>
                      <span className="notification-icon attention">
                        <Icon name="warning" size={19} />
                      </span>
                      <span>
                        <b>{t.notifications_sample_attention}</b>
                        <small>{t.notifications_sample_attention_sub}</small>
                      </span>
                    </button>
                    <button onClick={() => navigate("dates")}>
                      <span className="notification-icon blue">
                        <Icon name="calendar" size={19} />
                      </span>
                      <span>
                        <b>{t.notifications_sample_payment}</b>
                        <small>{t.notifications_sample_payment_sub}</small>
                      </span>
                    </button>
                    <p>{t.notifications_empty}</p>
                  </div>
                )}
              </div>
              <div className="header-divider" />
              <div className="popover-container">
                <button
                  className="profile-button"
                  aria-label="Open profile menu"
                  aria-expanded={profile}
                  onClick={() => {
                    setProfile(!profile)
                    setNotifications(false)
                  }}
                >
                  <span className="avatar">
                    {name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase() || "PA"}
                  </span>
                  <span className="profile-name">
                    {name}
                  </span>
                  <Icon name="chevron" size={14} />
                </button>
                {profile && (
                  <div className="popover profile-popover">
                    <b>{name}</b>
                    <small>{email}</small>
                    <button onClick={() => navigate("settings")}>
                      <Icon name="settings" size={16} />
                      {t.account_settings}
                    </button>
                    <button onClick={() => navigate("pricing")}>
                      <Icon name="spark" size={16} />
                      {t.plans_billing}
                    </button>
                    {token ? (
                      <button onClick={handleLogout}>
                        <Icon name="logout" size={16} />
                        {t.sign_out}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setProfile(false)
                          setAuthModal("login")
                          setAuthError("")
                        }}
                      >
                        <Icon name="lock" size={16} />
                        {t.sign_in_register}
                      </button>
                    )}
                    <button onClick={() => navigate("landing")}>
                      <Icon name="external" size={16} />
                      {t.back_to_website}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>
        )}
        <main key={page} className={isLanding ? "landing-content" : "page-content"}>
          {page === "dashboard" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="greeting-eyebrow">
                    {t.greeting_eyebrow}
                  </div>
                  <h1>
                    {t.greeting_morning} {name.split(" ")[0]}
                    <span className="greeting-dot">.</span>
                  </h1>
                  <p>
                    {t.greeting_sub}
                  </p>
                </div>
                <Button icon="plus" onClick={openUpload}>
                  {t.new_contract_btn}
                </Button>
              </div>
              <section className="welcome-card">
                <div className="welcome-copy">
                  <span className="eyebrow">
                    <span className="blue-dot" />
                    {t.welcome_eyebrow}
                  </span>
                  <h2>
                    {t.welcome_title}
                  </h2>
                  <p>
                    {t.welcome_desc}
                  </p>
                  <Button variant="white" onClick={openUpload}>
                    {t.welcome_btn}
                    <Icon name="arrow" size={17} />
                  </Button>
                  <div className="welcome-trust">
                    <Icon name="lock" size={12} />
                    {t.welcome_trust}
                  </div>
                </div>
                <DocumentArt lang={lang} />
                <div className="welcome-corner">{t.welcome_corner}</div>
              </section>
              <div className="stats-grid">
                {[
                  {
                    label: t.stat_analyzed,
                    value: String(contracts.length),
                    icon: "file" as IconName,
                    color: "blue",
                    note: t.stat_active_note,
                    noteClass: "positive",
                    page: "contracts" as Page,
                    filterKey: "all",
                  },
                  {
                    label: t.stat_needs_attention,
                    value: String(
                      contracts.filter(
                        (contract) =>
                          contract.status === "Needs Attention" ||
                          contract.statusId === "Perlu Perhatian",
                      ).length,
                    ),
                    icon: "shield" as IconName,
                    color: "coral",
                    note: t.stat_attention_note,
                    noteClass: "",
                    page: "contracts" as Page,
                    filterKey: "attention",
                  },
                  {
                    label: t.stat_upcoming_dates,
                    value: "3",
                    icon: "calendar" as IconName,
                    color: "amber",
                    note: t.stat_dates_note,
                    noteClass: "",
                    page: "dates" as Page,
                    filterKey: "all",
                  },
                  {
                    label: t.stat_this_month,
                    value: String(contracts.length),
                    icon: "spark" as IconName,
                    color: "mint",
                    note: t.stat_month_note,
                    noteClass: "",
                    page: "contracts" as Page,
                    filterKey: "all",
                  },
                ].map((stat) => (
                  <button
                    className="stat-card"
                    key={stat.label}
                    onClick={() => {
                      navigate(stat.page)
                      setFilter(stat.filterKey)
                    }}
                  >
                    <div className="stat-top">
                      <span>{stat.label}</span>
                      <span className={`stat-icon ${stat.color}`}>
                        <Icon name={stat.icon} size={19} />
                      </span>
                    </div>
                    <strong>
                      {stat.value}
                      <span className="stat-mini">
                        {stat.filterKey === "all" && (
                          <svg width="73" height="26" viewBox="0 0 73 26">
                            <path
                              d="M1 24 10 20 18 22 26 14 35 17 44 10 53 12 62 5 72 2"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        )}
                      </span>
                    </strong>
                    <small className={stat.noteClass}>
                      {stat.noteClass === "positive" && <span>↗</span>}
                      {stat.note}
                    </small>
                  </button>
                ))}
              </div>
              <div className="dashboard-columns">
                <section className="surface recent-contracts">
                  <SectionTitle
                    title={t.recent_contracts_title}
                    subtitle={t.recent_contracts_sub}
                  >
                    <button
                      className="text-link"
                      onClick={() => {
                        navigate("contracts")
                        setFilter("all")
                      }}
                    >
                      {t.recent_contracts_all}
                      <Icon name="arrow" size={15} />
                    </button>
                  </SectionTitle>
                  {contractTable()}
                </section>
                <section className="surface dates-widget">
                  <SectionTitle title={t.horizon_title}>
                    <span className="count-tag">3</span>
                  </SectionTitle>
                  <p className="widget-subtitle">
                    {t.horizon_sub}
                  </p>
                  <div className="mini-dates">
                    {dateItems.slice(0, 3).map((item, i) => (
                      <button
                        key={item.title}
                        className="mini-date"
                        onClick={() => navigate("dates")}
                      >
                        <span className={`date-square ${item.kind}`}>
                          <small>{lang === "id" && item.month === "DEC" ? "DES" : item.month}</small>
                          <b>{item.day}</b>
                        </span>
                        <span className="mini-date-text">
                          <b>{lang === "id" ? (item.titleId || item.title) : item.title}</b>
                          <small>{lang === "id" ? (item.contractId || item.contract) : item.contract}</small>
                          <span
                            className={`days-left ${
                              i === 1 ? "amber-text" : ""
                            }`}
                          >
                            {lang === "id" ? (item.tagId || item.tag) : item.tag}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                  <button
                    className="calendar-link"
                    onClick={() => navigate("dates")}
                  >
                    {t.horizon_all}
                    <Icon name="arrow" size={15} />
                  </button>
                </section>
              </div>
              <section className="new-contract-card">
                <div className="upload-circle">
                  <Icon name="upload" size={25} />
                </div>
                <div>
                  <h3>{t.new_contract_title}</h3>
                  <p>
                    {t.new_contract_desc}
                  </p>
                </div>
                <Button variant="secondary" icon="plus" onClick={openUpload}>
                  {t.new_contract_btn}
                </Button>
                <div className="banner-decoration" />
              </section>
              <div className="trust-footer">
                <span>
                  <Icon name="shield" size={15} />
                  {t.trust_footer_heading}
                </span>
                <p>{t.trust_footer_desc}</p>
                <button
                  onClick={() =>
                    setToast(
                      lang === "id"
                        ? "CLARIQ membantu menjelaskan dokumen. Konsultasikan dengan penasihat hukum profesional untuk kebutuhan kasus khusus Anda."
                        : "CLARIQ helps explain documents. Consult a qualified legal professional for advice specific to your situation."
                    )
                  }
                >
                  {t.trust_footer_learn}
                  <Icon name="external" size={12} />
                </button>
              </div>
            </>
          )}
          {page === "contracts" && (
            <>
              <div className="page-heading">
                <div>
                  <span className="greeting-eyebrow">
                    {t.library_eyebrow}
                  </span>
                  <h1>
                    {t.library_title}<span className="greeting-dot">.</span>
                  </h1>
                  <p>{t.library_sub}</p>
                </div>
                <Button icon="plus" onClick={openUpload}>
                  {t.new_contract_btn}
                </Button>
              </div>
              <div className="library-summary">
                <span className="file-icon blue">
                  <Icon name="file" size={23} />
                </span>
                <div>
                  <b>{contracts.length} {t.library_summary_title}</b>
                  <p>{t.library_summary_sub}</p>
                </div>
                <Badge status={t.library_badge_complete} />
              </div>
              <section className="surface">
                <div className="table-toolbar">
                  <div className="filter-tabs">
                    {[
                      { key: "all", label: t.filter_all },
                      { key: "safe", label: t.filter_safe },
                      { key: "review", label: t.filter_review },
                      { key: "attention", label: t.filter_attention },
                    ].map((item) => (
                      <button
                        key={item.key}
                        className={filter === item.key ? "active" : ""}
                        onClick={() => setFilter(item.key)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <div className="local-search">
                    <Icon name="search" size={17} />
                    <input
                      placeholder={t.library_search_placeholder}
                      aria-label={t.library_search_placeholder}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
                {contractTable(true)}
                <div className="table-footer">
                  {t.table_showing} {filteredContracts.length} {t.table_of} {contracts.length}{" "}
                  {t.table_contracts_suffix}<span>{t.table_sample_workspace}</span>
                </div>
              </section>
              <div className="legal-note">
                <Icon name="shield" size={16} />
                {t.library_demo_note}
              </div>
            </>
          )}
          {page === "analysis" && (
            <>
              <button
                className="back-link"
                onClick={() => navigate("contracts")}
              >
                <Icon name="arrow" size={15} />
                {t.analysis_back}
              </button>
              <div className="page-heading analysis-heading">
                <div>
                  <h1>{getContractName(selected, lang)}</h1>
                  <p>{selected.company}</p>
                  <div className="document-meta">
                    <span>
                      <Icon name="file" size={14} />
                      {lang === "id" ? `Kontrak ${getContractType(selected.typeId || selected.type, "id")}` : `${getContractType(selected.typeId || selected.type, "en")} contract`}
                    </span>
                    <span>
                      <Icon name="calendar" size={14} />
                      {lang === "id" ? "Diunggah" : "Uploaded"} {getContractDate(selected.dateId || selected.date, lang)}
                    </span>
                    <Badge status={lang === "id" ? "Analisis selesai" : "Analysis complete"} />
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setMessages([])
                    navigate("chat")
                  }}
                  icon="chat"
                >
                  {t.analysis_ask_btn}
                </Button>
              </div>
              <div className="sample-note">
                <Icon name="spark" size={16} />
                <span>
                  {t.analysis_sample_note}
                </span>
              </div>
              <section className="summary-card">
                <div className="summary-icon">
                  <Icon name="spark" size={24} />
                </div>
                <div>
                  <div className="summary-heading">
                    <h2>{t.summary_heading}</h2>
                    <span>{t.summary_tag}</span>
                  </div>
                  <p>
                    {lang === "id" ? (
                      selected.id === 1 || selected.id > 4
                        ? "Ini adalah perjanjian kerja 12 bulan untuk peran Product Designer di PT Example Indonesia. Dokumen ini menetapkan gaji kotor bulanan Rp12.000.000, 40 jam kerja per minggu, dan masa pemberitahuan resign 30 hari. Sebagian besar ketentuan merupakan standar industri, namun klausul denda pengunduran diri dini dan perpanjangan otomatis layak dicermati lebih mendalam."
                        : selected.id === 2
                          ? "Perjanjian freelance ini bersama Studio XYZ mencakup proyek desain seharga Rp8.000.000 per bulan. Pembayaran jatuh tempo setiap tanggal 25. Periksa klausul perpanjangan otomatis dan berikan pemberitahuan tertulis sebelum 30 November 2027 jika tidak ingin memperpanjang."
                          : selected.id === 3
                            ? "Perjanjian vendor dengan Kopi Kita ini mencakup pasokan selama 12 bulan, termin pembayaran bulanan, dan tanggung jawab pengiriman barang yang jelas. Tidak ditemukan klausul berisiko tinggi."
                            : "Perjanjian sewa apartemen di Bumi Residence mencakup masa sewa 12 bulan dengan uang jaminan (deposit) satu bulan sewa. Masa pemberitahuan pengakhiran sewa adalah 30 hari."
                    ) : (
                      selected.id === 1 || selected.id > 4
                        ? "This is a 12-month employment agreement for a Product Designer role at PT Example Indonesia. It outlines a monthly salary of Rp12,000,000, a 40-hour work week, and a 30-day notice period. Most terms are standard, but early termination penalties and automatic renewal deserve a closer look."
                        : selected.id === 2
                          ? "This freelance agreement with Studio XYZ covers a design project at Rp8,000,000 per month. Payment is due on the 25th. Review the automatic renewal clause and give written notice before 30 November 2027 if you do not wish to continue."
                          : selected.id === 3
                            ? "This vendor agreement with Kopi Kita outlines a 12-month supply arrangement, monthly payments, and clearly defined delivery responsibilities. The sample terms are balanced, with no high-attention clauses identified."
                            : "This apartment lease at Bumi Residence covers a 12-month rental term. Rent is paid monthly, a one-month security deposit is required, and both parties must give 30 days’ notice before termination."
                    )}
                  </p>
                  <span className="source-caption">
                    <Icon name="file" size={13} />
                    {t.summary_based_on}
                  </span>
                </div>
              </section>
              <div className="insight-grid">
                {[
                  {
                    icon: "calendar" as IconName,
                    label: t.insight_duration,
                    value: lang === "id" ? "12 bulan" : "12 months",
                    sub: "13 Jan 2027 – 12 Jan 2028",
                  },
                  {
                    icon: "file" as IconName,
                    label: t.insight_payment,
                    value: "Rp12.000.000",
                    sub: lang === "id" ? "Bulanan · Maks tgl 25" : "Monthly · Paid by the 25th",
                  },
                  {
                    icon: "clock" as IconName,
                    label: t.insight_notice,
                    value: lang === "id" ? "30 hari" : "30 days",
                    sub: lang === "id" ? "Pemberitahuan tertulis" : "Written notice required",
                  },
                  {
                    icon: "calendar" as IconName,
                    label: t.insight_renewal,
                    value: lang === "id" ? "12 Des 2027" : "12 Dec 2027",
                    sub: lang === "id" ? "Batas perpanjangan kontrak" : "Next renewal deadline",
                  },
                ].map((item) => (
                  <div className="surface insight-card" key={item.label}>
                    <div>
                      <Icon name={item.icon} size={18} />
                      <span>{item.label}</span>
                    </div>
                    <strong>{item.value}</strong>
                    <small>{item.sub}</small>
                  </div>
                ))}
              </div>
              <section className="surface risk-section">
                <SectionTitle
                  title={t.risk_title}
                  subtitle={t.risk_sub}
                >
                  <span className="muted-label">{t.risk_clauses_count}</span>
                </SectionTitle>
                <div className="risk-bar">
                  <span className="risk-safe" />
                  <span className="risk-review" />
                  <span className="risk-attention" />
                </div>
                <div className="risk-legend">
                  <span>
                    <i className="mint-bg" />
                    <b>8</b> {t.risk_safe_label}
                  </span>
                  <span>
                    <i className="amber-bg" />
                    <b>3</b> {t.risk_review_label}
                  </span>
                  <span>
                    <i className="coral-bg" />
                    <b>1</b> {t.risk_attention_label}
                  </span>
                </div>
              </section>
              <section className="surface clauses-section">
                <SectionTitle
                  title={t.clauses_heading}
                  subtitle={t.clauses_sub}
                />
                {activeClauses.map((item, i) => (
                  <button
                    className="clause-row"
                    key={item.title}
                    onClick={() => openClause(i)}
                  >
                    <span
                      className={`clause-icon ${
                        /attention|perhatian/i.test(item.status)
                          ? "coral"
                          : /review|tinjau/i.test(item.status)
                            ? "amber"
                            : "mint"
                      }`}
                    >
                      <Icon
                        name={
                          /attention|perhatian/i.test(item.status)
                            ? "warning"
                            : /review|tinjau/i.test(item.status)
                              ? "search"
                              : "check"
                        }
                        size={19}
                      />
                    </span>
                    <span className="clause-copy">
                      <b>{lang === "id" ? (item.titleId || item.title) : item.title}</b>
                      <span>{lang === "id" ? (item.textId || item.text) : item.text}</span>
                      <small>{lang === "id" ? (item.sourceId || item.source) : item.source}</small>
                    </span>
                    <Badge status={getContractStatus(item.statusId || item.status, lang)} />
                    <Icon name="chevron" size={18} />
                  </button>
                ))}
              </section>
              <div className="legal-note">
                <Icon name="shield" size={16} />
                {t.clause_legal_disclaimer}
              </div>
            </>
          )}
          {page === "chat" && (
            <>
              <button
                className="back-link"
                onClick={() => navigate("analysis")}
              >
                <Icon name="arrow" size={15} />
                {t.chat_back}
              </button>
              <div className="page-heading">
                <div>
                  <span className="greeting-eyebrow">
                    {t.chat_eyebrow}
                  </span>
                  <h1>
                    {t.chat_title}<span className="greeting-dot">.</span>
                  </h1>
                  <p>{t.chat_sub}</p>
                </div>
                <Button
                  variant="secondary"
                  icon="file"
                  onClick={() => navigate("analysis")}
                >
                  {t.chat_view_analysis}
                </Button>
              </div>
              <section className="surface chat-surface">
                <div className="chat-document">
                  <span className="file-icon blue">
                    <Icon name="file" size={18} />
                  </span>
                  <div>
                    <b>{lang === "id" ? (selected.nameId || selected.name) : selected.name}</b>
                    <span>{lang === "id" ? "Dokumen Perjanjian · 12 klausul" : "Sample agreement · 12 clauses"}</span>
                  </div>
                  <span className="chat-ready">
                    <span />
                    {t.chat_ready}
                  </span>
                </div>
                <div className="chat-messages">
                  {messages.length === 0 ? (
                    <div className="chat-empty">
                      <div className="chat-brand-icon">
                        <Icon name="spark" size={29} />
                      </div>
                      <h2 style={{ whiteSpace: "pre-line" }}>
                        {t.chat_empty_title}
                      </h2>
                      <p style={{ whiteSpace: "pre-line" }}>
                        {t.chat_empty_desc}
                      </p>
                      <div className="suggested-questions">
                        {[
                          t.chat_suggested_1,
                          t.chat_suggested_2,
                          t.chat_suggested_3,
                          t.chat_suggested_4,
                        ].map((q) => (
                          <button onClick={() => ask(q)} key={q}>
                            {q}
                            <Icon name="arrow" size={15} />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    messages.map((m, i) => (
                      <div key={i} className={`chat-message ${m.role}`}>
                        <span
                          className={
                            m.role === "assistant"
                              ? "assistant-avatar"
                              : "avatar"
                          }
                        >
                          {m.role === "assistant" ? (
                            <Icon name="spark" size={19} />
                          ) : (
                            name.slice(0, 2).toUpperCase() || "PA"
                          )}
                        </span>
                        <div>
                          <span className="message-author">
                            {m.role === "assistant"
                              ? "CLARIQ AI"
                              : name.split(" ")[0]}
                            {m.role === "assistant" && (
                              <small>{lang === "id" ? "AI · SIMULASI" : "AI · SAMPLE"}</small>
                            )}
                          </span>
                          <p>{m.text}</p>
                          {m.source !== undefined && (
                            <div className="chat-citation">
                              <small>
                                {t.chat_citation_based}{" "}
                                {lang === "id"
                                  ? (activeClauses[m.source] || clauses[m.source] || clauses[0]).sourceId || (activeClauses[m.source] || clauses[m.source] || clauses[0]).source
                                  : (activeClauses[m.source] || clauses[m.source] || clauses[0]).source}
                              </small>
                              <button
                                onClick={() => {
                                  openClause(m.source!)
                                  setOriginal(true)
                                }}
                              >
                                <Icon name="file" size={13} />
                                {t.chat_citation_view}
                                <Icon name="external" size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={chatBottom} />
                </div>
                <form
                  className="chat-input-wrap"
                  onSubmit={(e) => {
                    e.preventDefault()
                    ask()
                  }}
                >
                  <div className="chat-input">
                    <input
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      aria-label="Question about your contract"
                      placeholder={t.chat_input_placeholder}
                    />
                    <button
                      type="submit"
                      className="send-button"
                      aria-label="Send question"
                      disabled={!question.trim()}
                    >
                      <Icon name="arrow" size={20} />
                    </button>
                  </div>
                  <p>
                    <Icon name="shield" size={12} />
                    {t.chat_disclaimer}
                  </p>
                </form>
              </section>
            </>
          )}
          {page === "compare" && (
            <>
              <div className="page-heading">
                <div>
                  <span className="greeting-eyebrow">{t.compare_eyebrow}</span>
                  <h1>
                    {t.compare_title}<span className="greeting-dot">.</span>
                  </h1>
                  <p>{t.compare_sub}</p>
                </div>
                <Button
                  icon="compare"
                  disabled={compareFiles.some((f) => !f)}
                  onClick={() => {
                    setCompared(true)
                    setToast(
                      lang === "id"
                        ? "Perbandingan percontohan siap ditinjau. Isi file tidak dikirim ke pihak luar."
                        : "Sample comparison ready. File contents are not processed in this prototype."
                    )
                  }}
                >
                  {t.compare_btn}
                </Button>
              </div>
              <div className="compare-upload-grid">
                {[t.compare_doc_a, t.compare_doc_b].map((label, i) => (
                  <label className="surface compare-upload" key={label}>
                    <span className="compare-label">
                      {label}
                      <span>{i ? t.compare_revised_tag : t.compare_orig_tag}</span>
                    </span>
                    <span className={`file-icon ${i ? "mint" : "blue"}`}>
                      <Icon name="file" size={23} />
                    </span>
                    <b>
                      {compareFiles[i] === "Employment Agreement.pdf" && lang === "id"
                        ? "Perjanjian Kerja.pdf"
                        : compareFiles[i] === "Employment Agreement — revised.pdf" && lang === "id"
                          ? "Perjanjian Kerja — revisi.pdf"
                          : compareFiles[i] || t.compare_choose_doc}
                    </b>
                    <span className="text-link">
                      {compareFiles[i] ? t.compare_replace_doc : t.compare_upload_doc}
                      <Icon name="upload" size={14} />
                    </span>
                    <input
                      type="file"
                      className="sr-only"
                      accept=".pdf,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (f) {
                          if (f.size > 20 * 1024 * 1024) {
                            setToast(lang === "id" ? "Pilih file di bawah 20 MB." : "Please select a file smaller than 20 MB.")
                            return
                          }
                          const next = [...compareFiles]
                          next[i] = f.name
                          setCompareFiles(next)
                          setCompared(false)
                        }
                      }}
                    />
                  </label>
                ))}
              </div>
              {compared ? (
                <>
                  <div className="sample-note">
                    <Icon name="spark" size={16} />
                    {t.compare_sample_note}
                  </div>
                  <section className="surface compare-table-wrap">
                    <SectionTitle title={t.compare_details_title}>
                      <Badge status={t.compare_diff_badge} />
                    </SectionTitle>
                    <div className="table-scroll">
                      <table className="compare-table">
                        <thead>
                          <tr>
                            <th>{t.compare_category}</th>
                            <th>
                              <span className="comparison-dot blue-bg" />
                              {t.compare_doc_a}
                            </th>
                            <th>
                              <span className="comparison-dot mint-bg" />
                              {t.compare_doc_b}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            [lang === "id" ? "Durasi" : "Duration", lang === "id" ? "12 bulan" : "12 months", lang === "id" ? "12 bulan" : "12 months"],
                            [
                              lang === "id" ? "Gaji / Kompensasi" : "Payment",
                              lang === "id" ? "Rp12.000.000 / bulan" : "Rp12,000,000 / month",
                              lang === "id" ? "Rp14.000.000 / bulan" : "Rp14,000,000 / month",
                            ],
                            [lang === "id" ? "Masa Pemberitahuan" : "Notice Period", lang === "id" ? "30 hari" : "30 days", lang === "id" ? "60 hari" : "60 days"],
                            [
                              lang === "id" ? "Perpanjangan" : "Renewal",
                              lang === "id" ? "Otomatis · 12 bulan" : "Automatic · 12 months",
                              lang === "id" ? "Otomatis · 12 bulan" : "Automatic · 12 months",
                            ],
                            [
                              lang === "id" ? "Pengakhiran Kontrak" : "Termination",
                              lang === "id" ? "Pemberitahuan tertulis 30 hari" : "30 days’ written notice",
                              lang === "id" ? "Pemberitahuan tertulis 60 hari" : "60 days’ written notice",
                            ],
                            [
                              lang === "id" ? "Denda Resign Dini" : "Penalty",
                              lang === "id" ? "1 bulan gaji kotor" : "One month’s gross salary",
                              lang === "id" ? "Tanpa denda pinalti" : "No early termination penalty",
                            ],
                            [
                              lang === "id" ? "Tanggung Jawab" : "Responsibilities",
                              lang === "id" ? "Product Designer · 40 jam/minggu" : "Product Designer · 40 hrs/week",
                              lang === "id" ? "Product Designer · 40 jam/minggu" : "Product Designer · 40 hrs/week",
                            ],
                          ].map(([label, a, b]) => (
                            <tr
                              key={label}
                              className={a !== b ? "difference-row" : ""}
                            >
                              <th>
                                {label}
                                {a !== b && <span className="difference-dot" />}
                              </th>
                              <td>{a}</td>
                              <td>
                                {b}
                                {(label.includes("Penalty") || label.includes("Denda")) && (
                                  <Icon name="check" size={16} />
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                  <SectionTitle
                    title={t.compare_key_diff}
                    subtitle={t.compare_key_sub}
                  />
                  <div className="key-differences">
                    {[
                      {
                        icon: "file" as IconName,
                        title: t.compare_diff_1_title,
                        text: t.compare_diff_1_text,
                        color: "mint",
                      },
                      {
                        icon: "clock" as IconName,
                        title: t.compare_diff_2_title,
                        text: t.compare_diff_2_text,
                        color: "amber",
                      },
                      {
                        icon: "shield" as IconName,
                        title: t.compare_diff_3_title,
                        text: t.compare_diff_3_text,
                        color: "blue",
                      },
                    ].map((item) => (
                      <div className="surface difference-card" key={item.title}>
                        <span className={`stat-icon ${item.color}`}>
                          <Icon name={item.icon} size={21} />
                        </span>
                        <h3>{item.title}</h3>
                        <p>{item.text}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="surface empty-state">
                  <Icon name="compare" size={34} />
                  <h3>{t.compare_empty_title}</h3>
                  <p>
                    {t.compare_empty_sub}
                  </p>
                </div>
              )}
              <div className="legal-note">
                <Icon name="shield" size={16} />
                {t.compare_legal_note}
              </div>
            </>
          )}
          {page === "dates" && (
            <>
              <div className="page-heading">
                <div>
                  <span className="greeting-eyebrow">
                    {t.dates_eyebrow}
                  </span>
                  <h1>
                    {t.dates_title}<span className="greeting-dot">.</span>
                  </h1>
                  <p>{t.dates_sub}</p>
                </div>
                <span className="demo-today">
                  <Icon name="calendar" size={16} />
                  {t.dates_demo_badge}
                </span>
              </div>
              <div className="dates-page-grid">
                <section className="surface timeline-card">
                  <SectionTitle
                    title={t.dates_timeline_title}
                    subtitle={t.dates_timeline_sub}
                  />
                  <div className="timeline-list">
                    {dateItems.map((item, i) => (
                      <div className="timeline-item" key={item.title}>
                        <span className={`date-square ${item.kind}`}>
                          <small>{lang === "id" && item.month === "DEC" ? "DES" : item.month}</small>
                          <b>{item.day}</b>
                        </span>
                        <div className="timeline-copy">
                          <h3>{lang === "id" ? (item.titleId || item.title) : item.title}</h3>
                          <button
                            onClick={() =>
                              openContract(initialContracts[i === 1 ? 1 : 0])
                            }
                          >
                            {lang === "id" ? (item.contractId || item.contract) : item.contract}
                            <Icon name="external" size={12} />
                          </button>
                          <span>{lang === "id" ? (item.dateId || item.date) : item.date}</span>
                        </div>
                        <div className="timeline-actions">
                          <Badge status={lang === "id" ? (item.tagId || item.tag) : item.tag} />
                          <button
                            className={`reminder-button ${
                              reminders.includes(i) ? "enabled" : ""
                            }`}
                            onClick={() => {
                              setReminders(
                                reminders.includes(i)
                                  ? reminders.filter((n) => n !== i)
                                  : [...reminders, i],
                              )
                              setToast(
                                reminders.includes(i)
                                  ? (lang === "id" ? "Pengingat dihapus untuk sesi ini." : "Reminder removed for this session.")
                                  : (lang === "id" ? "Pengingat berhasil dipasang." : "Demo reminder saved. No email or notification will be sent.")
                              )
                            }}
                          >
                            <Icon
                              name={reminders.includes(i) ? "check" : "bell"}
                              size={13}
                            />
                            {reminders.includes(i)
                              ? t.dates_reminder_set
                              : t.dates_set_reminder}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="past-date">
                    <span className="past-check">
                      <Icon name="check" size={16} />
                    </span>
                    <span>
                      <b>{t.dates_past_title}</b>
                      <small>{t.dates_past_sub}</small>
                    </span>
                    <Badge status={t.dates_past_status} />
                  </div>
                </section>
                <div>
                  <section className="surface calendar-card">
                    <div className="calendar-header">
                      <h3>
                        {lang === "id" ? [
                          "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"
                        ][dateMonth] : [
                          "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
                        ][dateMonth]}{" "}
                        2027
                      </h3>
                      <div>
                        <button
                          className="icon-button"
                          disabled={dateMonth === 0}
                          onClick={() => setDateMonth(dateMonth - 1)}
                          aria-label="Previous month"
                        >
                          <Icon name="chevron" className="rotated" size={16} />
                        </button>
                        <button
                          className="icon-button"
                          disabled={dateMonth === 11}
                          onClick={() => setDateMonth(dateMonth + 1)}
                          aria-label="Next month"
                        >
                          <Icon name="chevron" size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="calendar-grid">
                      {(lang === "id" ? ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"] : ["M", "T", "W", "T", "F", "S", "S"]).map((d, i) => (
                        <span key={`day-${i}`} className="calendar-day-name">
                          {d}
                        </span>
                      ))}
                      {Array.from(
                        {
                          length:
                            (new Date(2027, dateMonth, 1).getDay() + 6) % 7,
                        },
                        (_, i) => (
                          <span key={`blank-${i}`} />
                        ),
                      )}
                      {Array.from(
                        { length: new Date(2027, dateMonth + 1, 0).getDate() },
                        (_, i) => (
                          <button
                            key={i}
                            className={`${
                              dateMonth === 10 && i === 11 ? "today" : ""
                            } ${
                              (dateMonth === 10 && [24, 29].includes(i)) ||
                              (dateMonth === 11 && i === 11)
                                ? "has-event"
                                : ""
                            }`}
                            onClick={() =>
                              setToast(
                                `${i + 1} ${
                                  dateMonth === 10
                                    ? (lang === "id" ? "November" : "November")
                                    : dateMonth === 11
                                      ? (lang === "id" ? "Desember" : "December")
                                      : (lang === "id" ? "bulan ini" : "of this month")
                                } 2027: ${
                                  dateMonth === 10 && i === 24
                                    ? (lang === "id" ? "Jatuh tempo pembayaran gaji bulanan." : "Monthly payment due.")
                                    : dateMonth === 10 && i === 29
                                      ? (lang === "id" ? "Batas akhir pemberitahuan kontrak freelance." : "Freelance notice deadline.")
                                      : dateMonth === 11 && i === 11
                                        ? (lang === "id" ? "Batas akhir perpanjangan kontrak kerja." : "Employment renewal deadline.")
                                        : (lang === "id" ? "Tidak ada tenggat waktu dokumen." : "No contract milestones.")
                                }`,
                              )
                            }
                          >
                            {i + 1}
                          </button>
                        ),
                      )}
                    </div>
                    <div className="calendar-legend">
                      <span>
                        <i className="blue-bg" />
                        {lang === "id" ? "Hari Ini" : "Today"}
                      </span>
                      <span>
                        <i className="mint-bg" />
                        {lang === "id" ? "Tenggat Kontrak" : "Contract milestone"}
                      </span>
                    </div>
                  </section>
                  <section className="reminder-tip">
                    <span className="stat-icon blue">
                      <Icon name="bell" size={21} />
                    </span>
                    <h3>{t.dates_nudge_title}</h3>
                    <p>{t.dates_nudge_desc}</p>
                    <span>{t.dates_nudge_sub}</span>
                  </section>
                </div>
              </div>
            </>
          )}
          {page === "settings" && (
            <>
              <div className="page-heading">
                <div>
                  <span className="greeting-eyebrow">
                    {t.settings_eyebrow}
                  </span>
                  <h1>
                    {t.settings_title}<span className="greeting-dot">.</span>
                  </h1>
                  <p>{t.settings_sub}</p>
                </div>
              </div>
              <form
                className="surface settings-card"
                onSubmit={(e) => {
                  e.preventDefault()
                  fetch("/api/user", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, emailReminders, plan }),
                  })
                    .then(() => {
                      setToast(lang === "id" ? "Pengaturan berhasil disimpan ke database CLARIQ!" : "Your preferences have been saved.")
                    })
                    .catch(() => {
                      setToast(lang === "id" ? "Pengaturan tersimpan." : "Your preferences have been saved.")
                    })
                }}
              >
                <SectionTitle
                  title={t.settings_profile_title}
                  subtitle={t.settings_profile_sub}
                />
                <div className="settings-avatar">
                  <span className="avatar">{name.slice(0, 2).toUpperCase() || "PA"}</span>
                  <div>
                    <b>{name}</b>
                    <span>{t.nav_personal_workspace}</span>
                  </div>
                </div>
                <div className="form-grid">
                  <label>
                    {t.settings_fullname}
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </label>
                  <label>
                    {t.settings_email}
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      required
                    />
                  </label>
                </div>
                <div className="settings-divider" />
                <SectionTitle
                  title={t.settings_notifications_title}
                  subtitle={t.settings_notifications_sub}
                />
                <label className="switch-row">
                  <span>
                    <b>{t.settings_reminders}</b>
                    <small>
                      {t.settings_reminders_sub}
                    </small>
                  </span>
                  <input
                    type="checkbox"
                    checked={emailReminders}
                    onChange={(e) => setEmailReminders(e.target.checked)}
                  />
                  <span className={`switch ${emailReminders ? "on" : ""}`} />
                </label>
                <div className="settings-divider" />
                <div className="settings-plan">
                  <div>
                    <b>{t.settings_plan_label} {plan}</b>
                    <p>
                      {plan === "Free"
                        ? t.settings_plan_free_desc
                        : t.settings_plan_plus_desc}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => navigate("pricing")}
                  >
                    {t.nav_explore_plans}
                    <Icon name="arrow" size={15} />
                  </Button>
                </div>
                <div className="settings-actions">
                  <span>{t.settings_demo_save_note}</span>
                  <Button type="submit">{t.settings_save}</Button>
                </div>
              </form>
            </>
          )}
          {page === "pricing" && (
            <>
              <div className="pricing-heading">
                <span className="eyebrow">
                  <span className="blue-dot" />
                  {t.pricing_eyebrow}
                </span>
                <h1>
                  {t.pricing_h1_1}
                  <br />
                  {t.pricing_h1_2}
                </h1>
                <p>{t.pricing_sub}</p>
                <span className="pricing-frequency">
                  {t.pricing_freq} <span>{t.pricing_no_lock}</span>
                </span>
              </div>
              <div className="pricing-grid">
                {[
                  {
                    name: "Free",
                    price: "0",
                    description: lang === "id" ? "Kejelasan dasar untuk memulai." : "A little clarity to get you started.",
                    features: lang === "id" ? [
                      "2 analisis dokumen / bulan",
                      "Rangkuman cerdas AI",
                      "Pemantauan tanggal penting",
                      "Penjelasan pasal terhubung ke naskah",
                    ] : [
                      "2 contract analyses / month",
                      "Basic AI summaries",
                      "Important dates",
                      "Source-linked explanations",
                    ],
                    cta: lang === "id" ? "Mulai Gratis" : "Start for free",
                  },
                  {
                    name: "Plus",
                    price: "9",
                    description: lang === "id" ? "Untuk perjanjian penting yang menentukan langkah karir Anda." : "For the agreements that shape your life.",
                    features: lang === "id" ? [
                      "20 analisis dokumen / bulan",
                      "Deteksi risiko mendalam",
                      "Tanya Kontrak Anda (AI Chat)",
                      "Perbandingan 2 versi kontrak",
                      "Semua fitur di paket Free",
                    ] : [
                      "20 contract analyses / month",
                      "Detailed risk detection",
                      "Ask Your Contract",
                      "Contract comparison",
                      "Everything in Free",
                    ],
                    cta: lang === "id" ? "Dapatkan Lebih Banyak Kejelasan" : "Get more clarity",
                  },
                  {
                    name: "Business",
                    price: "29",
                    description: lang === "id" ? "Pastikan seluruh tim sepaham dalam setiap kontrak kesepakatan." : "Keep your whole team on the same page.",
                    features: lang === "id" ? [
                      "100 analisis dokumen / bulan",
                      "Ruang kerja kolaborasi tim",
                      "Hingga 5 anggota tim",
                      "Dasbor analitik terpusat",
                      "Manajemen dokumen tingkat lanjut",
                    ] : [
                      "100 contract analyses / month",
                      "Team workspace",
                      "Up to 5 workspace members",
                      "Contract dashboard",
                      "Advanced document management",
                    ],
                    cta: lang === "id" ? "Pilih Paket Bisnis" : "Choose Business",
                  },
                ].map((item) => (
                  <section
                    className={`surface pricing-card ${
                      item.name === "Plus" ? "featured" : ""
                    }`}
                    key={item.name}
                  >
                    {item.name === "Plus" && (
                      <span className="popular-label">
                        <Icon name="spark" size={13} />
                        {t.pricing_favorite}
                      </span>
                    )}
                    <span
                      className={`stat-icon ${
                        item.name === "Plus" ? "blue" : "neutral"
                      }`}
                    >
                      <Icon
                        name={
                          item.name === "Free"
                            ? "file"
                            : item.name === "Plus"
                              ? "spark"
                              : "grid"
                        }
                        size={23}
                      />
                    </span>
                    <h2>{item.name}</h2>
                    <p>{item.description}</p>
                    <div className="plan-price">
                      ${item.price}
                      <span>{lang === "id" ? "/ bulan" : "/ month"}</span>
                    </div>
                    <Button
                      variant={item.name === "Plus" ? "primary" : "secondary"}
                      onClick={() => setPlanModal(item.name)}
                    >
                      {plan === item.name ? t.pricing_current : item.cta}
                      <Icon name="arrow" size={16} />
                    </Button>
                    <div className="plan-features">
                      {item.features.map((f) => (
                        <span key={f}>
                          <Icon name="check" size={16} />
                          {f}
                        </span>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
              <div className="pricing-bottom">
                <Icon name="shield" size={20} />
                <h3>{t.pricing_trust_heading}</h3>
                <p>
                  {t.pricing_trust_desc}
                  <br />
                  {lang === "id" ? "Ini adalah mode prototipe. Pemilihan paket tidak mengenakan biaya." : "This is a prototype. Plan selection does not charge you."}
                </p>
              </div>
            </>
          )}
          {page === "landing" && (
            <>
              <section className="landing-hero">
                <div className="landing-hero-copy">
                  <span className="eyebrow">
                    <span className="blue-dot" />
                    {lang === "id" ? "LANGKAH ANDA SELANJUTNYA DENGAN PENUH KEPASTIAN" : "YOUR NEXT CHAPTER. WITH CLARITY."}
                  </span>
                  <h1>
                    {t.landing_hero_h1_1}
                    <br />
                    {t.landing_hero_h1_2}
                  </h1>
                  <p>
                    {t.landing_hero_sub}
                  </p>
                  <div className="hero-actions">
                    <Button icon="upload" onClick={openUpload}>
                      {t.landing_hero_cta}
                    </Button>
                    <a href="#how-it-works" className="btn btn-secondary">
                      {t.landing_hero_how}
                      <Icon name="arrow" size={16} />
                    </a>
                  </div>
                  <div className="landing-trust">
                    <Icon name="shield" size={17} />
                    <span>{t.landing_hero_trust}</span>
                  </div>
                </div>
                <div className="landing-upload-card">
                  <div className="landing-art">
                    <DocumentArt lang={lang} />
                  </div>
                  <button
                    className="landing-drop"
                    onClick={openUpload}
                    onDragOver={(e) => {
                      e.preventDefault()
                      setDragging(true)
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      openUpload()
                      selectFile(e.dataTransfer.files[0])
                      setDragging(false)
                    }}
                  >
                    <span className="upload-circle">
                      <Icon name="upload" size={25} />
                    </span>
                    <h3>
                      {dragging
                        ? t.landing_drop_active
                        : t.landing_drop_title}
                    </h3>
                    <p>
                      {t.landing_drop_or} <span>{t.landing_drop_browse}</span>
                    </p>
                    <small>{t.landing_drop_limit}</small>
                  </button>
                  <span className="upload-privacy">
                    <Icon name="lock" size={12} />
                    {lang === "id" ? "Langkah baru Anda dimulai dari pemahaman." : "Your next step starts with understanding."}
                  </span>
                </div>
              </section>
              <div className="landing-audience">
                <span>{t.landing_audience_label}</span>
                <div>
                  {t.landing_aud_1}
                  <span />
                  {t.landing_aud_2}
                  <span />
                  {t.landing_aud_3}
                  <span />
                  {t.landing_aud_4}
                </div>
              </div>
              <section id="product" className="landing-section">
                <div className="landing-section-heading">
                  <span className="eyebrow">
                    {t.landing_features_eyebrow}
                  </span>
                  <h2>{t.landing_features_title}</h2>
                  <p>{t.landing_features_sub}</p>
                </div>
                <div className="feature-grid">
                  {[
                    {
                      icon: "file" as IconName,
                      title: t.landing_feat_1_title,
                      description: t.landing_feat_1_desc,
                      label: t.summary_tag,
                    },
                    {
                      icon: "shield" as IconName,
                      title: t.landing_feat_2_title,
                      description: t.landing_feat_2_desc,
                      label: lang === "id" ? "TANPA KEJUTAN MERUGIKAN" : "NO UNWELCOME SURPRISES",
                    },
                    {
                      icon: "calendar" as IconName,
                      title: t.landing_feat_3_title,
                      description: t.landing_feat_3_desc,
                      label: lang === "id" ? "SELALU TERDEPAN" : "A STEP AHEAD",
                    },
                  ].map((f) => (
                    <div className="surface feature-card" key={f.title}>
                      <span className="stat-icon blue">
                        <Icon name={f.icon} size={24} />
                      </span>
                      <small>{f.label}</small>
                      <h3>{f.title}</h3>
                      <p>{f.description}</p>
                      <button
                        className="text-link"
                        onClick={() =>
                          navigate(
                            f.title.includes("Tanggal") || f.title.includes("Dates")
                              ? "dates"
                              : "analysis",
                          )
                        }
                      >
                        {t.landing_feat_action}
                        <Icon name="arrow" size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
              <section
                className="landing-section how-section"
                id="how-it-works"
              >
                <div className="landing-section-heading">
                  <span className="eyebrow">{t.landing_how_eyebrow}</span>
                  <h2>{t.landing_how_title}</h2>
                  <p>{t.landing_how_sub}</p>
                </div>
                <div className="steps-grid">
                  {[
                    {
                      title: t.landing_step_1_title,
                      text: t.landing_step_1_desc,
                    },
                    {
                      title: t.landing_step_2_title,
                      text: t.landing_step_2_desc,
                    },
                    {
                      title: t.landing_step_3_title,
                      text: t.landing_step_3_desc,
                    },
                    {
                      title: t.landing_step_4_title,
                      text: t.landing_step_4_desc,
                    },
                  ].map((s, i) => (
                    <div key={s.title}>
                      <span className="step-number">0{i + 1}</span>
                      <h3>{s.title}</h3>
                      <p>{s.text}</p>
                    </div>
                  ))}
                </div>
              </section>
              <section className="landing-trust-section">
                <Icon name="shield" size={35} />
                <h2>{t.landing_cta_bottom_title}</h2>
                <p>{t.trust_footer_desc}</p>
                <span>
                  {t.landing_cta_bottom_desc}
                  <br />
                  {t.landing_cta_bottom_sub}
                </span>
                <Button onClick={() => navigate("dashboard")}>
                  {t.landing_cta_bottom_btn}
                  <Icon name="arrow" size={17} />
                </Button>
              </section>
              <footer className="landing-footer">
                <Logo onClick={() => navigate("landing")} />
                <span>{t.nav_footer_tagline}</span>
                <span>© 2027 CLARIQ. {lang === "id" ? "Langkah cerdas memahami perjanjian." : "A clearer way forward."}</span>
                <button onClick={() => navigate("pricing")}>
                  {t.breadcrumb_pricing}
                </button>
              </footer>
            </>
          )}
        </main>
      </div>
      {toast && (
        <div className="toast" role="status">
          <span>
            <Icon name="check" size={18} />
          </span>
          <p>{toast}</p>
          <button
            className="icon-button"
            onClick={() => setToast("")}
            aria-label="Dismiss notification"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
      {uploadOpen && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setUploadOpen(false)
          }}
        >
          <div
            className="modal upload-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-title"
            ref={modalRef}
          >
            <div className="modal-heading">
              <span className="stat-icon blue">
                <Icon name="upload" size={23} />
              </span>
              <button
                className="icon-button"
                onClick={() => setUploadOpen(false)}
                aria-label="Close upload"
              >
                <Icon name="close" />
              </button>
            </div>
            <h2 id="upload-title">{t.upload_modal_eyebrow}</h2>
            <p className="modal-subtitle">
              {t.upload_modal_sub}
            </p>
            <input
              ref={fileInput}
              type="file"
              accept=".pdf,.docx,.jpg,.jpeg,.png"
              className="sr-only"
              onChange={(e) => selectFile(e.target.files?.[0])}
            />
            <button
              className={`drop-zone ${dragging ? "dragging" : ""} ${
                uploadFile ? "has-file" : ""
              }`}
              onClick={() => fileInput.current?.click()}
              onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragging(false)
                selectFile(e.dataTransfer.files[0])
              }}
            >
              <span className="upload-circle">
                <Icon name={uploadFile ? "file" : "upload"} size={28} />
              </span>
              <h3>
                {uploadFile ? uploadFile.name : t.landing_drop_title}
              </h3>
              <p>
                {uploadFile ? (
                  `${(uploadFile.size / 1024 / 1024).toFixed(2)} MB · ${lang === "id" ? "Klik untuk mengganti" : "Click to replace"}`
                ) : (
                  <>
                    {t.landing_drop_or} <b>{t.landing_drop_browse}</b>
                  </>
                )}
              </p>
              <small>{t.landing_drop_limit}</small>
            </button>
            {uploadError && (
              <p className="form-error" role="alert">
                {uploadError}
              </p>
            )}
            <div className="upload-demo-note">
              <Icon name="spark" size={16} />
              <p>
                <b>{lang === "id" ? "Jelajahi prototipe." : "Explore the prototype."}</b> {t.upload_sample_note}
              </p>
            </div>
            <Button
              icon="spark"
              className="full-width"
              disabled={!uploadFile}
              onClick={analyzeUpload}
            >
              {t.upload_btn}
              <Icon name="arrow" size={17} />
            </Button>
            <span className="modal-legal">
              <Icon name="shield" size={13} />
              {t.upload_legal}
            </span>
          </div>
        </div>
      )}
      {clause !== null && (
        <div
          className="modal-backdrop drawer-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setClause(null)
          }}
        >
          <div
            className="clause-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="clause-title"
            ref={modalRef}
          >
            <div className="drawer-top">
              <span>{t.clause_drawer_title}</span>
              <button
                className="icon-button"
                onClick={() => setClause(null)}
                aria-label="Close clause detail"
              >
                <Icon name="close" />
              </button>
            </div>
            <div className="drawer-content">
              {(() => {
                const currentClause = activeClauses[clause] || clauses[0]
                return (
                  <>
                    <span
                      className={`stat-icon ${
                        /attention|perhatian/i.test(currentClause.status)
                          ? "coral"
                          : /review|tinjau/i.test(currentClause.status)
                            ? "amber"
                            : "mint"
                      }`}
                    >
                      <Icon name={clause === 1 ? "warning" : "file"} size={25} />
                    </span>
                    <h2 id="clause-title">{lang === "id" ? (currentClause.titleId || currentClause.title) : currentClause.title}</h2>
                    <Badge status={getContractStatus(currentClause.statusId || currentClause.status, lang)} />
                    <div className="explanation-section">
                      <span className="language-tag">
                        {t.clause_drawer_tag}
                      </span>
                      <h3>{t.clause_what_means}</h3>
                      <p>{lang === "id" ? currentClause.meaning : (currentClause.meaningEn || currentClause.meaning)}</p>
                    </div>
                    <div className="why-card">
                      <span className="why-icon">
                        <Icon name="spark" size={20} />
                      </span>
                      <div>
                        <h3>{t.clause_why_matters}</h3>
                        <p>{lang === "id" ? currentClause.why : (currentClause.whyEn || currentClause.why)}</p>
                      </div>
                    </div>
                    <div className="source-section">
                      <h3>{t.clause_source}</h3>
                      <div>
                        <Icon name="file" size={18} />
                        <span>
                          {lang === "id" ? (currentClause.sourceId || currentClause.source) : currentClause.source}
                          <small>{getContractName(selected, lang)} · {lang === "id" ? "Dokumen contoh" : "Sample document"}</small>
                        </span>
                      </div>
                      <Button
                        variant="secondary"
                        icon="external"
                        onClick={() => setOriginal(!original)}
                      >
                        {original ? t.clause_hide_original : t.clause_view_original}
                      </Button>
                    </div>
                    {original && (
                      <div className="original-viewer">
                        <div>
                          <Icon name="file" size={15} />
                          <span>{t.compare_orig_tag}</span>
                          <small>{lang === "id" ? `Halaman ${clause + 2} dari 8` : `Page ${clause + 2} of 8`}</small>
                        </div>
                        <article>
                          <p className="document-context">
                            {lang === "id" ? "PERJANJIAN KERJA KARYAWAN · PT EXAMPLE INDONESIA" : "EMPLOYMENT AGREEMENT · PT EXAMPLE INDONESIA"}
                          </p>
                          <h4>{lang === "id" ? (currentClause.sourceId || currentClause.source) : currentClause.source}</h4>
                          <mark>{currentClause.original}</mark>
                          <p className="document-context bottom">
                            {lang === "id" ? "Para pihak mengakui dan menyetujui seluruh ketentuan yang tercantum dalam Perjanjian ini." : "The parties acknowledge and agree to the terms set forth in this Agreement."}
                          </p>
                        </article>
                      </div>
                    )}
                  </>
                )
              })()}
              <div className="drawer-disclaimer">
                <Icon name="shield" size={19} />
                <p>
                  <b>{lang === "id" ? "Pemahaman dokumen, bukan nasihat hukum." : "Understanding, not legal advice."}</b> {t.clause_legal_disclaimer}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {planModal && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPlanModal(null)
          }}
        >
          <div
            className="modal plan-modal"
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="plan-title"
          >
            <div className="modal-heading">
              <span className="stat-icon blue">
                <Icon name="spark" size={24} />
              </span>
              <button
                className="icon-button"
                aria-label="Close plan selection"
                onClick={() => setPlanModal(null)}
              >
                <Icon name="close" />
              </button>
            </div>
            <h2 id="plan-title">
              {lang === "id"
                ? `Paket CLARIQ ${planModal}. Lebih banyak kejelasan.`
                : `A little more ${planModal === "Free" ? "simplicity" : "clarity"}.`}
            </h2>
            <p>
              {lang === "id"
                ? `Anda memilih paket CLARIQ ${planModal}. Ini adalah prototipe demo—tidak ada informasi pembayaran yang dibutuhkan.`
                : `You’ve selected CLARIQ ${planModal}. This is a demo—no payment details are needed, and you won’t be charged.`}
            </p>
            <div className="plan-demo-card">
              <Icon name="shield" size={20} />
              {lang === "id" ? "Pilihan paket disimpan ke profil akun Anda." : "Plan selection is saved for this session only."}
            </div>
            <Button
              className="full-width"
              onClick={() => {
                setPlan(planModal)
                setPlanModal(null)
                setToast(
                  lang === "id"
                    ? `Selamat datang di CLARIQ ${planModal}. Paket demo aktif.`
                    : `Welcome to CLARIQ ${planModal}. Your demo plan is selected.`
                )
                navigate("dashboard")
              }}
            >
              {lang === "id" ? `Lanjutkan dengan ${planModal}` : `Continue with ${planModal}`}
              <Icon name="arrow" size={17} />
            </Button>
          </div>
        </div>
      )}
      {authModal && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setAuthModal(null)
          }}
        >
          <div
            className="modal auth-modal"
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
          >
            <div className="modal-heading">
              <span className="stat-icon blue">
                <Icon name={authModal === "login" ? "lock" : "spark"} size={22} />
              </span>
              <button
                className="icon-button"
                aria-label="Tutup formulir"
                onClick={() => setAuthModal(null)}
              >
                <Icon name="close" />
              </button>
            </div>
            <h2 id="auth-title">
              {authModal === "login" ? t.auth_login_title : t.auth_register_title}
            </h2>
            <p>
              {authModal === "login"
                ? t.auth_login_sub
                : t.auth_register_sub}
            </p>

            <div
              style={{
                display: "flex",
                gap: "6px",
                margin: "18px 0 16px",
                background: "#f0f4f9",
                padding: "4px",
                borderRadius: "8px",
              }}
            >
              <button
                type="button"
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: 600,
                  background: authModal === "login" ? "white" : "transparent",
                  color: authModal === "login" ? "var(--color-navy)" : "#7b8a9e",
                  boxShadow: authModal === "login" ? "0 2px 6px #172b4d10" : "none",
                }}
                onClick={() => {
                  setAuthModal("login")
                  setAuthError("")
                }}
              >
                {t.auth_login_tab}
              </button>
              <button
                type="button"
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: 600,
                  background: authModal === "register" ? "white" : "transparent",
                  color: authModal === "register" ? "var(--color-navy)" : "#7b8a9e",
                  boxShadow:
                    authModal === "register" ? "0 2px 6px #172b4d10" : "none",
                }}
                onClick={() => {
                  setAuthModal("register")
                  setAuthError("")
                }}
              >
                {t.auth_register_tab}
              </button>
            </div>

            {authError && <div className="form-error">{authError}</div>}

            <form
              onSubmit={handleAuthSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              {authModal === "register" && (
                <div>
                  <label
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#617288",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    {t.auth_name_label}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t.auth_name_placeholder}
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "11px 13px",
                      fontSize: "12px",
                      border: "1px solid #d9e3ef",
                      borderRadius: "7px",
                      outline: "none",
                      background: "#fcfdff",
                    }}
                  />
                </div>
              )}
              <div>
                <label
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#617288",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  {t.auth_email_label}
                </label>
                <input
                  type="email"
                  required
                  placeholder={t.auth_email_placeholder}
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "11px 13px",
                    fontSize: "12px",
                    border: "1px solid #d9e3ef",
                    borderRadius: "7px",
                    outline: "none",
                    background: "#fcfdff",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#617288",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  {t.auth_pass_label}
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder={t.auth_pass_placeholder}
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "11px 13px",
                    fontSize: "12px",
                    border: "1px solid #d9e3ef",
                    borderRadius: "7px",
                    outline: "none",
                    background: "#fcfdff",
                  }}
                />
              </div>

              <Button
                type="submit"
                className="full-width mt-2"
                disabled={authLoading}
              >
                {authLoading
                  ? t.auth_loading
                  : authModal === "login"
                    ? t.auth_btn_login
                    : t.auth_btn_register}
                <Icon name="arrow" size={16} />
              </Button>
            </form>

            <p
              style={{
                textAlign: "center",
                fontSize: "11px",
                color: "#8d9eb5",
                marginTop: "16px",
              }}
            >
              {authModal === "login" ? (
                <>
                  {t.auth_footer_register}{" "}
                  <button
                    type="button"
                    style={{
                      color: "var(--color-clarity)",
                      fontWeight: 600,
                      textDecoration: "underline",
                      padding: 0,
                    }}
                    onClick={() => {
                      setAuthModal("register")
                      setAuthError("")
                    }}
                  >
                    {t.auth_switch_to_register}
                  </button>
                </>
              ) : (
                <>
                  {t.auth_footer_login}{" "}
                  <button
                    type="button"
                    style={{
                      color: "var(--color-clarity)",
                      fontWeight: 600,
                      textDecoration: "underline",
                      padding: 0,
                    }}
                    onClick={() => {
                      setAuthModal("login")
                      setAuthError("")
                    }}
                  >
                    {t.auth_switch_to_login}
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
