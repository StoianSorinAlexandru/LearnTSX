import { useState, useEffect, createContext, useContext, useMemo, useCallback } from "react"

// =============================================================================
// SHARED TYPES
// =============================================================================

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

// =============================================================================
// SHARED CONSTANTS & HELPERS
// =============================================================================

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

const isOverdue = (deadline: string) => new Date(deadline) < new Date()

// =============================================================================
// LESSON 2 — Components & Props
// =============================================================================
//
// REQUIREMENTS:
//   1. Accept props: name (string), cui (string), isActive (boolean),
//      accountantName (optional string)
//   2. Render name in <h2>
//   3. Render cui in <p>
//   4. Render "Active" or "Inactive" depending on isActive
//   5. If accountantName is provided render it in <p>, otherwise render nothing
//
// CORRECTIONS FROM YOUR SUBMISSION:
//   - Use ternary for isActive instead of two separate && expressions
//   - Use <p> not <h1> for status (h1 is a page-level heading, only one per page)
//   - Remove quotes from "Active" — text inside JSX tags is already a string
// =============================================================================

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

// =============================================================================
// LESSON 3 — Rendering Lists
// =============================================================================
//
// REQUIREMENTS:
//   1. Render only unsubmitted declarations
//   2. For each one render a <div> with clientName, type, deadline
//   3. Use correct key props
//   4. Show <p>No pending declarations</p> if filtered list is empty
//
// CORRECTIONS FROM YOUR SUBMISSION:
//   - Props must be an object: ({ declarations }) not (declarations: Declaration[])
//   - .filter() with curly braces needs explicit return — or drop braces for implicit return
//   - Missing key on <li> elements inside .map()
// =============================================================================

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

// =============================================================================
// LESSON 4 — Conditional Rendering
// =============================================================================
//
// REQUIREMENTS:
//   1. Return <p>Loading...</p> if isLoading is true
//   2. Return <p>Error: {error}</p> if error is not null
//   3. Filter declarations where submitted=false AND deadline is before today
//   4. If none are overdue render <p>No overdue declarations</p>
//   5. Otherwise render <ul> with <li> showing clientName and deadline
//
// CORRECTIONS FROM YOUR SUBMISSION:
//   - CheckDate should be camelCase (isOverdue) — PascalCase is for components only
//   - return new Date(d) < new Date() ? true : false is redundant — just return the expression
//   - Missing key on <li> elements
// =============================================================================

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

// =============================================================================
// LESSON 6 — useState (object state)
// LESSON 7 — Event Handling
// =============================================================================
//
// REQUIREMENTS:
//   1. State variable filter of type "all"|"D300"|"D390"|"SAF-T" starting as "all"
//   2. State variable showOverdueOnly boolean starting as false
//   3. Buttons for All, D300, SAF-T that update filter
//   4. Toggle button switching showOverdueOnly, label describes what clicking will DO
//   5. Filters mockDeclarations by both state variables, renders as list
//
// CORRECTIONS FROM YOUR SUBMISSION:
//   - D300 and D390 button labels were swapped (label must match value)
//   - Overdue filter used || instead of && — must be BOTH unsubmitted AND past deadline
//   - Toggle button label was inverted — button should say what clicking WILL do
//   - Missing key on <li> — every .map() needs a key on outermost element
// =============================================================================

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

// =============================================================================
// LESSON 7 — Event Handling (ClientSearch)
// =============================================================================
//
// REQUIREMENTS:
//   1. Text input filtering mockDeclarations by clientName as you type
//   2. Select dropdown to filter by type ("all", "D300", "D390", "SAF-T")
//   3. Show count of results: "3 declarations found"
//   4. Render filtered results as list showing clientName, type, deadline
//   5. Clear button resets both input and dropdown to defaults
//
// CORRECTIONS FROM YOUR SUBMISSION:
//   - useState<"all"|"D300"|"D390"|"SAF-T">("all") — type must be explicit, not inferred as string
//   - handleClearAll passed as onClick={() => handleClearAll()} — pass reference directly: onClick={handleClearAll}
//   - Missing key on <li> elements
// =============================================================================

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

