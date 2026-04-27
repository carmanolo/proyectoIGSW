import { useState } from 'react'
import './Dashboard.css'

// ── Iconos SVG inline ──────────────────────────────────────────────────────
const Icon = ({ name, size = 18 }) => {
  const icons = {
    home: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    analytics: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    projects: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    messages: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    team: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    settings: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    logout: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    ),
    bell: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    search: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    user: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    check: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    file: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <polyline points="13 2 13 9 20 9" />
      </svg>
    ),
    alert: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    logo: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    dots: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1" />
        <circle cx="12" cy="5" r="1" />
        <circle cx="12" cy="19" r="1" />
      </svg>
    ),
  }
  return icons[name] || null
}

// ── Datos de ejemplo ───────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'home',      label: 'Inicio',        icon: 'home',      section: 'Principal' },
  { id: 'analytics', label: 'Analíticas',    icon: 'analytics', section: null },
  { id: 'projects',  label: 'Proyectos',     icon: 'projects',  badge: 4, section: null },
  { id: 'messages',  label: 'Mensajes',      icon: 'messages',  badge: 2, section: null },
  { id: 'team',      label: 'Equipo',        icon: 'team',      section: 'Cuenta' },
  { id: 'settings',  label: 'Configuración', icon: 'settings',  section: null },
]

const METRICS = [
  { label: 'Usuarios',       value: '1,284', change: '+12%', positive: true },
  { label: 'Ingresos',       value: '$8,430', change: '+5%', positive: true },
  { label: 'Tareas abiertas', value: '37',    change: '+3',  positive: false },
  { label: 'Retención',      value: '94%',    change: '+1%', positive: true },
]

const ACTIVITY = [
  { icon: 'user',  color: 'purple', title: 'Nuevo usuario registrado',  sub: 'Ana García se unió al equipo', time: 'hace 2 min' },
  { icon: 'check', color: 'green',  title: 'Tarea completada',          sub: 'Diseño de landing page',       time: 'hace 1h' },
  { icon: 'file',  color: 'amber',  title: 'Reporte generado',          sub: 'Ventas abril 2026',            time: 'hace 3h' },
  { icon: 'alert', color: 'red',    title: 'Error en servidor',         sub: 'Resuelto automáticamente',     time: 'hace 5h' },
  { icon: 'user',  color: 'purple', title: 'Acceso de administrador',   sub: 'Carlos López inició sesión',   time: 'hace 6h' },
]

const USAGE = [
  { label: 'Dashboard', pct: 82 },
  { label: 'Proyectos', pct: 65 },
  { label: 'Mensajes',  pct: 48 },
  { label: 'Analíticas', pct: 34 },
  { label: 'Equipo',    pct: 21 },
]

// ── Componente principal ───────────────────────────────────────────────────
function Dashboard({ user, onLogout }) {
  const [activePage, setActivePage] = useState('home')

  const currentLabel = NAV_ITEMS.find(i => i.id === activePage)?.label ?? 'Inicio'

  return (
    <div className="dash-layout">
      {/* ── Sidebar ── */}
      <aside className="dash-sidebar">
        <div className="dash-sidebar-header">
          <div className="dash-logo-icon">
            <Icon name="logo" size={20} />
          </div>
          <span className="dash-logo-text">Mi App</span>
        </div>

        <nav className="dash-nav">
          {NAV_ITEMS.map((item, idx) => (
            <div key={item.id}>
              {item.section && (
                <span className="dash-nav-section">{item.section}</span>
              )}
              <button
                className={`dash-nav-item ${activePage === item.id ? 'active' : ''}`}
                onClick={() => setActivePage(item.id)}
              >
                <span className="dash-nav-icon">
                  <Icon name={item.icon} size={16} />
                </span>
                {item.label}
                {item.badge && (
                  <span className="dash-badge">{item.badge}</span>
                )}
              </button>
            </div>
          ))}
        </nav>

        <div className="dash-sidebar-footer">
          <div className="dash-user-row">
            <div className="dash-avatar">{user.initials}</div>
            <div className="dash-user-info">
              <span className="dash-user-name">{user.name}</span>
              <span className="dash-user-role">{user.role}</span>
            </div>
            <button className="dash-logout-btn" onClick={onLogout} title="Cerrar sesión">
              <Icon name="logout" size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="dash-main">
        {/* Topbar */}
        <header className="dash-topbar">
          <h1 className="dash-page-title">{currentLabel}</h1>
          <div className="dash-topbar-actions">
            <button className="dash-icon-btn notif">
              <Icon name="bell" size={16} />
            </button>
            <button className="dash-icon-btn">
              <Icon name="search" size={16} />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="dash-content">
          {activePage === 'home' && <HomeView user={user} />}
          {activePage !== 'home' && (
            <PlaceholderView label={currentLabel} />
          )}
        </div>
      </main>
    </div>
  )
}

// ── Vista de inicio ────────────────────────────────────────────────────────
function HomeView({ user }) {
  return (
    <>
      <div className="dash-welcome">
        Hola, <strong>{user.name.split(' ')[0]}</strong> 👋
      </div>

      {/* Métricas */}
      <div className="dash-metrics">
        {METRICS.map(m => (
          <div key={m.label} className="dash-metric">
            <span className="dash-metric-label">{m.label}</span>
            <span className="dash-metric-value">{m.value}</span>
            <span className={`dash-metric-change ${m.positive ? 'up' : 'down'}`}>
              {m.positive ? '↑' : '↓'} {m.change} este mes
            </span>
          </div>
        ))}
      </div>

      {/* Tarjetas */}
      <div className="dash-cards">
        {/* Actividad reciente */}
        <div className="dash-card">
          <div className="dash-card-head">
            <span className="dash-card-title">Actividad reciente</span>
            <button className="dash-card-link">Ver todo</button>
          </div>
          <div className="dash-activity">
            {ACTIVITY.map((item, i) => (
              <div key={i} className="dash-activity-item">
                <div className={`dash-act-icon color-${item.color}`}>
                  <Icon name={item.icon} size={14} />
                </div>
                <div className="dash-act-text">
                  <span className="dash-act-title">{item.title}</span>
                  <span className="dash-act-sub">{item.sub}</span>
                </div>
                <span className="dash-act-time">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Uso por sección */}
        <div className="dash-card">
          <div className="dash-card-head">
            <span className="dash-card-title">Uso por sección</span>
          </div>
          <div className="dash-bars">
            {USAGE.map(u => (
              <div key={u.label} className="dash-bar-row">
                <span className="dash-bar-label">{u.label}</span>
                <div className="dash-bar-track">
                  <div className="dash-bar-fill" style={{ width: `${u.pct}%` }} />
                </div>
                <span className="dash-bar-pct">{u.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

// ── Placeholder para otras páginas ─────────────────────────────────────────
function PlaceholderView({ label }) {
  return (
    <div className="dash-placeholder">
      <div className="dash-placeholder-inner">
        <span className="dash-placeholder-icon">🚧</span>
        <h2>{label}</h2>
        <p>Esta sección está en construcción.</p>
      </div>
    </div>
  )
}

export default Dashboard
