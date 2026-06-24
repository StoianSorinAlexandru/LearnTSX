import { Link } from "react-router-dom"

const NotFoundPage = () => {
  return (
    <div>
      <h2>404 — Page not found</h2>
      <Link to="/">Go back to dashboard</Link>
    </div>
  )
}

export default NotFoundPage