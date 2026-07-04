import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider }      from './contexts/ThemeContext'
import { ToastProvider }      from './components/ui/Toast'
import { AuthProvider }       from './contexts/AuthContext'
import ProtectedRoute         from './components/ProtectedRoute'
import Home                   from './pages/Home'
import About                  from './pages/About'
import Dashboard               from './pages/Dashboard'
import Login                   from './pages/Login'
import Register                from './pages/Register'
import ComponentShowcase       from './pages/ComponentShowcase'
import RoleRoute               from './components/RoleRoute'
import MyProperties            from './pages/MyProperties'

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/"           element={<Home />} />
              <Route path="/about"      element={<About />} />
              <Route path="/login"      element={<Login />} />
              <Route path="/register"   element={<Register />} />
              <Route path="/components" element={<ComponentShowcase />} />

              {/* Protected Routes - Any authenticated user */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

              {/* Protected Routes - Hosts & Admins */}
              <Route path="/my-properties" element={
                <RoleRoute roles={['host', 'admin']}>
                  <MyProperties />
                </RoleRoute>
              } />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
