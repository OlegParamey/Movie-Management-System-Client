import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        Movie Management System
      </Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/lists">My lists</Link>
            <Link to="/stats">Stats</Link>
            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
            <span className="muted">{user.username}</span>
            <button
              onClick={() => {
                logout()
                navigate('/')
              }}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}
