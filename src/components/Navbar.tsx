import { NavLink } from "react-router-dom"

const Navbar = () => {
  return (
    <nav>
      <NavLink to="/">Dashboard</NavLink>
      <NavLink to="/clients">Clients</NavLink>
      <NavLink to="/declarations">Declarations</NavLink>
    </nav>
  )
}

export default Navbar