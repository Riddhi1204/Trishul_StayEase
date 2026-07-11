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
import Explore                 from './pages/Explore'
import GuestBookings           from './pages/GuestBookings'
import HostBookings            from './pages/HostBookings'
import Wishlist                from './pages/Wishlist'
import Profile                 from './pages/Profile'

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/"           element={<Home />} />
              <Route path="/explore"    element={<Explore />} />
              <Route path="/about"      element={<About />} />
              <Route path="/login"      element={<Login />} />
              <Route path="/register"   element={<Register />} />
              <Route path="/components" element={<ComponentShowcase />} />

              {/* Protected Routes - Any authenticated user */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              <Route path="/bookings" element={
                <RoleRoute roles={['guest']}>
                  <GuestBookings />
                </RoleRoute>
              } />

              <Route path="/wishlist" element={
                <RoleRoute roles={['guest']}>
                  <Wishlist />
                </RoleRoute>
              } />

              {/* Protected Routes - Hosts & Admins */}
              <Route path="/dashboard" element={
                <RoleRoute roles={['host', 'admin']}>
                  <Dashboard />
                </RoleRoute>
              } />

              <Route path="/my-properties" element={
                <RoleRoute roles={['host', 'admin']}>
                  <MyProperties />
                </RoleRoute>
              } />

              <Route path="/host-bookings" element={
                <RoleRoute roles={['host', 'admin']}>
                  <HostBookings />
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