// =============================================================================
// LESSON 8 — Controlled Inputs & Forms
// =============================================================================
//
// REQUIREMENTS:
//   1. Fields for clientName (text), type (select), deadline (date input)
//   2. All fields in a single form state object
//   3. Validate on submit: clientName not empty, deadline not empty, deadline not in past
//   4. Show error messages below each invalid field
//   5. On success console.log form data and reset form
//   6. Reset button clears form and errors
//
// CORRECTIONS FROM YOUR SUBMISSION:
//   - Reset button needs type="button" — buttons inside forms default to type="submit"
//   - Select needs an empty default option so type validation can trigger
//   - Missing deadline past-date validation (else if new Date(form.deadline) < new Date())
//   - Missing form reset after successful submit (setForm(InitialData) + setErrors({}))
//   - React.FormEvent is deprecated — use React.SyntheticEvent<HTMLFormElement> instead
// =============================================================================

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

// =============================================================================
// LESSON 9 — useEffect & Data Fetching
// =============================================================================
//
// REQUIREMENTS:
//   1. On mount fetch declarations using mockFetch (simulates 1500ms delay)
//   2. While loading show <p>Loading declarations...</p>
//   3. Store result in state, render each as <li> with clientName and type
//   4. Refresh button re-triggers the fetch (hint: refreshKey state variable)
//   5. Show count: "Loaded 6 declarations"
//
// CORRECTIONS FROM YOUR SUBMISSION:
//   - Used decs.length > 0 to detect loading — wrong, empty result would show Loading forever
//   - Use dedicated isLoading state variable instead
//   - useState<Declaration[] | null>(null) adds unnecessary complexity — start with []
//   - setRefreshKey(refreshKey + 1) — use functional update: setRefreshKey((prev) => prev + 1)
//   - Missing "Loaded N declarations" count
// =============================================================================

const DeclarationDashboard = () => {
  const [declarations, setDeclarations] = useState<Declaration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const fetchDec = async () => {
      setIsLoading(true)
      const dec = await mockFetch()
      setDeclarations(dec)
      setIsLoading(false)
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

// =============================================================================
// LESSON 10 — Custom Hooks
// =============================================================================
//
// REQUIREMENTS:
//   Part A — useDeclarations hook:
//     1. Fetch declarations using mockFetch on mount
//     2. Expose declarations, isLoading, error and refresh function
//     3. Handle errors with try/catch
//   Part B — DeclarationsDashboard component:
//     1. Uses useDeclarations — zero useState or useEffect in the component
//     2. Shows loading and error states
//     3. Shows "Loaded N declarations"
//     4. Renders each as <li> with clientName and type
//     5. Refresh button calls refresh from the hook
//
// CORRECTIONS FROM YOUR SUBMISSION:
//   - setIsLoading(false) called in both try and finally — finally already covers both cases
//   - useState<Declaration[] | null>(null) — use [] to avoid null checks
//   - Nested ternaries hard to read — extract to renderContent() function
//   - declarations ? declarations : [] — unnecessary with [] initial state
//   - Missing "Loaded N declarations" count
// =============================================================================

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

// =============================================================================
// LESSON 11 — Component Composition & children
// =============================================================================
//
// REQUIREMENTS:
//   Part A — Panel component:
//     1. Accepts title (string), children (ReactNode), collapsible (optional boolean, default false)
//     2. Renders title and children below
//     3. If collapsible shows toggle button that hides/shows children
//     4. Button says "Collapse" when expanded, "Expand" when collapsed
//   Part B — Use Panel in App to wrap at least 3 existing components
//
// CORRECTIONS FROM YOUR SUBMISSION:
//   - Button label and visibility were both inverted
//   - collapsed=false means OPEN → show children → button says "Collapse"
//   - collapsed=true means CLOSED → hide children → button says "Expand"
//   - {!collapsed ? "Expand" : "Collapse"} should be {collapsed ? "Expand" : "Collapse"}
//   - {collapsed && children} should be {!collapsed && children}
// =============================================================================

type PanelProps = {
  title: string
  children: React.ReactNode
  collapsible?: boolean
}

const Panel = ({ title, children, collapsible = false }: PanelProps) => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div>
      <div>
        <h3>{title}</h3>
        {collapsible && (
          <button type="button" onClick={() => setCollapsed((prev) => !prev)}>
            {collapsed ? "Expand" : "Collapse"}
          </button>
        )}
      </div>
      {!collapsed && <div>{children}</div>}
    </div>
  )
}

