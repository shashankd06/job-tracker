import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Navbar({ user, onAdd }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={s.nav}>
      <div style={s.inner}>
        <div style={s.brand}>
          <span style={s.logo}>⚡</span>
          <span style={s.name}>JobTracker</span>
        </div>
        <div style={s.right}>
          {user && <span style={s.userName}>Hi, {user.name.split(' ')[0]}</span>}
          <button style={s.btnAdd} onClick={onAdd}>+ Add Job</button>
          <button style={s.btnLogout} onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  )
}

const s = {
  nav: { background: 'var(--surface)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50 },
  inner: { maxWidth: '1300px', margin: '0 auto', padding: '0 1rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  brand: { display: 'flex', alignItems: 'center', gap: '8px' },
  logo: { fontSize: '20px' },
  name: { fontSize: '18px', fontWeight: 700, color: 'var(--text)' },
  right: { display: 'flex', alignItems: 'center', gap: '12px' },
  userName: { fontSize: '14px', color: 'var(--text2)' },
  btnAdd: { background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: '8px 16px', fontSize: '13px', fontWeight: 600 },
  btnLogout: { background: 'transparent', color: 'var(--text2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '8px 14px', fontSize: '13px' },
}
