import { useState, useEffect, createContext, useContext, useMemo, useCallback } from "react"

// =============================================================================
// SHARED TYPES — already provided, do not modify
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
// SHARED CONSTANTS & HELPERS — already provided, do not modify
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
// Build a ClientCard component that:
//   1. Accepts props: name (string), cui (string), isActive (boolean),
//      accountantName (optional string)
//   2. Renders name in <h2>
//   3. Renders cui in <p>
//   4. Renders "Active" or "Inactive" depending on isActive — use a ternary
//   5. If accountantName is provided renders it in <p>, otherwise renders nothing
//
// HINTS:
//   - Define a ClientCardProps type first
//   - Use ? for optional props
//   - {isActive ? <p>Active</p> : <p>Inactive</p>}
//   - {accountantName && <p>{accountantName}</p>}
// =============================================================================

// Write ClientCard here 👇


// =============================================================================
// LESSON 3 — Rendering Lists
// =============================================================================
//
// Build a DeclarationCard component and a DeclarationList component:
//
// DeclarationCard:
//   - Accepts clientName (string), type ("D300"|"D390"|"SAF-T"), deadline (string)
//   - Renders each in a <p>
//
// DeclarationList:
//   - Accepts declarations: Declaration[]
//   - Renders ONLY unsubmitted declarations using DeclarationCard
//   - Uses correct key props on every mapped element
//   - Shows <p>No pending declarations</p> if filtered list is empty
//
// HINTS:
//   - .filter((d) => !d.submitted) for unsubmitted
//   - key={d.id} on the outermost element inside .map()
//   - Extract filtered array to variable, check .length for empty state
// =============================================================================

// Write DeclarationCard and DeclarationList here 👇


// =============================================================================
// LESSON 4 — Conditional Rendering
// =============================================================================
//
// Build a DeadlineAlert component that:
//   1. Returns <p>Loading...</p> if isLoading is true
//   2. Returns <p>Error: {error}</p> if error is not null
//   3. Filters declarations where submitted=false AND deadline is before today
//   4. If none are overdue returns <p>No overdue declarations</p>
//   5. Otherwise renders <ul> with <li> per overdue item (clientName + deadline)
//
// Props: isLoading (boolean), error (string | null), declarations (Declaration[])
//
// HINTS:
//   - Use early returns for loading and error (guard clause pattern)
//   - isOverdue(deadline) helper is already defined above
//   - !d.submitted && isOverdue(d.deadline) for the filter condition
//   - key={d.id} on every <li>
// =============================================================================

type DeadlineAlertProps = {
  isLoading: boolean
  error: string | null
  declarations: Declaration[]
}

// Write DeadlineAlert here 👇


// =============================================================================
// LESSON 6 — useState
// LESSON 7 — Event Handling (DeclarationFilter)
// =============================================================================
//
// Build a DeclarationFilter component that:
//   1. Has a filter state object: { type: "all"|"D300"|"D390"|"SAF-T", showOverdueOnly: boolean }
//      starting as { type: "all", showOverdueOnly: false }
//   2. Buttons for Clear, All, D300, D390, SAF-T that update filter.type
//      (use spread: { ...filter, type: "D300" })
//   3. Toggle button switching showOverdueOnly — label describes what clicking WILL DO:
//      "Show overdue only" when currently showing all, "Show all" when currently filtering
//   4. Filters declarations by both state variables and renders as <ul>/<li> list
//
// HINTS:
//   - useState<{ type: "all"|"D300"|"D390"|"SAF-T", showOverdueOnly: boolean }>({...})
//   - Chain two .filter() calls
//   - Overdue filter: !d.submitted && isOverdue(d.deadline) (both conditions with &&)
//   - key={d.id} on every <li>
// =============================================================================

// Write DeclarationFilter here 👇


// =============================================================================
// LESSON 7 — Event Handling (ClientSearch)
// =============================================================================
//
// Build a ClientSearch component that:
//   1. Has a text input filtering declarations by clientName as you type
//   2. Has a <select> dropdown to filter by type ("all", "D300", "D390", "SAF-T")
//   3. Shows count: "Found N declarations" or "No declarations found."
//   4. Renders filtered results as <ul>/<li> list with clientName, type, deadline
//   5. Clear button resets both input and dropdown to defaults
//
// HINTS:
//   - useState<"all"|"D300"|"D390"|"SAF-T">("all") — explicit type needed
//   - Controlled input: value={query} onChange={(e) => setQuery(e.target.value)}
//   - Controlled select: value={type} onChange={(e) => setType(e.target.value as ...)}
//   - Chain two .filter() calls
//   - Pass handleClearAll directly: onClick={handleClearAll} (no arrow wrapper needed)
// =============================================================================

