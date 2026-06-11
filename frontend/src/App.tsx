import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import { ProtectedRoute } from './auth/ProtectedRoute'
import AuthProvider from './auth/AuthProvider'
import Items from './pages/Items'
import './App.css'
import { ProtectedLogin } from './auth/ProtectedLogin'
import Layout from './pages/Layout'
import ItemsReducer from './pages/ItemsReducer'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Navigate to='/login' />} />
          <Route element={<Layout />}>
            <Route element={<ProtectedRoute />}>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/items' element={<Items />} />
              <Route path='/items-reducer' element={<ItemsReducer />} />
            </Route>
          </Route>
          <Route element={<ProtectedLogin />}>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
