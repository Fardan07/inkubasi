import { useEffect, useRef, useState, type ReactNode } from "react"

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
function Button({
  children,
  onClick,
  variant = "primary",
  icon,
  type = "button",
  disabled = false,
  className = "",
}: {
  children: ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "text" | "white"
  icon?: IconName
  type?: "button" | "submit"
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <Icon name={icon} size={17} />}
      {children}
    </button>
  )
}
function Badge({ status }: { status: string }) {
  const kind = /safe|complete|active/i.test(status)
    ? "safe"
    : /attention/i.test(status)
      ? "attention"
      : /review|remaining|due/i.test(status)
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
  status: string
  source: string
  text: string
  meaning: string
  why: string
  original: string
}
type Contract = {
  id: number
  name: string
  company: string
  type: string
  status: string
  date: string
  color: string
  summary?: string
  riskScore?: number
  riskBreakdown?: { safe: number; review: number; attention: number }
  meta?: Record<string, string>
  clauses?: Clause[]
}
const initialContracts: Contract[] = [
  {
    id: 1,
    name: "Employment Agreement",
    company: "PT Example Indonesia",
    type: "Employment",
    status: "Needs Attention",
    date: "Nov 12, 2027",
    color: "blue",
  },
  {
    id: 2,
    name: "Freelance Agreement",
    company: "Studio XYZ",
    type: "Freelance",
    status: "Review",
    date: "Nov 10, 2027",
    color: "lavender",
  },
  {
    id: 3,
    name: "Vendor Agreement",
    company: "Kopi Kita",
    type: "Business",
    status: "Safe",
    date: "Nov 8, 2027",
    color: "mint",
  },
  {
    id: 4,
    name: "Apartment Lease",
    company: "Bumi Residence",
    type: "Rental",
    status: "Safe",
    date: "Nov 5, 2027",
    color: "peach",
  },
]
const clauses = [
  {
    title: "Payment Terms",
    status: "Safe",
    source: "Article 3 — Remuneration",
    text: "Your monthly salary is paid by the 25th, with clearly defined benefits.",
    meaning:
      "Gaji sebesar Rp12.000.000 dibayarkan setiap tanggal 25. Anda juga berhak menerima tunjangan sesuai ketentuan perusahaan.",
    why: "Jadwal pembayaran yang jelas membantu Anda merencanakan keuangan dan memastikan kewajiban perusahaan.",
    original:
      "The Employee shall receive a gross monthly salary of IDR 12,000,000, payable no later than the 25th day of each calendar month.",
  },
  {
    title: "Early Termination",
    status: "Needs Attention",
    source: "Article 8 — Termination",
    text: "Leaving before the contract ends may require a payment of one month’s salary.",
    meaning:
      "Jika Anda mengundurkan diri sebelum kontrak berakhir, Anda perlu memberikan pemberitahuan tertulis 30 hari sebelumnya. Anda juga dapat diwajibkan membayar kompensasi sebesar satu bulan gaji.",
    why: "Anda mungkin perlu menyiapkan biaya tambahan jika ingin berpindah pekerjaan sebelum masa kontrak selesai. Diskusikan ketentuan ini dengan perusahaan sebelum menandatangani.",
    original:
      "Either party may terminate this Agreement with thirty (30) days’ prior written notice. If the Employee terminates before the agreed end date, the Employee may be required to compensate the Employer an amount equivalent to one (1) month’s gross salary.",
  },
  {
    title: "Automatic Renewal",
    status: "Review",
    source: "Article 9 — Renewal",
    text: "Your contract renews automatically unless you give 30 days’ written notice.",
    meaning:
      "Kontrak akan diperpanjang secara otomatis selama 12 bulan jika tidak ada pemberitahuan tertulis paling lambat 30 hari sebelum tanggal berakhir.",
    why: "Catat batas waktu pemberitahuan agar Anda tidak terikat masa kontrak baru tanpa menyadarinya.",
    original:
      "This Agreement shall automatically renew for a further twelve (12) months unless either party provides written notice at least thirty (30) days before expiry.",
  },
  {
    title: "Confidentiality",
    status: "Safe",
    source: "Article 6 — Confidentiality",
    text: "Keep non-public company information confidential during and after employment.",
    meaning:
      "Anda harus menjaga kerahasiaan informasi perusahaan yang tidak tersedia untuk umum, termasuk setelah hubungan kerja berakhir.",
    why: "Hindari membagikan dokumen internal atau informasi klien tanpa izin tertulis dari perusahaan.",
    original:
      "The Employee agrees not to disclose any non-public business information during or after the term of employment, except as required by law.",
  },
  {
    title: "Responsibilities",
    status: "Safe",
    source: "Article 2 — Duties",
    text: "Your role, working hours, and reporting structure are clearly outlined.",
    meaning:
      "Anda bekerja sebagai Product Designer selama 40 jam per minggu dan melapor kepada Head of Design. Perubahan tanggung jawab harus disepakati secara tertulis.",
    why: "Ruang lingkup pekerjaan yang jelas membantu mencegah tugas tambahan di luar kesepakatan awal.",
    original:
      "The Employee shall serve as Product Designer for forty (40) hours per week and report to the Head of Design. Material changes to duties shall be agreed in writing.",
  },
]
const dateItems = [
  {
    day: "25",
    month: "NOV",
    title: "Monthly payment",
    contract: "Employment Agreement",
    date: "25 November 2027",
    tag: "13 days remaining",
    kind: "mint",
  },
  {
    day: "30",
    month: "NOV",
    title: "Notice deadline",
    contract: "Freelance Agreement",
    date: "30 November 2027",
    tag: "18 days remaining",
    kind: "amber",
  },
  {
    day: "12",
    month: "DEC",
    title: "Renewal deadline",
    contract: "Employment Agreement",
    date: "12 December 2027",
    tag: "30 days remaining",
    kind: "blue",
  },
  {
    day: "12",
    month: "JAN",
    title: "Contract expiration",
    contract: "Employment Agreement",
    date: "12 January 2028",
    tag: "61 days remaining",
    kind: "blue",
  },
  {
    day: "13",
    month: "JAN",
    title: "Renewed contract starts",
    contract: "Employment Agreement",
    date: "13 January 2028",
    tag: "62 days remaining",
    kind: "mint",
  },
]
function DocumentArt() {
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
            <b>YOUR CONTRACT</b>
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
        Clarity, delivered.
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
  const [filter, setFilter] = useState("All contracts")
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
  const fileInput = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const chatBottom = useRef<HTMLDivElement>(null)

  const activeClauses: Clause[] =
    selected && selected.clauses && selected.clauses.length > 0
      ? selected.clauses
      : clauses

  useEffect(() => {
    fetch("/api/contracts")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setContracts(json.data)
          setSelected((prev) => json.data.find((c: any) => c.id === prev.id) || json.data[0])
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
    window.scrollTo(0, 0)
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
  const modalOpen = uploadOpen || clause !== null || planModal !== null
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
      setUploadError("Please choose a PDF, DOCX, JPG, or PNG document.")
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      setUploadError("Your file must be smaller than 20 MB.")
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
      "If you resign before 12 January 2028, you need to give 30 days’ written notice. You may also owe compensation equal to one month’s gross salary (Rp12,000,000). Consider discussing this condition with your employer before making a decision."
    if (/end|expire|duration|berakhir/i.test(text)) {
      source = 2
      answer =
        "The sample agreement runs from 13 January 2027 to 12 January 2028. It automatically renews for another 12 months unless either party gives written notice at least 30 days before expiry."
    } else if (/renew|perpanjang/i.test(text)) {
      source = 2
      answer =
        "Yes. The sample agreement renews automatically for 12 months. To avoid renewal, submit written notice by 12 December 2027—30 days before the contract expires."
    } else if (/responsib|duties|tugas/i.test(text)) {
      source = 4
      answer =
        "Your main responsibility is working as a Product Designer, 40 hours per week, reporting to the Head of Design. Any material changes to your role must be agreed in writing."
    } else if (/pay|salary|gaji/i.test(text)) {
      source = 0
      answer =
        "Your gross monthly salary is Rp12,000,000, paid no later than the 25th of each month. Benefits follow the company’s written policies."
    } else if (!/resign|early|terminat|quit/i.test(text)) {
      answer =
        "This prototype can explain the sample agreement’s payment, termination, renewal, and responsibilities clauses. For your question, the relevant starting point is Article 8: either party must give 30 days’ written notice to end the agreement."
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
    { label: "Dashboard", icon: "grid", page: "dashboard" },
    {
      label: "My Contracts",
      icon: "file",
      page: "contracts",
      count: String(contracts.length),
    },
    { label: "Compare", icon: "compare", page: "compare" },
    { label: "Important Dates", icon: "calendar", page: "dates", count: "3" },
  ]
  const filteredContracts = contracts.filter(
    (c) =>
      `${c.name} ${c.company} ${c.type}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (filter === "All contracts" ||
        (filter === "Needs attention"
          ? c.status === "Needs Attention"
          : c.status === filter)),
  )
  const isLanding = page === "landing"
  const contractTable = (all = false) => (
    <div className="table-scroll">
      <table className="contracts-table">
        <thead>
          <tr>
            <th>Contract</th>
            <th>Type</th>
            <th>Status</th>
            <th>Last analyzed</th>
            <th aria-label="Actions" />
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
                      {c.name}
                    </button>
                    <span>{c.company}</span>
                  </div>
                </div>
              </td>
              <td>
                <span className="type-label">{c.type}</span>
              </td>
              <td>
                <Badge status={c.status} />
              </td>
              <td className="date-cell">{c.date}</td>
              <td>
                <button
                  className="icon-button table-arrow"
                  aria-label={`Open ${c.name}`}
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
          <h3>No contracts found</h3>
          <p>Try a different search or filter.</p>
          <Button
            variant="secondary"
            onClick={() => {
              setSearch("")
              setFilter("All contracts")
            }}
          >
            Clear filters
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
                <b>Personal workspace</b>
                <small>{plan} plan</small>
              </span>
              <span className="workspace-chevron">
                <Icon name="chevron" size={14} />
              </span>
            </button>
            <div className="nav-label">WORKSPACE</div>
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
                <h3>A little more clarity.</h3>
                <p>
                  More contracts. Deeper insights.
                  <br />
                  Meet CLARIQ Plus.
                </p>
                <button onClick={() => navigate("pricing")}>
                  Explore Plus
                  <Icon name="arrow" size={15} />
                </button>
              </div>
              <button
                className={`nav-item ${page === "settings" ? "active" : ""}`}
                onClick={() => navigate("settings")}
              >
                <Icon name="settings" size={19} />
                <span>Settings</span>
              </button>
              <button
                className="nav-item"
                onClick={() =>
                  setToast(
                    "Need a hand? Contact hello@clariq.example. This is a demo support address.",
                  )
                }
              >
                <Icon name="help" size={19} />
                <span>Help & getting started</span>
                <Icon name="external" size={14} />
              </button>
              <div className="sidebar-footer">
                <span className="tiny-brand">CLARIQ</span>
                <span>Understand what you sign.</span>
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
              <a href="#product">Product</a>
              <a href="#how-it-works">How it works</a>
              <button onClick={() => navigate("pricing")}>For Business</button>
              <button onClick={() => navigate("pricing")}>Pricing</button>
            </nav>
            <div>
              <Button variant="text" onClick={() => navigate("dashboard")}>
                Login
              </Button>
              <Button onClick={() => navigate("dashboard")}>
                Get Started
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
                  Explore product
                </button>
                <a href="#how-it-works" onClick={() => setMobileNav(false)}>
                  How it works
                </a>
                <button onClick={() => navigate("pricing")}>
                  Pricing & Business
                </button>
                <button onClick={() => navigate("dashboard")}>
                  Get started
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
                Workspace
                <Icon name="chevron" size={13} />
                <b>
                  {
                    {
                      dashboard: "Dashboard",
                      contracts: "My Contracts",
                      analysis: "Contract Analysis",
                      chat: "Ask Your Contract",
                      compare: "Compare",
                      dates: "Important Dates",
                      settings: "Settings",
                      pricing: "Plans & Pricing",
                      landing: "",
                    }[page]
                  }
                </b>
              </span>
            </div>
            <div className="topbar-right">
              <div className="global-search">
                <Icon name="search" size={17} />
                <input
                  aria-label="Search contracts"
                  placeholder="Search anything..."
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
                      Your notifications <span>2 new</span>
                    </h3>
                    <button onClick={() => navigate("analysis")}>
                      <span className="notification-icon attention">
                        <Icon name="warning" size={19} />
                      </span>
                      <span>
                        <b>A clause needs your attention</b>
                        <small>Employment Agreement · Just now</small>
                      </span>
                    </button>
                    <button onClick={() => navigate("dates")}>
                      <span className="notification-icon blue">
                        <Icon name="calendar" size={19} />
                      </span>
                      <span>
                        <b>Your next payment is coming up</b>
                        <small>25 November · 13 days remaining</small>
                      </span>
                    </button>
                    <p>You're all caught up.</p>
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
                  <span className="avatar">PA</span>
                  <span className="profile-name">
                    {name.split(" ")[0]} Anindya
                  </span>
                  <Icon name="chevron" size={14} />
                </button>
                {profile && (
                  <div className="popover profile-popover">
                    <b>{name}</b>
                    <small>{email}</small>
                    <button onClick={() => navigate("settings")}>
                      <Icon name="settings" size={16} />
                      Account settings
                    </button>
                    <button onClick={() => navigate("pricing")}>
                      <Icon name="spark" size={16} />
                      Plans & billing
                    </button>
                    <button onClick={() => navigate("landing")}>
                      <Icon name="logout" size={16} />
                      Back to website
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>
        )}
        <main className={isLanding ? "landing-content" : "page-content"}>
          {page === "dashboard" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="greeting-eyebrow">
                    YOUR CLARITY STARTS HERE
                  </div>
                  <h1>
                    Good morning, {name.split(" ")[0]}
                    <span className="greeting-dot">.</span>
                  </h1>
                  <p>
                    Here’s an overview of your contracts. Let’s keep things
                    clear.
                  </p>
                </div>
                <Button icon="plus" onClick={openUpload}>
                  Analyze Contract
                </Button>
              </div>
              <section className="welcome-card">
                <div className="welcome-copy">
                  <span className="eyebrow">
                    <span className="blue-dot" />
                    LESS COMPLEXITY. MORE CONFIDENCE.
                  </span>
                  <h2>
                    Your contracts.
                    <br />A little clearer.
                  </h2>
                  <p>
                    From the fine print to the big picture, understand
                    <br className="desktop-break" /> what matters—before you put
                    pen to paper.
                  </p>
                  <Button variant="white" onClick={openUpload}>
                    Analyze a contract
                    <Icon name="arrow" size={17} />
                  </Button>
                  <div className="welcome-trust">
                    <Icon name="lock" size={12} />
                    Private by design. Clear by default.
                  </div>
                </div>
                <DocumentArt />
                <div className="welcome-corner">UNDERSTAND WHAT YOU SIGN.</div>
              </section>
              <div className="stats-grid">
                {[
                  {
                    label: "Active Contracts",
                    value: String(contracts.length),
                    icon: "file" as IconName,
                    color: "blue",
                    note: "+2 this month",
                    noteClass: "positive",
                    page: "contracts" as Page,
                  },
                  {
                    label: "Need Attention",
                    value: String(
                      contracts.filter(
                        (contract) => contract.status === "Needs Attention",
                      ).length,
                    ),
                    icon: "shield" as IconName,
                    color: "coral",
                    note: "Let’s take a closer look",
                    noteClass: "",
                    page: "contracts" as Page,
                  },
                  {
                    label: "Upcoming Deadlines",
                    value: "3",
                    icon: "calendar" as IconName,
                    color: "amber",
                    note: "In the next 30 days",
                    noteClass: "",
                    page: "dates" as Page,
                  },
                  {
                    label: "Analyzed This Month",
                    value: String(contracts.length),
                    icon: "spark" as IconName,
                    color: "mint",
                    note: "A little more informed",
                    noteClass: "",
                    page: "contracts" as Page,
                  },
                ].map((stat) => (
                  <button
                    className="stat-card"
                    key={stat.label}
                    onClick={() => {
                      navigate(stat.page)
                      setFilter(
                        stat.label === "Need Attention"
                          ? "Needs attention"
                          : "All contracts",
                      )
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
                        {stat.label === "Active Contracts" && (
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
                    title="Recent contracts"
                    subtitle="Your documents, understood."
                  >
                    <button
                      className="text-link"
                      onClick={() => {
                        navigate("contracts")
                        setFilter("All contracts")
                      }}
                    >
                      View all
                      <Icon name="arrow" size={15} />
                    </button>
                  </SectionTitle>
                  {contractTable()}
                </section>
                <section className="surface dates-widget">
                  <SectionTitle title="On the horizon">
                    <span className="count-tag">3</span>
                  </SectionTitle>
                  <p className="widget-subtitle">
                    A heads-up for what’s coming.
                  </p>
                  <div className="mini-dates">
                    {dateItems.slice(0, 3).map((item, i) => (
                      <button
                        key={item.title}
                        className="mini-date"
                        onClick={() => navigate("dates")}
                      >
                        <span className={`date-square ${item.kind}`}>
                          <small>{item.month}</small>
                          <b>{item.day}</b>
                        </span>
                        <span className="mini-date-text">
                          <b>{item.title}</b>
                          <small>{item.contract}</small>
                          <span
                            className={`days-left ${
                              i === 1 ? "amber-text" : ""
                            }`}
                          >
                            {item.tag}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                  <button
                    className="calendar-link"
                    onClick={() => navigate("dates")}
                  >
                    View all important dates
                    <Icon name="arrow" size={15} />
                  </button>
                </section>
              </div>
              <section className="new-contract-card">
                <div className="upload-circle">
                  <Icon name="upload" size={25} />
                </div>
                <div>
                  <h3>Have a new contract?</h3>
                  <p>
                    Upload it. We’ll help you make sense of the important parts.
                  </p>
                </div>
                <Button variant="secondary" icon="plus" onClick={openUpload}>
                  Analyze Contract
                </Button>
                <div className="banner-decoration" />
              </section>
              <div className="trust-footer">
                <span>
                  <Icon name="shield" size={15} />A little clarity goes a long
                  way.
                </span>
                <p>AI-assisted document understanding. Not legal advice.</p>
                <button
                  onClick={() =>
                    setToast(
                      "CLARIQ helps explain documents. Consult a qualified legal professional for advice specific to your situation.",
                    )
                  }
                >
                  Learn more
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
                    YOUR DOCUMENT LIBRARY
                  </span>
                  <h1>
                    My Contracts<span className="greeting-dot">.</span>
                  </h1>
                  <p>All your agreements. One clear picture.</p>
                </div>
                <Button icon="plus" onClick={openUpload}>
                  Analyze Contract
                </Button>
              </div>
              <div className="library-summary">
                <span className="file-icon blue">
                  <Icon name="file" size={23} />
                </span>
                <div>
                  <b>{contracts.length} documents in your workspace</b>
                  <p>Organized, analyzed, and always within reach.</p>
                </div>
                <Badge status="All analyses complete" />
              </div>
              <section className="surface">
                <div className="table-toolbar">
                  <div className="filter-tabs">
                    {["All contracts", "Safe", "Review", "Needs attention"].map(
                      (item) => (
                        <button
                          key={item}
                          className={filter === item ? "active" : ""}
                          onClick={() => setFilter(item)}
                        >
                          {item}
                        </button>
                      ),
                    )}
                  </div>
                  <div className="local-search">
                    <Icon name="search" size={17} />
                    <input
                      placeholder="Find a contract..."
                      aria-label="Find a contract"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
                {contractTable(true)}
                <div className="table-footer">
                  Showing {filteredContracts.length} of {contracts.length}{" "}
                  contracts<span>Sample workspace</span>
                </div>
              </section>
              <div className="legal-note">
                <Icon name="shield" size={16} />
                Your documents stay in this demo session. No files are sent to
                an AI service.
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
                Back to My Contracts
              </button>
              <div className="page-heading analysis-heading">
                <div>
                  <h1>{selected.name}</h1>
                  <p>{selected.company}</p>
                  <div className="document-meta">
                    <span>
                      <Icon name="file" size={14} />
                      {selected.type} contract
                    </span>
                    <span>
                      <Icon name="calendar" size={14} />
                      Uploaded {selected.date}
                    </span>
                    <Badge status="Analysis complete" />
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setMessages([])
                    navigate("chat")
                  }}
                  icon="chat"
                >
                  Ask your contract
                </Button>
              </div>
              <div className="sample-note">
                <Icon name="spark" size={16} />
                <span>
                  <b>Sample AI analysis</b> — These insights illustrate CLARIQ’s
                  experience. They are not generated from your uploaded
                  document.
                </span>
              </div>
              <section className="summary-card">
                <div className="summary-icon">
                  <Icon name="spark" size={24} />
                </div>
                <div>
                  <div className="summary-heading">
                    <h2>AI Summary</h2>
                    <span>THE BIG PICTURE</span>
                  </div>
                  <p>
                    {selected.id === 1 || selected.id > 4
                      ? "This is a 12-month employment agreement for a Product Designer role at PT Example Indonesia. It outlines a monthly salary of Rp12,000,000, a 40-hour work week, and a 30-day notice period. Most terms are standard, but early termination penalties and automatic renewal deserve a closer look."
                      : selected.id === 2
                        ? "This freelance agreement with Studio XYZ covers a design project at Rp8,000,000 per month. Payment is due on the 25th. Review the automatic renewal clause and give written notice before 30 November 2027 if you do not wish to continue."
                        : selected.id === 3
                          ? "This vendor agreement with Kopi Kita outlines a 12-month supply arrangement, monthly payments, and clearly defined delivery responsibilities. The sample terms are balanced, with no high-attention clauses identified."
                          : "This apartment lease at Bumi Residence covers a 12-month rental term. Rent is paid monthly, a one-month security deposit is required, and both parties must give 30 days’ notice before termination."}
                  </p>
                  <span className="source-caption">
                    <Icon name="file" size={13} />
                    Based on your agreement · 12 clauses reviewed
                  </span>
                </div>
              </section>
              <div className="insight-grid">
                {[
                  {
                    icon: "calendar" as IconName,
                    label: "Contract Duration",
                    value: "12 months",
                    sub: "13 Jan 2027 – 12 Jan 2028",
                  },
                  {
                    icon: "file" as IconName,
                    label: "Payment",
                    value: "Rp12,000,000",
                    sub: "Monthly · Paid by the 25th",
                  },
                  {
                    icon: "clock" as IconName,
                    label: "Notice Period",
                    value: "30 days",
                    sub: "Written notice required",
                  },
                  {
                    icon: "calendar" as IconName,
                    label: "Important Dates",
                    value: "12 Dec 2027",
                    sub: "Next renewal deadline",
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
                  title="Risk Analysis"
                  subtitle="Know what’s standard. See what deserves a second look."
                >
                  <span className="muted-label">12 clauses analyzed</span>
                </SectionTitle>
                <div className="risk-bar">
                  <span className="risk-safe" />
                  <span className="risk-review" />
                  <span className="risk-attention" />
                </div>
                <div className="risk-legend">
                  <span>
                    <i className="mint-bg" />
                    <b>8</b> Safe Clauses
                  </span>
                  <span>
                    <i className="amber-bg" />
                    <b>3</b> Clauses to Review
                  </span>
                  <span>
                    <i className="coral-bg" />
                    <b>1</b> High Attention Clause
                  </span>
                </div>
              </section>
              <section className="surface clauses-section">
                <SectionTitle
                  title="Understand your clauses"
                  subtitle="Plain-language explanations, with the source always close by."
                />
                {activeClauses.map((item, i) => (
                  <button
                    className="clause-row"
                    key={item.title}
                    onClick={() => openClause(i)}
                  >
                    <span
                      className={`clause-icon ${
                        item.status === "Needs Attention"
                          ? "coral"
                          : item.status === "Review"
                            ? "amber"
                            : "mint"
                      }`}
                    >
                      <Icon
                        name={
                          item.status === "Needs Attention"
                            ? "warning"
                            : item.status === "Review"
                              ? "search"
                              : "check"
                        }
                        size={19}
                      />
                    </span>
                    <span className="clause-copy">
                      <b>{item.title}</b>
                      <span>{item.text}</span>
                      <small>{item.source}</small>
                    </span>
                    <Badge status={item.status} />
                    <Icon name="chevron" size={18} />
                  </button>
                ))}
              </section>
              <div className="legal-note">
                <Icon name="shield" size={16} />
                CLARIQ explains your document. It does not replace professional
                legal advice.
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
                Back to analysis
              </button>
              <div className="page-heading">
                <div>
                  <span className="greeting-eyebrow">
                    A CONVERSATION, NOT A COMPLICATION
                  </span>
                  <h1>
                    Ask your contract<span className="greeting-dot">.</span>
                  </h1>
                  <p>Ask questions about the document you uploaded.</p>
                </div>
                <Button
                  variant="secondary"
                  icon="file"
                  onClick={() => navigate("analysis")}
                >
                  View analysis
                </Button>
              </div>
              <section className="surface chat-surface">
                <div className="chat-document">
                  <span className="file-icon blue">
                    <Icon name="file" size={18} />
                  </span>
                  <div>
                    <b>{selected.name}</b>
                    <span>Sample agreement · 12 clauses</span>
                  </div>
                  <span className="chat-ready">
                    <span />
                    Ready to help
                  </span>
                </div>
                <div className="chat-messages">
                  {messages.length === 0 ? (
                    <div className="chat-empty">
                      <div className="chat-brand-icon">
                        <Icon name="spark" size={29} />
                      </div>
                      <h2>
                        A little question.
                        <br />A lot more clarity.
                      </h2>
                      <p>
                        The fine print doesn’t have to be confusing.
                        <br />
                        What would you like to understand?
                      </p>
                      <div className="suggested-questions">
                        {[
                          "What happens if I resign early?",
                          "When does this contract end?",
                          "Is there an automatic renewal?",
                          "What are my main responsibilities?",
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
                            "PA"
                          )}
                        </span>
                        <div>
                          <span className="message-author">
                            {m.role === "assistant"
                              ? "CLARIQ"
                              : name.split(" ")[0]}
                            {m.role === "assistant" && (
                              <small>AI · SAMPLE</small>
                            )}
                          </span>
                          <p>{m.text}</p>
                          {m.source !== undefined && (
                            <div className="chat-citation">
                              <small>
                                Based on{" "}
                                {(
                                  activeClauses[m.source] ||
                                  clauses[m.source] ||
                                  clauses[0]
                                ).source}
                              </small>
                              <button
                                onClick={() => {
                                  openClause(m.source!)
                                  setOriginal(true)
                                }}
                              >
                                <Icon name="file" size={13} />
                                View source
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
                      placeholder="Ask anything about your contract..."
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
                    Sample AI answers. Always verify the source. Not legal
                    advice.
                  </p>
                </form>
              </section>
            </>
          )}
          {page === "compare" && (
            <>
              <div className="page-heading">
                <div>
                  <span className="greeting-eyebrow">SEE THE DIFFERENCE</span>
                  <h1>
                    Compare Contracts<span className="greeting-dot">.</span>
                  </h1>
                  <p>
                    Two documents. Side by side. Nothing important overlooked.
                  </p>
                </div>
                <Button
                  icon="compare"
                  disabled={compareFiles.some((f) => !f)}
                  onClick={() => {
                    setCompared(true)
                    setToast(
                      "Sample comparison ready. File contents are not processed in this prototype.",
                    )
                  }}
                >
                  Compare contracts
                </Button>
              </div>
              <div className="compare-upload-grid">
                {["Contract A", "Contract B"].map((label, i) => (
                  <label className="surface compare-upload" key={label}>
                    <span className="compare-label">
                      {label}
                      <span>{i ? "REVISED VERSION" : "ORIGINAL VERSION"}</span>
                    </span>
                    <span className={`file-icon ${i ? "mint" : "blue"}`}>
                      <Icon name="file" size={23} />
                    </span>
                    <b>{compareFiles[i] || "Choose a document"}</b>
                    <span className="text-link">
                      {compareFiles[i] ? "Replace document" : "Upload document"}
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
                            setToast("Please select a file smaller than 20 MB.")
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
                    Sample comparison — Differences below are illustrative, not
                    extracted from selected files.
                  </div>
                  <section className="surface compare-table-wrap">
                    <SectionTitle title="The details, side by side">
                      <Badge status="3 differences to review" />
                    </SectionTitle>
                    <div className="table-scroll">
                      <table className="compare-table">
                        <thead>
                          <tr>
                            <th>Category</th>
                            <th>
                              <span className="comparison-dot blue-bg" />
                              Contract A
                            </th>
                            <th>
                              <span className="comparison-dot mint-bg" />
                              Contract B
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            ["Duration", "12 months", "12 months"],
                            [
                              "Payment",
                              "Rp12,000,000 / month",
                              "Rp14,000,000 / month",
                            ],
                            ["Notice Period", "30 days", "60 days"],
                            [
                              "Renewal",
                              "Automatic · 12 months",
                              "Automatic · 12 months",
                            ],
                            [
                              "Termination",
                              "30 days’ written notice",
                              "60 days’ written notice",
                            ],
                            [
                              "Penalty",
                              "One month’s gross salary",
                              "No early termination penalty",
                            ],
                            [
                              "Responsibilities",
                              "Product Designer · 40 hrs/week",
                              "Product Designer · 40 hrs/week",
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
                                {label === "Penalty" && (
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
                    title="Key Differences"
                    subtitle="A quick look at what changed—and why it matters."
                  />
                  <div className="key-differences">
                    {[
                      {
                        icon: "file" as IconName,
                        title: "A higher monthly salary",
                        text: "Contract B offers Rp2,000,000 more per month—a 16.7% increase.",
                        color: "mint",
                      },
                      {
                        icon: "clock" as IconName,
                        title: "More time to give notice",
                        text: "The notice period doubles from 30 to 60 days. Plan ahead if you intend to leave.",
                        color: "amber",
                      },
                      {
                        icon: "shield" as IconName,
                        title: "No early termination penalty",
                        text: "Contract B removes the one-month salary penalty, giving you more flexibility.",
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
                  <h3>Ready for a clearer comparison?</h3>
                  <p>
                    Select “Compare contracts” to view the sample differences.
                  </p>
                </div>
              )}
              <div className="legal-note">
                <Icon name="shield" size={16} />
                Compare the details. For legal decisions, consult a qualified
                professional.
              </div>
            </>
          )}
          {page === "dates" && (
            <>
              <div className="page-heading">
                <div>
                  <span className="greeting-eyebrow">
                    A LITTLE AHEAD OF THE CURVE
                  </span>
                  <h1>
                    Important Dates<span className="greeting-dot">.</span>
                  </h1>
                  <p>No surprises. Just the dates that matter.</p>
                </div>
                <span className="demo-today">
                  <Icon name="calendar" size={16} />
                  Demo date: 12 Nov 2027
                </span>
              </div>
              <div className="dates-page-grid">
                <section className="surface timeline-card">
                  <SectionTitle
                    title="Your contract timeline"
                    subtitle="Upcoming milestones across your agreements."
                  />
                  <div className="timeline-list">
                    {dateItems.map((item, i) => (
                      <div className="timeline-item" key={item.title}>
                        <span className={`date-square ${item.kind}`}>
                          <small>{item.month}</small>
                          <b>{item.day}</b>
                        </span>
                        <div className="timeline-copy">
                          <h3>{item.title}</h3>
                          <button
                            onClick={() =>
                              openContract(initialContracts[i === 1 ? 1 : 0])
                            }
                          >
                            {item.contract}
                            <Icon name="external" size={12} />
                          </button>
                          <span>{item.date}</span>
                        </div>
                        <div className="timeline-actions">
                          <Badge status={item.tag} />
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
                                  ? "Reminder removed for this session."
                                  : "Demo reminder saved. No email or notification will be sent.",
                              )
                            }}
                          >
                            <Icon
                              name={reminders.includes(i) ? "check" : "bell"}
                              size={13}
                            />
                            {reminders.includes(i)
                              ? "Reminder set"
                              : "Set reminder"}
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
                      <b>Contract start date</b>
                      <small>Employment Agreement · 13 January 2027</small>
                    </span>
                    <Badge status="Complete" />
                  </div>
                </section>
                <div>
                  <section className="surface calendar-card">
                    <div className="calendar-header">
                      <h3>
                        {
                          [
                            "January",
                            "February",
                            "March",
                            "April",
                            "May",
                            "June",
                            "July",
                            "August",
                            "September",
                            "October",
                            "November",
                            "December",
                          ][dateMonth]
                        }{" "}
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
                      {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
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
                                    ? "November"
                                    : dateMonth === 11
                                      ? "December"
                                      : "of this month"
                                } 2027: ${
                                  dateMonth === 10 && i === 24
                                    ? "Monthly payment due."
                                    : dateMonth === 10 && i === 29
                                      ? "Freelance notice deadline."
                                      : dateMonth === 11 && i === 11
                                        ? "Employment renewal deadline."
                                        : "No contract milestones."
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
                        Today
                      </span>
                      <span>
                        <i className="mint-bg" />
                        Contract milestone
                      </span>
                    </div>
                  </section>
                  <section className="reminder-tip">
                    <span className="stat-icon blue">
                      <Icon name="bell" size={21} />
                    </span>
                    <h3>A timely nudge.</h3>
                    <p>
                      Set reminders for your important dates and stay a step
                      ahead of your agreements.
                    </p>
                    <span>Reminders are session-only in this prototype.</span>
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
                    MAKE YOURSELF AT HOME
                  </span>
                  <h1>
                    Settings<span className="greeting-dot">.</span>
                  </h1>
                  <p>A workspace that works for you.</p>
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
                      setToast("Pengaturan berhasil disimpan ke backend CLARIQ!")
                    })
                    .catch(() => {
                      setToast("Your preferences have been saved.")
                    })
                }}
              >
                <SectionTitle
                  title="Your profile"
                  subtitle="The basics, all in one place."
                />
                <div className="settings-avatar">
                  <span className="avatar">PA</span>
                  <div>
                    <b>{name}</b>
                    <span>Personal workspace</span>
                  </div>
                </div>
                <div className="form-grid">
                  <label>
                    Full name
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Email address
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
                  title="Notifications"
                  subtitle="Stay informed without the noise."
                />
                <label className="switch-row">
                  <span>
                    <b>Email reminders</b>
                    <small>
                      Get a heads-up before important contract dates. Demo
                      preference only.
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
                    <b>Your plan: CLARIQ {plan}</b>
                    <p>
                      {plan === "Free"
                        ? "2 contract analyses per month. A great place to start."
                        : "More clarity, more possibilities."}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => navigate("pricing")}
                  >
                    Explore plans
                    <Icon name="arrow" size={15} />
                  </Button>
                </div>
                <div className="settings-actions">
                  <span>Changes are saved for this demo session.</span>
                  <Button type="submit">Save changes</Button>
                </div>
              </form>
            </>
          )}
          {page === "pricing" && (
            <>
              <div className="pricing-heading">
                <span className="eyebrow">
                  <span className="blue-dot" />
                  CLARITY FOR EVERY CHAPTER
                </span>
                <h1>
                  Less uncertainty.
                  <br />
                  More possibility.
                </h1>
                <p>Simple plans. Clear value. Choose what works for you.</p>
                <span className="pricing-frequency">
                  Monthly billing <span>No long-term commitment</span>
                </span>
              </div>
              <div className="pricing-grid">
                {[
                  {
                    name: "Free",
                    price: "0",
                    description: "A little clarity to get you started.",
                    features: [
                      "2 contract analyses / month",
                      "Basic AI summaries",
                      "Important dates",
                      "Source-linked explanations",
                    ],
                    cta: "Start for free",
                  },
                  {
                    name: "Plus",
                    price: "9",
                    description: "For the agreements that shape your life.",
                    features: [
                      "20 contract analyses / month",
                      "Detailed risk detection",
                      "Ask Your Contract",
                      "Contract comparison",
                      "Everything in Free",
                    ],
                    cta: "Get more clarity",
                  },
                  {
                    name: "Business",
                    price: "29",
                    description: "Keep your whole team on the same page.",
                    features: [
                      "100 contract analyses / month",
                      "Team workspace",
                      "Up to 5 workspace members",
                      "Contract dashboard",
                      "Advanced document management",
                    ],
                    cta: "Choose Business",
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
                        <Icon name="spark" size={13} />A CLEAR FAVORITE
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
                      <span>/ month</span>
                    </div>
                    <Button
                      variant={item.name === "Plus" ? "primary" : "secondary"}
                      onClick={() => setPlanModal(item.name)}
                    >
                      {plan === item.name ? "Current plan" : item.cta}
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
                <h3>Your trust is part of every plan.</h3>
                <p>
                  AI-assisted document understanding—not legal advice.
                  <br />
                  This is a prototype. Plan selection does not charge you.
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
                    YOUR NEXT CHAPTER. WITH CLARITY.
                  </span>
                  <h1>
                    Understand
                    <br />
                    what you <span>sign.</span>
                  </h1>
                  <p>
                    Turn complex contracts into clear, understandable insights
                    with AI. Less fine-print anxiety. More confidence.
                  </p>
                  <div className="hero-actions">
                    <Button icon="upload" onClick={openUpload}>
                      Analyze a Contract
                    </Button>
                    <a href="#how-it-works" className="btn btn-secondary">
                      See How It Works
                      <Icon name="arrow" size={16} />
                    </a>
                  </div>
                  <div className="landing-trust">
                    <Icon name="shield" size={17} />
                    <span>Made for real life. Not just legal experts.</span>
                  </div>
                </div>
                <div className="landing-upload-card">
                  <div className="landing-art">
                    <DocumentArt />
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
                        ? "Drop it. Find your clarity."
                        : "Drop your contract here"}
                    </h3>
                    <p>
                      or <span>browse files</span> to get started
                    </p>
                    <small>PDF, DOCX, JPG or PNG · Up to 20 MB</small>
                  </button>
                  <span className="upload-privacy">
                    <Icon name="lock" size={12} />
                    Your next step starts with understanding.
                  </span>
                </div>
              </section>
              <div className="landing-audience">
                <span>FOR EVERY AGREEMENT THAT MATTERS</span>
                <div>
                  Everyday life
                  <span />
                  Freelancers
                  <span />
                  Young professionals
                  <span />
                  Small businesses
                </div>
              </div>
              <section id="product" className="landing-section">
                <div className="landing-section-heading">
                  <span className="eyebrow">
                    FROM FINE PRINT TO CLEAR PICTURE
                  </span>
                  <h2>Make sense of what matters.</h2>
                  <p>One document. A whole lot less uncertainty.</p>
                </div>
                <div className="feature-grid">
                  {[
                    {
                      icon: "file" as IconName,
                      title: "Understand",
                      description:
                        "Skip the jargon. Get a clear, plain-language summary of your contract and its important terms.",
                      label: "THE BIG PICTURE",
                    },
                    {
                      icon: "shield" as IconName,
                      title: "Detect Risks",
                      description:
                        "Spot the clauses that deserve a closer look, from hidden penalties to automatic renewals.",
                      label: "NO UNWELCOME SURPRISES",
                    },
                    {
                      icon: "calendar" as IconName,
                      title: "Track Important Dates",
                      description:
                        "Stay ahead of payment dates, notice periods, and renewal deadlines. Never miss what matters.",
                      label: "A STEP AHEAD",
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
                            f.title === "Track Important Dates"
                              ? "dates"
                              : "analysis",
                          )
                        }
                      >
                        Take a closer look
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
                  <span className="eyebrow">SIMPLE BY DESIGN</span>
                  <h2>How CLARIQ works</h2>
                  <p>From upload to understanding. In a few simple steps.</p>
                </div>
                <div className="steps-grid">
                  {[
                    {
                      title: "Upload your contract",
                      text: "Drop in your document. We take it from there.",
                    },
                    {
                      title: "Let CLARIQ analyze it",
                      text: "AI turns the complex into something clear.",
                    },
                    {
                      title: "Understand the details",
                      text: "Explore important clauses, risks, and dates.",
                    },
                    {
                      title: "Make informed decisions",
                      text: "Your agreement. Your next step. Your call.",
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
                <h2>Clarity, with the right boundaries.</h2>
                <p>AI-assisted document understanding — not legal advice.</p>
                <span>
                  CLARIQ helps you understand your document, ask better
                  questions, and feel more prepared.
                  <br />
                  For advice specific to your situation, always consult a
                  qualified legal professional.
                </span>
                <Button onClick={() => navigate("dashboard")}>
                  Find your clarity
                  <Icon name="arrow" size={17} />
                </Button>
              </section>
              <footer className="landing-footer">
                <Logo onClick={() => navigate("landing")} />
                <span>Understand what you sign.</span>
                <span>© 2027 CLARIQ. A clearer way forward.</span>
                <button onClick={() => navigate("pricing")}>
                  Plans & Pricing
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
            <h2 id="upload-title">Your next step starts here.</h2>
            <p className="modal-subtitle">
              Upload a contract. Find a little more clarity.
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
                {uploadFile ? uploadFile.name : "Drop your contract here"}
              </h3>
              <p>
                {uploadFile ? (
                  `${(uploadFile.size / 1024 / 1024).toFixed(2)} MB · Click to replace`
                ) : (
                  <>
                    or <b>browse files</b> to get started
                  </>
                )}
              </p>
              <small>PDF, DOCX, JPG or PNG · Up to 20 MB</small>
            </button>
            {uploadError && (
              <p className="form-error" role="alert">
                {uploadError}
              </p>
            )}
            <div className="upload-demo-note">
              <Icon name="spark" size={16} />
              <p>
                <b>Explore the prototype.</b> Your file stays in this session.
                We’ll show a sample analysis, not process its contents.
              </p>
            </div>
            <Button
              icon="spark"
              className="full-width"
              disabled={!uploadFile}
              onClick={analyzeUpload}
            >
              View sample analysis
              <Icon name="arrow" size={17} />
            </Button>
            <span className="modal-legal">
              <Icon name="shield" size={13} />
              Document understanding. Not legal advice.
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
              <span>CLAUSE EXPLAINED</span>
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
                        currentClause.status === "Needs Attention"
                          ? "coral"
                          : currentClause.status === "Review"
                            ? "amber"
                            : "mint"
                      }`}
                    >
                      <Icon name={clause === 1 ? "warning" : "file"} size={25} />
                    </span>
                    <h2 id="clause-title">{currentClause.title}</h2>
                    <Badge status={currentClause.status} />
                    <div className="explanation-section">
                      <span className="language-tag">
                        PLAIN LANGUAGE · BAHASA INDONESIA
                      </span>
                      <h3>What does this mean?</h3>
                      <p>{currentClause.meaning}</p>
                    </div>
                    <div className="why-card">
                      <span className="why-icon">
                        <Icon name="spark" size={20} />
                      </span>
                      <div>
                        <h3>Why does this matter?</h3>
                        <p>{currentClause.why}</p>
                      </div>
                    </div>
                    <div className="source-section">
                      <h3>Source</h3>
                      <div>
                        <Icon name="file" size={18} />
                        <span>
                          {currentClause.source}
                          <small>{selected.name} · Sample document</small>
                        </span>
                      </div>
                      <Button
                        variant="secondary"
                        icon="external"
                        onClick={() => setOriginal(!original)}
                      >
                        {original ? "Hide Original Clause" : "View Original Clause"}
                      </Button>
                    </div>
                    {original && (
                      <div className="original-viewer">
                        <div>
                          <Icon name="file" size={15} />
                          <span>ORIGINAL DOCUMENT</span>
                          <small>Page {clause + 2} of 8</small>
                        </div>
                        <article>
                          <p className="document-context">
                            EMPLOYMENT AGREEMENT · PT EXAMPLE INDONESIA
                          </p>
                          <h4>{currentClause.source}</h4>
                          <mark>{currentClause.original}</mark>
                          <p className="document-context bottom">
                            The parties acknowledge and agree to the terms set forth
                            in this Agreement.
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
                  <b>Understanding, not legal advice.</b> CLARIQ explains your
                  document. It does not replace advice from a qualified legal
                  professional.
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
              A little more {planModal === "Free" ? "simplicity" : "clarity"}.
            </h2>
            <p>
              You’ve selected CLARIQ <b>{planModal}</b>. This is a demo—no
              payment details are needed, and you won’t be charged.
            </p>
            <div className="plan-demo-card">
              <Icon name="shield" size={20} />
              Plan selection is saved for this session only.
            </div>
            <Button
              className="full-width"
              onClick={() => {
                setPlan(planModal)
                setPlanModal(null)
                setToast(
                  `Welcome to CLARIQ ${planModal}. Your demo plan is selected.`,
                )
                navigate("dashboard")
              }}
            >
              Continue with {planModal}
              <Icon name="arrow" size={17} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
