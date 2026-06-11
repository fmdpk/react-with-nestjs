import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Layout() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Navbar */}
      <nav className='bg-white shadow-sm sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-6'>
          <div className='flex justify-between items-center h-16'>
            {/* Logo / Brand */}
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold'>
                A
              </div>
              <span className='font-semibold text-xl'>MyApp</span>
            </div>

            {/* Navigation Links */}
            <div className='flex items-center gap-8'>
              <Link
                to='/dashboard'
                className={`font-medium transition ${
                  isActive('/dashboard')
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </Link>

              <Link
                to='/items'
                className={`font-medium transition ${
                  isActive('/items')
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Items
              </Link>
              <Link
                to='/items-reducer'
                className={`font-medium transition ${
                  isActive('/items-reducer')
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Items Reducer
              </Link>
            </div>

            {/* User Info & Logout */}
            <div className='flex items-center gap-4'>
              <div className='text-sm text-gray-600'>{user?.email}</div>
              <button
                onClick={logout}
                className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition'
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-6 py-8'>
        <Outlet />
      </main>
    </div>
  )
}