// Write ClientSearch here 👇


// =============================================================================
// LESSON 8 — Controlled Inputs & Forms
// =============================================================================
//
// Build an AddDeclarationForm component that:
//   1. Has fields for clientName (text), type (select), deadline (date input)
//   2. Manages ALL fields in a single form state object (use FormDataType + InitialData)
//   3. Single handleChange works for both input and select:
//      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)
//   4. Validates on submit:
//      - clientName cannot be empty
//      - type cannot be empty (add a default empty option to select)
//      - deadline cannot be empty
//      - deadline cannot be in the past
//   5. Shows error messages below each invalid field using FormErrors type
//   6. On success: console.log form, reset form, reset errors
//   7. Reset button clears form and errors — must have type="button"!
//
// HINTS:
//   - setForm((prev) => ({ ...prev, [name]: value })) for generic handleChange
//   - setErrors((prev) => ({ ...prev, [name]: undefined })) to clear on change
//   - Object.keys(errs).length > 0 to check if validation failed
//   - e.preventDefault() in handleSubmit (use React.SyntheticEvent<HTMLFormElement>)
//   - Buttons inside forms default to type="submit" — always set type explicitly!
// =============================================================================

// Write AddDeclarationForm here 👇


// =============================================================================
// LESSON 9 — useEffect & Data Fetching
// =============================================================================
//
// Build a DeclarationDashboard component that:
//   1. On mount fetches declarations using mockFetch (simulates 1500ms delay)
//   2. While loading shows <p>Loading declarations...</p>
//   3. Stores result in state, renders each as <li> with clientName and type
//   4. Has Refresh button that re-triggers the fetch
//   5. Shows count: "Loaded N declarations"
//
// HINTS:
//   - useState<Declaration[]>([]) for data, useState(true) for isLoading
//   - useState(0) for refreshKey — increment to re-trigger useEffect
//   - useEffect cannot be async — define async function inside and call it
//   - setIsLoading(true) at start of fetch, setIsLoading(false) when done
//   - Use functional update for refreshKey: setRefreshKey((prev) => prev + 1)
//   - <> fragment wraps multiple elements without adding a div
// =============================================================================

// Write DeclarationDashboard here 👇


// =============================================================================
// LESSON 10 — Custom Hooks
// =============================================================================
//
// Part A — Build a useDeclarations hook that:
//   1. Fetches declarations using mockFetch on mount
//   2. Exposes: declarations, isLoading, error (string|null), refresh function
//   3. Handles errors with try/catch/finally
//   4. setIsLoading(false) goes in finally only — not in try
//
// Part B — Build a DeclarationsDashboard component that:
//   1. Uses useDeclarations — ZERO useState or useEffect in the component itself
//   2. Shows loading and error states
//   3. Shows "Loaded N declarations"
//   4. Renders each as <li> with clientName and type
//   5. Refresh button calls refresh from the hook
//
// HINTS:
//   - Extract renderContent() function inside component to avoid nested ternaries
//   - const { declarations, isLoading, error, refresh } = useDeclarations()
//   - Name what the hook returns carefully — destructuring is a KEY lookup not positional
// =============================================================================

// Write useDeclarations and DeclarationsDashboard here 👇


// =============================================================================
// LESSON 11 — Component Composition & children
// =============================================================================
//
// Part A — Build a Panel component that:
//   1. Accepts title (string), children (React.ReactNode), collapsible (optional boolean, default false)
//   2. Renders title in <h3> and children below it
//   3. If collapsible=true shows a toggle button
//   4. Button says "Collapse" when panel is OPEN (collapsed=false)
//      Button says "Expand" when panel is CLOSED (collapsed=true)
//   5. Children hidden when collapsed=true, shown when collapsed=false
//
// Part B — Use Panel in App to wrap at least 3 existing components
//
// HINTS:
//   - children: React.ReactNode in props type
//   - useState(false) for collapsed state — false = open
//   - {collapsed ? "Expand" : "Collapse"} for button label
//   - {!collapsed && <div>{children}</div>} for content visibility
//   - Mental model: collapsed=true means IT IS collapsed → hide content
// =============================================================================

type PanelProps = {
  title: string
  children: React.ReactNode
  collapsible?: boolean
}

// Write Panel here 👇


