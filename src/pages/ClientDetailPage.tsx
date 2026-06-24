import { Link, useParams } from "react-router-dom"
import { mockClients, mockDeclarations } from "../data/mockData"
// import { mockClients, mockDeclarations } from "../data/mockData"

// clientId will come from URL params in Lesson 19
// for now we accept it as a prop as a placeholder

/** 
Update src/pages/ClientDetailPage.tsx to:

Read id from useParams
Guard against missing id
Find the matching client from mockClients
Guard against client not found — show a meaningful message with a link back to /clients
Show the client details: name in <h2>, cui, email, isActive status
Find all declarations where declaration.clientId === id
If no declarations show <p>No declarations found</p>
Otherwise render each declaration as a <li> with type, deadline, and submitted status
Keep the <Link to="/clients">← Back to clients</Link> at the top
 * 
 * 
*/


const ClientDetailPage = () => {
  const {id} = useParams()
  if(!id) return <p>Invalid client ID</p>
  const client = mockClients.find((c) => c.id === id)

  if (!client) return (
    <>
      <p>Client not found</p>      
      <Link to="/clients">Back to clients</Link>

    </>
  )
  const decs = mockDeclarations.filter((d) => d.clientId === id) 
  return (
    <div>
      <Link to="/clients">Back to clients</Link>
      <h2>{client.name}</h2>
      <p>{client.cui} {client.email} {client.isActive ? "Active" : "Offline"}</p>
      {
        decs.length === 0 ? 
        <p>No declarations found</p> :
        <ul>
          {decs.map((d) => <li key={d.id}>{d.clientName} {d.deadline} {d.type} {d.submitted ? "Submited" : "Unsubmited"}</li>)}
        </ul>
      }
    </div>
  )
}

export default ClientDetailPage