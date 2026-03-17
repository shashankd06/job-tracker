import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const API = import.meta.env.VITE_API_URL

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await axios.post(`${API}/auth/login`, form)
      login(res.data.user, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Job Tracker</h1>
        <p style={styles.sub}>Sign in to your account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem', width: '100%', maxWidth: '400px' },
  title: { fontSize: '24px', fontWeight: 700, marginBottom: '4px' },
  sub: { color: 'var(--text2)', fontSize: '14px', marginBottom: '1.5rem' },
  error: { background: '#ff4d4d22', border: '1px solid #ff4d4d55', borderRadius: 'var(--radius)', padding: '10px 14px', fontSize: '14px', color: '#ff6b6b', marginBottom: '1rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', color: 'var(--text2)', fontWeight: 500 },
  btn: { background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: '12px', fontSize: '15px', fontWeight: 600, marginTop: '0.5rem', transition: 'background 0.15s' },
  footer: { textAlign: 'center', marginTop: '1.5rem', fontSize: '14px', color: 'var(--text2)' },
}
