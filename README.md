# TSX Learning — React + TypeScript Curriculum

A structured, hands-on curriculum for learning React with TypeScript from scratch. Built around a fictional CRM product for Romanian accounting firms (MBCRM), so every exercise has a real-world context rather than abstract toy examples.

---

## Who this is for

This repo is for developers who already know basic JavaScript and want to learn React and TypeScript properly — not by reading documentation in isolation, but by building progressively more complex components around a consistent domain.

It assumes no prior React knowledge. TypeScript fundamentals are introduced as they become relevant rather than front-loaded.

---

## How the repo is structured

There are three branches:

**`main`** — the completed reference implementation. Each lesson has its requirements and corrections documented as comments above the component.

**`lesson/starter`** — a blank slate with only the requirements as comments and all App sections commented out. This is where you write your own solutions. Uncomment each lesson in `App` as you complete it.

**`lesson/completed-reference`** — same as main, intended as a read-only reference if you get stuck.

All lessons live in a single `src/App.tsx` file by design. The goal is to keep the environment simple so you focus on learning the language, not configuring tooling.

---

## Prerequisites

- Node.js 18 or higher
- A code editor (VS Code recommended)
- Basic JavaScript knowledge (variables, functions, arrays, objects)

---

## Getting started

```bash
git clone https://github.com/your-username/tsx-learning.git
cd tsx-learning
git checkout lesson/starter
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. The page starts nearly blank — you build it up lesson by lesson.

### Recommended VS Code extensions

- **ESLint** — catches React mistakes in real time
- **Prettier** — auto-formats your code

TypeScript support is built into VS Code natively. No extension needed.

---

## Curriculum overview

### Module 1 — The Basics

| Lesson | Topic | What you build |
|--------|-------|----------------|
| 1 | What TSX actually is | No code — understanding the compiler pipeline |
| 2 | Components and props | `ClientCard` with typed props and optional fields |
| 3 | Rendering lists | `DeclarationList` with `.map()`, `key` props, and empty state |
| 4 | Conditional rendering | `DeadlineAlert` with early returns and guard clauses |

### Module 2 — Interactivity

| Lesson | Topic | What you build |
|--------|-------|----------------|
| 6 | `useState` | `DeclarationFilter` with object state and spread updates |
| 7 | Event handling | `ClientSearch` with controlled inputs and a dropdown |
| 8 | Controlled forms | `AddDeclarationForm` with validation and error messages |
| 9 | `useEffect` and data fetching | `DeclarationDashboard` with async fetch and refresh |
| 10 | Custom hooks | `useDeclarations` hook — extracting reusable logic |

### Module 3 — Component Patterns

| Lesson | Topic | What you build |
|--------|-------|----------------|
| 11 | Composition and `children` | `Panel` wrapper with collapsible content |
| 12 | Lifting state up | `DeclarationPage` coordinating two stateless children |
| 13 | Context API | Client selection system shared across sibling components |

### Module 4 — TypeScript in Depth

| Lesson | Topic | What you build |
|--------|-------|----------------|
| 14 | Generics in components | Generic `List<T>` component and `useFilter<T>` hook |
| 15 | Utility types | Deriving types with `Omit`, `Pick`, `Partial`, `Record`, `keyof` |
| 16 | Discriminated unions | `SubmissionFlow` modeling an async state machine |

---

## The domain

Every lesson uses the same data model: declarations (D300, D390, SAF-T) filed by accounting firms on behalf of clients, with deadlines and submission statuses. This gives the exercises a consistent real-world feel — you're not building a counter or a todo list, you're building something that resembles actual software.

The mock data and types are defined once at the top of `App.tsx` and reused throughout:

```tsx
type Declaration = {
  id: string
  clientName: string
  type: "D300" | "D390" | "SAF-T"
  deadline: string
  submitted: boolean
}
```

---

## Key concepts covered

**React fundamentals**
- JSX/TSX compilation — what the browser actually receives
- Component functions and the rules of rendering
- Props as function arguments, typed with TypeScript interfaces
- The `children` prop and composition patterns
- Controlled vs uncontrolled inputs

**State and effects**
- `useState` with primitives, objects, and arrays
- Functional state updates (`prev => ...`)
- `useEffect` dependency arrays and cleanup
- Custom hooks for extracting and reusing stateful logic
- `useMemo` and `useCallback` for memoization

**TypeScript**
- Typing props, state, and event handlers
- Optional and union types
- Generic components and hooks
- Utility types: `Partial`, `Pick`, `Omit`, `Record`, `keyof`, `ReturnType`, `NonNullable`
- Discriminated unions for modeling state machines

**Patterns**
- Guard clause pattern (early returns for edge cases)
- Lifting state up to coordinate siblings
- Context API for avoiding prop drilling
- Data down, events up — the React data flow model

---

## Things intentionally not covered

This curriculum focuses on core React and TypeScript. The following topics are intentional omissions — they are covered in separate branches:

- **React Router** — client-side navigation (`lesson/react-router`)
- **Redux** — global state management (`lesson/redux`)
- **React Query / TanStack Query** — server state and caching (`lesson/react-query`)
- **Zod** — runtime schema validation (`lesson/zod`)

---

## Notes on the code style

A few decisions were made deliberately throughout the exercises:

**Self-closing inputs.** `<input />` not `<input></input>`. Input is a void element and cannot have children.

**Explicit button types.** Every `<button>` inside a `<form>` has `type="button"` or `type="submit"` explicitly. Without this, buttons default to `type="submit"` and trigger form submission unexpectedly.

**Functional state updates.** `setState((prev) => ...)` is used whenever the new state depends on the previous value, rather than `setState(value + 1)`. This avoids stale closure bugs under rapid updates.

**Arrow functions without braces for filters.** `.filter((d) => !d.submitted)` not `.filter((d) => { !d.submitted })`. Curly braces require an explicit `return` — omitting it returns `undefined`, which is always falsy, filtering out every item silently.

---

## License

MIT. Use freely for personal learning, teaching, or as a reference.