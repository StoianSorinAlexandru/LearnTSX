import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import DashboardPage from "./pages/DashboardPage"
import ClientsPage from "./pages/ClientsPage"
import ClientDetailPage from "./pages/ClientDetailPage"
import DeclarationsPage from "./pages/DeclarationsPage"
import NewDeclarationPage from "./pages/NewDeclarationPage"
import NotFoundPage from "./pages/NotFoundPage"

const App = () => {
  return (
    <div>
      <Navbar />
      <hr />
      <main>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/clients/:id" element={<ClientDetailPage />} />
          <Route path="/declarations" element={<DeclarationsPage />} />
          <Route path="/declarations/new" element={<NewDeclarationPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App