// =============================================================================
// LESSON 12 — Lifting State Up
// =============================================================================
//
// REQUIREMENTS:
//   DeclarationTypeFilter — receives type and onTypeChange, renders select only
//   FilteredDeclarationList — receives type and query, renders filtered results
//   DeclarationPage — owns ALL state:
//     1. type state starting as "all"
//     2. query state starting as ""
//     3. Renders search input controlling query
//     4. Renders DeclarationTypeFilter passing type and onTypeChange
//     5. Renders FilteredDeclarationList passing type and query
//     6. Neither child has any useState calls
//
// CORRECTIONS FROM YOUR SUBMISSION:
//   - Input used old-style closing tag <input></input> — use self-closing <input />
//   - Repeated "all"|"D300"|"D390"|"SAF-T" three times — extract as DeclarationType alias
//   - submitted rendered as true/false boolean — use ternary: submitted ? "Submitted" : "Pending"
// =============================================================================

type DeclarationType = "all" | "D300" | "D390" | "SAF-T"

const DeclarationPage = () => {
  const [type, setType] = useState<DeclarationType>("all")
  const [query, setQuery] = useState("")

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search clients..."
      />
      <ChildDeclarationFilter type={type} onTypeChange={setType} />
      <ChildDeclarationList type={type} query={query} />
    </div>
  )
}

type ChildDeclarationListProps = {
  type: DeclarationType
  query: string
}

const ChildDeclarationList = ({ type, query }: ChildDeclarationListProps) => {
  const filtered = mockDeclarations
    .filter((d) => d.type === type || type === "all")
    .filter((d) => d.clientName.toLowerCase().startsWith(query.toLowerCase()))

  return (
    <ul>
      {filtered.map((d) => (
        <li key={d.id}>{d.clientName} — {d.type} — {d.deadline} — {d.submitted ? "Submitted" : "Pending"}</li>
      ))}
    </ul>
  )
}

type ChildDeclarationFilterProps = {
  type: DeclarationType
  onTypeChange: (type: DeclarationType) => void
}

const ChildDeclarationFilter = ({ type, onTypeChange }: ChildDeclarationFilterProps) => {
  return (
    <select value={type} onChange={(e) => onTypeChange(e.target.value as DeclarationType)}>
      <option value="all">All</option>
      <option value="D300">D300</option>
      <option value="D390">D390</option>
      <option value="SAF-T">SAF-T</option>
    </select>
  )
}

// =============================================================================
// LESSON 13 — Context API
// =============================================================================
//
// REQUIREMENTS:
//   ClientContext + ClientProvider:
//     1. Stores selectedClient of type Client | null
//     2. Exposes selectClient function
//     3. Wraps children in provider
//   useClientContext hook:
//     1. Calls useContext, throws if used outside provider
//   ClientSelector — uses useClientContext, no props, renders clients, clicking selects
//   ClientDeclarationView — uses useClientContext, no props, shows selected client's declarations
//   ClientPage — wraps in ClientProvider, renders both side by side with flexbox
//
// CORRECTIONS FROM YOUR SUBMISSION:
//   - mockClients defined before Client type — types should be defined first
//   - Missing key on mapped <div> in ClientSelector
//   - submitted rendered as boolean — use ternary
// =============================================================================

type Client = {
  id: string
  name: string
}

type ClientContextType = {
  selectedClient: Client | null
  selectClient: (client: Client | null) => void
}

const ClientContext = createContext<ClientContextType | null>(null)

const useClientContext = () => {
  const ctx = useContext(ClientContext)
  if (!ctx) throw new Error("useClientContext must be inside ClientContext.Provider")
  return ctx
}

const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  return (
    <ClientContext.Provider value={{ selectedClient, selectClient: setSelectedClient }}>
      {children}
    </ClientContext.Provider>
  )
}

