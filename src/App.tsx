import { useState, useEffect } from "react"

// --- Types ---

type Declaration = {
  id: string
  clientName: string
  type: "D300" | "D390" | "SAF-T"
  deadline: string
  submitted: boolean
}

type FormDataType = {
  clientName: string
  type: string
  deadline: string
}

type FormErrors = Partial<Record<keyof FormDataType, string>>

// --- Constants ---

const InitialData: FormDataType = {
  clientName: "",
  type: "",
  deadline: ""
}

const mockDeclarations: Declaration[] = [
  { id: "1", clientName: "Contabilitate SRL", type: "D300", deadline: "2026-01-25", submitted: true },
  { id: "2", clientName: "Audit Expert SRL", type: "SAF-T", deadline: "2026-01-31", submitted: false },
  { id: "3", clientName: "Taxe & Co SRL", type: "D390", deadline: "2026-01-25", submitted: false },
  { id: "4", clientName: "Contabilitate SRL", type: "SAF-T", deadline: "2026-01-31", submitted: true },
  { id: "5", clientName: "Expert Cont SRL", type: "D300", deadline: "2025-12-25", submitted: false },
  { id: "6", clientName: "Fiscalitate SRL", type: "D390", deadline: "2025-11-30", submitted: false },
]

const mockFetch = (): Promise<Declaration[]> =>
  new Promise((resolve) =>
    setTimeout(() => resolve(mockDeclarations), 1500)
  )

// --- Helpers ---

const isOverdue = (deadline: string) => new Date(deadline) < new Date()

// --- Lesson 2: ClientCard ---

type ClientCardProps = {
  name: string
  cui: string
  isActive: boolean
  accountantName?: string
}

const ClientCard = ({ name, cui, isActive, accountantName }: ClientCardProps) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>{cui}</p>
      {isActive ? <p>Active</p> : <p>Inactive</p>}
      {accountantName && <p>{accountantName}</p>}
    </div>
  )
}

// --- Lesson 3: DeclarationCard + DeclarationList ---

type DeclarationProp = {
  clientName: string
  type: "D300" | "D390" | "SAF-T"
  deadline: string
}

const DeclarationCard = ({ clientName, type, deadline }: DeclarationProp) => {
  return (
    <div>
      <p>{clientName}</p>
      <p>{type}</p>
      <p>{deadline}</p>
    </div>
  )
}

const DeclarationList = ({ declarations }: { declarations: Declaration[] }) => {
  const pending = declarations.filter((d) => !d.submitted)

  if (pending.length === 0) return <p>No pending declarations</p>

  return (
    <div>
      {pending.map((d) => (
        <DeclarationCard
          key={d.id}
          clientName={d.clientName}
          type={d.type}
          deadline={d.deadline}
        />
      ))}
    </div>
  )
}

// --- Lesson 4: DeadlineAlert ---

type DeadlineAlertProps = {
  isLoading: boolean
  error: string | null
  declarations: Declaration[]
}

const DeadlineAlert = ({ isLoading, error, declarations }: DeadlineAlertProps) => {
  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  const overdue = declarations.filter((d) => !d.submitted && isOverdue(d.deadline))

  if (overdue.length === 0) return <p>No overdue declarations</p>

  return (
    <div>
      <ul>
        {overdue.map((d) => (
          <li key={d.id}>{d.clientName}, {d.deadline}</li>
        ))}
      </ul>
    </div>
  )
}

// --- Lesson 6+7: DeclarationFilter ---

type DeclarationFilterState = {
  type: "all" | "D300" | "D390" | "SAF-T"
  showOverdueOnly: boolean
}

const DeclarationFilter = ({ declarations }: { declarations: Declaration[] }) => {
  const [filter, setFilter] = useState<DeclarationFilterState>({
    type: "all",
    showOverdueOnly: false
  })

  const filtered = declarations
    .filter((d) => filter.type === "all" || d.type === filter.type)
    .filter((d) => !filter.showOverdueOnly || (!d.submitted && isOverdue(d.deadline)))

  return (
    <div>
      <button type="button" onClick={() => setFilter({ type: "all", showOverdueOnly: false })}>Clear</button>
      <button type="button" onClick={() => setFilter({ ...filter, type: "all" })}>All</button>
      <button type="button" onClick={() => setFilter({ ...filter, type: "D300" })}>D300</button>
      <button type="button" onClick={() => setFilter({ ...filter, type: "D390" })}>D390</button>
      <button type="button" onClick={() => setFilter({ ...filter, type: "SAF-T" })}>SAF-T</button>
      <button type="button" onClick={() => setFilter({ ...filter, showOverdueOnly: !filter.showOverdueOnly })}>
        {filter.showOverdueOnly ? "Show all" : "Show overdue only"}
      </button>
      <ul>
        {filtered.map((d) => (
          <li key={d.id}>{d.clientName} — {d.type} — {d.deadline}</li>
        ))}
      </ul>
    </div>
  )
}

