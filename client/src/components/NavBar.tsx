import { Link, NavLink } from 'react-router-dom'
import { Calendar, Moon, Sun, LogOut, User, Plus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { motion } from 'framer-motion'

export default function NavBar() {
  const { isAuthenticated, user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white dark:bg-slate-900 shadow-lg border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50 backdrop-blur-sm bg-white/90 dark:bg-slate-900/90"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-xl group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden sm:block">
              Mini Event Finder
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex gap-2 sm:gap-4 items-center">
            <NavLink 
              to="/" 
              end 
              className={({isActive}) => `px-3 py-2 rounded-lg transition-all ${
                isActive 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              Home
            </NavLink>
            
            <NavLink 
              to="/create" 
              className={({isActive}) => `px-3 py-2 rounded-lg transition-all flex items-center gap-2 ${
                isActive 
                  ? 'bg-gradient-to-r from-accent to-amber-500 text-white' 
                  : 'bg-accent hover:bg-amber-500 text-white'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create</span>
            </NavLink>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-slate-800 rounded-lg">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium dark:text-gray-200">{user?.username}</span>
                </div>
                <button 
                  onClick={logout} 
                  className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <NavLink 
                  to="/login" 
                  className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Login
                </NavLink>
                <NavLink 
                  to="/register" 
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-indigo-600 text-white transition-colors"
                >
                  Register
                </NavLink>
              </div>
            )}
          </nav>
        </div>
      </div>
    </motion.header>
  )
}
