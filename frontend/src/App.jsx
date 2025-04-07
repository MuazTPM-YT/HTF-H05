import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './components/auth/Login'
import RegisterPage from './components/auth/Register'
import AuthLayout from './components/layouts/auth-layout'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={
          <LoginPage />
        } />
        <Route path="/register" element={
          <RegisterPage />
        } />
      </Routes>
    </Router>
  )
}

export default App