// --- Lesson 7: ClientSearch ---

const ClientSearch = ({ declarations }: { declarations: Declaration[] }) => {
  const [query, setQuery] = useState("")
  const [type, setType] = useState<"all" | "D300" | "D390" | "SAF-T">("all")

  const handleClearAll = () => {
    setQuery("")
    setType("all")
  }

  const filtered = declarations
    .filter((d) => type === "all" || d.type === type)
    .filter((d) => d.clientName.toLowerCase().includes(query.toLowerCase()))

  return (
    <div>
      <button type="button" onClick={handleClearAll}>Clear</button>
      <select value={type} onChange={(e) => setType(e.target.value as "all" | "D300" | "D390" | "SAF-T")}>
        <option value="all">All types</option>
        <option value="D300">D300</option>
        <option value="D390">D390</option>
        <option value="SAF-T">SAF-T</option>
      </select>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search clients..."
      />
      <p>{filtered.length > 0 ? `Found ${filtered.length} declarations` : "No declarations found."}</p>
      <ul>
        {filtered.map((d) => (
          <li key={d.id}>{d.clientName} — {d.type} — {d.deadline}</li>
        ))}
      </ul>
    </div>
  )
}

// --- Lesson 8: AddDeclarationForm ---

const AddDeclarationForm = () => {
  const [form, setForm] = useState<FormDataType>(InitialData)
  const [errors, setErrors] = useState<FormErrors>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const validate = (): FormErrors => {
    const errs: FormErrors = {}
    if (!form.clientName.trim()) errs.clientName = "Name is required"
    if (!form.type.trim()) errs.type = "Type is required"
    if (!form.deadline.trim()) errs.deadline = "Deadline is required"
    else if (new Date(form.deadline) < new Date()) errs.deadline = "Deadline cannot be in the past"
    return errs
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    console.log("Submitted:", form)
    setForm(InitialData)
    setErrors({})
  }

  const handleReset = () => {
    setForm(InitialData)
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input name="clientName" value={form.clientName} onChange={handleChange} placeholder="Client name" />
        {errors.clientName && <p>{errors.clientName}</p>}
      </div>
      <div>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="">Select type...</option>
          <option value="D300">D300</option>
          <option value="D390">D390</option>
          <option value="SAF-T">SAF-T</option>
        </select>
        {errors.type && <p>{errors.type}</p>}
      </div>
      <div>
        <input type="date" name="deadline" value={form.deadline} onChange={handleChange} />
        {errors.deadline && <p>{errors.deadline}</p>}
      </div>
      <button type="button" onClick={handleReset}>Reset</button>
      <button type="submit">Submit</button>
    </form>
  )
}

// --- Lesson 9: DeclarationDashboard ---


const DeclarationDashboard = () => {
  const [declarations, setDeclarations] = useState<Declaration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const fetchDec = async () => {
      setIsLoading(true)
      const dec = await mockFetch()
      setDeclarations(dec)
    }
    fetchDec()
  }, [refreshKey])

  return (
    <div>
      <button type="button" onClick={() => setRefreshKey((prev) => prev + 1)}>
        Refresh
      </button>

      {isLoading
        ? <p>Loading declarations...</p>
        : <>
            <p>Loaded {declarations.length} declarations</p>
            <ul>
              {declarations.map((d) => (
                <li key={d.id}>{d.clientName} — {d.type}</li>
              ))}
            </ul>
          </>
      }
    </div>
  )
}

// --- Lesson 10: useDeclarations and DeclarationsDashboard ---
const useDeclarations = () => {
  const [declarations, setDeclarations] = useState<Declaration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        const result = await mockFetch()
        setDeclarations(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [refreshKey])

  const refresh = () => setRefreshKey((prev) => prev + 1)

  return { declarations, isLoading, error, refresh }
}

