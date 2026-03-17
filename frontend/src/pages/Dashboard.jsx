import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import JobCard from '../components/JobCard'
import JobModal from '../components/JobModal'
import Navbar from '../components/Navbar'

const API = import.meta.env.VITE_API_URL

const STAGES = ['Applied', 'Interview', 'Offer', 'Rejected']

const STAGE_COLORS = {
  Applied: '#3b82f6',
  Interview: '#f59e0b',
  Offer: '#22c55e',
  Rejected: '#ef4444',
}

export default function Dashboard() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState(null)

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API}/jobs`)
      setJobs(res.data)
    } catch (err) {
      console.error('Failed to fetch jobs', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchJobs() }, [])

  const filtered = jobs.filter(j => {
    const matchSearch = !search ||
      j.role.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase())
    const matchType = !filterType || j.type === filterType
    return matchSearch && matchType
  })

  const byStage = (stage) => filtered.filter(j => j.status === stage)

  const stats = {
    total: jobs.length,
    interviews: jobs.filter(j => j.status === 'Interview').length,
    offers: jobs.filter(j => j.status === 'Offer').length,
    rate: jobs.length ? Math.round((jobs.filter(j => j.status !== 'Applied' && j.status !== 'Rejected').length / jobs.length) * 100) : 0,
  }

  const openAdd = () => { setEditingJob(null); setModalOpen(true) }
  const openEdit = (job) => { setEditingJob(job); setModalOpen(true) }

  const handleSave = async (formData) => {
    try {
      if (editingJob) {
        const res = await axios.put(`${API}/jobs/${editingJob._id}`, formData)
        setJobs(prev => prev.map(j => j._id === editingJob._id ? res.data : j))
      } else {
        const res = await axios.post(`${API}/jobs`, formData)
        setJobs(prev => [res.data, ...prev])
      }
      setModalOpen(false)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save')
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/jobs/${id}`)
      setJobs(prev => prev.filter(j => j._id !== id))
      setModalOpen(false)
    } catch (err) {
      alert('Failed to delete')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Navbar user={user} onAdd={openAdd} />

      <div style={s.container}>
        {/* Stats */}
        <div style={s.statsGrid}>
          {[
            { label: 'Total Applied', value: stats.total, color: '#6c63ff' },
            { label: 'Interviews', value: stats.interviews, color: '#f59e0b' },
            { label: 'Offers', value: stats.offers, color: '#22c55e' },
            { label: 'Response Rate', value: `${stats.rate}%`, color: '#3b82f6' },
          ].map(stat => (
            <div key={stat.label} style={s.statCard}>
              <div style={{ ...s.statVal, color: stat.color }}>{stat.value}</div>
              <div style={s.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={s.controls}>
          <input
            type="text"
            placeholder="Search role or company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: '200px' }}
          />
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="">All types</option>
            <option>On-site</option>
            <option>Remote</option>
            <option>Hybrid</option>
          </select>
        </div>

        {/* Kanban Board */}
        {loading ? (
          <div style={s.loading}>Loading your applications...</div>
        ) : (
          <div style={s.board}>
            {STAGES.map(stage => (
              <div key={stage} style={s.col}>
                <div style={s.colHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ ...s.dot, background: STAGE_COLORS[stage] }} />
                    <span style={s.colTitle}>{stage}</span>
                  </div>
                  <span style={s.colCount}>{byStage(stage).length}</span>
                </div>
                <div style={s.colBody}>
                  {byStage(stage).length === 0 ? (
                    <div style={s.empty}>No applications</div>
                  ) : (
                    byStage(stage).map(job => (
                      <JobCard key={job._id} job={job} onClick={() => openEdit(job)} />
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <JobModal
          job={editingJob}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}

const s = {
  container: { maxWidth: '1300px', margin: '0 auto', padding: '1.5rem 1rem' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: '12px', marginBottom: '1.5rem' },
  statCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem 1.25rem' },
  statVal: { fontSize: '28px', fontWeight: 700, marginBottom: '4px' },
  statLabel: { fontSize: '13px', color: 'var(--text2)' },
  controls: { display: 'flex', gap: '10px', marginBottom: '1.5rem', flexWrap: 'wrap' },
  board: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: '14px' },
  col: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' },
  colHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--border)' },
  dot: { width: '8px', height: '8px', borderRadius: '50%' },
  colTitle: { fontSize: '13px', fontWeight: 600, color: 'var(--text)' },
  colCount: { fontSize: '12px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '99px', padding: '2px 8px', color: 'var(--text2)' },
  colBody: { padding: '12px', minHeight: '200px' },
  empty: { textAlign: 'center', padding: '2rem 0', fontSize: '13px', color: 'var(--text3)' },
  loading: { textAlign: 'center', padding: '4rem', color: 'var(--text2)' },
}
