import { Link, NavLink } from 'react-router-dom'

export default function NavBar() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-xl">Mini Event Finder</Link>
        <nav className="flex gap-4">
          <NavLink to="/" end className={({isActive}) => isActive ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}>Home</NavLink>
          <NavLink to="/create" className={({isActive}) => isActive ? 'text-blue-600' : 'text-gray-700 hover:text-gray-900'}>Create</NavLink>
        </nav>
      </div>
    </header>
  )
}