// =============================================================================
// LESSON 12 — Lifting State Up
// =============================================================================
//
// Build three components — all state lives in DeclarationPage only:
//
// DeclarationTypeFilter (no useState):
//   - Receives type and onTypeChange as props
//   - Renders only the <select> dropdown
//
// ChildDeclarationList (no useState):
//   - Receives type and query as props
//   - Filters mockDeclarations by both and renders as list
//
// DeclarationPage (owns ALL state):
//   - type state: "all"|"D300"|"D390"|"SAF-T" starting as "all"
//   - query state: string starting as ""
//   - Renders search <input> controlling query
//   - Renders DeclarationTypeFilter and ChildDeclarationList
//
// HINTS:
//   - Extract type DeclarationType = "all"|"D300"|"D390"|"SAF-T" to avoid repetition
//   - Callback prop type: onTypeChange: (type: DeclarationType) => void
//   - Pass setType directly: onTypeChange={setType}
//   - Use self-closing <input /> not <input></input>
// =============================================================================

type DeclarationType = "all" | "D300" | "D390" | "SAF-T"

// Write DeclarationPage, ChildDeclarationFilter, ChildDeclarationList here 👇


// =============================================================================
// LESSON 13 — Context API
// =============================================================================
//
// Build a client selection system using Context:
//
// ClientContext + ClientProvider:
//   - selectedClient: Client | null
//   - selectClient: (client: Client | null) => void
//   - Wrap children in Context.Provider
//
// useClientContext hook:
//   - Calls useContext, throws error if used outside provider
//   - Returns context value
//
// ClientSelector (no props — uses context):
//   - Renders mockClients list
//   - Clicking a client calls selectClient
//   - Selected client visually distinct (→ prefix or bold)
//   - key={c.id} on mapped elements
//
// ClientDeclarationView (no props — uses context):
//   - Shows "Select a client" if none selected
//   - Shows selected client name in <h3>
//   - Lists only matching declarations
//
// ClientPage:
//   - Wraps in ClientProvider
//   - Renders both side by side with display: flex
//
// HINTS:
//   - createContext<ClientContextType | null>(null)
//   - if (!ctx) throw new Error(...) in useClientContext
//   - selectedClient?.id === c.id for highlighting
//   - Define Client type BEFORE mockClients that uses it
// =============================================================================

type Client = {
  id: string
  name: string
}

const mockClients: Client[] = [
  { id: "1", name: "Contabilitate SRL" },
  { id: "2", name: "Audit Expert SRL" },
  { id: "3", name: "Taxe & Co SRL" },
]

// Write ClientContext, useClientContext, ClientProvider,
// ClientSelector, ClientDeclarationView, ClientPage here 👇


// =============================================================================
// LESSON 14 — Generics in Components
// =============================================================================
//
// Part A — Generic List<T> component:
//   1. T extends { id: string } — use item.id as key automatically
//   2. Accepts items: T[], renderItem: (item: T) => React.ReactNode
//   3. Optional emptyMessage?: string shown when items.length === 0
//   4. Optional onClickFunction?: (item: T) => void — cursor: pointer when provided
//
// Part B — Generic useFilter<T> hook:
//   1. Accepts items: T[] and predicate: (item: T) => boolean
//   2. Returns { filtered } memoized with useMemo
//
// Part C — GenericExample component using both:
//   1. Uses useFilter with Client[] and Declaration[] separately
//   2. Clicking a client filters declarations by that client
//   3. Wrap predicates in useCallback so useMemo works correctly
//
// HINTS:
//   - const List = <T extends { id: string },>(...) — trailing comma required in TSX!
//   - items.length === 0 for empty check (not !items — arrays are always truthy)
//   - useCallback(() => ..., [dependency]) to stabilize predicate references
//   - const { filtered: myClients } = useFilter(...) — rename on destructure
// =============================================================================

// Write List, useFilter, GenericExample here 👇


// =============================================================================
// LESSON 15 — Utility Types
// =============================================================================
//
// Using ONLY utility types — derive these 6 types from Declaration and Client:
//
//   type Declaration = { id, clientName, type, deadline, submitted }
//   type Client = { id, name, cui, email, isActive }
//
//   1. DeclarationFormData — Declaration without "id" and "submitted"
//      → Omit<...>
//   2. DeclarationUpdate — all optional EXCEPT id which is required
//      → { id: string } & Partial<Omit<...>>
//   3. ClientSummary — only id and name from Client
//      → Pick<...>
//   4. ClientFormData — Client without id, all fields optional
//      → Partial<Omit<...>>
//   5. DeclarationFormErrors — optional string per form field (NOT all Declaration fields)
//      → Partial<Record<keyof DeclarationFormData, string>>
//   6. ClientIndex — Record mapping string keys to ClientSummary arrays
//      → Record<string, ClientSummary[]>
//
// Then build DeclarationUpdateComponent:
//   - Lists declarations, clicking one opens DeclarationUpdateForm
//   - DeclarationUpdateForm uses DeclarationUpdate as form state
//   - Pre-fills clientName and deadline from the selected declaration
//   - id must always be included: { id: declaration.id, ...prev, [name]: value }
//
// HINTS:
//   - Typo "submited" vs "submitted" — TypeScript will warn if key doesn't exist
//   - useState<Declaration | null>(null) — always provide initial value explicitly
//   - Buttons inside forms need type="button" or type="submit" explicitly
// =============================================================================

