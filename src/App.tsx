import { useState } from "react"

// =============================================================================
// TYPES
// =============================================================================

type Declaration = {
  id: string
  clientName: string
  clientId: string
  type: "D300" | "D390" | "SAF-T"
  deadline: string
  submitted: boolean
}

type Client = {
  id: string
  name: string
  cui: string
  email: string
  isActive: boolean
}

// =============================================================================
// MOCK DATA
// =============================================================================

const mockClients: Client[] = [
  { id: "1", name: "Contabilitate SRL", cui: "RO12345678", email: "contact@contabilitate.ro", isActive: true },
  { id: "2", name: "Audit Expert SRL", cui: "RO87654321", email: "office@auditexpert.ro", isActive: true },
  { id: "3", name: "Taxe & Co SRL", cui: "RO11111111", email: "taxe@taxeco.ro", isActive: false },
  { id: "4", name: "Expert Cont SRL", cui: "RO22222222", email: "info@expertcont.ro", isActive: true },
  { id: "5", name: "Fiscalitate SRL", cui: "RO33333333", email: "contact@fiscalitate.ro", isActive: true },
]

const mockDeclarations: Declaration[] = [
  { id: "1", clientId: "1", clientName: "Contabilitate SRL", type: "D300", deadline: "2026-01-25", submitted: true },
  { id: "2", clientId: "2", clientName: "Audit Expert SRL", type: "SAF-T", deadline: "2026-01-31", submitted: false },
  { id: "3", clientId: "3", clientName: "Taxe & Co SRL", type: "D390", deadline: "2026-01-25", submitted: false },
  { id: "4", clientId: "1", clientName: "Contabilitate SRL", type: "SAF-T", deadline: "2026-01-31", submitted: true },
  { id: "5", clientId: "4", clientName: "Expert Cont SRL", type: "D300", deadline: "2025-12-25", submitted: false },
  { id: "6", clientId: "5", clientName: "Fiscalitate SRL", type: "D390", deadline: "2025-11-30", submitted: false },
  { id: "7", clientId: "2", clientName: "Audit Expert SRL", type: "D300", deadline: "2026-02-25", submitted: false },
  { id: "8", clientId: "4", clientName: "Expert Cont SRL", type: "D390", deadline: "2026-02-28", submitted: true },
]

// =============================================================================
// HELPERS
// =============================================================================

const isOverdue = (deadline: string) => new Date(deadline) < new Date()

// =============================================================================
// PAGES — each will become its own file in lesson/react-router
// =============================================================================

// Dashboard page — summary stats
const DashboardPage = () => {
  const totalClients = mockClients.length
  const activeClients = mockClients.filter((c) => c.isActive).length
  const pendingDeclarations = mockDeclarations.filter((d) => !d.submitted).length
  const overdueDeclarations = mockDeclarations.filter((d) => !d.submitted && isOverdue(d.deadline)).length

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Total clients: {totalClients}</p>
      <p>Active clients: {activeClients}</p>
      <p>Pending declarations: {pendingDeclarations}</p>
      <p>Overdue declarations: {overdueDeclarations}</p>
    </div>
  )
}

// Clients list page
const ClientsPage = () => {
  const [query, setQuery] = useState("")

  const filtered = mockClients.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div>
      <h2>Clients</h2>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search clients..."
      />
      <ul>
        {filtered.map((c) => (
          <li key={c.id}>
            {c.name} — {c.cui} — {c.isActive ? "Active" : "Inactive"}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Client detail page — will receive id from URL params in lesson 19
const ClientDetailPage = ({ clientId }: { clientId: string }) => {
  const client = mockClients.find((c) => c.id === clientId)
  const clientDeclarations = mockDeclarations.filter((d) => d.clientId === clientId)

  if (!client) return <p>Client not found</p>

  return (
    <div>
      <h2>{client.name}</h2>
      <p>CUI: {client.cui}</p>
      <p>Email: {client.email}</p>
      <p>Status: {client.isActive ? "Active" : "Inactive"}</p>
      <h3>Declarations</h3>
      {clientDeclarations.length === 0
        ? <p>No declarations found</p>
        : (
          <ul>
            {clientDeclarations.map((d) => (
              <li key={d.id}>
                {d.type} — {d.deadline} — {d.submitted ? "Submitted" : "Pending"}
              </li>
            ))}
          </ul>
        )
      }
    </div>
  )
}

// Declarations list page
const DeclarationsPage = () => {
  const [type, setType] = useState<"all" | "D300" | "D390" | "SAF-T">("all")

  const filtered = mockDeclarations.filter(
    (d) => type === "all" || d.type === type
  )

  return (
    <div>
      <h2>Declarations</h2>
      <select
        value={type}
        onChange={(e) => setType(e.target.value as "all" | "D300" | "D390" | "SAF-T")}
      >
        <option value="all">All types</option>
        <option value="D300">D300</option>
        <option value="D390">D390</option>
        <option value="SAF-T">SAF-T</option>
      </select>
      <ul>
        {filtered.map((d) => (
          <li key={d.id}>
            {d.clientName} — {d.type} — {d.deadline} — {d.submitted ? "Submitted" : "Pending"}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Add declaration page — will use useNavigate to redirect on submit in lesson 21
const NewDeclarationPage = () => {
  const [form, setForm] = useState({
    clientId: "",
    type: "" as "D300" | "D390" | "SAF-T" | "",
    deadline: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("New declaration:", form)
    // will redirect to /declarations after submit in lesson 21
  }

  return (
    <div>
      <h2>New Declaration</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <select name="clientId" value={form.clientId} onChange={handleChange}>
            <option value="">Select client...</option>
            {mockClients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="">Select type...</option>
            <option value="D300">D300</option>
            <option value="D390">D390</option>
            <option value="SAF-T">SAF-T</option>
          </select>
        </div>
        <div>
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
        <button type="button" onClick={() => console.log("cancelled")}>
          Cancel
        </button>
      </form>
    </div>
  )
}

// =============================================================================
// TEMPORARY NAVIGATION — will be replaced by React Router in lesson 18
// =============================================================================

type Page = "dashboard" | "clients" | "declarations" | "new-declaration"

const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard")
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)

  const renderPage = () => {
    if (selectedClientId) {
      return (
        <ClientDetailPage clientId={selectedClientId} />
      )
    }

    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />
      case "clients":
        return <ClientsPage />
      case "declarations":
        return <DeclarationsPage />
      case "new-declaration":
        return <NewDeclarationPage />
    }
  }

  return (
    <div>
      {/* Temporary nav — will become <Link> components in lesson 18 */}
      <nav>
        <button
          type="button"
          onClick={() => { setCurrentPage("dashboard"); setSelectedClientId(null) }}
        >
          Dashboard
        </button>
        <button
          type="button"
          onClick={() => { setCurrentPage("clients"); setSelectedClientId(null) }}
        >
          Clients
        </button>
        <button
          type="button"
          onClick={() => { setCurrentPage("declarations"); setSelectedClientId(null) }}
        >
          Declarations
        </button>
        <button
          type="button"
          onClick={() => { setCurrentPage("new-declaration"); setSelectedClientId(null) }}
        >
          New Declaration
        </button>
        {selectedClientId && (
          <button type="button" onClick={() => setSelectedClientId(null)}>
            Back to Clients
          </button>
        )}
      </nav>

      <hr />

      {/* Temporary client selection — will become /clients/:id in lesson 19 */}
      {currentPage === "clients" && !selectedClientId && (
        <div>
          <p>Click a client to view details:</p>
          {mockClients.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedClientId(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      <main>
        {renderPage()}
      </main>
    </div>
  )
}

export default App