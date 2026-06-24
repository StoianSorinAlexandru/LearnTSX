import { mockClients, mockDeclarations } from "../data/mockData"
import isOverdue from "../utils/helpers"

const DashboardPage = () => {
  const totalClients = mockClients.length
  const activeClients = mockClients.filter((c) => c.isActive).length
  const pendingDeclarations = mockDeclarations.filter((d) => !d.submitted).length
  const overdueDeclarations = mockDeclarations.filter(
    (d) => !d.submitted && isOverdue(d.deadline)
  ).length

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

export default DashboardPage