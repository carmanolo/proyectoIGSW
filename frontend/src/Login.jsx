import { useState } from 'react'
import axios from 'axios'
import './Login.css'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Por favor completa todos los campos.')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      })

      if (response.data.status === 'Success') {
        const { user, token } = response.data.data
        
        // Guardar token por si se requiere enviar en los headers después
        localStorage.setItem('token', token)
        
        const nombre = user.nombre || 'Usuario';
        onLogin({
          id: user.id,
          name: nombre,
          email: user.email,
          role: user.rol,
          initials: nombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U',
        })
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError('Error de conexión o correo/contraseña incorrectos.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="login-logo-name">Mi App</span>
        </div>

        <h1 className="login-title">Iniciar sesión</h1>
        <p className="login-subtitle">Bienvenido de nuevo</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <a href="#" className="forgot-link">¿Olvidaste tu contraseña?</a>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Ingresando...' : 'Entrar'}
          </button>
        </form>

    

        <p className="register-text">
          ¿No tienes cuenta? <a href="#">Regístrate gratis</a>
        </p>
      </div>
    </div>
  )
}

export default Login
