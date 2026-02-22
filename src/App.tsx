import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { Login } from './components/Login'
import { Signup } from './components/Signup'
import { Tasks } from './components/Tasks'
import { TeamManagement } from './components/TeamManagement'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route 
        path="/tasks" 
        element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/team" 
        element={
          <ProtectedRoute>
            <TeamManagement />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/" 
        element={
          user ? <Navigate to="/tasks" replace /> : <Navigate to="/login" replace />
        } 
      />
    </Routes>
  )
}

export default App
