import { useState } from 'react'
import Login from './Login'
import Dashboard from './Dashboard'

function App() {
  const [user, setUser] = useState(null)

  if (!user) {
    return <Login onLogin={(userData) => setUser(userData)} />
  }

  return <Dashboard user={user} onLogout={() => setUser(null)} />
}

export default App
