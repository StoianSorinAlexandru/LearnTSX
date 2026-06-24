import { useState } from "react"
import { Link } from "react-router-dom"
import { mockClients } from "../data/mockData"

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
    // will navigate to /declarations after submit in Lesson 21
  }

  return (
    <div>
      <Link to="/declarations">← Back to declarations</Link>
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
        <button type="button">
          <Link to="/declarations">Cancel</Link>
        </button>
      </form>
    </div>
  )
}

export default NewDeclarationPage