const mockClients: Client[] = [
  { id: "1", name: "Contabilitate SRL" },
  { id: "2", name: "Audit Expert SRL" },
  { id: "3", name: "Taxe & Co SRL" },
]

const ClientSelector = () => {
  const { selectedClient, selectClient } = useClientContext()

  return (
    <div>
      <button type="button" onClick={() => selectClient(null)}>Clear</button>
      {mockClients.map((c) => (
        <div key={c.id} onClick={() => selectClient(c)}>
          <p>{selectedClient?.id === c.id && "→ "}{c.name}</p>
        </div>
      ))}
    </div>
  )
}

const ClientDeclarationView = () => {
  const { selectedClient } = useClientContext()

  const clientDecs = mockDeclarations.filter(
    (d) => d.clientName.toLowerCase() === selectedClient?.name.toLowerCase()
  )

  if (!selectedClient) return <p>Select a client</p>

  return (
    <div>
      <h3>{selectedClient.name}</h3>
      <ul>
        {clientDecs.map((d) => (
          <li key={d.id}>
            {d.type} — {d.deadline} — {d.submitted ? "Submitted" : "Pending"}
          </li>
        ))}
      </ul>
    </div>
  )
}

const ClientPage = () => {
  return (
    <ClientProvider>
      <div style={{ display: "flex", gap: "24px" }}>
        <ClientSelector />
        <ClientDeclarationView />
      </div>
    </ClientProvider>
  )
}

// =============================================================================
// LESSON 14 — Generics in Components
// =============================================================================
//
// REQUIREMENTS:
//   Part A — Generic List component:
//     1. Accepts items: T[] where T extends { id: string }
//     2. Accepts renderItem: (item: T) => React.ReactNode
//     3. Uses item.id as key automatically
//     4. Optional emptyMessage shown when items is empty
//     5. Optional onClickFunction that disables click when not provided
//   Part B — Generic useFilter hook:
//     1. Accepts items: T[] and predicate: (item: T) => boolean
//     2. Returns filtered array (memoized with useMemo)
//     3. Used twice with different types in one component
//
// CORRECTIONS FROM YOUR SUBMISSION:
//   - items.length check for empty was missing (used !items which is always false for arrays)
//   - Predicate functions recreated every render — wrap in useCallback so useMemo works correctly
//   - Typo "filterd" in return value
//   - ListProps<T> constraint should match component: T extends { id: string }
// =============================================================================

type ListProps<T extends { id: string }> = {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  emptyMessage?: string
  onClickFunction?: (item: T) => void
}

const List = <T extends { id: string },>({
  items,
  renderItem,
  emptyMessage = "No items",
  onClickFunction
}: ListProps<T>) => {
  return (
    <ul>
      {items.length === 0 && <p>{emptyMessage}</p>}
      {items.map((i) => (
        <li
          key={i.id}
          onClick={onClickFunction ? () => onClickFunction(i) : undefined}
          style={{ cursor: onClickFunction ? "pointer" : "default" }}
        >
          {renderItem(i)}
        </li>
      ))}
    </ul>
  )
}

const useFilter = <T,>(items: T[], predicate: (item: T) => boolean) => {
  const filtered = useMemo(
    () => items.filter(predicate),
    [items, predicate]
  )
  return { filtered }
}

const GenericExample = () => {
  const [query, setQuery] = useState("")
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  const clientName = selectedClient?.name ?? ""

  const clientPredicate = useCallback(
    (client: Client) => client.name.toLowerCase().startsWith(query.toLowerCase()),
    [query]
  )

  const declarationPredicate = useCallback(
    (declaration: Declaration) => declaration.clientName.toLowerCase().startsWith(clientName.toLowerCase()),
    [clientName]
  )

  const { filtered: myClients } = useFilter(mockClients, clientPredicate)
  const { filtered: myDecs } = useFilter(mockDeclarations, declarationPredicate)

  const handleClearAll = () => {
    setSelectedClient(null)
    setQuery("")
  }

  return (
    <div>
      <button type="button" onClick={handleClearAll}>Clear All</button>
      <h3>Client List</h3>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search clients..."
      />
      <List
        items={myClients}
        renderItem={(c) => <p>{c.name}</p>}
        onClickFunction={setSelectedClient}
        emptyMessage="No clients found"
      />
      <h3>Declarations for {selectedClient?.name ?? "all clients"}</h3>
      <List
        items={myDecs}
        renderItem={(d) => <p>{d.clientName} — {d.type} — {d.deadline}</p>}
        emptyMessage="No declarations found"
      />
    </div>
  )
}

