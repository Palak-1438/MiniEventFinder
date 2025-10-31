import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function NavBar() {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-xl">Mini Event Finder</Link>
        <nav className="flex gap-4 items-center">
          <NavLink to="/" end className={({isActive}) => isActive ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}>Home</NavLink>
          <NavLink to="/create" className={({isActive}) => isActive ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}>Create</NavLink>
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-600">Hi, {user?.username}!</span>
              <button onClick={logout} className="text-gray-700 hover:text-gray-900">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({isActive}) => isActive ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}>Login</NavLink>
              <NavLink to="/register" className={({isActive}) => isActive ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}>Register</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