const DeclarationsDashboard = () => {
  const { declarations, isLoading, error, refresh } = useDeclarations()

  const renderContent = () => {
    if (isLoading) return <p>Loading declarations...</p>
    if (error) return <p>Error: {error}</p>
    return (
      <div>
        <button type="button" onClick={refresh}>Refresh</button>
        <p>Loaded {declarations.length} declarations</p>
        <ul>
          {declarations.map((d) => (
            <li key={d.id}>{d.clientName} — {d.type}</li>
          ))}
        </ul>
      </div>
    )
  }

  return <div>{renderContent()}</div>
}

// --- Lesson 11: Panel component and Moded App ---

type PanelProps = {
  title: string
  children: React.ReactNode
  collapsible?: boolean
}

const Panel = ({title, children, collapsible = false} : PanelProps) => {
  const [collapsed, setCollapse] = useState(false)

  return (
    <div>
      <div>
        <h3>{title}</h3>
        {collapsible && (
          <button type="button" onClick={() => setCollapse((prev) => !prev)}>
            {collapsed ? "Expand" : "Collapse"}
          </button>
        )}
      </div>
      {!collapsed && <div>{children}</div>}
    </div>
  )
}

// --- Lesson 12: DeclarationPage ---

type DeclarationType = "all" | "D300" | "D390" | "SAF-T"

const DeclarationPage = () => {
  const [type, setType] = useState<DeclarationType>("all")
  const [query, setQuery] = useState("")


  return(
    <div>
      <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search clients...">
      
      </input>
      <ChildDeclarationFilter type={type} onTypeChange={setType}/>
      <ChildDeclarationList type={type} query={query}/>
    </div>
  )
}

type ChildDeclarationListProps = {
  type: DeclarationType,
  query: string
}

const ChildDeclarationList = ({type, query} : ChildDeclarationListProps) => {
  const filtered = mockDeclarations
  .filter((d) => d.type === type || type === "all")
  .filter((d) => d.clientName.toLowerCase().startsWith(query.toLowerCase()))
  return (
    <ul>
      {filtered.map((d) => 
      <li key={d.id}>{d.clientName} {d.type} {d.deadline} {d.submitted}</li>)}
    </ul>
  )
}

type ChildDeclarationFilterProps = {
  type: DeclarationType,
  onTypeChange: (type: DeclarationType) => void
}

const ChildDeclarationFilter = ({type, onTypeChange} : ChildDeclarationFilterProps) => {
  return (
    <div>
      <select value={type} onChange={(e) => onTypeChange(e.target.value as DeclarationType)}>
        <option value="all">All</option>
        <option value="SAF-T">SAF-T</option>
        <option value="D300">D300</option>
        <option value="D390">D390</option>
      </select>
    </div>
  )
}

// --- App ---

const App = () => {
  return (
    <div>
      <h1>MBCRM Practice</h1>

      <h2>Lesson 2 — ClientCard</h2>
      <ClientCard name="Contabilitate SRL" cui="RO12345678" isActive={true} />
      <ClientCard name="Audit Expert SRL" cui="RO87654321" isActive={false} accountantName="Ion Popescu" />

      <h2>Lesson 3 — DeclarationList</h2>
      <DeclarationList declarations={mockDeclarations} />

      <h2>Lesson 4 — DeadlineAlert</h2>
      <DeadlineAlert isLoading={false} error={null} declarations={mockDeclarations} />

      <h2>Lesson 6+7 — DeclarationFilter</h2>
      <DeclarationFilter declarations={mockDeclarations} />

      <h2>Lesson 7 — ClientSearch</h2>
      <ClientSearch declarations={mockDeclarations} />

      <h2>Lesson 8 — AddDeclarationForm</h2>
      <AddDeclarationForm />

      <h2>Lesson 9 — DeclarationDashboard</h2>
      <DeclarationDashboard/>

      <h2>Lesson 10 — useDeclarations and DeclarationDashboard</h2>
      <DeclarationsDashboard/>

      <h2>Lesson 11 — Panels</h2>
      <Panel title="Declarations" collapsible>
        <DeclarationsDashboard />
      </Panel>

      <Panel title="Search">
        <ClientSearch declarations={mockDeclarations} />
      </Panel>

      <Panel title="Add Declaration" collapsible>
        <AddDeclarationForm />
      </Panel>

      <h2>Lesson 12 — DeclarationPage</h2>
      <DeclarationPage/>

    </div>
  )
}

export default App