// =============================================================================
// LESSON 15 — Utility Types
// =============================================================================
//
// REQUIREMENTS:
//   Derive these 6 types using ONLY utility types — no new type definitions from scratch:
//     1. DeclarationFormData — Declaration without id and submitted
//     2. DeclarationUpdate — all Declaration fields optional EXCEPT id (required)
//     3. ClientSummary — only id and name from Client
//     4. ClientFormData — Client without id, all fields optional
//     5. DeclarationFormErrors — optional string for each key in DeclarationFormData
//     6. ClientIndex — Record mapping string keys to ClientSummary arrays
//   Then build DeclarationUpdateForm using DeclarationUpdate as form state
//
// CORRECTIONS FROM YOUR SUBMISSION:
//   - Typo "submited" in Omit — field name must match exactly: "submitted"
//   - DeclarationFormErrors used keyof Declaration instead of keyof DeclarationFormData
//     (errors should only cover form fields, not id or submitted)
//   - useState<Declaration | null>() — missing initial value, use null explicitly
//   - dec variable used in JSX that didn't exist — use form state instead
//   - Redundant useEffect syncing props to state — useState initializer already handles it
//   - setForm spread without guaranteeing id stays — add id: declaration.id explicitly
// =============================================================================

type DeclarationFormData = Omit<Declaration, "id" | "submitted">
type DeclarationUpdate = { id: string } & Partial<Omit<Declaration, "id">>
type ClientSummary = Pick<Client, "id" | "name">
type ClientFormData = Partial<Omit<Client, "id">>
type DeclarationFormErrors = Partial<Record<keyof DeclarationFormData, string>>
type ClientIndex = Record<string, ClientSummary[]>

const DeclarationUpdateForm = ({ declaration }: { declaration: Declaration }) => {
  const [form, setForm] = useState<DeclarationUpdate>({
    id: declaration.id,
    clientName: declaration.clientName,
    deadline: declaration.deadline
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value, id: declaration.id }))
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Updated:", { ...declaration, ...form })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="clientName"
        value={form.clientName ?? ""}
        onChange={handleChange}
      />
      <input
        name="deadline"
        value={form.deadline ?? ""}
        onChange={handleChange}
      />
      <button type="submit">Update</button>
    </form>
  )
}

const DeclarationUpdateComponent = () => {
  const [selDec, setSelDec] = useState<Declaration | null>(null)

  return (
    <div>
      <button type="button" onClick={() => setSelDec(null)}>Clear</button>
      <ul>
        {mockDeclarations.map((d) => (
          <li key={d.id} onClick={() => setSelDec(d)} style={{ cursor: "pointer" }}>
            {d.clientName} — {d.deadline} — {d.type} — {d.submitted ? "Submitted" : "Pending"}
          </li>
        ))}
      </ul>
      <div>
        {selDec && <DeclarationUpdateForm declaration={selDec} />}
      </div>
    </div>
  )
}

// =============================================================================
// LESSON 16 — Discriminated Unions
// =============================================================================
//
// REQUIREMENTS:
//   Part A — Define SubmissionState discriminated union with variants:
//     idle | validating | submitting (declarationId) | success (submittedAt, declarationId) | error (message, retryable)
//   Part B — SubmissionFlow component:
//     1. Starts in "idle" state
//     2. Start button → "validating" → after 1000ms → "submitting" with declarationId
//     3. After another 1000ms → "success" or "error" via Math.random() > 0.5
//     4. Different UI per state, switch statement at component level
//     5. Reset always goes back to "idle"
//     6. Error state shows Retry (if retryable) AND Reset buttons
//
// CORRECTIONS FROM YOUR SUBMISSION:
//   - Missing Reset button in error case
//   - "Submiting DEC-001" hardcoded — use state.declarationId (available via narrowing)
//   - type="button" missing on some buttons inside the switch cases
// =============================================================================

