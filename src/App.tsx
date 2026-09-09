import './App.css'
import { LedgerShell } from './components/LedgerShell'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AuthPage } from './pages/AuthPage'

function AppShell() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="app-loading">
        <p>Loading…</p>
      </div>
    )
  }

  return user ? <LedgerShell /> : <AuthPage />
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}

export default App
