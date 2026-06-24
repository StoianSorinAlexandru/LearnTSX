import { useState } from "react"
import { Link } from "react-router-dom"
import { mockClients } from "../data/mockData"

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
            <Link to={`/clients/${c.id}`}>
              {c.name}
            </Link>
            {" "} — {c.cui} — {c.isActive ? "Active" : "Inactive"}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ClientsPage