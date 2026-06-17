import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider }      from './contexts/ThemeContext'
import { ToastProvider }      from './components/ui/Toast'
import Home                   from './pages/Home'
import About                  from './pages/About'
import Dashboard               from './pages/Dashboard'
import Login                   from './pages/Login'
import ComponentShowcase        from './pages/ComponentShowcase'

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/"           element={<Home />} />
            <Route path="/about"      element={<About />} />
            <Route path="/dashboard"  element={<Dashboard />} />
            <Route path="/login"      element={<Login />} />
            <Route path="/components" element={<ComponentShowcase />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