// Write utility types and DeclarationUpdateComponent here 👇


// =============================================================================
// LESSON 16 — Discriminated Unions
// =============================================================================
//
// Part A — Define SubmissionState discriminated union:
//   | { status: "idle" }
//   | { status: "validating" }
//   | { status: "submitting"; declarationId: string }
//   | { status: "success"; submittedAt: string; declarationId: string }
//   | { status: "error"; message: string; retryable: boolean }
//
// Part B — Build SubmissionFlow component:
//   1. Starts in "idle" state
//   2. Start button → "validating" → after 1000ms → "submitting" with declarationId
//   3. After another 1000ms → "success" or "error" via Math.random() > 0.5
//   4. Different UI for each state using switch(state.status) at component level
//   5. idle: "Ready to submit" + Start button
//      validating: "Validating declaration..."
//      submitting: "Submitting {state.declarationId}..." (use narrowed state!)
//      success: "Successfully submitted at {state.submittedAt}" + Reset
//      error: "Error: {state.message}" + Retry (if retryable) + Reset
//   6. Reset always returns to "idle"
//
// HINTS:
//   - useState<SubmissionState>({ status: "idle" })
//   - switch returns JSX directly — no return statement needed in the component body
//   - In "submitting" case, state.declarationId is available via TypeScript narrowing
//   - Chain timeouts: setTimeout(() => { setState(...); setTimeout(() => {...}, 1000) }, 1000)
//   - type="button" on all buttons inside switch cases
// =============================================================================

// Write SubmissionState type and SubmissionFlow here 👇


// =============================================================================
// APP — uncomment each lesson as you complete it
// =============================================================================

const App = () => {
  return (
    <div>
      <h1>MBCRM Practice — TSX Learning</h1>

      {/* Uncomment as you complete each lesson */}

      {/* <h2>Lesson 2 — Components & Props</h2> */}
      {/* <ClientCard name="Contabilitate SRL" cui="RO12345678" isActive={true} /> */}
      {/* <ClientCard name="Audit Expert SRL" cui="RO87654321" isActive={false} accountantName="Ion Popescu" /> */}

      {/* <h2>Lesson 3 — Rendering Lists</h2> */}
      {/* <DeclarationList declarations={mockDeclarations} /> */}

      {/* <h2>Lesson 4 — Conditional Rendering</h2> */}
      {/* <DeadlineAlert isLoading={false} error={null} declarations={mockDeclarations} /> */}

      {/* <h2>Lesson 6+7 — useState & Event Handling (DeclarationFilter)</h2> */}
      {/* <DeclarationFilter declarations={mockDeclarations} /> */}

      {/* <h2>Lesson 7 — Event Handling (ClientSearch)</h2> */}
      {/* <ClientSearch declarations={mockDeclarations} /> */}

      {/* <h2>Lesson 8 — Controlled Inputs & Forms</h2> */}
      {/* <AddDeclarationForm /> */}

      {/* <h2>Lesson 9 — useEffect & Data Fetching</h2> */}
      {/* <DeclarationDashboard /> */}

      {/* <h2>Lesson 10 — Custom Hooks</h2> */}
      {/* <DeclarationsDashboard /> */}

      {/* <h2>Lesson 11 — Component Composition & children</h2> */}
      {/* <Panel title="Declarations" collapsible><DeclarationsDashboard /></Panel> */}
      {/* <Panel title="Search"><ClientSearch declarations={mockDeclarations} /></Panel> */}
      {/* <Panel title="Add Declaration" collapsible><AddDeclarationForm /></Panel> */}

      {/* <h2>Lesson 12 — Lifting State Up</h2> */}
      {/* <DeclarationPage /> */}

      {/* <h2>Lesson 13 — Context API</h2> */}
      {/* <ClientPage /> */}

      {/* <h2>Lesson 14 — Generics</h2> */}
      {/* <GenericExample /> */}

      {/* <h2>Lesson 15 — Utility Types</h2> */}
      {/* <DeclarationUpdateComponent /> */}

      {/* <h2>Lesson 16 — Discriminated Unions</h2> */}
      {/* <SubmissionFlow /> */}

    </div>
  )
}

export default App