type SubmissionState =
  | { status: "idle" }
  | { status: "validating" }
  | { status: "submitting"; declarationId: string }
  | { status: "success"; submittedAt: string; declarationId: string }
  | { status: "error"; message: string; retryable: boolean }

const SubmissionFlow = () => {
  const [state, setState] = useState<SubmissionState>({ status: "idle" })

  const handleStart = (decId: string) => {
    setState({ status: "validating" })

    setTimeout(() => {
      setState({ status: "submitting", declarationId: decId })

      setTimeout(() => {
        if (Math.random() > 0.5) {
          setState({
            status: "success",
            submittedAt: new Date().toISOString(),
            declarationId: decId
          })
        } else {
          setState({
            status: "error",
            message: "Failed to connect to ANAF",
            retryable: true
          })
        }
      }, 1000)
    }, 1000)
  }

  const handleReset = () => setState({ status: "idle" })

  switch (state.status) {
    case "idle":
      return (
        <div>
          <p>Ready to submit</p>
          <button type="button" onClick={() => handleStart("DEC-001")}>Start</button>
        </div>
      )
    case "validating":
      return <p>Validating declaration...</p>

    case "submitting":
      return <p>Submitting {state.declarationId}...</p>

    case "success":
      return (
        <div>
          <p>Successfully submitted at {state.submittedAt}</p>
          <button type="button" onClick={handleReset}>Reset</button>
        </div>
      )
    case "error":
      return (
        <div>
          <p>Error: {state.message}</p>
          {state.retryable && (
            <button type="button" onClick={() => handleStart("DEC-001")}>Retry</button>
          )}
          <button type="button" onClick={handleReset}>Reset</button>
        </div>
      )
  }
}

const SubmitPage = () => {
  return (
    <>
      <SubmissionFlow />
    </>
  )
}

// =============================================================================
// APP
// =============================================================================

const App = () => {
  return (
    <div>
      <h1>MBCRM Practice — TSX Learning</h1>

      <h2>Lesson 2 — Components & Props</h2>
      <ClientCard name="Contabilitate SRL" cui="RO12345678" isActive={true} />
      <ClientCard name="Audit Expert SRL" cui="RO87654321" isActive={false} accountantName="Ion Popescu" />

      <h2>Lesson 3 — Rendering Lists</h2>
      <DeclarationList declarations={mockDeclarations} />

      <h2>Lesson 4 — Conditional Rendering</h2>
      <DeadlineAlert isLoading={false} error={null} declarations={mockDeclarations} />

      <h2>Lesson 6+7 — useState & Event Handling (DeclarationFilter)</h2>
      <DeclarationFilter declarations={mockDeclarations} />

      <h2>Lesson 7 — Event Handling (ClientSearch)</h2>
      <ClientSearch declarations={mockDeclarations} />

      <h2>Lesson 8 — Controlled Inputs & Forms</h2>
      <AddDeclarationForm />

      <h2>Lesson 9 — useEffect & Data Fetching</h2>
      <DeclarationDashboard />

      <h2>Lesson 10 — Custom Hooks</h2>
      <DeclarationsDashboard />

      <h2>Lesson 11 — Component Composition & children</h2>
      <Panel title="Declarations" collapsible>
        <DeclarationsDashboard />
      </Panel>
      <Panel title="Search">
        <ClientSearch declarations={mockDeclarations} />
      </Panel>
      <Panel title="Add Declaration" collapsible>
        <AddDeclarationForm />
      </Panel>

      <h2>Lesson 12 — Lifting State Up</h2>
      <DeclarationPage />

      <h2>Lesson 13 — Context API</h2>
      <ClientPage />

      <h2>Lesson 14 — Generics</h2>
      <GenericExample />

      <h2>Lesson 15 — Utility Types</h2>
      <DeclarationUpdateComponent />

      <h2>Lesson 16 — Discriminated Unions</h2>
      <SubmitPage />
    </div>
  )
}

export default App
