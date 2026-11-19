import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { translations, type Lang } from "./i18n"

type IconName = "grid" | "file" | "compare" | "calendar" | "settings" | "search" | "bell" | "chevron" | "arrow" | "plus" | "upload" | "check" | "shield" | "spark" | "clock" | "close" | "menu" | "help" | "logout" | "chat" | "download" | "external" | "warning" | "send" | "lock" | "dots" | "trash"
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
    trash: (
      <>
        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
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
    <button className="brand" onClick={onClick} aria-label="Cek Kontrak home">
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
      Cek Kontrak<span className="brand-period">.</span>
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

const SESSION_IDLE_TIMEOUT_MS = 24 * 60 * 60 * 1000 // 24 Jam (86.400.000 ms)
const LAST_ACTIVITY_KEY = "clariq_last_activity"

type Page = "dashboard" | "contracts" | "builder" | "analysis" | "chat" | "compare" | "dates" | "settings" | "pricing" | "landing"

function PageSkeleton({ variant }: { variant: Page }) {
  if (variant === "dashboard") {
    return (
      <div className="page-skeleton-wrap" aria-busy="true" aria-label="Loading dashboard">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <div style={{ display: "grid", gap: 8, flex: 1 }}>
            <div className="skeleton-line sm" style={{ width: 120 }} />
            <div className="skeleton-line lg" style={{ width: 280 }} />
            <div className="skeleton-line" style={{ width: 340 }} />
          </div>
          <div className="skeleton-block" style={{ width: 150, height: 42, borderRadius: 10 }} />
        </div>
        <div className="skeleton-block" style={{ height: 170, width: "100%" }} />
        <div className="stats-grid">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="skeleton-block" style={{ height: 112 }} />
          ))}
        </div>
        <div className="dashboard-columns">
          <div className="skeleton-block" style={{ height: 320 }} />
          <div className="skeleton-block" style={{ height: 320 }} />
        </div>
      </div>
    )
  }

  if (variant === "contracts") {
    return (
      <div className="page-skeleton-wrap" aria-busy="true" aria-label="Loading contracts">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <div style={{ display: "grid", gap: 8 }}>
            <div className="skeleton-line sm" style={{ width: 110 }} />
            <div className="skeleton-line lg" style={{ width: 240 }} />
          </div>
          <div className="skeleton-block" style={{ width: 150, height: 42, borderRadius: 10 }} />
        </div>
        <div className="skeleton-block" style={{ height: 68, width: "100%" }} />
        <div className="skeleton-block" style={{ height: 52, width: "100%" }} />
        <div style={{ display: "grid", gap: 12 }}>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="skeleton-block" style={{ height: 58, width: "100%" }} />
          ))}
        </div>
      </div>
    )
  }

  if (variant === "analysis") {
    return (
      <div className="page-skeleton-wrap" aria-busy="true" aria-label="Loading contract analysis">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
          <div style={{ display: "grid", gap: 8, flex: 1 }}>
            <div className="skeleton-line sm" style={{ width: 140 }} />
            <div className="skeleton-line lg" style={{ width: 360 }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div className="skeleton-block" style={{ width: 160, height: 42, borderRadius: 10 }} />
            <div className="skeleton-block" style={{ width: 100, height: 42, borderRadius: 10 }} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20 }}>
          <div className="skeleton-block" style={{ height: 220 }} />
          <div className="skeleton-block" style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="skeleton-circle" style={{ width: 120, height: 120 }} />
          </div>
        </div>
        <div className="stats-grid">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="skeleton-block" style={{ height: 108 }} />
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="skeleton-block" style={{ height: 140 }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="page-skeleton-wrap" aria-busy="true" aria-label="Loading page">
      <div style={{ display: "grid", gap: 8 }}>
        <div className="skeleton-line sm" style={{ width: 120 }} />
        <div className="skeleton-line lg" style={{ width: 260 }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 20 }}>
        <div className="skeleton-block" style={{ height: 260 }} />
        <div className="skeleton-block" style={{ height: 260 }} />
      </div>
    </div>
  )
}
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
    if (lower.includes("kerjasama") || lower.includes("partnership") || lower.includes("jasa") || lower.includes("service")) return "Perjanjian Kerjasama / Jasa"
    if (lower.includes("employ") || lower.includes("tenaga") || /\bkerja\b/.test(lower)) return "Ketenagakerjaan"
    if (lower.includes("freelance") || lower.includes("lepas")) return "Pekerja Lepas"
    if (lower.includes("business") || lower.includes("vendor") || lower.includes("bisnis")) return "Bisnis / Vendor"
    if (lower.includes("rental") || lower.includes("lease") || lower.includes("sewa")) return "Sewa Menyewa"
    if (lower.includes("other") || lower.includes("lain")) return "Lainnya"
    return type
  } else {
    if (lower.includes("kerjasama") || lower.includes("partnership") || lower.includes("jasa") || lower.includes("service")) return "Partnership / Service"
    if (lower.includes("ketenagakerjaan") || lower.includes("tenaga") || lower.includes("employ") || /\bkerja\b/.test(lower)) return "Employment"
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

function getContractName(c?: Contract | null, currentLang: Lang = "id"): string {
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

const KEVIN_BIROWO_CONTRACT = `Surat Kontrak Perjanjian Kerja
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

export default function App() {
  const [token, setToken] = useState<string>(() => localStorage.getItem("clariq_token") || "")
  const [page, setPage] = useState<Page>(() => {
    const hash = window.location.hash.slice(1) as Page
    const savedToken = localStorage.getItem("clariq_token")
    if (!savedToken) {
      return hash === "pricing" ? "pricing" : "landing"
    }
    return [
      "dashboard",
      "contracts",
      "builder",
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
  const [contracts, setContracts] = useState<Contract[]>([])
  const [selected, setSelected] = useState<Contract | null>(null)
  const [dates, setDates] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState("")
  const [uploadContractType, setUploadContractType] = useState<"kerja" | "sewa">("kerja")
  const [uploadMode, setUploadMode] = useState<"file" | "paste">("file")
  const [uploadText, setUploadText] = useState("")
  const [extractingPdf, setExtractingPdf] = useState(false)
  const [extractedData, setExtractedData] = useState<{
    text: string
    numPages: number
    charCount: number
    wordCount: number
  } | null>(null)
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
    source?: number | null
  }[]>([])
  const [compareFiles, setCompareFiles] = useState<string[]>(["", ""])
  const [compared, setCompared] = useState(false)
  const [compareData, setCompareData] = useState<any>(null)
  const [compareIdA, setCompareIdA] = useState<number | string>("")
  const [compareIdB, setCompareIdB] = useState<number | string>("")
  const [reminders, setReminders] = useState<number[]>([])
  const [dateMonth, setDateMonth] = useState(10)
  const [name, setName] = useState<string>(() => {
    const savedToken = localStorage.getItem("clariq_token")
    return savedToken ? localStorage.getItem("clariq_name") || "" : ""
  })
  const [email, setEmail] = useState<string>(() => {
    const savedToken = localStorage.getItem("clariq_token")
    return savedToken ? localStorage.getItem("clariq_email") || "" : ""
  })
  const [emailReminders, setEmailReminders] = useState(true)
  const [userPlan, setUserPlan] = useState<"free" | "pro">(() => {
    const savedPlan = (localStorage.getItem("clariq_plan") || "").toLowerCase()
    return savedPlan === "pro" || savedPlan === "plus" || savedPlan === "hrd pro" ? "pro" : "free"
  })
  const [plan, setPlan] = useState<string>(() => {
    const savedPlan = (localStorage.getItem("clariq_plan") || "").toLowerCase()
    return savedPlan === "pro" || savedPlan === "plus" || savedPlan === "hrd pro" ? "HRD Pro" : "Free"
  })
  const [planModal, setPlanModal] = useState<string | null>(null)

  // HRD Smart Contract Generator States
  const buildCalligraphySigSvg = (signerName: string, inkColor = "#1e3a8a") => {
    const clean = (signerName || "Tanda Tangan").trim().slice(0, 24)
    const fontSize = clean.length > 18 ? 16.5 : clean.length > 14 ? 19 : 21.5
    const escaped = clean
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="75" viewBox="0 0 220 75">
      <path d="M20 54 C 48 16, 86 64, 132 32 C 158 14, 178 48, 200 36" fill="none" stroke="${inkColor}" stroke-width="2" stroke-linecap="round" opacity="0.72"/>
      <path d="M30 60 Q 110 48 194 56" fill="none" stroke="${inkColor}" stroke-width="1.35" stroke-linecap="round" opacity="0.65"/>
      <text x="110" y="43" text-anchor="middle" fill="${inkColor}" font-family="'Brush Script MT', 'Segoe Script', 'Snell Roundhand', 'Georgia', cursive" font-size="${fontSize}" font-style="italic" font-weight="600" transform="rotate(-4 110 43)">${escaped}</text>
    </svg>`
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
  }

  const [hrdType, setHrdType] = useState<"PKWTT" | "PKWT" | "FREELANCE">("PKWT")
  const [hrdCompany, setHrdCompany] = useState("PT. Nusantara Teknologi Mandiri")
  const [hrdCompanyAddress, setHrdCompanyAddress] = useState("Jl. Jenderal Sudirman Kav. 52-53, SCBD, Jakarta Selatan")
  const [hrdRepName, setHrdRepName] = useState("Rina Wijaya")
  const [hrdRepRole, setHrdRepRole] = useState("HR Manager")
  const [hrdEmpName, setHrdEmpName] = useState("Dimas Pratama")
  const [hrdEmpNik, setHrdEmpNik] = useState("3174051208980002")
  const [hrdEmpAddress, setHrdEmpAddress] = useState("Jl. Kemang Raya No. 18, Kebayoran Baru, Jakarta Selatan")
  const [hrdEmpRole, setHrdEmpRole] = useState("Senior Product Designer")
  const [hrdStartDate, setHrdStartDate] = useState("1 Desember 2026")
  const [hrdDurationMonths, setHrdDurationMonths] = useState("12")
  const [hrdProbationMonths, setHrdProbationMonths] = useState("3")
  const [hrdSalary, setHrdSalary] = useState("12000000")
  const [hrdPayDay, setHrdPayDay] = useState("25")
  const [hrdWorkDays, setHrdWorkDays] = useState("Senin hingga Jumat (5 hari kerja)")
  const [hrdWorkHours, setHrdWorkHours] = useState("09.00 - 17.00 WIB (40 jam/minggu)")
  const [hrdNoticeDays, setHrdNoticeDays] = useState("30")
  const [hrdDuties, setHrdDuties] = useState(
    "Merancang antarmuka dan pengalaman pengguna (UI/UX) produk digital perusahaan, berkolaborasi dengan tim produk dan rekayasa perangkat lunak, serta menyusun dokumentasi sistem desain sesuai standar operasional perusahaan."
  )
  const [hrdTermination, setHrdTermination] = useState(
    "Pengakhiran hubungan kerja dilakukan secara tertulis dengan masa pemberitahuan (notice period) minimal 30 hari kalender sebelumnya tanpa pengenaan denda finansial sepihak, sesuai dengan Peraturan Pemerintah Nomor 35 Tahun 2021."
  )
  const [hrdRepSig, setHrdRepSig] = useState<string>(() => buildCalligraphySigSvg("Rina Wijaya", "#1d4ed8"))
  const [hrdEmpSig, setHrdEmpSig] = useState<string>(() => buildCalligraphySigSvg("Dimas Pratama", "#0f172a"))
  const [showCompanyStamp, setShowCompanyStamp] = useState<boolean>(true)
  const [showEmeterai, setShowEmeterai] = useState<boolean>(true)
  const [activeSigPad, setActiveSigPad] = useState<"p1" | "p2" | null>(null)
  const sigPadCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const isDrawingSigRef = useRef<boolean>(false)
  const sigFileP1Ref = useRef<HTMLInputElement | null>(null)
  const sigFileP2Ref = useRef<HTMLInputElement | null>(null)
  const [hrdSaving, setHrdSaving] = useState(false)
  const [authModal, setAuthModal] = useState<"login" | "register" | null>(null)
  const [authName, setAuthName] = useState("")
  const [authEmail, setAuthEmail] = useState("")
  const [authPassword, setAuthPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [authLoading, setAuthLoading] = useState(false)
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("clariq_lang") as Lang) || "id")
  const t = translations[lang]

  useEffect(() => {
    localStorage.setItem("clariq_lang", lang)
    document.documentElement.lang = lang
  }, [lang])

  const fileInput = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const backdropMouseDownRef = useRef<EventTarget | null>(null)
  const chatBottom = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(null)
  const [isAppLoading, setIsAppLoading] = useState<boolean>(false)
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false)
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const pageLoadTimerRef = useRef<number | null>(null)

  const handleSessionExpired = () => {
    setToken("")
    setName("")
    setEmail("")
    localStorage.removeItem("clariq_token")
    localStorage.removeItem("clariq_name")
    localStorage.removeItem("clariq_email")
    localStorage.removeItem(LAST_ACTIVITY_KEY)
    setContracts([])
    setSelected(null)
    setDates([])
    setReminders([])
    setCompareFiles(["", ""])
    setCompared(false)
    setProfile(false)
    setMobileNav(false)
    setPage("landing")
    window.location.hash = "landing"
    setAuthModal("login")
    setToast(t.session_expired_toast)
  }

  const loadUserData = (authToken?: string, showSkeleton = false) => {
    const activeToken = authToken || localStorage.getItem("clariq_token") || token
    if (!activeToken) {
      setContracts([])
      setSelected(null)
      setDates([])
      setReminders([])
      setCompareFiles(["", ""])
      setCompared(false)
      setIsAppLoading(false)
      return
    }

    if (showSkeleton) {
      setIsAppLoading(true)
    }

    fetch("/api/contracts", {
      headers: { Authorization: `Bearer ${activeToken}` },
    })
      .then((res) => {
        if (res.status === 401) {
          handleSessionExpired()
          throw new Error("SESSION_EXPIRED")
        }
        return res.json()
      })
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          const enriched = json.data.map((c: any) => ({
            ...c,
            nameId: c.nameId || (c.id === 1 ? "Perjanjian Kerja Karyawan" : c.id === 2 ? "Kontrak Kerja Lepas (Freelance)" : c.id === 3 ? "Perjanjian Layanan Vendor" : c.id === 4 ? "Perjanjian Sewa Apartemen" : c.name),
            typeId: c.typeId || (c.type === "Employment" ? "Ketenagakerjaan" : c.type === "Freelance" ? "Pekerja Lepas" : c.type === "Business" ? "Bisnis / Vendor" : c.type === "Rental" ? "Sewa Menyewa" : c.type),
            statusId: c.statusId || (c.status === "Needs Attention" ? "Perlu Perhatian" : c.status === "Review" ? "Perlu Tinjauan" : c.status === "Safe" ? "Aman" : c.status),
            dateId: c.dateId || (c.date === "Nov 12, 2027" ? "12 Nov 2027" : c.date === "Nov 10, 2027" ? "10 Nov 2027" : c.date === "Nov 8, 2027" ? "8 Nov 2027" : c.date === "Nov 5, 2027" ? "5 Nov 2027" : c.date),
          }))
          setContracts(enriched)
          setSelected(enriched.length > 0 ? enriched[0] : null)
          setCompareIdA((prev) => prev || (enriched[0]?.id || 1))
          setCompareIdB((prev) => prev || (enriched[1]?.id || enriched[0]?.id || 2))
        } else {
          setContracts([])
          setSelected(null)
        }
      })
      .catch(() => {
        setContracts([])
        setSelected(null)
      })
      .finally(() => {
        setIsAppLoading(false)
      })

    fetch("/api/dates", {
      headers: { Authorization: `Bearer ${activeToken}` },
    })
      .then((res) => {
        if (res.status === 401) {
          handleSessionExpired()
          throw new Error("SESSION_EXPIRED")
        }
        return res.json()
      })
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setDates(json.data)
          setReminders(
            json.data
              .filter((d: any) => d.reminderEnabled)
              .map((d: any) => d.id)
          )
        } else {
          setDates([])
          setReminders([])
        }
      })
      .catch(() => {
        setDates([])
        setReminders([])
      })
  }

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")

    // 1. Validation for Register: Name
    if (authModal === "register" && !authName.trim()) {
      setAuthError(t.auth_err_name_required)
      return
    }

    // 2. Email format validation
    const emailClean = authEmail.trim()
    if (!emailClean) {
      setAuthError(t.auth_err_email_required)
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailClean)) {
      setAuthError(t.auth_err_email_invalid)
      return
    }

    // 3. Password validation
    if (!authPassword) {
      setAuthError(t.auth_err_pass_required)
      return
    }
    if (authPassword.length < 6) {
      setAuthError(t.auth_err_pass_length)
      return
    }

    setAuthLoading(true)
    const endpoint = authModal === "login" ? "/api/auth/login" : "/api/auth/register"
    const payload =
      authModal === "login"
        ? { email: emailClean, password: authPassword }
        : { name: authName.trim(), email: emailClean, password: authPassword }

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
      localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()))
      if (data.user?.name) {
        setName(data.user.name)
        localStorage.setItem("clariq_name", data.user.name)
      }
      if (data.user?.email) {
        setEmail(data.user.email)
        localStorage.setItem("clariq_email", data.user.email)
      }
      if (data.user?.plan) {
        const isProServer = /pro|plus|business/i.test(data.user.plan)
        const isProLocal = (localStorage.getItem("clariq_plan") || "") === "pro"
        if (isProServer || isProLocal) {
          setUserPlan("pro")
          setPlan("HRD Pro")
          localStorage.setItem("clariq_plan", "pro")
        } else {
          setUserPlan("free")
          setPlan("Free")
        }
      }
      setAuthModal(null)
      setAuthEmail("")
      setAuthPassword("")
      setAuthName("")
      loadUserData(data.token, true)
      setToast(data.message || (lang === "id" ? "Selamat datang di Cek Kontrak!" : "Welcome to Cek Kontrak!"))
      navigate("dashboard")
    } catch {
      setAuthError("Gagal terhubung ke server backend.")
    } finally {
      setAuthLoading(false)
    }
  }

  const handleDeleteContract = async (contract: Contract) => {
    try {
      const activeToken = localStorage.getItem("clariq_token") || token
      const res = await fetch(`/api/contracts/${contract.id}`, {
        method: "DELETE",
        headers: {
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
      })
      if (res.status === 401) {
        handleSessionExpired()
        return
      }
      const data = await res.json()
      if (!res.ok || !data.success) {
        setToast(data.message || (lang === "id" ? "Gagal menghapus kontrak." : "Failed to delete contract."))
        return
      }
      setContracts((prev) => prev.filter((c) => c.id !== contract.id))
      if (selected?.id === contract.id) {
        const remaining = contracts.filter((c) => c.id !== contract.id)
        setSelected(remaining[0] || null)
        if (page === "analysis") {
          navigate(remaining.length ? "analysis" : "contracts")
        }
      }
      setContractToDelete(null)
      setToast(t.delete_success)
      loadUserData(activeToken)
    } catch {
      setToast(lang === "id" ? "Terjadi kesalahan saat menghapus kontrak." : "Error deleting contract.")
    }
  }

  const handleLogout = () => {
    setToken("")
    setName("")
    setEmail("")
    localStorage.removeItem("clariq_token")
    localStorage.removeItem("clariq_name")
    localStorage.removeItem("clariq_email")
    localStorage.removeItem(LAST_ACTIVITY_KEY)
    setContracts([])
    setSelected(null)
    setDates([])
    setReminders([])
    setCompareFiles(["", ""])
    setCompared(false)
    setProfile(false)
    setMobileNav(false)
    setPage("landing")
    window.location.hash = "landing"
    setToast(lang === "id" ? "Anda telah keluar akun." : "You have signed out.")
  }

  const activeClauses: Clause[] =
    selected && selected.clauses && selected.clauses.length > 0
      ? selected.clauses
      : []

  useEffect(() => {
    const savedToken = localStorage.getItem("clariq_token")
    if (!savedToken) {
      const hash = window.location.hash.slice(1)
      if (hash !== "pricing" && hash !== "landing") {
        window.location.hash = "landing"
      }
      setContracts([])
      setSelected(null)
      setDates([])
    } else {
      const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY)
      if (lastActivity && Date.now() - Number(lastActivity) >= SESSION_IDLE_TIMEOUT_MS) {
        handleSessionExpired()
        return
      }
      if (!lastActivity) {
        localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()))
      }
      loadUserData(savedToken, true)
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${savedToken}` },
      })
        .then((res) => {
          if (res.status === 401) {
            handleSessionExpired()
            throw new Error("SESSION_EXPIRED")
          }
          return res.json()
        })
        .then((json) => {
          if (json.success && json.user) {
            if (json.user.name) {
              setName(json.user.name)
              localStorage.setItem("clariq_name", json.user.name)
            }
            if (json.user.email) {
              setEmail(json.user.email)
              localStorage.setItem("clariq_email", json.user.email)
            }
            if (json.user.plan) {
              const isProServer = /pro|plus|business/i.test(json.user.plan)
              const isProLocal = (localStorage.getItem("clariq_plan") || "") === "pro"
              if (isProServer || isProLocal) {
                setUserPlan("pro")
                setPlan("HRD Pro")
                localStorage.setItem("clariq_plan", "pro")
              } else {
                setUserPlan("free")
                setPlan("Free")
              }
            }
            if (json.user.emailReminders !== undefined) setEmailReminders(json.user.emailReminders)
          } else {
            handleLogout()
          }
        })
        .catch(() => {})
    }
  }, [token])

  // 24-Hour Idle Session Timeout Tracker (Throttled Activity + Periodic Check + VisibilityChange)
  useEffect(() => {
    const activeToken = localStorage.getItem("clariq_token") || token
    if (!activeToken) return

    let lastWrite = 0
    const recordActivity = () => {
      const currentToken = localStorage.getItem("clariq_token")
      if (!currentToken) return
      const now = Date.now()
      const stored = localStorage.getItem(LAST_ACTIVITY_KEY)
      if (stored && now - Number(stored) >= SESSION_IDLE_TIMEOUT_MS) {
        handleSessionExpired()
        return
      }
      if (now - lastWrite >= 30000) {
        lastWrite = now
        localStorage.setItem(LAST_ACTIVITY_KEY, String(now))
      }
    }

    const checkIdleExpiry = () => {
      const currentToken = localStorage.getItem("clariq_token")
      if (!currentToken) return
      const stored = localStorage.getItem(LAST_ACTIVITY_KEY)
      if (stored && Date.now() - Number(stored) >= SESSION_IDLE_TIMEOUT_MS) {
        handleSessionExpired()
      }
    }

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkIdleExpiry()
      }
    }

    const events: (keyof WindowEventMap)[] = ["mousedown", "keydown", "scroll", "touchstart", "click"]
    events.forEach((evt) => window.addEventListener(evt, recordActivity, { passive: true }))
    document.addEventListener("visibilitychange", onVisibilityChange)
    const intervalId = window.setInterval(checkIdleExpiry, 60000)

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, recordActivity))
      document.removeEventListener("visibilitychange", onVisibilityChange)
      window.clearInterval(intervalId)
    }
  }, [token, lang])

  const triggerPageSkeleton = (targetPage: Page) => {
    const skeletonPages: Page[] = ["dashboard", "contracts", "analysis", "compare", "dates"]
    if (!skeletonPages.includes(targetPage)) {
      setIsPageLoading(false)
      return
    }
    if (pageLoadTimerRef.current) {
      window.clearTimeout(pageLoadTimerRef.current)
    }
    setIsPageLoading(true)
    pageLoadTimerRef.current = window.setTimeout(() => {
      setIsPageLoading(false)
      pageLoadTimerRef.current = null
    }, 250)
  }

  const navigate = (next: Page) => {
    const isPublic = next === "landing" || next === "pricing"
    const savedToken = localStorage.getItem("clariq_token") || token
    if (!savedToken && !isPublic) {
      setAuthModal("login")
      setToast(
        lang === "id"
          ? "Silakan masuk atau daftar terlebih dahulu untuk membuka fitur ini."
          : "Please sign in or register first to access this feature."
      )
      setPage("landing")
      window.location.hash = "landing"
      setMobileNav(false)
      setNotifications(false)
      setProfile(false)
      setSearch("")
      return
    }
    if (next !== page) {
      triggerPageSkeleton(next)
    }
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
      builder: "HRD Contract Builder",
      analysis: "Contract Analysis",
      chat: "Ask Your Contract",
      compare: "Compare Contracts",
      dates: "Important Dates",
      settings: "Settings",
      pricing: "Pricing",
      landing: "Understand what you sign",
    }
    document.title = `${titles[page]} · Cek Kontrak`
    document.documentElement.lang = lang

    if (page === "compare" && !compareData) {
      fetch("/api/contracts/compare")
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            setCompareData(json.data)
          }
        })
        .catch(() => {})
    }
  }, [page, lang, compareData])
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
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (notifications && notificationsRef.current && !notificationsRef.current.contains(target)) {
        setNotifications(false)
      }
      if (profile && profileRef.current && !profileRef.current.contains(target)) {
        setProfile(false)
      }
    }
    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [notifications, profile])
  useEffect(() => {
    const handler = () => {
      const hash = window.location.hash.slice(1) as Page
      const validPages: Page[] = [
        "dashboard",
        "contracts",
        "builder",
        "analysis",
        "chat",
        "compare",
        "dates",
        "settings",
        "pricing",
        "landing",
      ]
      if (validPages.includes(hash)) {
        const savedToken = localStorage.getItem("clariq_token") || token
        const isPublic = hash === "landing" || hash === "pricing"
        if (!savedToken && !isPublic) {
          setPage("landing")
          window.location.hash = "landing"
          setAuthModal("login")
          setToast(
            lang === "id"
              ? "Silakan masuk atau daftar terlebih dahulu."
              : "Please sign in or register first."
          )
        } else {
          setPage(hash)
        }
      }
    }
    window.addEventListener("hashchange", handler)
    return () => window.removeEventListener("hashchange", handler)
  }, [token, lang])
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
    if (!/\.(pdf|docx|txt|jpg|jpeg|png)$/i.test(file.name)) {
      setUploadError(
        lang === "id"
          ? "Silakan pilih dokumen dengan format PDF, DOCX, TXT, JPG, atau PNG."
          : "Please choose a PDF, DOCX, TXT, JPG, or PNG document."
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
    setUploadText("")
    setExtractingPdf(true)
    setExtractedData(null)

    if (/\.txt$/i.test(file.name)) {
      const reader = new FileReader()
      reader.onload = () => {
        const content = String(reader.result || "")
        setExtractingPdf(false)
        setExtractedData({
          text: content,
          numPages: 1,
          charCount: content.length,
          wordCount: content.split(/\s+/).filter(Boolean).length,
        })
        setUploadText(content)
      }
      reader.readAsText(file)
    } else if (/\.pdf$/i.test(file.name)) {
      const reader = new FileReader()
      reader.onload = async () => {
        try {
          const base64 = String(reader.result || "")
          const res = await fetch("/api/extract-pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ base64, fileName: file.name }),
          })
          const json = await res.json()
          setExtractingPdf(false)
          if (res.ok && json.success && json.data) {
            setExtractedData(json.data)
            setUploadText(json.data.text)
          } else {
            setUploadError(
              json.message ||
                (lang === "id"
                  ? "Teks dokumen tidak terbaca atau PDF berupa scan gambar. Silakan tempel teks secara manual."
                  : "Document text unreadable or scanned PDF. Please paste text manually.")
            )
          }
        } catch {
          setExtractingPdf(false)
          setUploadError(
            lang === "id"
              ? "Gagal mengekstrak PDF. Silakan coba lagi atau gunakan mode tempel teks."
              : "Failed to extract PDF. Please retry or paste text."
          )
        }
      }
      reader.readAsDataURL(file)
    } else if (/\.docx$/i.test(file.name)) {
      setExtractingPdf(false)
      setUploadMode("paste")
      setUploadError(
        lang === "id"
          ? "Dokumen Word (.docx) terdeteksi. Silakan salin isi pasal kontrak Anda ke kolom di bawah ini untuk analisis AI langsung."
          : "Word document (.docx) detected. Please copy your contract clauses into the text box below for direct AI analysis."
      )
    } else if (/\.(jpe?g|png)$/i.test(file.name)) {
      setExtractingPdf(false)
      setUploadMode("paste")
      setUploadError(
        lang === "id"
          ? "Dokumen foto/scan belum mendukung ekstraksi teks otomatis. Silakan gunakan PDF berbasis teks atau salin isi kontrak ke tab ini."
          : "Image/photo scan does not support auto-extraction. Please use a text-based PDF or paste contract text into this tab."
      )
    } else {
      setExtractingPdf(false)
    }
  }
  const openUpload = () => {
    const savedToken = localStorage.getItem("clariq_token") || token
    if (!savedToken) {
      setAuthModal("login")
      setToast(
        lang === "id"
          ? "Silakan masuk atau daftar terlebih dahulu untuk menganalisis dokumen."
          : "Please sign in or register first to analyze documents."
      )
      return
    }
    setUploadFile(null)
    setUploadText("")
    setExtractedData(null)
    setExtractingPdf(false)
    setUploadMode("file")
    setUploadError("")
    setUploadOpen(true)
  }
  const analyzeUpload = async () => {
    const isPaste = uploadMode === "paste"
    const finalText = isPaste ? uploadText.trim() : (extractedData?.text?.trim() || uploadText.trim())

    if (!finalText) {
      setUploadError(
        lang === "id"
          ? "Teks dokumen tidak terbaca atau PDF berupa gambar scan. Silakan gunakan PDF berbasis teks atau tempel (paste) isi kontrak secara manual."
          : "Document text is unreadable or PDF is a scanned image. Please use a text-based PDF or paste contract text manually."
      )
      return
    }

    const defaultTitle =
      uploadContractType === "sewa"
        ? lang === "id"
          ? "Perjanjian Sewa Cek AI"
          : "Rental Agreement AI Check"
        : lang === "id"
        ? "Perjanjian Kerja Cek AI"
        : "Employment Agreement AI Check"

    const docName = uploadFile?.name
      ? uploadFile.name.replace(/\.[^.]+$/, "")
      : defaultTitle

    setIsAnalyzing(true)
    try {
      const res = await fetch("/api/contracts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: docName,
          fileName: uploadFile?.name || (isPaste ? "contract-text.txt" : undefined),
          contractType: uploadContractType,
          contractText: finalText,
          useAICheck: true,
          lang,
        }),
      })
      if (res.status === 401) {
        setIsAnalyzing(false)
        handleSessionExpired()
        return
      }
      const json = await res.json()
      if (res.ok && json.success && json.data) {
        setContracts((prev) => [json.data, ...prev])
        setSelected(json.data)
        setMessages([])
        setClause(null)
        setOriginal(false)
        setUploadFile(null)
        setUploadText("")
        setExtractedData(null)
        setUploadOpen(false)
        setIsAnalyzing(false)
        navigate("analysis")
        setToast(
          lang === "id"
            ? "Dokumen berhasil dianalisis oleh AI! Hasil telaah telah siap."
            : "Document analyzed successfully by AI!"
        )
        loadUserData(token)
        return
      } else {
        setIsAnalyzing(false)
        setUploadError(
          json.message ||
            (lang === "id" ? "Gagal menganalisis dokumen." : "Failed to analyze document.")
        )
        return
      }
    } catch {
      setIsAnalyzing(false)
      setUploadError(
        lang === "id"
          ? "Terjadi kesalahan jaringan atau server tidak dapat dihubungi. Silakan coba beberapa saat lagi."
          : "Network error occurred or server unreachable. Please try again later."
      )
      return
    }
  }
  const ask = async (text = question) => {
    if (!text.trim()) return
    const userMsg = { role: "user", text }
    setMessages((prev) => [...prev, userMsg])
    setQuestion("")

    try {
      const activeToken = localStorage.getItem("clariq_token") || token
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify({
          question: text,
          contractId: selected?.id || 1,
          lang,
        }),
      })
      if (res.status === 401) {
        handleSessionExpired()
        return
      }
      if (res.ok) {
        const json = await res.json()
        if (json.success && json.data) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              text: json.data.text,
              source: json.data.source ?? null,
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
          ? "AI Cek Kontrak dapat menjelaskan klausul pembayaran, pengakhiran kontrak, perpanjangan otomatis, dan tanggung jawab kerja. Terkait pertanyaan Anda, pasal rujukan utama adalah Pasal 8: masing-masing pihak harus memberikan pemberitahuan tertulis 30 hari."
          : "This prototype can explain the sample agreement’s payment, termination, renewal, and responsibilities clauses. For your question, the relevant starting point is Article 8: either party must give 30 days’ written notice to end the agreement."
    }
    setMessages((prev) => [
      ...prev,
      { role: "assistant", text: answer, source },
    ])
  }
  const [checkoutMethod, setCheckoutMethod] = useState<"QRIS" | "BCA_VA" | "MANDIRI_VA">("QRIS")
  const [promoCode, setPromoCode] = useState("")
  const [paymentVerifying, setPaymentVerifying] = useState(false)

  const activateProPlan = (navigateToBuilder = false) => {
    setUserPlan("pro")
    setPlan("HRD Pro")
    localStorage.setItem("clariq_plan", "pro")
    setPaymentVerifying(false)
    setPlanModal(null)
    setToast(t.plan_activated_toast)
    const activeToken = localStorage.getItem("clariq_token") || token
    if (activeToken) {
      fetch("/api/subscription/upgrade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ promoCode, method: checkoutMethod }),
      }).catch(() => {})
    }
    if (navigateToBuilder) {
      navigate("builder")
    }
  }

  const handleSimulateCheckoutPayment = (navigateToBuilder = true) => {
    setPaymentVerifying(true)
    setTimeout(() => {
      activateProPlan(navigateToBuilder)
    }, 900)
  }

  const switchToFreePlan = () => {
    setUserPlan("free")
    setPlan("Free")
    localStorage.setItem("clariq_plan", "free")
    setPlanModal(null)
    setToast(t.plan_switched_free_toast)
    const activeToken = localStorage.getItem("clariq_token") || token
    if (activeToken) {
      fetch("/api/subscription/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeToken}`,
        },
      }).catch(() => {})
    }
  }

  const fillSampleHrdData = () => {
    setHrdType("PKWT")
    setHrdCompany("PT. Nusantara Teknologi Mandiri")
    setHrdCompanyAddress("Jl. Jenderal Sudirman Kav. 52-53, SCBD, Jakarta Selatan")
    setHrdRepName("Rina Wijaya")
    setHrdRepRole("HR Manager")
    setHrdEmpName("Dimas Pratama")
    setHrdEmpNik("3174051208980002")
    setHrdEmpAddress("Jl. Kemang Raya No. 18, Kebayoran Baru, Jakarta Selatan")
    setHrdEmpRole("Senior Product Designer")
    setHrdStartDate("1 Desember 2026")
    setHrdDurationMonths("12")
    setHrdProbationMonths("0")
    setHrdSalary("15000000")
    setHrdPayDay("25")
    setHrdWorkDays("Senin hingga Jumat (5 hari kerja)")
    setHrdWorkHours("09.00 - 17.00 WIB (40 jam/minggu)")
    setHrdNoticeDays("30")
    setHrdDuties(
      "Merancang antarmuka dan pengalaman pengguna (UI/UX) produk digital perusahaan, berkolaborasi dengan tim produk dan rekayasa perangkat lunak, serta menyusun dokumentasi sistem desain sesuai standar operasional PT. Nusantara Teknologi Mandiri."
    )
    setHrdTermination(
      "Pengakhiran hubungan kerja dilakukan secara tertulis dengan masa pemberitahuan (notice period) minimal 30 hari kalender sebelumnya tanpa pengenaan denda finansial sepihak, sesuai dengan Peraturan Pemerintah Nomor 35 Tahun 2021."
    )
    setHrdRepSig(buildCalligraphySigSvg("Rina Wijaya", "#1d4ed8"))
    setHrdEmpSig(buildCalligraphySigSvg("Dimas Pratama", "#0f172a"))
    setShowCompanyStamp(true)
    setShowEmeterai(true)
    setActiveSigPad(null)
    setToast(t.builder_sample_filled_toast)
  }

  const handleSigImageUpload = (party: "p1" | "p2", file?: File) => {
    if (!file) return
    if (!/\.(png|jpe?g|webp|svg)$/i.test(file.name)) {
      setToast(
        lang === "id"
          ? "Silakan pilih gambar tanda tangan berformat PNG, JPG, atau SVG."
          : "Please choose a PNG, JPG, or SVG signature image."
      )
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = String(reader.result || "")
      if (party === "p1") {
        setHrdRepSig(dataUrl)
      } else {
        setHrdEmpSig(dataUrl)
      }
      setActiveSigPad(null)
      setToast(
        lang === "id"
          ? "Gambar tanda tangan berhasil diunggah ke dokumen!"
          : "Signature image uploaded to the document!"
      )
    }
    reader.readAsDataURL(file)
  }

  const getSigPadCoords = (
    canvas: HTMLCanvasElement,
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / (rect.width || 1)
    const scaleY = canvas.height / (rect.height || 1)
    if ("touches" in e) {
      const touch = e.touches[0] || e.changedTouches[0]
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      }
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  const startSigPadDraw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = sigPadCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    isDrawingSigRef.current = true
    const { x, y } = getSigPadCoords(canvas, e)
    ctx.strokeStyle = activeSigPad === "p1" ? "#1d4ed8" : "#0f172a"
    ctx.lineWidth = 2.4
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const moveSigPadDraw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawingSigRef.current) return
    const canvas = sigPadCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const { x, y } = getSigPadCoords(canvas, e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const endSigPadDraw = () => {
    isDrawingSigRef.current = false
  }

  const clearSigPadCanvas = () => {
    const canvas = sigPadCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    ctx?.clearRect(0, 0, canvas.width, canvas.height)
  }

  const applySigPadCanvas = (party: "p1" | "p2") => {
    const canvas = sigPadCanvasRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL("image/png")
    if (party === "p1") {
      setHrdRepSig(dataUrl)
    } else {
      setHrdEmpSig(dataUrl)
    }
    setActiveSigPad(null)
    setToast(
      lang === "id"
        ? "Tanda tangan dari kanvas berhasil diterapkan ke dokumen!"
        : "Drawn signature applied to the document!"
    )
  }

  const getCompanyInitials = (compName: string) => {
    const words = (compName || "PT")
      .replace(/^(PT\.?|CV\.?|UD\.?|YAYASAN)\s+/i, "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
    if (words.length === 0) return "CORP"
    return words
      .slice(0, 3)
      .map((w) => w[0]?.toUpperCase() || "")
      .join("")
  }

  const formatRupiahDisplay = (val: string | number) => {
    const num = Number(String(val).replace(/[^\d]/g, "")) || 0
    return "Rp" + num.toLocaleString("id-ID")
  }

  const hrdContractNumber = `088/HRD-${hrdType}/${getCompanyInitials(hrdCompany)}/XI/2026`

  const buildLiveHrdContractText = () => {
    const docTitle =
      hrdType === "PKWTT"
        ? "SURAT PERJANJIAN KERJA WAKTU TIDAK TERTENTU (PKWTT)"
        : hrdType === "FREELANCE"
        ? "SURAT PERJANJIAN KEMITRAAN PEKERJA LEPAS (FREELANCE)"
        : "SURAT PERJANJIAN KERJA WAKTU TERTENTU (PKWT)"

    const statusTextPasal1 =
      hrdType === "PKWTT"
        ? `Karyawan Tetap berdasarkan Perjanjian Kerja Waktu Tidak Tertentu (PKWTT) terhitung sejak tanggal ${hrdStartDate}`
        : hrdType === "FREELANCE"
        ? `Mitra Pekerja Lepas (Freelance) untuk jangka waktu ${hrdDurationMonths || "6"} bulan terhitung sejak tanggal ${hrdStartDate}`
        : `Karyawan Kontrak berdasarkan Perjanjian Kerja Waktu Tertentu (PKWT) untuk jangka waktu ${hrdDurationMonths || "12"} bulan terhitung sejak tanggal ${hrdStartDate}`

    const effectiveProbation = hrdType === "PKWTT" ? Math.min(3, Math.max(0, Number(hrdProbationMonths) || 3)) : 0
    const formattedSal = formatRupiahDisplay(hrdSalary || "12000000")

    const pasal4Text =
      hrdType === "PKWT"
        ? `1. Perjanjian Kerja Waktu Tertentu (PKWT) ini berlaku selama ${hrdDurationMonths || "12"} bulan terhitung sejak tanggal ${hrdStartDate} dan dibuat tanpa masa percobaan (tidak memberlakukan masa percobaan) sesuai ketentuan Pasal 58 ayat (1) dan (2) Undang-Undang Nomor 13 Tahun 2003 tentang Ketenagakerjaan.\n2. ${hrdTermination}\n3. Pada saat berakhirnya jangka waktu PKWT, Pihak Pertama wajib memberikan uang kompensasi PKWT kepada Pihak Kedua secara proporsional sesuai masa kerja berdasarkan Pasal 15 dan Pasal 16 Peraturan Pemerintah Nomor 35 Tahun 2021.`
        : hrdType === "PKWTT"
        ? `1. Perjanjian Kerja Waktu Tidak Tertentu (PKWTT) ini berlaku efektif sejak tanggal ${hrdStartDate} dengan ketentuan masa percobaan kerja selama ${effectiveProbation} bulan (maksimal 3 bulan sesuai Pasal 60 ayat (1) Undang-Undang Nomor 13 Tahun 2003).\n2. Selama masa percobaan berlangsung, Pihak Pertama wajib membayar upah penuh di atas batas upah minimum yang berlaku dan tidak membebankan sanksi finansial apabila salah satu pihak mengakhiri hubungan kerja.\n3. ${hrdTermination}`
        : `1. Perjanjian Kemitraan ini berlaku selama ${hrdDurationMonths || "6"} bulan terhitung sejak tanggal ${hrdStartDate} tanpa masa percobaan hubungan kerja berdasarkan asas kebebasan berkontrak Pasal 1338 KUHPerdata.\n2. ${hrdTermination}`

    return `${docTitle}
Oleh ${hrdCompany}
${hrdCompanyAddress}
Nomor Kontrak: ${hrdContractNumber}

Pada hari ini, yang bertanda tangan di bawah ini:

1. PIHAK PERTAMA (PEMBERI KERJA)
Nama : ${hrdRepName}
Jabatan : ${hrdRepRole} ${hrdCompany}
Alamat : ${hrdCompanyAddress}
Dalam hal ini bertindak untuk dan atas nama ${hrdCompany}, selanjutnya dalam Perjanjian ini disebut sebagai PIHAK PERTAMA.

2. PIHAK KEDUA (PEKERJA / KARYAWAN)
Nama : ${hrdEmpName}
Nomor KTP / NIK : ${hrdEmpNik}
Alamat : ${hrdEmpAddress}
Dalam hal ini bertindak untuk dan atas nama diri sendiri, selanjutnya dalam Perjanjian ini disebut sebagai PIHAK KEDUA.

Kedua belah pihak sepakat untuk mengikatkan diri dalam ${docTitle} dengan ketentuan dan pasal-pasal hukum sebagai berikut:

Pasal 1 — Jabatan dan Status Hubungan Kerja
Pihak Pertama dengan ini menerima dan mengangkat Pihak Kedua untuk bekerja di ${hrdCompany} sebagai bagian ${hrdEmpRole} dengan status sebagai ${statusTextPasal1}.

Pasal 2 — Waktu Kerja dan Ketentuan Kehadiran
Pihak Kedua memiliki kewajiban waktu kerja pada hari ${hrdWorkDays} mulai pukul ${hrdWorkHours}, yang telah mematuhi batas waktu kerja maksimal 40 (empat puluh) jam dalam 1 (satu) minggu sesuai dengan Pasal 77 ayat (2) Undang-Undang Nomor 13 Tahun 2003 tentang Ketenagakerjaan. Kelebihan jam kerja di luar jam kerja standar dihitung sebagai waktu kerja lembur sesuai regulasi yang berlaku.

Pasal 3 — Ruang Lingkup Tugas dan Tanggung Jawab
Pihak Kedua bertanggung jawab menjalankan tugas pokok sebagai ${hrdEmpRole}, meliputi: ${hrdDuties} Segala perubahan mendasar pada ruang lingkup pekerjaan wajib disetujui secara tertulis oleh kedua belah pihak.

Pasal 4 — Jangka Waktu, Kepatuhan Regulasi, dan Pengakhiran Kontrak
${pasal4Text}

Pasal 5 — Upah Pokok, Tunjangan, dan Jadwal Pembayaran
Selama bekerja di ${hrdCompany}, Pihak Kedua berhak menerima gaji pokok sebesar ${formattedSal} setiap bulan yang dibayarkan melalui rekening bank Pihak Kedua selambat-lambatnya pada tanggal ${hrdPayDay || "25"} setiap bulannya sesuai Pasal 88 Undang-Undang Nomor 13 Tahun 2003 jo. Peraturan Pemerintah Nomor 36 Tahun 2021 tentang Pengupahan, beserta kepesertaan BPJS Kesehatan dan BPJS Ketenagakerjaan.

Pasal 6 — Kerahasiaan Informasi dan Penyelesaian Perselisihan
Pihak Kedua wajib menjaga kerahasiaan data internal perusahaan selama dan setelah hubungan kerja berakhir. Apabila terjadi perselisihan hubungan industrial, kedua belah pihak sepakat menyelesaikannya secara musyawarah untuk mufakat sesuai Undang-Undang Nomor 2 Tahun 2004 tentang Penyelesaian Perselisihan Hubungan Industrial.

Demikian surat perjanjian kerja ini dibuat secara sadar, tanpa paksaan dari pihak manapun, dalam rangkap 2 (dua) bermeterai cukup yang masing-masing memiliki kekuatan hukum yang sama.

Jakarta, ${hrdStartDate}
Pihak Pertama (${hrdRepName} — ${hrdCompany}) & Pihak Kedua (${hrdEmpName})`
  }

  const saveAndAnalyzeHrdContract = async () => {
    setHrdSaving(true)
    const fullText = buildLiveHrdContractText()
    const docName = `${hrdType} - ${hrdEmpName || "Karyawan"} (${hrdEmpRole || "Posisi"})`
    const activeToken = localStorage.getItem("clariq_token") || token
    try {
      const res = await fetch("/api/contracts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        body: JSON.stringify({
          name: docName,
          company: hrdCompany,
          fileName: `${hrdContractNumber.replace(/\//g, "-")}.pdf`,
          contractType: "kerja",
          contractText: fullText,
          useAICheck: true,
          lang,
        }),
      })
      const json = await res.json()
      setHrdSaving(false)
      if (res.ok && json.success && json.data) {
        setContracts((prev) => [json.data, ...prev])
        setSelected(json.data)
        navigate("analysis")
        setToast(t.builder_saved_toast)
        loadUserData(activeToken)
      } else {
        setToast(json.message || (lang === "id" ? "Gagal menyimpan draf kontrak." : "Failed to save contract draft."))
      }
    } catch {
      setHrdSaving(false)
      setToast(lang === "id" ? "Terjadi kesalahan jaringan saat menyimpan kontrak." : "Network error saving contract.")
    }
  }

  const navItems: {
    label: string
    icon: IconName
    page: Page
    count?: string
    isPro?: boolean
  }[] = [
    { label: t.nav_dashboard, icon: "grid", page: "dashboard" },
    {
      label: t.nav_contracts,
      icon: "file",
      page: "contracts",
      count: contracts.length > 0 ? String(contracts.length) : undefined,
    },
    {
      label: t.nav_builder,
      icon: "spark",
      page: "builder",
      isPro: true,
    },
    { label: t.nav_compare, icon: "compare", page: "compare" },
    {
      label: t.nav_dates,
      icon: "calendar",
      page: "dates",
      count: dates.length > 0 ? String(dates.length) : undefined,
    },
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
  const contractTable = (all = false) => {
    if (contracts.length === 0) {
      return (
        <div className="empty-state" style={{ padding: "48px 24px", textAlign: "center" }}>
          <div style={{ display: "inline-flex", padding: 14, borderRadius: "50%", background: "var(--card-subtle)", color: "var(--brand-primary)", marginBottom: 12 }}>
            <Icon name="file" size={32} />
          </div>
          <h3>{lang === "id" ? "Belum Ada Dokumen Kontrak" : "No Contracts Yet"}</h3>
          <p style={{ maxWidth: 440, margin: "8px auto 20px", color: "var(--text-secondary)" }}>
            {lang === "id"
              ? "Ruang kerja Anda masih bersih. Unggah draf kontrak kerja, freelance, sewa, atau perjanjian bisnis pertama Anda untuk mulai ditinjau oleh AI."
              : "Your workspace is clean. Upload your first employment, freelance, rental, or business contract draft to start AI review."}
          </p>
          <Button icon="upload" onClick={openUpload}>
            {lang === "id" ? "Unggah Dokumen Pertama" : "Upload First Document"}
          </Button>
        </div>
      )
    }

    return (
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
                    <span className={`file-icon ${c.color || "blue"}`}>
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
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px" }}>
                    <button
                      className="icon-button"
                      style={{ color: "#ef4444", padding: "6px", borderRadius: "6px" }}
                      title={t.delete_action_btn}
                      aria-label={`${t.delete_action_btn} ${getContractName(c, lang)}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setContractToDelete(c)
                      }}
                    >
                      <Icon name="trash" size={15} />
                    </button>
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
                  </div>
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
  }

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
            <button className={`workspace ${userPlan === "pro" ? "pro-active" : ""}`} onClick={() => setProfile(!profile)}>
              <span className={`workspace-avatar ${userPlan === "pro" ? "pro" : ""}`}>P</span>
              <span>
                <b>{t.nav_personal_workspace}</b>
                {userPlan === "pro" ? (
                  <small className="workspace-plan-pro">
                    {t.plan_badge_pro}
                  </small>
                ) : (
                  <small className="workspace-plan-free">{t.plan_badge_free}</small>
                )}
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
                  {item.isPro && <small className="nav-pro-badge">PRO</small>}
                  {!item.isPro && item.count && <small>{item.count}</small>}
                </button>
              ))}
            </nav>
            <div className="sidebar-bottom">
              <div className={`upgrade-card ${userPlan === "pro" ? "pro-active" : ""}`}>
                <span className="upgrade-icon">
                  <Icon name="spark" size={19} />
                </span>
                <h3>
                  {userPlan === "pro"
                    ? lang === "id"
                      ? "Paket HRD Pro Aktif"
                      : "HRD Pro Plan Active"
                    : t.nav_upgrade_title}
                </h3>
                <p>
                  {userPlan === "pro"
                    ? lang === "id"
                      ? "Akses penuh Generator Kontrak HRD & Analisis AI tanpa batas."
                      : "Full access to HRD Contract Builder & unlimited AI analysis."
                    : t.nav_upgrade_desc}
                </p>
                <button
                  onClick={() =>
                    userPlan === "pro" ? navigate("builder") : setPlanModal("HRD Pro")
                  }
                >
                  {userPlan === "pro"
                    ? lang === "id"
                      ? "Buat Kontrak HRD"
                      : "Open HRD Builder"
                    : t.nav_explore_plans}
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
                      ? "Butuh bantuan? Hubungi bantuan@cekkontrak.id. Layanan bantuan siap membantu."
                      : "Need a hand? Contact support@cekkontrak.id. We are here to help."
                  )
                }
              >
                <Icon name="help" size={19} />
                <span>{t.nav_help}</span>
                <Icon name="external" size={14} />
              </button>
              <div className="sidebar-footer">
                <span className="tiny-brand">Cek Kontrak</span>
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
              {token ? (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => navigate("dashboard")}
                  >
                    <Icon name="grid" size={16} />
                    {lang === "id" ? "Buka Dasbor" : "Open Dashboard"}
                  </Button>
                  <Button
                    variant="text"
                    onClick={handleLogout}
                  >
                    {lang === "id" ? "Keluar" : "Sign Out"}
                  </Button>
                </>
              ) : (
                <>
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
                </>
              )}
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
                {token ? (
                  <>
                    <button onClick={() => navigate("dashboard")}>
                      {lang === "id" ? "Buka Dasbor" : "Open Dashboard"}
                    </button>
                    <a href="#how-it-works" onClick={() => setMobileNav(false)}>
                      {lang === "id" ? "Cara Kerja" : "How it works"}
                    </a>
                    <button onClick={() => navigate("pricing")}>
                      {lang === "id" ? "Harga & Bisnis" : "Pricing & Business"}
                    </button>
                    <button onClick={handleLogout}>
                      {lang === "id" ? "Keluar Akun" : "Sign out"}
                    </button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderTop: "1px solid var(--border)", marginTop: "6px" }}>
                  <span style={{ fontSize: "11px", color: "var(--muted)", fontWeight: 600 }}>
                    {lang === "id" ? "Pilihan Bahasa" : "Language"}
                  </span>
                  <LanguageSwitcher lang={lang} onChange={setLang} />
                </div>
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
                      builder: t.breadcrumb_builder,
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
              </div>
              <div className="popover-container" ref={notificationsRef}>
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
                  {(contracts.some((c) => c.status === "Needs Attention" || c.statusId === "Perlu Perhatian") || dates.length > 0) && (
                    <span className="notification-dot" />
                  )}
                </button>
                {notifications && (
                  <div className="popover notifications">
                    <h3>
                      {t.notifications_title} <span>{(contracts.some((c) => c.status === "Needs Attention" || c.statusId === "Perlu Perhatian") || dates.length > 0) ? t.notifications_unread : ""}</span>
                    </h3>
                    {contracts.some((c) => c.status === "Needs Attention" || c.statusId === "Perlu Perhatian") && (
                      <button onClick={() => navigate("contracts")}>
                        <span className="notification-icon attention">
                          <Icon name="warning" size={19} />
                        </span>
                        <span>
                          <b>{t.notifications_sample_attention}</b>
                          <small>{t.notifications_sample_attention_sub}</small>
                        </span>
                      </button>
                    )}
                    {dates.length > 0 && (
                      <button onClick={() => navigate("dates")}>
                        <span className="notification-icon blue">
                          <Icon name="calendar" size={19} />
                        </span>
                        <span>
                          <b>{t.notifications_sample_payment}</b>
                          <small>{t.notifications_sample_payment_sub}</small>
                        </span>
                      </button>
                    )}
                    {!contracts.some((c) => c.status === "Needs Attention" || c.statusId === "Perlu Perhatian") && dates.length === 0 && (
                      <p style={{ padding: "12px 6px", textAlign: "center", color: "var(--text-secondary)" }}>
                        {t.notifications_empty}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="header-divider" />
              <div className="popover-container" ref={profileRef}>
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
                    <button
                      id="btn-reset-free-plan"
                      onClick={() => {
                        setProfile(false)
                        switchToFreePlan()
                      }}
                    >
                      <Icon name="shield" size={16} />
                      {lang === "id" ? "Reset ke Paket Gratis (Mode Pameran)" : "Reset to Free Plan (Exhibition Mode)"}
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
        <main key={page} className={`${isLanding ? "landing-content" : "page-content"} page-enter`}>
          {(isAppLoading || isPageLoading || isAnalyzing) &&
            (["dashboard", "contracts", "analysis", "compare", "dates"] as Page[]).includes(page) && (
              <PageSkeleton variant={page} />
            )}
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
                    value: String(dates.length),
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
                ].map((stat, idx) => (
                  <button
                    className={`stat-card stagger-${idx + 1}`}
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
                    <span className="count-tag">{dates.length}</span>
                  </SectionTitle>
                  <p className="widget-subtitle">
                    {t.horizon_sub}
                  </p>
                  {dates.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "32px 16px", color: "var(--text-secondary)" }}>
                      <p style={{ margin: "0 0 14px 0", fontSize: "0.88rem" }}>
                        {lang === "id" ? "Belum ada tenggat waktu atau pengingat aktif." : "No active deadlines or reminders."}
                      </p>
                      <Button variant="secondary" icon="upload" onClick={openUpload} style={{ fontSize: "0.85rem", padding: "8px 14px" }}>
                        {lang === "id" ? "Unggah Dokumen" : "Upload Document"}
                      </Button>
                    </div>
                  ) : (
                    <div className="mini-dates">
                      {dates.slice(0, 3).map((item, i) => (
                        <button
                          key={item.id || item.title || i}
                          className="mini-date"
                          onClick={() => navigate("dates")}
                        >
                          <span className={`date-square ${item.kind || "mint"}`}>
                            <small>{lang === "id" && item.month === "DEC" ? "DES" : item.month}</small>
                            <b>{item.day}</b>
                          </span>
                          <span className="mini-date-text">
                            <b>{lang === "id" ? (item.titleId || item.title) : item.title}</b>
                            <small>{lang === "id" ? (item.contractId || item.contractName || item.contract) : (item.contractName || item.contract)}</small>
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
                  )}
                  {dates.length > 0 && (
                    <button
                      className="calendar-link"
                      onClick={() => navigate("dates")}
                    >
                      {t.horizon_all}
                      <Icon name="arrow" size={15} />
                    </button>
                  )}
                </section>
              </div>
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
                        ? "Cek Kontrak membantu menjelaskan dokumen. Konsultasikan dengan penasihat hukum profesional untuk kebutuhan kasus khusus Anda."
                        : "Cek Kontrak helps explain documents. Consult a qualified legal professional for advice specific to your situation."
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
                {contracts.length > 0 && <Badge status={t.library_badge_complete} />}
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
          {page === "builder" && (
            <>
              <div className="page-heading">
                <div>
                  <span className="greeting-eyebrow">
                    {t.builder_eyebrow}
                  </span>
                  <h1>
                    {t.builder_title}<span className="greeting-dot">.</span>
                  </h1>
                  <p>{t.builder_sub}</p>
                </div>
                {userPlan === "pro" && (
                  <Button variant="secondary" icon="spark" onClick={fillSampleHrdData}>
                    {t.builder_fill_sample_btn}
                  </Button>
                )}
              </div>

              {userPlan !== "pro" ? (
                <section className="hrd-paywall-card">
                  <span className="hrd-paywall-badge">
                    <Icon name="spark" size={14} />
                    {t.builder_paywall_badge}
                  </span>
                  <h2>{t.builder_paywall_title}</h2>
                  <p>{t.builder_paywall_desc}</p>

                  <div className="hrd-paywall-features">
                    <div className="hrd-paywall-feature-item">
                      <span className="stat-icon blue">
                        <Icon name="shield" size={20} />
                      </span>
                      <h4>{t.builder_paywall_b1_title}</h4>
                      <p>{t.builder_paywall_b1_desc}</p>
                    </div>
                    <div className="hrd-paywall-feature-item">
                      <span className="stat-icon mint">
                        <Icon name="check" size={20} />
                      </span>
                      <h4>{t.builder_paywall_b2_title}</h4>
                      <p>{t.builder_paywall_b2_desc}</p>
                    </div>
                    <div className="hrd-paywall-feature-item">
                      <span className="stat-icon lavender">
                        <Icon name="file" size={20} />
                      </span>
                      <h4>{t.builder_paywall_b3_title}</h4>
                      <p>{t.builder_paywall_b3_desc}</p>
                    </div>
                  </div>

                  <div className="hrd-paywall-actions">
                    <Button icon="spark" onClick={() => setPlanModal("HRD Pro")}>
                      {t.builder_paywall_upgrade_btn}
                      <Icon name="arrow" size={16} />
                    </Button>
                    <Button variant="secondary" onClick={() => setPlanModal("HRD Pro")}>
                      {t.builder_paywall_compare_btn}
                    </Button>
                  </div>
                </section>
              ) : (
                <div className="hrd-builder-grid">
                  {/* KOLOM KIRI: FORMULIR KONFIGURASI KONTRAK HRD */}
                  <section className="hrd-form-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
                      <div>
                        <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px", color: "var(--color-navy)" }}>
                          {t.builder_form_title}
                        </h2>
                        <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0 }}>
                          {t.builder_form_sub}
                        </p>
                      </div>
                    </div>

                    {/* 1. Jenis Perjanjian */}
                    <div className="hrd-form-section">
                      <h3>{t.builder_sec_type}</h3>
                      <div className="hrd-type-tabs" role="radiogroup" aria-label={t.builder_sec_type}>
                        <button
                          type="button"
                          className={`hrd-type-tab ${hrdType === "PKWTT" ? "active" : ""}`}
                          onClick={() => {
                            setHrdType("PKWTT")
                            if (hrdProbationMonths === "0") setHrdProbationMonths("3")
                          }}
                        >
                          {t.builder_type_pkwtt}
                        </button>
                        <button
                          type="button"
                          className={`hrd-type-tab ${hrdType === "PKWT" ? "active" : ""}`}
                          onClick={() => {
                            setHrdType("PKWT")
                            setHrdProbationMonths("0")
                          }}
                        >
                          {t.builder_type_pkwt}
                        </button>
                        <button
                          type="button"
                          className={`hrd-type-tab ${hrdType === "FREELANCE" ? "active" : ""}`}
                          onClick={() => {
                            setHrdType("FREELANCE")
                            setHrdProbationMonths("0")
                          }}
                        >
                          {t.builder_type_freelance}
                        </button>
                      </div>
                    </div>

                    {/* 2. Identitas Perusahaan & HRD */}
                    <div className="hrd-form-section">
                      <h3>{t.builder_sec_company}</h3>
                      <div className="hrd-field">
                        <label>{t.builder_company_name}</label>
                        <input
                          type="text"
                          value={hrdCompany}
                          onChange={(e) => setHrdCompany(e.target.value)}
                        />
                      </div>
                      <div className="hrd-field">
                        <label>{t.builder_company_address}</label>
                        <input
                          type="text"
                          value={hrdCompanyAddress}
                          onChange={(e) => setHrdCompanyAddress(e.target.value)}
                        />
                      </div>
                      <div className="hrd-input-grid">
                        <div className="hrd-field">
                          <label>{t.builder_hrd_name}</label>
                          <input
                            type="text"
                            value={hrdRepName}
                            onChange={(e) => setHrdRepName(e.target.value)}
                          />
                        </div>
                        <div className="hrd-field">
                          <label>{t.builder_hrd_role}</label>
                          <input
                            type="text"
                            value={hrdRepRole}
                            onChange={(e) => setHrdRepRole(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 3. Identitas Karyawan */}
                    <div className="hrd-form-section">
                      <h3>{t.builder_sec_employee}</h3>
                      <div className="hrd-input-grid">
                        <div className="hrd-field">
                          <label>{t.builder_emp_name}</label>
                          <input
                            type="text"
                            value={hrdEmpName}
                            onChange={(e) => setHrdEmpName(e.target.value)}
                          />
                        </div>
                        <div className="hrd-field">
                          <label>{t.builder_emp_nik}</label>
                          <input
                            type="text"
                            value={hrdEmpNik}
                            onChange={(e) => setHrdEmpNik(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="hrd-field">
                        <label>{t.builder_emp_address}</label>
                        <input
                          type="text"
                          value={hrdEmpAddress}
                          onChange={(e) => setHrdEmpAddress(e.target.value)}
                        />
                      </div>
                      <div className="hrd-input-grid">
                        <div className="hrd-field">
                          <label>{t.builder_emp_role}</label>
                          <input
                            type="text"
                            value={hrdEmpRole}
                            onChange={(e) => setHrdEmpRole(e.target.value)}
                          />
                        </div>
                        <div className="hrd-field">
                          <label>{t.builder_start_date}</label>
                          <input
                            type="text"
                            value={hrdStartDate}
                            onChange={(e) => setHrdStartDate(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 4. Durasi Kontrak & Masa Percobaan (SMART LEGAL GUARDRAIL) */}
                    <div className="hrd-form-section">
                      <h3>{t.builder_sec_duration}</h3>
                      <div className="hrd-input-grid">
                        {hrdType !== "PKWTT" && (
                          <div className="hrd-field">
                            <label>{t.builder_duration_months}</label>
                            <input
                              type="number"
                              min={1}
                              max={60}
                              value={hrdDurationMonths}
                              onChange={(e) => setHrdDurationMonths(e.target.value)}
                            />
                          </div>
                        )}
                        <div className="hrd-field" style={{ gridColumn: hrdType === "PKWTT" ? "1 / -1" : undefined }}>
                          <label>{t.builder_probation_months}</label>
                          {hrdType === "PKWTT" ? (
                            <select
                              value={hrdProbationMonths}
                              onChange={(e) => setHrdProbationMonths(e.target.value)}
                            >
                              <option value="0">0 {lang === "id" ? "Bulan (Tanpa Masa Percobaan)" : "Months (No Probation)"}</option>
                              <option value="1">1 {lang === "id" ? "Bulan" : "Month"}</option>
                              <option value="2">2 {lang === "id" ? "Bulan" : "Months"}</option>
                              <option value="3">3 {lang === "id" ? "Bulan (Batas Maksimal Pasal 60 UU 13/2003)" : "Months (Max Limit Art. 60 Law 13/2003)"}</option>
                            </select>
                          ) : (
                            <input
                              type="text"
                              disabled
                              value={t.builder_probation_locked_value}
                            />
                          )}
                        </div>
                      </div>

                      {hrdType === "PKWT" && (
                        <div className="hrd-guardrail-box warning" role="status">
                          <Icon name="shield" size={15} />
                          <span>{t.builder_guardrail_pkwt}</span>
                        </div>
                      )}
                      {hrdType === "PKWTT" && (
                        <div className="hrd-guardrail-box safe" role="status">
                          <Icon name="check" size={15} />
                          <span>{t.builder_guardrail_pkwtt}</span>
                        </div>
                      )}
                      {hrdType === "FREELANCE" && (
                        <div className="hrd-guardrail-box safe" role="status">
                          <Icon name="shield" size={15} />
                          <span>{t.builder_guardrail_freelance}</span>
                        </div>
                      )}
                    </div>

                    {/* 5. Kompensasi & Jam Kerja */}
                    <div className="hrd-form-section">
                      <h3>{t.builder_sec_comp}</h3>
                      <div className="hrd-compliance-pill">
                        <Icon name="check" size={14} />
                        <span>{t.builder_hours_compliance}</span>
                      </div>
                      <div className="hrd-input-grid">
                        <div className="hrd-field">
                          <label>{t.builder_salary} ({formatRupiahDisplay(hrdSalary)})</label>
                          <input
                            type="number"
                            min={1000000}
                            step={500000}
                            value={hrdSalary}
                            onChange={(e) => setHrdSalary(e.target.value)}
                          />
                        </div>
                        <div className="hrd-field">
                          <label>{t.builder_pay_day}</label>
                          <input
                            type="number"
                            min={1}
                            max={31}
                            value={hrdPayDay}
                            onChange={(e) => setHrdPayDay(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="hrd-input-grid">
                        <div className="hrd-field">
                          <label>{t.builder_work_days}</label>
                          <input
                            type="text"
                            value={hrdWorkDays}
                            onChange={(e) => setHrdWorkDays(e.target.value)}
                          />
                        </div>
                        <div className="hrd-field">
                          <label>{t.builder_work_hours}</label>
                          <input
                            type="text"
                            value={hrdWorkHours}
                            onChange={(e) => setHrdWorkHours(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="hrd-field">
                        <label>{t.builder_notice_period}</label>
                        <input
                          type="number"
                          min={14}
                          max={90}
                          value={hrdNoticeDays}
                          onChange={(e) => setHrdNoticeDays(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* 6. Deskripsi Tugas & Pengakhiran Kontrak */}
                    <div className="hrd-form-section">
                      <h3>{t.builder_sec_duties}</h3>
                      <div className="hrd-field">
                        <label>{t.builder_duties_label}</label>
                        <textarea
                          rows={3}
                          value={hrdDuties}
                          onChange={(e) => setHrdDuties(e.target.value)}
                        />
                      </div>
                      <div className="hrd-field">
                        <label>{t.builder_term_label}</label>
                        <textarea
                          rows={3}
                          value={hrdTermination}
                          onChange={(e) => setHrdTermination(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* 7. Tanda Tangan Digital, Stempel & E-Meterai (Siap Download) */}
                    <div className="hrd-form-section">
                      <h3>{t.builder_sec_signatures}</h3>
                      <p style={{ fontSize: 11.5, color: "#64748b", margin: "-6px 0 10px" }}>
                        {t.builder_sig_sub}
                      </p>

                      <input
                        ref={sigFileP1Ref}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          handleSigImageUpload("p1", e.target.files?.[0])
                          e.target.value = ""
                        }}
                      />
                      <input
                        ref={sigFileP2Ref}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          handleSigImageUpload("p2", e.target.files?.[0])
                          e.target.value = ""
                        }}
                      />

                      <div className="hrd-sig-config-grid">
                        {/* Pihak Pertama (HRD / Perusahaan) */}
                        <div className="hrd-sig-card">
                          <div className="hrd-sig-card-head">
                            <strong>1. {t.builder_sig_p1_title}</strong>
                            <span style={{ fontSize: 11, color: "#64748b" }}>{hrdRepName}</span>
                          </div>
                          <div className="hrd-sig-btn-row">
                            <button
                              type="button"
                              className="hrd-sig-mini-btn"
                              onClick={() => sigFileP1Ref.current?.click()}
                            >
                              <Icon name="upload" size={13} />
                              {t.builder_sig_upload_btn}
                            </button>
                            <button
                              type="button"
                              className="hrd-sig-mini-btn"
                              onClick={() => setActiveSigPad(activeSigPad === "p1" ? null : "p1")}
                            >
                              <Icon name="file" size={13} />
                              {t.builder_sig_draw_btn}
                            </button>
                            <button
                              type="button"
                              className="hrd-sig-mini-btn"
                              onClick={() => {
                                setHrdRepSig(buildCalligraphySigSvg(hrdRepName || "HRD", "#1d4ed8"))
                                setActiveSigPad(null)
                              }}
                            >
                              <Icon name="spark" size={13} />
                              {t.builder_sig_auto_btn}
                            </button>
                            {hrdRepSig && (
                              <button
                                type="button"
                                className="hrd-sig-mini-btn danger"
                                onClick={() => setHrdRepSig("")}
                              >
                                <Icon name="trash" size={13} />
                                {t.builder_sig_clear_btn}
                              </button>
                            )}
                          </div>

                          {activeSigPad === "p1" && (
                            <div className="hrd-sig-pad-box">
                              <small style={{ display: "block", fontSize: 11, color: "#475569", marginBottom: 6 }}>
                                {t.builder_sig_pad_hint}
                              </small>
                              <canvas
                                ref={sigPadCanvasRef}
                                width={340}
                                height={100}
                                className="hrd-sig-pad-canvas"
                                onMouseDown={startSigPadDraw}
                                onMouseMove={moveSigPadDraw}
                                onMouseUp={endSigPadDraw}
                                onMouseLeave={endSigPadDraw}
                                onTouchStart={startSigPadDraw}
                                onTouchMove={moveSigPadDraw}
                                onTouchEnd={endSigPadDraw}
                              />
                              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                                <button
                                  type="button"
                                  className="hrd-sig-mini-btn"
                                  onClick={() => applySigPadCanvas("p1")}
                                >
                                  <Icon name="check" size={13} />
                                  {t.builder_sig_pad_apply}
                                </button>
                                <button
                                  type="button"
                                  className="hrd-sig-mini-btn"
                                  onClick={clearSigPadCanvas}
                                >
                                  {t.builder_sig_pad_clear}
                                </button>
                              </div>
                            </div>
                          )}

                          {hrdRepSig && (
                            <div className="hrd-sig-preview-thumb">
                              <img src={hrdRepSig} alt="Preview TTD Pihak Pertama" />
                              <span style={{ fontSize: 10.5, color: "#16a34a", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
                                <Icon name="check" size={13} />
                                {lang === "id" ? "Aktif di Dokumen" : "Active on Document"}
                              </span>
                            </div>
                          )}

                          <label className="hrd-sig-checkbox">
                            <input
                              type="checkbox"
                              checked={showCompanyStamp}
                              onChange={(e) => setShowCompanyStamp(e.target.checked)}
                            />
                            <span>{t.builder_sig_stamp_check}</span>
                          </label>
                        </div>

                        {/* Pihak Kedua (Karyawan) & E-Meterai */}
                        <div className="hrd-sig-card">
                          <div className="hrd-sig-card-head">
                            <strong>2. {t.builder_sig_p2_title}</strong>
                            <span style={{ fontSize: 11, color: "#64748b" }}>{hrdEmpName}</span>
                          </div>
                          <div className="hrd-sig-btn-row">
                            <button
                              type="button"
                              className="hrd-sig-mini-btn"
                              onClick={() => sigFileP2Ref.current?.click()}
                            >
                              <Icon name="upload" size={13} />
                              {t.builder_sig_upload_btn}
                            </button>
                            <button
                              type="button"
                              className="hrd-sig-mini-btn"
                              onClick={() => setActiveSigPad(activeSigPad === "p2" ? null : "p2")}
                            >
                              <Icon name="file" size={13} />
                              {t.builder_sig_draw_btn}
                            </button>
                            <button
                              type="button"
                              className="hrd-sig-mini-btn"
                              onClick={() => {
                                setHrdEmpSig(buildCalligraphySigSvg(hrdEmpName || "Karyawan", "#0f172a"))
                                setActiveSigPad(null)
                              }}
                            >
                              <Icon name="spark" size={13} />
                              {t.builder_sig_auto_btn}
                            </button>
                            {hrdEmpSig && (
                              <button
                                type="button"
                                className="hrd-sig-mini-btn danger"
                                onClick={() => setHrdEmpSig("")}
                              >
                                <Icon name="trash" size={13} />
                                {t.builder_sig_clear_btn}
                              </button>
                            )}
                          </div>

                          {activeSigPad === "p2" && (
                            <div className="hrd-sig-pad-box">
                              <small style={{ display: "block", fontSize: 11, color: "#475569", marginBottom: 6 }}>
                                {t.builder_sig_pad_hint}
                              </small>
                              <canvas
                                ref={sigPadCanvasRef}
                                width={340}
                                height={100}
                                className="hrd-sig-pad-canvas"
                                onMouseDown={startSigPadDraw}
                                onMouseMove={moveSigPadDraw}
                                onMouseUp={endSigPadDraw}
                                onMouseLeave={endSigPadDraw}
                                onTouchStart={startSigPadDraw}
                                onTouchMove={moveSigPadDraw}
                                onTouchEnd={endSigPadDraw}
                              />
                              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                                <button
                                  type="button"
                                  className="hrd-sig-mini-btn"
                                  onClick={() => applySigPadCanvas("p2")}
                                >
                                  <Icon name="check" size={13} />
                                  {t.builder_sig_pad_apply}
                                </button>
                                <button
                                  type="button"
                                  className="hrd-sig-mini-btn"
                                  onClick={clearSigPadCanvas}
                                >
                                  {t.builder_sig_pad_clear}
                                </button>
                              </div>
                            </div>
                          )}

                          {hrdEmpSig && (
                            <div className="hrd-sig-preview-thumb">
                              <img src={hrdEmpSig} alt="Preview TTD Pihak Kedua" />
                              <span style={{ fontSize: 10.5, color: "#16a34a", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 4 }}>
                                <Icon name="check" size={13} />
                                {lang === "id" ? "Aktif di Dokumen" : "Active on Document"}
                              </span>
                            </div>
                          )}

                          <label className="hrd-sig-checkbox">
                            <input
                              type="checkbox"
                              checked={showEmeterai}
                              onChange={(e) => setShowEmeterai(e.target.checked)}
                            />
                            <span>{t.builder_sig_emeterai_check}</span>
                          </label>
                        </div>
                      </div>

                      <div style={{ marginTop: 14 }}>
                        <Button
                          variant="secondary"
                          icon="spark"
                          className="full-width"
                          onClick={fillSampleHrdData}
                        >
                          {t.builder_fill_sample_btn}
                        </Button>
                      </div>
                    </div>
                  </section>

                  {/* KOLOM KANAN: STICKY LIVE PREVIEW DOKUMEN HUKUM RESMI (SCROLLABLE MANDIRI) */}
                  <div className="legal-document-wrapper">
                    <div className="legal-document-toolbar">
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Badge status={t.builder_preview_compliant} />
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>
                          {t.builder_preview_badge}
                        </span>
                      </div>
                      <div className="legal-document-actions">
                        <Button
                          icon="spark"
                          disabled={hrdSaving}
                          onClick={saveAndAnalyzeHrdContract}
                        >
                          {hrdSaving ? t.builder_btn_saving : t.builder_btn_save_analyze}
                        </Button>
                        <Button
                          variant="secondary"
                          icon="download"
                          onClick={() => window.print()}
                        >
                          {t.builder_btn_print}
                        </Button>
                        <Button
                          variant="secondary"
                          icon="file"
                          onClick={() => {
                            navigator.clipboard?.writeText(buildLiveHrdContractText())
                            setToast(t.builder_copied_toast)
                          }}
                        >
                          {t.builder_btn_copy}
                        </Button>
                      </div>
                    </div>

                    <div className="legal-document-desk preview-scroll-area">
                      <article className="legal-document-paper contract-paper" aria-label="Live Preview Surat Kontrak Kerja">
                        <table className="print-doc-table">
                          <thead className="print-only-spacer">
                            <tr>
                              <td>
                                <div className="print-top-margin" />
                              </td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="print-doc-body-cell">
                        {/* 1. KOP SURAT PERUSAHAAN RESMI (OFFICIAL CORPORATE LETTERHEAD) */}
                        <header className="legal-doc-letterhead">
                          <div className="letterhead-logo-badge" aria-hidden="true">
                            <span>{getCompanyInitials(hrdCompany)}</span>
                            <small>CORP</small>
                          </div>
                          <div className="letterhead-text-center">
                            <h2 className="letterhead-company-name">{hrdCompany}</h2>
                            <p className="letterhead-company-address">{hrdCompanyAddress}</p>
                            <p className="letterhead-company-contact">
                              Divisi Human Capital &amp; Legal · Dokumen Kepegawaian Resmi Republik Indonesia
                            </p>
                          </div>
                        </header>

                        {/* 2. JUDUL & NOMOR SURAT FORMAL */}
                        <div className="legal-doc-title-block">
                          <h3 className="legal-doc-main-title">
                            {hrdType === "PKWTT"
                              ? "SURAT PERJANJIAN KERJA WAKTU TIDAK TERTENTU (PKWTT)"
                              : hrdType === "FREELANCE"
                              ? "SURAT PERJANJIAN KEMITRAAN PEKERJA LEPAS (FREELANCE)"
                              : "SURAT PERJANJIAN KERJA WAKTU TERTENTU (PKWT)"}
                          </h3>
                          <p className="legal-doc-number-line">Nomor: {hrdContractNumber}</p>
                        </div>

                        {/* 3. KOMPARISI / IDENTITAS PARA PIHAK (FORMAT TABEL HUKUM TANPA KOTAK WEB) */}
                        <div className="legal-doc-parties">
                          <p>Pada hari ini, yang bertanda tangan di bawah ini:</p>

                          <div className="legal-doc-party-section">
                            <div className="legal-doc-party-heading">I. PIHAK PERTAMA (PEMBERI KERJA)</div>
                            <table className="legal-doc-party-table">
                              <tbody>
                                <tr>
                                  <td className="party-label">Nama</td>
                                  <td className="party-colon">:</td>
                                  <td><b>{hrdRepName}</b></td>
                                </tr>
                                <tr>
                                  <td className="party-label">Jabatan</td>
                                  <td className="party-colon">:</td>
                                  <td>{hrdRepRole} — {hrdCompany}</td>
                                </tr>
                                <tr>
                                  <td className="party-label">Alamat</td>
                                  <td className="party-colon">:</td>
                                  <td>{hrdCompanyAddress}</td>
                                </tr>
                              </tbody>
                            </table>
                            <p className="legal-doc-party-desc">
                              Dalam hal ini bertindak untuk dan atas nama <b>{hrdCompany}</b>, selanjutnya dalam Perjanjian ini disebut sebagai <b>PIHAK PERTAMA</b>.
                            </p>
                          </div>

                          <div className="legal-doc-party-section">
                            <div className="legal-doc-party-heading">II. PIHAK KEDUA (PEKERJA / KARYAWAN)</div>
                            <table className="legal-doc-party-table">
                              <tbody>
                                <tr>
                                  <td className="party-label">Nama</td>
                                  <td className="party-colon">:</td>
                                  <td><b>{hrdEmpName}</b></td>
                                </tr>
                                <tr>
                                  <td className="party-label">Nomor KTP / NIK</td>
                                  <td className="party-colon">:</td>
                                  <td>{hrdEmpNik}</td>
                                </tr>
                                <tr>
                                  <td className="party-label">Jabatan / Posisi</td>
                                  <td className="party-colon">:</td>
                                  <td>{hrdEmpRole}</td>
                                </tr>
                                <tr>
                                  <td className="party-label">Alamat</td>
                                  <td className="party-colon">:</td>
                                  <td>{hrdEmpAddress}</td>
                                </tr>
                              </tbody>
                            </table>
                            <p className="legal-doc-party-desc">
                              Dalam hal ini bertindak untuk dan atas nama diri sendiri, selanjutnya dalam Perjanjian ini disebut sebagai <b>PIHAK KEDUA</b>.
                            </p>
                          </div>

                          <p>
                            Kedua belah pihak sepakat untuk mengikatkan diri dalam Perjanjian Kerja ini dengan ketentuan dan pasal-pasal hukum sebagai berikut:
                          </p>
                        </div>

                        {/* 4. PASAL-PASAL KONTRAK */}
                        <div className="legal-doc-article contract-clause-item">
                          <h4>Pasal 1<br />Jabatan dan Status Hubungan Kerja</h4>
                          <p>
                            Pihak Pertama dengan ini menerima dan mengangkat Pihak Kedua untuk bekerja di <b>{hrdCompany}</b> sebagai bagian <b>{hrdEmpRole}</b> dengan status sebagai{" "}
                            {hrdType === "PKWTT"
                              ? `Karyawan Tetap berdasarkan Perjanjian Kerja Waktu Tidak Tertentu (PKWTT) terhitung sejak tanggal ${hrdStartDate}.`
                              : hrdType === "FREELANCE"
                              ? `Mitra Pekerja Lepas (Freelance) untuk jangka waktu ${hrdDurationMonths || "6"} bulan terhitung sejak tanggal ${hrdStartDate}.`
                              : `Karyawan Kontrak berdasarkan Perjanjian Kerja Waktu Tertentu (PKWT) untuk jangka waktu ${hrdDurationMonths || "12"} bulan terhitung sejak tanggal ${hrdStartDate}.`}
                          </p>
                        </div>

                        <div className="legal-doc-article contract-clause-item">
                          <h4>Pasal 2<br />Waktu Kerja dan Ketentuan Kehadiran</h4>
                          <p>
                            Pihak Kedua memiliki kewajiban waktu kerja pada hari <b>{hrdWorkDays}</b> mulai pukul <b>{hrdWorkHours}</b>, yang telah mematuhi batas waktu kerja maksimal 40 (empat puluh) jam dalam 1 (satu) minggu sesuai dengan <b>Pasal 77 ayat (2) Undang-Undang Nomor 13 Tahun 2003</b> tentang Ketenagakerjaan. Kelebihan jam kerja di luar jam kerja standar dihitung sebagai waktu kerja lembur sesuai regulasi yang berlaku.
                          </p>
                        </div>

                        <div className="legal-doc-article contract-clause-item">
                          <h4>Pasal 3<br />Ruang Lingkup Tugas dan Tanggung Jawab</h4>
                          <p>
                            Pihak Kedua bertanggung jawab menjalankan tugas pokok sebagai <b>{hrdEmpRole}</b>, meliputi: {hrdDuties} Segala perubahan mendasar pada ruang lingkup pekerjaan wajib disetujui secara tertulis oleh kedua belah pihak.
                          </p>
                        </div>

                        <div className="legal-doc-article contract-clause-item">
                          <h4>Pasal 4<br />Jangka Waktu, Kepatuhan Regulasi, dan Pengakhiran Kontrak</h4>
                          {hrdType === "PKWT" ? (
                            <>
                              <p>
                                1. Perjanjian Kerja Waktu Tertentu (PKWT) ini berlaku selama <b>{hrdDurationMonths || "12"} bulan</b> terhitung sejak tanggal <b>{hrdStartDate}</b> dan dibuat <b>tanpa masa percobaan (tidak memberlakukan masa percobaan)</b> sesuai ketentuan <b>Pasal 58 ayat (1) dan (2) Undang-Undang Nomor 13 Tahun 2003</b> tentang Ketenagakerjaan.
                              </p>
                              <p>2. {hrdTermination}</p>
                              <p>
                                3. Pada saat berakhirnya jangka waktu PKWT, Pihak Pertama wajib memberikan <b>uang kompensasi PKWT</b> kepada Pihak Kedua secara proporsional sesuai masa kerja berdasarkan <b>Pasal 15 dan Pasal 16 Peraturan Pemerintah Nomor 35 Tahun 2021</b>.
                              </p>
                            </>
                          ) : hrdType === "PKWTT" ? (
                            <>
                              <p>
                                1. Perjanjian Kerja Waktu Tidak Tertentu (PKWTT) ini berlaku efektif sejak tanggal <b>{hrdStartDate}</b> dengan ketentuan masa percobaan kerja selama <b>{hrdProbationMonths} bulan</b> (maksimal 3 bulan sesuai <b>Pasal 60 ayat (1) Undang-Undang Nomor 13 Tahun 2003</b>).
                              </p>
                              <p>
                                2. Selama masa percobaan berlangsung, Pihak Pertama wajib membayar upah penuh di atas batas upah minimum yang berlaku dan tidak membebankan sanksi finansial apabila salah satu pihak mengakhiri hubungan kerja.
                              </p>
                              <p>3. {hrdTermination}</p>
                            </>
                          ) : (
                            <>
                              <p>
                                1. Perjanjian Kemitraan ini berlaku selama <b>{hrdDurationMonths || "6"} bulan</b> terhitung sejak tanggal <b>{hrdStartDate}</b> tanpa masa percobaan hubungan kerja berdasarkan asas kebebasan berkontrak <b>Pasal 1338 KUHPerdata</b>.
                              </p>
                              <p>2. {hrdTermination}</p>
                            </>
                          )}
                        </div>

                        <div className="legal-doc-article contract-clause-item">
                          <h4>Pasal 5<br />Upah Pokok, Tunjangan, dan Jadwal Pembayaran</h4>
                          <p>
                            Selama bekerja di <b>{hrdCompany}</b>, Pihak Kedua berhak menerima gaji pokok sebesar <b>{formatRupiahDisplay(hrdSalary)}</b> setiap bulan yang dibayarkan melalui rekening bank Pihak Kedua selambat-lambatnya pada tanggal <b>{hrdPayDay || "25"}</b> setiap bulannya sesuai <b>Pasal 88 Undang-Undang Nomor 13 Tahun 2003 jo. Peraturan Pemerintah Nomor 36 Tahun 2021</b> tentang Pengupahan, beserta kepesertaan BPJS Kesehatan dan BPJS Ketenagakerjaan.
                          </p>
                        </div>

                        <div className="legal-doc-article contract-clause-item">
                          <h4>Pasal 6<br />Kerahasiaan Informasi dan Penyelesaian Perselisihan</h4>
                          <p>
                            Pihak Kedua wajib menjaga kerahasiaan data internal perusahaan selama dan setelah hubungan kerja berakhir. Apabila terjadi perselisihan hubungan industrial, kedua belah pihak sepakat menyelesaikannya secara musyawarah untuk mufakat sesuai <b>Undang-Undang Nomor 2 Tahun 2004</b> tentang Penyelesaian Perselisihan Hubungan Industrial.
                          </p>
                        </div>

                        {/* 5. BLOK PENUTUP & TANDA TANGAN ANTI-TERPOTONG (break-inside: avoid) */}
                        <div className="signature-block legal-doc-closing-block contract-closing-and-signatures">
                          <p className="legal-doc-closing-text">
                            Demikian surat perjanjian kerja ini dibuat secara sadar, tanpa paksaan dari pihak manapun, dalam rangkap 2 (dua) bermeterai cukup yang masing-masing memiliki kekuatan hukum yang sama.
                          </p>

                          <div className="legal-doc-date-line">
                            Jakarta, <b>{hrdStartDate}</b>
                          </div>

                          <div className="signature-grid legal-doc-signatures contract-signatures">
                            <div className="signature-col legal-doc-sig-col">
                              <p><b>PIHAK PERTAMA</b></p>
                              <p className="signature-party-sub">{hrdCompany}</p>
                              <div className="signature-stage sig-visual-area">
                                {showCompanyStamp && (
                                  <div className="corporate-stamp-seal" aria-label="Stempel Resmi Perusahaan">
                                    <strong>{hrdCompany}</strong>
                                    <span>OFFICIAL HRD SEAL</span>
                                  </div>
                                )}
                                {hrdRepSig ? (
                                  <img
                                    src={hrdRepSig}
                                    alt={`Tanda Tangan ${hrdRepName}`}
                                    className="sig-rendered-img"
                                  />
                                ) : (
                                  <span className="sig-placeholder-line">( Tanda Tangan &amp; Stempel )</span>
                                )}
                              </div>
                              <p className="legal-doc-sig-name">{hrdRepName}</p>
                              <p><small>{hrdRepRole}</small></p>
                            </div>

                            <div className="signature-col legal-doc-sig-col">
                              <p><b>PIHAK KEDUA</b></p>
                              <p className="signature-party-sub">Pekerja / Karyawan</p>
                              <div className="signature-stage sig-visual-area">
                                {showEmeterai && (
                                  <img
                                    src="/meterai-10000.png"
                                    alt="Meterai Rp10.000"
                                    className="emeterai-seal-img"
                                  />
                                )}
                                {hrdEmpSig ? (
                                  <img
                                    src={hrdEmpSig}
                                    alt={`Tanda Tangan ${hrdEmpName}`}
                                    className={`sig-rendered-img ${showEmeterai ? "with-emeterai" : ""}`}
                                  />
                                ) : (
                                  <span className={`sig-placeholder-line ${showEmeterai ? "with-emeterai" : ""}`}>
                                    ( Tanda Tangan )
                                  </span>
                                )}
                              </div>
                              <p className="legal-doc-sig-name">{hrdEmpName}</p>
                              <p><small>{hrdEmpRole}</small></p>
                            </div>
                          </div>
                        </div>
                              </td>
                            </tr>
                          </tbody>
                          <tfoot className="print-only-spacer">
                            <tr>
                              <td>
                                <div className="print-bottom-margin" />
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </article>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {page === "analysis" && (
            !selected ? (
              <div className="surface" style={{ padding: "64px 24px", textAlign: "center", borderRadius: "var(--radius-lg)", margin: "20px 0" }}>
                <div style={{ display: "inline-flex", padding: 16, borderRadius: "50%", background: "var(--card-subtle)", color: "var(--brand-primary)", marginBottom: 14 }}>
                  <Icon name="file" size={36} />
                </div>
                <h2>{lang === "id" ? "Belum Ada Dokumen untuk Ditelaah" : "No Document Selected for Analysis"}</h2>
                <p style={{ maxWidth: 460, margin: "8px auto 24px", color: "var(--text-secondary)" }}>
                  {lang === "id"
                    ? "Pilih dokumen dari daftar kontrak atau unggah dokumen baru untuk melihat ringkasan AI, deteksi risiko, dan analisis klausul."
                    : "Select a document from your contracts list or upload a new one to view AI summary, risk detection, and clause breakdown."}
                </p>
                <Button icon="upload" onClick={openUpload}>
                  {lang === "id" ? "Unggah Dokumen Sekarang" : "Upload Document Now"}
                </Button>
              </div>
            ) : (
            <>
              <button
                className="back-link"
                onClick={() => navigate("contracts")}
              >
                <Icon name="arrow" size={15} />
                {t.analysis_back}
              </button>
              <div className="page-heading analysis-heading">
                <div className="analysis-header-meta">
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
                <div className="analysis-header-actions">
                  <Button
                    onClick={() => {
                      setMessages([])
                      navigate("chat")
                    }}
                    icon="chat"
                  >
                    {t.analysis_ask_btn}
                  </Button>
                  <Button
                    variant="secondary"
                    icon="trash"
                    style={{ color: "#dc2626", borderColor: "#fecaca" }}
                    onClick={() => setContractToDelete(selected)}
                  >
                    {t.delete_action_btn}
                  </Button>
                </div>
              </div>
              <div className="sample-note">
                <Icon name="spark" size={16} />
                <span>
                  {t.analysis_sample_note}
                </span>
              </div>
              {/* RED FLAG CALLOUT ALERT: Disproportionate Penalty / High Risk Trap */}
              {(Boolean(selected.meta?.disproportionatePenalty) || Boolean(selected.meta?.penalty && selected.meta?.salaryNum && (selected.meta.penaltyNum ?? 0) >= selected.meta.salaryNum)) && (
                <div className="red-flag-alert-box">
                  <div className="red-flag-header">
                    <span className="red-flag-icon-box">
                      <Icon name="warning" size={20} />
                    </span>
                    <h3>{t.red_flag_title.replace(/^⚠️\s*/, "")}</h3>
                  </div>
                  <div className="red-flag-body">
                    <p>
                      {lang === "id"
                        ? `Perjanjian ini membebankan Denda Resign (${selected.meta?.penalty || "Rp10.000.000"}) yang lebih besar dari Gaji Bulanan (${selected.meta?.salary || "Rp8.000.000"}) selama masa uji coba. Klausul ini berpotensi mengeksploitasi pekerja dan bertentangan dengan prinsip keadilan serta PP No. 35/2021 jo. Putusan MK No. 168/PUU-XXI/2023.`
                        : `This agreement imposes a Resignation Penalty (${selected.meta?.penalty || "Rp10,000,000"}) higher than your Monthly Salary (${selected.meta?.salary || "Rp8,000,000"}) during probation. This clause is considered disproportionate and exploitative under Indonesian labor regulations.`}
                    </p>
                    {selected.meta?.probationPeriod && (
                      <span className="red-flag-sub">
                        {t.red_flag_probation_note}
                      </span>
                    )}
                  </div>
                </div>
              )}

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
                    {selected.summary
                      ? selected.summary
                      : lang === "id"
                        ? selected.id === 1
                          ? "Ini adalah perjanjian kerja 12 bulan untuk peran Product Designer di PT Example Indonesia. Dokumen ini menetapkan gaji kotor bulanan Rp12.000.000, 40 jam kerja per minggu, dan masa pemberitahuan resign 30 hari. Sebagian besar ketentuan merupakan standar industri, namun klausul denda pengunduran diri dini dan perpanjangan otomatis layak dicermati lebih mendalam."
                          : selected.id === 2
                            ? "Perjanjian freelance ini bersama Studio XYZ mencakup proyek desain seharga Rp8.000.000 per bulan. Pembayaran jatuh tempo setiap tanggal 25. Periksa klausul perpanjangan otomatis dan berikan pemberitahuan tertulis sebelum 30 November 2027 jika tidak ingin memperpanjang."
                            : selected.id === 3
                              ? "Perjanjian vendor dengan Kopi Kita ini mencakup pasokan selama 12 bulan, termin pembayaran bulanan, dan tanggung jawab pengiriman barang yang jelas. Tidak ditemukan klausul berisiko tinggi."
                              : "Perjanjian sewa apartemen di Bumi Residence mencakup masa sewa 12 bulan dengan uang jaminan (deposit) satu bulan sewa. Masa pemberitahuan pengakhiran sewa adalah 30 hari."
                        : selected.id === 1
                          ? "This is a 12-month employment agreement for a Product Designer role at PT Example Indonesia. It outlines a monthly salary of Rp12,000,000, a 40-hour work week, and a 30-day notice period. Most terms are standard, but early termination penalties and automatic renewal deserve a closer look."
                          : selected.id === 2
                            ? "This freelance agreement with Studio XYZ covers a design project at Rp8,000,000 per month. Payment is due on the 25th. Review the automatic renewal clause and give written notice before 30 November 2027 if you do not wish to continue."
                            : selected.id === 3
                              ? "This vendor agreement with Kopi Kita outlines a 12-month supply arrangement, monthly payments, and clearly defined delivery responsibilities. The sample terms are balanced, with no high-attention clauses identified."
                              : "This apartment lease at Bumi Residence covers a 12-month rental term. Rent is paid monthly, a one-month security deposit is required, and both parties must give 30 days’ notice before termination."}
                  </p>
                  <span className="source-caption">
                    <Icon name="file" size={13} />
                    {t.summary_based_on} · {activeClauses.length} {t.risk_clauses_count}
                  </span>
                </div>
              </section>
              <div className="insight-grid">
                {(() => {
                  const isPartnership =
                    selected.meta?.detectedCategory === "kerjasama" ||
                    /kerjasama|partnership|service|jasa/i.test(`${selected.type || ""} ${selected.typeId || ""}`)
                  const isRental =
                    selected.meta?.detectedCategory === "sewa" ||
                    /rental|sewa|lease/i.test(`${selected.type || ""} ${selected.typeId || ""}`)
                  const isNonEmployment = isPartnership || isRental

                  return [
                    {
                      icon: "file" as IconName,
                      label: isNonEmployment
                        ? lang === "id"
                          ? "Nilai Kontrak & Pembayaran"
                          : "Contract Value & Payment"
                        : t.insight_salary_title,
                      value:
                        selected.meta?.salary ||
                        (isNonEmployment
                          ? lang === "id"
                            ? "Sesuai rincian nilai kontrak"
                            : "As stated in contract"
                          : lang === "id"
                            ? "Rp8.000.000 / bln"
                            : "Rp8,000,000 / mo"),
                      sub:
                        selected.meta?.paymentSchedule ||
                        (lang === "id" ? "Transfer rekening bank" : "Bank transfer"),
                    },
                    {
                      icon: "clock" as IconName,
                      label:
                        isNonEmployment || Boolean(selected.meta?.contractDuration)
                          ? lang === "id"
                            ? "Jangka Waktu & Layanan"
                            : "Contract Term & Scope"
                          : t.insight_hours_title,
                      value:
                        selected.meta?.contractDuration ||
                        selected.meta?.workingHours ||
                        (isNonEmployment
                          ? lang === "id"
                            ? "Sesuai jangka waktu perjanjian"
                            : "Per contract duration"
                          : lang === "id"
                            ? "Senin - Jumat (40 jam/minggu)"
                            : "Mon - Fri (40 hrs/wk)"),
                      sub:
                        isNonEmployment || Boolean(selected.meta?.contractDuration)
                          ? selected.meta?.role ||
                            (lang === "id"
                              ? "Sesuai Pasal 1338 KUHPerdata"
                              : "Complies with Art. 1338 Civil Code")
                          : lang === "id"
                            ? "Sesuai Pasal 77 UU 13/2003"
                            : "Complies with Art. 77 Law 13/2003",
                    },
                    {
                      icon: "shield" as IconName,
                      label: isNonEmployment
                        ? lang === "id"
                          ? "Perubahan & Pengakhiran"
                          : "Amendments & Termination"
                        : t.insight_probation_title,
                      value:
                        selected.meta?.probationPeriod ||
                        selected.meta?.noticePeriod ||
                        (lang === "id" ? "Diatur tertulis" : "Written terms"),
                      sub: selected.meta?.noticePeriod
                        ? `${lang === "id" ? "Ketentuan" : "Terms"}: ${selected.meta.noticePeriod}`
                        : isNonEmployment
                          ? lang === "id"
                            ? "Ketentuan masa berlaku"
                            : "Term provisions"
                          : lang === "id"
                            ? "Masa percobaan kerja"
                            : "Probation period",
                    },
                    {
                      icon: "calendar" as IconName,
                      label: isNonEmployment
                        ? lang === "id"
                          ? "Para Pihak & Objek"
                          : "Parties & Object"
                        : t.insight_role_title,
                      value: isNonEmployment
                        ? selected.meta?.company || selected.company || selected.meta?.role || "-"
                        : selected.meta?.role || (lang === "id" ? "Karyawan" : "Employee"),
                      sub: isNonEmployment
                        ? `${getContractType(selected.typeId || selected.type, lang)}${selected.meta?.role ? ` · ${selected.meta.role}` : ""}`
                        : selected.meta?.company || selected.company || (lang === "id" ? "Perusahaan" : "Company"),
                    },
                  ]
                })().map((item, idx) => (
                  <div className={`surface insight-card stagger-${idx + 1}`} key={item.label}>
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
                  <span className="muted-label">{activeClauses.length} {t.risk_clauses_count}</span>
                </SectionTitle>
                {(() => {
                  const safeCount = selected.riskBreakdown?.safe ?? (activeClauses.filter((c) => /safe|aman/i.test(c.status || c.statusId || "")).length || 0)
                  const reviewCount = selected.riskBreakdown?.review ?? (activeClauses.filter((c) => /review|tinjau/i.test(c.status || c.statusId || "")).length || 0)
                  const attentionCount = selected.riskBreakdown?.attention ?? (activeClauses.filter((c) => /attention|perhatian/i.test(c.status || c.statusId || "")).length || 0)
                  const totalClauses = Math.max(1, safeCount + reviewCount + attentionCount)
                  return (
                    <>
                      <div className="risk-bar" style={{ display: "flex", gap: "3px", borderRadius: "8px", overflow: "hidden", background: "#f1f5f9" }}>
                        {safeCount > 0 && (
                          <span className="risk-safe" style={{ width: `${(safeCount / totalClauses) * 100}%` }} />
                        )}
                        {reviewCount > 0 && (
                          <span className="risk-review" style={{ width: `${(reviewCount / totalClauses) * 100}%` }} />
                        )}
                        {attentionCount > 0 && (
                          <span className="risk-attention" style={{ width: `${(attentionCount / totalClauses) * 100}%` }} />
                        )}
                      </div>
                      <div className="risk-legend">
                        <span>
                          <i className="mint-bg" />
                          <b>{safeCount}</b> {t.risk_safe_label}
                        </span>
                        <span>
                          <i className="amber-bg" />
                          <b>{reviewCount}</b> {t.risk_review_label}
                        </span>
                        <span>
                          <i className="coral-bg" />
                          <b>{attentionCount}</b> {t.risk_attention_label}
                        </span>
                      </div>
                    </>
                  )
                })()}
              </section>
              <section className="surface clauses-section">
                <SectionTitle
                  title={t.clauses_heading}
                  subtitle={t.clauses_sub}
                />
                {activeClauses.map((item, i) => (
                  <button
                    className={`clause-row ${i < 4 ? `stagger-${i + 1}` : ""}`}
                    key={`${item.id ?? i}-${item.title}`}
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
              <div className="legal-disclaimer-banner">
                <Icon name="shield" size={22} />
                <div>
                  <strong>{t.legal_disclaimer_title}</strong>
                  <p>{t.legal_disclaimer_body}</p>
                </div>
              </div>
            </>
            )
          )}
          {page === "chat" && (
            !selected ? (
              <div className="surface" style={{ padding: "64px 24px", textAlign: "center", borderRadius: "var(--radius-lg)", margin: "20px 0" }}>
                <div style={{ display: "inline-flex", padding: 16, borderRadius: "50%", background: "var(--card-subtle)", color: "var(--brand-primary)", marginBottom: 14 }}>
                  <Icon name="chat" size={36} />
                </div>
                <h2>{lang === "id" ? "Pilih Dokumen untuk Tanya Jawab AI" : "Select a Document for AI Q&A"}</h2>
                <p style={{ maxWidth: 460, margin: "8px auto 24px", color: "var(--text-secondary)" }}>
                  {lang === "id"
                    ? "Unggah kontrak baru atau pilih dari daftar dokumen Anda untuk mulai bertanya hal-hal spesifik kepada asisten AI hukum."
                    : "Upload a new contract or select from your document list to start asking specific questions with the AI legal assistant."}
                </p>
                <Button icon="upload" onClick={openUpload}>
                  {lang === "id" ? "Unggah Dokumen Sekarang" : "Upload Document Now"}
                </Button>
              </div>
            ) : (
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
                    <span>{lang === "id" ? `Dokumen Perjanjian · ${activeClauses.length} ${t.risk_clauses_count}` : `Contract document · ${activeClauses.length} ${t.risk_clauses_count}`}</span>
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
                              ? "AI Cek Kontrak"
                              : name.split(" ")[0]}
                            {m.role === "assistant" && (
                              <small>{lang === "id" ? "AI · SIMULASI" : "AI · SAMPLE"}</small>
                            )}
                          </span>
                          <p>{m.text}</p>
                          {m.source !== null && m.source !== undefined && m.source >= 0 && (
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
                <div className="quick-chips-container" role="group" aria-label="Quick questions">
                  {[
                    { text: lang === "id" ? "Berapa gaji & kapan dibayar?" : "What is the salary & payment schedule?", label: t.chip_salary, icon: "chat" as IconName },
                    { text: lang === "id" ? "Apakah ada denda jika resign?" : "Is there a resignation penalty?", label: t.chip_penalty, icon: "warning" as IconName },
                    { text: lang === "id" ? "Apakah ada masa uji coba?" : "Is there a probation period?", label: t.chip_probation, icon: "shield" as IconName },
                    { text: lang === "id" ? "Bagaimana aturan jam kerjanya?" : "What are the working hours?", label: t.chip_hours, icon: "clock" as IconName },
                  ].map((chip) => (
                    <button
                      key={chip.text}
                      type="button"
                      className="quick-chip-btn"
                      onClick={() => ask(chip.text)}
                      style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                    >
                      <Icon name={chip.icon} size={13} />
                      <span>{chip.label}</span>
                    </button>
                  ))}
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
            )
          )}
          {page === "compare" && (
            (() => {
              const contractA = contracts.find((c) => String(c.id) === String(compareIdA)) || contracts[0]
              const contractB = contracts.find((c) => String(c.id) === String(compareIdB)) || contracts[1] || contracts[0]
              return (
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
                  disabled={!contractA && !contractB && compareFiles.some((f) => !f)}
                  onClick={() => {
                    setCompared(true)
                    if (!compareData) {
                      fetch("/api/contracts/compare")
                        .then((res) => res.json())
                        .then((json) => {
                          if (json.success && json.data) setCompareData(json.data)
                        })
                        .catch(() => {})
                    }
                    setToast(
                      lang === "id"
                        ? "Perbandingan klausul siap ditinjau dengan analisis AI."
                        : "Clause comparison ready with AI analysis."
                    )
                  }}
                >
                  {t.compare_btn}
                </Button>
              </div>

              {/* Dynamic Contract Selector Row */}
              {contracts.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginBottom: "20px" }}>
                  <div className="surface" style={{ padding: "14px 18px", borderRadius: "10px" }}>
                    <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                      <span className="comparison-dot blue-bg" />
                      {t.compare_select_doc_a}
                    </label>
                    <select
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "7px", border: "1px solid var(--border)", fontSize: "12px", fontWeight: 600, color: "var(--color-navy)", background: "white", outline: "none", cursor: "pointer" }}
                      value={compareIdA || contracts[0]?.id}
                      onChange={(e) => {
                        const val = e.target.value
                        setCompareIdA(val)
                        setCompared(true)
                        const c = contracts.find((item) => String(item.id) === String(val))
                        if (c) {
                          const next = [...compareFiles]
                          next[0] = c.name
                          setCompareFiles(next)
                        }
                      }}
                    >
                      {contracts.map((c) => (
                        <option key={`opt-a-${c.id}`} value={c.id}>
                          {getContractName(c, lang)} ({c.company})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="surface" style={{ padding: "14px 18px", borderRadius: "10px" }}>
                    <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                      <span className="comparison-dot mint-bg" />
                      {t.compare_select_doc_b}
                    </label>
                    <select
                      style={{ width: "100%", padding: "9px 12px", borderRadius: "7px", border: "1px solid var(--border)", fontSize: "12px", fontWeight: 600, color: "var(--color-navy)", background: "white", outline: "none", cursor: "pointer" }}
                      value={compareIdB || (contracts[1]?.id || contracts[0]?.id)}
                      onChange={(e) => {
                        const val = e.target.value
                        setCompareIdB(val)
                        setCompared(true)
                        const c = contracts.find((item) => String(item.id) === String(val))
                        if (c) {
                          const next = [...compareFiles]
                          next[1] = c.name
                          setCompareFiles(next)
                        }
                      }}
                    >
                      {contracts.map((c) => (
                        <option key={`opt-b-${c.id}`} value={c.id}>
                          {getContractName(c, lang)} ({c.company})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

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
                      {i === 0
                        ? (contractA ? getContractName(contractA, lang) : compareFiles[0] || t.compare_choose_doc)
                        : (contractB ? getContractName(contractB, lang) : compareFiles[1] || t.compare_choose_doc)}
                    </b>
                    <span className="text-link">
                      {t.compare_or_upload_new}
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
                              {contractA ? getContractName(contractA, lang) : t.compare_doc_a}
                            </th>
                            <th>
                              <span className="comparison-dot mint-bg" />
                              {contractB ? getContractName(contractB, lang) : t.compare_doc_b}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const metaA = contractA?.meta as Record<string, string> | undefined
                            const metaB = contractB?.meta as Record<string, string> | undefined
                            return [
                              [
                                lang === "id" ? "Para Pihak / Instansi" : "Parties / Organization",
                                metaA?.company || contractA?.company || "-",
                                metaB?.company || contractB?.company || "-",
                              ],
                              [
                                lang === "id" ? "Durasi Kontrak" : "Duration",
                                metaA?.contractDuration || metaA?.duration || metaA?.expiryDate || (lang === "id" ? "12 bulan" : "12 months"),
                                metaB?.contractDuration || metaB?.duration || metaB?.expiryDate || (lang === "id" ? "12 bulan" : "12 months"),
                              ],
                              [
                                lang === "id" ? "Gaji / Nilai Kontrak" : "Payment / Contract Value",
                                metaA?.salary || (lang === "id" ? "Rp12.000.000 / bulan" : "Rp12,000,000 / month"),
                                metaB?.salary || (lang === "id" ? "Rp14.000.000 / bulan" : "Rp14,000,000 / month"),
                              ],
                              [
                                lang === "id" ? "Masa Pemberitahuan / Addendum" : "Notice Period / Addendum",
                                metaA?.noticePeriod || (lang === "id" ? "30 hari" : "30 days"),
                                metaB?.noticePeriod || (lang === "id" ? "60 hari" : "60 days"),
                              ],
                              [
                                lang === "id" ? "Masa Uji Coba / Ketentuan" : "Probation / Terms",
                                metaA?.probationPeriod || (lang === "id" ? "Tidak ada masa uji coba" : "No probation"),
                                metaB?.probationPeriod || (lang === "id" ? "Tidak ada masa uji coba" : "No probation"),
                              ],
                              [
                                lang === "id" ? "Denda / Penalti" : "Penalty",
                                metaA?.penalty || metaA?.dendaResign || (lang === "id" ? "Tanpa denda pinalti" : "No early termination penalty"),
                                metaB?.penalty || metaB?.dendaResign || (lang === "id" ? "Tanpa denda pinalti" : "No early termination penalty"),
                              ],
                              [
                                lang === "id" ? "Jam Kerja / Ruang Lingkup" : "Schedule / Scope",
                                metaA?.workingHours || metaA?.role || (lang === "id" ? "40 jam/minggu" : "40 hrs/week"),
                                metaB?.workingHours || metaB?.role || (lang === "id" ? "40 jam/minggu" : "40 hrs/week"),
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
                            ))
                          })()}
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
            )
          })())}
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
                  {dates.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "48px 24px", color: "var(--text-secondary)" }}>
                      <div style={{ display: "inline-flex", padding: 14, borderRadius: "50%", background: "var(--card-subtle)", color: "var(--brand-primary)", marginBottom: 12 }}>
                        <Icon name="calendar" size={32} />
                      </div>
                      <h3 style={{ margin: "0 0 8px 0" }}>{lang === "id" ? "Belum Ada Tanggal Penting" : "No Important Dates Yet"}</h3>
                      <p style={{ maxWidth: 400, margin: "0 auto 20px", fontSize: "0.9rem" }}>
                        {lang === "id"
                          ? "Unggah kontrak atau perjanjian baru untuk mengekstrak otomatis tanggal jatuh tempo pembayaran, perpanjangan, dan masa tenggang."
                          : "Upload a contract or agreement to automatically extract payment dues, renewals, and notice deadlines."}
                      </p>
                      <Button icon="upload" onClick={openUpload}>
                        {lang === "id" ? "Unggah Dokumen Sekarang" : "Upload Document Now"}
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="timeline-list">
                        {dates.map((item, i) => (
                          <div className="timeline-item" key={item.id || item.title || i}>
                            <span className={`date-square ${item.kind || "mint"}`}>
                              <small>{lang === "id" && item.month === "DEC" ? "DES" : item.month}</small>
                              <b>{item.day}</b>
                            </span>
                            <div className="timeline-copy">
                              <h3>{lang === "id" ? (item.titleId || item.title) : item.title}</h3>
                              <button
                                onClick={() => {
                                  const target = contracts.find(
                                    (c) =>
                                      c.name === (item.contractName || item.contract) ||
                                      c.nameId === (item.contractId || item.contract)
                                  ) || contracts[0]
                                  if (target) openContract(target)
                                }}
                              >
                                {lang === "id" ? (item.contractId || item.contractName || item.contract) : (item.contractName || item.contract)}
                                <Icon name="external" size={12} />
                              </button>
                              <span>{lang === "id" ? (item.dateId || item.date) : item.date}</span>
                            </div>
                            <div className="timeline-actions">
                              <Badge status={lang === "id" ? (item.tagId || item.tag) : item.tag} />
                              <button
                                className={`reminder-button ${
                                  reminders.includes(item.id) ? "enabled" : ""
                                }`}
                                onClick={() => {
                                  const dateId = item.id
                                  const isCurrentlySet = reminders.includes(dateId)
                                  const nextReminders = isCurrentlySet
                                    ? reminders.filter((id) => id !== dateId)
                                    : [...reminders, dateId]
                                  setReminders(nextReminders)

                                  const activeToken = localStorage.getItem("clariq_token") || token
                                  fetch(`/api/dates/${dateId}/reminder`, {
                                    method: "PUT",
                                    headers: {
                                      "Content-Type": "application/json",
                                      ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
                                    },
                                  })
                                    .then((res) => res.json())
                                    .then((data) => {
                                      if (data.success && data.data) {
                                        setDates((prev) =>
                                          prev.map((d) => (d.id === dateId ? { ...d, reminderEnabled: data.data.reminderEnabled } : d))
                                        )
                                      }
                                    })
                                    .catch(() => {})

                                  setToast(
                                    isCurrentlySet
                                      ? (lang === "id" ? "Pengingat dinonaktifkan." : "Reminder disabled.")
                                      : (lang === "id" ? "Pengingat berhasil diaktifkan dan disimpan ke database!" : "Reminder saved to database!")
                                  )
                                }}
                              >
                                <Icon
                                  name={reminders.includes(item.id) ? "check" : "bell"}
                                  size={13}
                                />
                                {reminders.includes(item.id)
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
                    </>
                  )}
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
                        (_, i) => {
                          const dayNum = i + 1
                          const monthMap: Record<string, number> = {
                            JAN: 0, FEB: 1, MAR: 2, APR: 3, MEI: 4, MAY: 4,
                            JUN: 5, JUL: 6, AGU: 7, AUG: 7, SEP: 8, OKT: 9,
                            OCT: 9, NOV: 10, DES: 11, DEC: 11,
                          }
                          const matchingDate = dates.find((d) => {
                            const dMonth = monthMap[(d.month || "").toUpperCase()]
                            return dMonth === dateMonth && parseInt(d.day, 10) === dayNum
                          })
                          const isToday = dateMonth === 10 && dayNum === 12
                          const monthName = lang === "id"
                            ? [
                                "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"
                              ][dateMonth]
                            : [
                                "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
                              ][dateMonth]
                          const eventTitle = matchingDate
                            ? (lang === "id" ? (matchingDate.titleId || matchingDate.title) : (matchingDate.title || matchingDate.titleId))
                            : null
                          const contractName = matchingDate ? (matchingDate.contract || matchingDate.contractName || "") : ""

                          return (
                            <button
                              key={i}
                              className={`${isToday ? "today" : ""} ${matchingDate ? "has-event" : ""}`}
                              title={matchingDate ? `${eventTitle}${contractName ? ` (${contractName})` : ""}` : undefined}
                              onClick={() => {
                                if (matchingDate) {
                                  setToast(
                                    `${dayNum} ${monthName} 2027: ${eventTitle}${contractName ? ` (${contractName})` : ""}`
                                  )
                                } else {
                                  setToast(
                                    lang === "id"
                                      ? `${dayNum} ${monthName} 2027: Tidak ada tenggat waktu dokumen.`
                                      : `${dayNum} ${monthName} 2027: No contract milestones.`
                                  )
                                }
                              }}
                            >
                              {dayNum}
                            </button>
                          )
                        },
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
                onSubmit={async (e) => {
                  e.preventDefault()
                  try {
                    const res = await fetch("/api/user", {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                      },
                      body: JSON.stringify({ name, email, emailReminders, plan }),
                    })
                    const data = await res.json()
                    if (!res.ok || !data.success) {
                      setToast(data.message || (lang === "id" ? "Gagal menyimpan pengaturan profil." : "Failed to save profile settings."))
                      return
                    }
                    if (name) localStorage.setItem("clariq_name", name)
                    if (email) localStorage.setItem("clariq_email", email)
                    setToast(lang === "id" ? "Pengaturan berhasil disimpan ke database Cek Kontrak!" : "Your preferences have been saved.")
                  } catch {
                    setToast(lang === "id" ? "Terjadi kesalahan jaringan saat menyimpan profil." : "Network error saving profile.")
                  }
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
                    <b>{t.settings_plan_label} — {userPlan === "pro" ? t.plan_badge_pro : t.plan_badge_free}</b>
                    <p>
                      {userPlan === "free"
                        ? t.settings_plan_free_desc
                        : t.settings_plan_plus_desc}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => setPlanModal("HRD Pro")}
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
                    description: lang === "id" ? "Untuk HRD, Bisnis & Profesional — Termasuk Generator Surat Kontrak Kerja Otomatis." : "For HRD, Business & Professionals — Includes Automated Employment Contract Generator.",
                    features: lang === "id" ? [
                      "Generator Surat Kontrak Kerja HRD Otomatis",
                      "Smart Legal Guardrails (Pasal 58 & 77 UU 13/2003)",
                      "Live Preview & Cetak PDF Kontrak Resmi",
                      "20 analisis dokumen / bulan & AI Legal Chat",
                      "Perbandingan 2 versi kontrak berdampingan",
                    ] : [
                      "Automated HRD Smart Contract Generator",
                      "Smart Legal Guardrails (Art. 58 & 77 Law 13/2003)",
                      "Live Preview & Official PDF Contract Print",
                      "20 contract analyses / month & AI Legal Chat",
                      "Side-by-side 2-contract comparison",
                    ],
                    cta: lang === "id" ? "Aktifkan Paket HRD Pro" : "Activate HRD Pro Plan",
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
                        name={item.name === "Free" ? "file" : "spark"}
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
                  <div className="landing-art float-gentle">
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
                  ].map((f, idx) => (
                    <div className={`surface feature-card stagger-${idx + 1}`} key={f.title}>
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
                    <div className={`stagger-${i + 1}`} key={s.title}>
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
                <span>© 2027 Cek Kontrak. {lang === "id" ? "Langkah cerdas memahami perjanjian." : "A clearer way forward."}</span>
                <button onClick={() => navigate("pricing")}>
                  {t.breadcrumb_pricing}
                </button>
              </footer>
            </>
          )}
        </main>
      </div>
      {toast && (
        <div className="toast-wrapper">
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
        </div>
      )}
      {uploadOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            backdropMouseDownRef.current = e.target
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && backdropMouseDownRef.current === e.currentTarget) {
              setUploadOpen(false)
            }
            backdropMouseDownRef.current = null
          }}
        >
          <div
            className="modal upload-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="upload-title"
            ref={modalRef}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
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

            {/* Pilihan Grounding Hukum & Kategori */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", margin: "14px 0 10px", width: "100%" }}>
              <button
                type="button"
                className={`btn btn-${uploadContractType === "kerja" ? "primary" : "secondary"}`}
                style={{ flex: "1 1 200px", minWidth: 0, fontSize: "0.82rem", padding: "8px 10px", minHeight: "36px", whiteSpace: "normal", textAlign: "center", lineHeight: "1.3", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                onClick={() => setUploadContractType("kerja")}
              >
                <Icon name="shield" size={14} />
                <span>{lang === "id" ? "Ketenagakerjaan (UU 13/2003)" : "Employment"}</span>
              </button>
              <button
                type="button"
                className={`btn btn-${uploadContractType === "sewa" ? "primary" : "secondary"}`}
                style={{ flex: "1 1 200px", minWidth: 0, fontSize: "0.82rem", padding: "8px 10px", minHeight: "36px", whiteSpace: "normal", textAlign: "center", lineHeight: "1.3", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                onClick={() => setUploadContractType("sewa")}
              >
                <Icon name="file" size={14} />
                <span>{lang === "id" ? "Sewa Menyewa (KUHPerdata)" : "Rental Lease"}</span>
              </button>
            </div>

            {/* Mode Switch: File vs Paste */}
            <div style={{ display: "flex", flexWrap: "wrap", borderBottom: "1px solid var(--border)", marginBottom: "14px", width: "100%" }}>
              <button
                type="button"
                style={{
                  flex: "1 1 180px",
                  minWidth: 0,
                  padding: "8px 10px",
                  fontSize: "0.83rem",
                  fontWeight: uploadMode === "file" ? 700 : 500,
                  borderBottom: uploadMode === "file" ? "2px solid var(--color-clarity)" : "none",
                  color: uploadMode === "file" ? "var(--color-clarity)" : "var(--muted)",
                  whiteSpace: "normal",
                  textAlign: "center",
                  lineHeight: "1.3",
                }}
                onClick={() => setUploadMode("file")}
              >
                {lang === "id" ? "Unggah Dokumen (PDF/DOCX/Gambar)" : "Upload Document"}
              </button>
              <button
                type="button"
                style={{
                  flex: "1 1 180px",
                  minWidth: 0,
                  padding: "8px 10px",
                  fontSize: "0.83rem",
                  fontWeight: uploadMode === "paste" ? 700 : 500,
                  borderBottom: uploadMode === "paste" ? "2px solid var(--color-clarity)" : "none",
                  color: uploadMode === "paste" ? "var(--color-clarity)" : "var(--muted)",
                  whiteSpace: "normal",
                  textAlign: "center",
                  lineHeight: "1.3",
                }}
                onClick={() => setUploadMode("paste")}
              >
                {lang === "id" ? "Tempel Teks Pasal (Paste)" : "Paste Contract Text"}
              </button>
            </div>

            {uploadMode === "paste" ? (
              <div style={{ marginBottom: "14px" }}>
                <textarea
                  style={{
                    width: "100%",
                    minHeight: "120px",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    fontSize: "0.85rem",
                    resize: "vertical",
                    fontFamily: "inherit",
                    background: "white",
                  }}
                  placeholder={
                    uploadContractType === "kerja"
                      ? (lang === "id"
                          ? "Tempel teks pasal kontrak kerja di sini (contoh: 'Karyawan yang mengundurkan diri sebelum masa kontrak berakhir wajib membayar denda 3x gaji bulanan. Kontrak otomatis diperpanjang...')"
                          : "Paste employment contract text here (e.g. 'Employee resigning before end of contract shall pay 3x monthly salary penalty. Contract renews automatically...')")
                      : (lang === "id"
                          ? "Tempel teks perjanjian sewa di sini (contoh: 'Uang deposit tidak dapat dikembalikan dengan alasan apapun. Pemilik berhak menaikkan harga sewa kapan saja...')"
                          : "Paste lease agreement text here (e.g. 'Security deposit non-refundable. Owner reserves right to increase rent unilaterally...')")
                  }
                  value={uploadText}
                  onChange={(e) => setUploadText(e.target.value)}
                />
              </div>
            ) : (
              <>
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
                {extractingPdf && (
                  <div className="extracted-preview-box" style={{ textAlign: "center", color: "#0284c7" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <Icon name="clock" size={16} />
                      <b>{t.upload_extracting}</b>
                    </div>
                  </div>
                )}
                {extractedData && (
                  <div className="extracted-preview-box">
                    <div className="extracted-badge">
                      <Icon name="check" size={14} />
                      <span>{t.upload_extracted_success} ({extractedData.numPages} {lang === "id" ? "hal" : "pages"} · {extractedData.charCount.toLocaleString("id-ID")} {lang === "id" ? "karakter" : "chars"} · {extractedData.wordCount} {lang === "id" ? "kata" : "words"})</span>
                    </div>
                    <div className="extracted-text-snippet">
                      {extractedData.text.slice(0, 320)}...
                    </div>
                  </div>
                )}
              </>
            )}

            <button
              type="button"
              className="demo-case-btn"
              onClick={() => {
                setUploadContractType("kerja")
                setUploadMode("paste")
                setUploadText(KEVIN_BIROWO_CONTRACT)
                setExtractedData({
                  text: KEVIN_BIROWO_CONTRACT,
                  numPages: 2,
                  charCount: KEVIN_BIROWO_CONTRACT.length,
                  wordCount: KEVIN_BIROWO_CONTRACT.split(/\s+/).filter(Boolean).length,
                })
                setUploadError("")
              }}
            >
              <Icon name="spark" size={16} />
              <span>{t.upload_demo_kevin_btn}</span>
            </button>

            {uploadError && (
              <p className="form-error" role="alert">
                {uploadError}
              </p>
            )}
            <div className="upload-demo-note">
              <Icon name="spark" size={16} />
              <p>
                <b>{lang === "id" ? "Grounding Hukum AI." : "AI Legal Grounding."}</b> {lang === "id" ? "Dianalisis otomatis berbasis UU Ketenagakerjaan & KUHPerdata Indonesia." : "Automatically analyzed grounded in Indonesian Manpower Law & Civil Code."}
              </p>
            </div>
            <Button
              icon="spark"
              className="full-width"
              disabled={extractingPdf || (uploadMode === "paste" ? !uploadText.trim() : (!uploadFile && !extractedData))}
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
          onMouseDown={(e) => {
            backdropMouseDownRef.current = e.target
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && backdropMouseDownRef.current === e.currentTarget) {
              setClause(null)
            }
            backdropMouseDownRef.current = null
          }}
        >
          <div
            className="clause-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="clause-title"
            ref={modalRef}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
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
          onMouseDown={(e) => {
            backdropMouseDownRef.current = e.target
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && backdropMouseDownRef.current === e.currentTarget) {
              setPlanModal(null)
            }
            backdropMouseDownRef.current = null
          }}
        >
          <div
            className="modal plan-modal plan-comparison-modal"
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="plan-title"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
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
            <span className="eyebrow" style={{ marginBottom: 4 }}>
              <span className="blue-dot" />
              {t.plan_modal_eyebrow}
            </span>
            <h2 id="plan-title" style={{ margin: "4px 0 6px" }}>
              {t.plan_modal_title}
            </h2>
            <p style={{ margin: "0 0 12px", fontSize: 12.5 }}>
              {t.plan_modal_sub}
            </p>

            <div className="plan-compare-grid">
              {/* FREE PLAN CARD */}
              <div className="plan-compare-card">
                <div>
                  <h3>{t.plan_modal_free_title}</h3>
                  <div className="plan-compare-price">
                    {t.plan_modal_free_price} <span>{lang === "id" ? "/ selamanya" : "/ forever"}</span>
                  </div>
                  <p style={{ fontSize: 11.5, color: "#64748b", margin: 0 }}>
                    {t.plan_modal_free_sub}
                  </p>
                  <ul className="plan-compare-list">
                    <li><Icon name="check" size={15} /><span>{t.plan_modal_free_f1}</span></li>
                    <li><Icon name="check" size={15} /><span>{t.plan_modal_free_f2}</span></li>
                    <li><Icon name="check" size={15} /><span>{t.plan_modal_free_f3}</span></li>
                    <li><Icon name="check" size={15} /><span>{t.plan_modal_free_f4}</span></li>
                  </ul>
                </div>
                <Button
                  variant="secondary"
                  className="full-width"
                  onClick={switchToFreePlan}
                >
                  {userPlan === "free" ? t.pricing_current : t.plan_modal_use_free_btn}
                </Button>
              </div>

              {/* PRO PLAN CARD */}
              <div className="plan-compare-card pro">
                <div>
                  <span className="plan-pro-pill">
                    <Icon name="spark" size={12} />
                    {t.plan_modal_pro_badge}
                  </span>
                  <h3>{t.plan_modal_pro_title}</h3>
                  <div className="plan-compare-price">
                    {t.plan_modal_pro_price} <span>{lang === "id" ? "/ bulan (Simulasi Gratis)" : "/ month (Free Simulation)"}</span>
                  </div>
                  <p style={{ fontSize: 11.5, color: "#1d4ed8", fontWeight: 600, margin: 0 }}>
                    {t.plan_modal_pro_sub}
                  </p>
                   <ul className="plan-compare-list">
                    <li><Icon name="check" size={15} /><span><b>{t.plan_modal_pro_f1}</b></span></li>
                    <li><Icon name="check" size={15} /><span>{t.plan_modal_pro_f2}</span></li>
                    <li><Icon name="check" size={15} /><span>{t.plan_modal_pro_f3}</span></li>
                    <li><Icon name="check" size={15} /><span>{t.plan_modal_pro_f4}</span></li>
                  </ul>

                  {/* QRIS & Virtual Account Exhibition Checkout Box */}
                  <div
                    id="qris-checkout-box"
                    style={{
                      background: "#ffffff",
                      border: "1px solid #bfdbfe",
                      borderRadius: 10,
                      padding: 12,
                      marginBottom: 12,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <strong style={{ fontSize: 11.5, color: "var(--color-navy)" }}>
                        {lang === "id" ? "Metode Pembayaran (QRIS & Virtual Account)" : "Payment Method (QRIS & Virtual Account)"}
                      </strong>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#1d4ed8", background: "#dbeafe", padding: "2px 7px", borderRadius: 999 }}>
                        QRIS / VA · 14:59
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                      {(["QRIS", "BCA_VA", "MANDIRI_VA"] as const).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setCheckoutMethod(method)}
                          style={{
                            flex: 1,
                            padding: "6px 8px",
                            borderRadius: 7,
                            fontSize: 10.5,
                            fontWeight: 700,
                            border: checkoutMethod === method ? "1.5px solid #2563eb" : "1px solid #cbd5e1",
                            background: checkoutMethod === method ? "#eff6ff" : "#f8fafc",
                            color: checkoutMethod === method ? "#1d4ed8" : "#475569",
                          }}
                        >
                          {method === "QRIS" ? "QRIS Instan" : method === "BCA_VA" ? "BCA VA" : "Mandiri VA"}
                        </button>
                      ))}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <div
                        style={{
                          width: 54,
                          height: 54,
                          borderRadius: 8,
                          border: "1px solid #cbd5e1",
                          background: "#f8fafc",
                          display: "grid",
                          placeItems: "center",
                          flexShrink: 0,
                          fontSize: 9,
                          fontWeight: 800,
                          color: "#0f172a",
                          textAlign: "center",
                          lineHeight: 1.15,
                        }}
                      >
                        {checkoutMethod === "QRIS" ? "QRIS\nCLARIQ" : "VA\n880192"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <label
                          htmlFor="checkout-promo-input"
                          style={{ display: "block", fontSize: 10.5, fontWeight: 600, color: "#475569", marginBottom: 4 }}
                        >
                          {lang === "id" ? "Kode Voucher / Promo Pameran" : "Exhibition Promo Code"}
                        </label>
                        <input
                          id="checkout-promo-input"
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder={lang === "id" ? "Ketik GURU atau PAMERAN" : "Type GURU or PAMERAN"}
                          style={{
                            width: "100%",
                            padding: "6px 10px",
                            borderRadius: 7,
                            border: "1px solid #cbd5e1",
                            fontSize: 11.5,
                            fontWeight: 600,
                          }}
                        />
                      </div>
                    </div>
                    {/^(guru|pameran|dosen|demo)$/i.test(promoCode.trim()) && (
                      <div
                        id="promo-applied-badge"
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#15803d",
                          background: "#f0fdf4",
                          border: "1px solid #86efac",
                          borderRadius: 7,
                          padding: "5px 9px",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <Icon name="check" size={14} />
                        {lang === "id"
                          ? `Kode "${promoCode.toUpperCase()}" aktif: Diskon 100% (Rp 0)`
                          : `Code "${promoCode.toUpperCase()}" applied: 100% Off (Rp 0)`}
                      </div>
                    )}
                  </div>
                </div>
                {paymentVerifying ? (
                  <div
                    id="payment-verifying-state"
                    style={{
                      padding: "11px 16px",
                      borderRadius: 9,
                      background: "#eff6ff",
                      border: "1px solid #93c5fd",
                      color: "#1d4ed8",
                      fontSize: 12,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <Icon name="spark" size={16} />
                    {lang === "id" ? "Memverifikasi Pembayaran QRIS..." : "Verifying QRIS Payment..."}
                  </div>
                ) : (
                  <Button
                    icon="spark"
                    className="full-width"
                    onClick={() => handleSimulateCheckoutPayment(true)}
                  >
                    {userPlan === "pro"
                      ? t.plan_modal_active_pro_btn
                      : lang === "id"
                        ? "Simulasikan Pembayaran Berhasil"
                        : "Simulate Successful Payment"}
                    <Icon name="arrow" size={16} />
                  </Button>
                )}
              </div>
            </div>

            <div className="plan-demo-card" style={{ marginBottom: 0 }}>
              <Icon name="shield" size={18} />
              {lang === "id"
                ? "Mode Prototipe Pendidikan — Pengaktifan Paket HRD Pro tidak mengenakan biaya pembayaran."
                : "Educational Prototype Mode — Activating HRD Pro Plan does not require any payment."}
            </div>
          </div>
        </div>
      )}
      {authModal && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            backdropMouseDownRef.current = e.target
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && backdropMouseDownRef.current === e.currentTarget) {
              setAuthModal(null)
            }
            backdropMouseDownRef.current = null
          }}
        >
          <div
            className="modal auth-modal"
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
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

            {authError && (
              <div
                className="form-error"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#dc2626",
                  padding: "10px 12px",
                  borderRadius: "7px",
                  fontSize: "11px",
                  lineHeight: 1.5,
                  margin: "0 0 14px 0",
                }}
              >
                <Icon name="warning" size={16} />
                <span>{authError}</span>
              </div>
            )}

            <form
              onSubmit={handleAuthSubmit}
              noValidate
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
      {contractToDelete && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            backdropMouseDownRef.current = e.target
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && backdropMouseDownRef.current === e.currentTarget) {
              setContractToDelete(null)
            }
            backdropMouseDownRef.current = null
          }}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            style={{ maxWidth: "440px" }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-heading">
              <span className="stat-icon" style={{ background: "#fef2f2", color: "#dc2626" }}>
                <Icon name="trash" size={22} />
              </span>
              <button
                className="icon-button"
                aria-label="Tutup"
                onClick={() => setContractToDelete(null)}
              >
                <Icon name="close" />
              </button>
            </div>
            <h2 id="delete-dialog-title" style={{ fontSize: "18px", fontWeight: 700, margin: "14px 0 8px" }}>
              {t.delete_confirm_title}
            </h2>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "20px" }}>
              {t.delete_confirm_desc}{" "}
              <b style={{ color: "var(--color-navy)" }}>{getContractName(contractToDelete, lang)}</b>?
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <Button
                variant="secondary"
                onClick={() => setContractToDelete(null)}
              >
                {t.delete_cancel_btn}
              </Button>
              <Button
                style={{ background: "#dc2626", borderColor: "#dc2626", color: "#ffffff" }}
                onClick={() => handleDeleteContract(contractToDelete)}
              >
                <Icon name="trash" size={15} />
                {t.delete_confirm_btn}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
