import { useState } from "react"
import { Link } from "react-router-dom"
import { mockDeclarations } from "../data/mockData"

const DeclarationsPage = () => {
  const [type, setType] = useState<"all" | "D300" | "D390" | "SAF-T">("all")

  const filtered = mockDeclarations.filter(
    (d) => type === "all" || d.type === type
  )

  return (
    <div>
      <h2>Declarations</h2>
      <Link to="/declarations/new">
        <button type="button">New Declaration</button>
      </Link>
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

export default DeclarationsPage