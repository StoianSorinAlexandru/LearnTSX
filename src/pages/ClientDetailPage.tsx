import { Link } from "react-router-dom"
// import { mockClients, mockDeclarations } from "../data/mockData"

// clientId will come from URL params in Lesson 19
// for now we accept it as a prop as a placeholder
const ClientDetailPage = () => {
  return (
    <div>
      <Link to="/clients">← Back to clients</Link>
      <p>Client detail — URL params coming in Lesson 19</p>
    </div>
  )
}

export default ClientDetailPage