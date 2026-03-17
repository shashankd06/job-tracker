import { useState, useEffect } from 'react'

const today = new Date().toISOString().split('T')[0]

const empty = {
  role: '', company: '', status: 'Applied',
  type: 'On-site', date: today, notes: '', link: '',
}

export default function JobModal({ job, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (job) {
      setForm({
        role: job.role || '',
        company: job.company || '',
        status: job.status || 'Applied',
        type: job.type || 'On-site',
        date: job.date || today,
        notes: job.notes || '',
        link: job.link || '',
      })
    } else {
      setForm(empty)
    }
  }, [job])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSave = async () => {
    if (!form.role.trim() || !form.company.trim()) {
      alert('Role and Company are required')
      return
    }
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  const handleDelete = () => {
    if (window.confirm('Delete this application?')) {
      onDelete(job._id)
    }
  }

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        <div style={s.header}>
          <h2 style={s.title}>{job ? 'Edit Application' : 'Add Application'}</h2>
          <button style={s.close} onClick={onClose}>✕</button>
        </div>

        <div style={s.body}>
          <div style={s.row}>
            <Field label="Role / Position" required>
              <input
                type="text"
                placeholder="e.g. Frontend Intern"
                value={form.role}
                onChange={e => set('role', e.target.value)}
              />
            </Field>
            <Field label="Company" required>
              <input
                type="text"
                placeholder="e.g. Razorpay"
                value={form.company}
                onChange={e => set('company', e.target.value)}
              />
            </Field>
          </div>

          <div style={s.row}>
            <Field label="Status">
              <select value={form.status} onChange={e => set('status', e.target.value)}>
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </Field>
            <Field label="Work Type">
              <select value={form.type} onChange={e => set('type', e.target.value)}>
                <option>On-site</option>
                <option>Remote</option>
                <option>Hybrid</option>
              </select>
            </Field>
          </div>

          <div style={s.row}>
            <Field label="Date Applied">
              <input
                type="date"
                value={form.date}
                onChange={e => set('date', e.target.value)}
              />
            </Field>
            <Field label="Job Posting Link">
              <input
                type="url"
                placeholder="https://..."
                value={form.link}
                onChange={e => set('link', e.target.value)}
              />
            </Field>
          </div>

          <Field label="Notes">
            <textarea
              placeholder="Interview rounds, contacts, referral details..."
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              style={{ minHeight: '90px' }}
            />
          </Field>
        </div>

        <div style={s.footer}>
          {job && (
            <button style={s.btnDel} onClick={handleDelete}>Delete</button>
          )}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            <button style={s.btnCancel} onClick={onClose}>Cancel</button>
            <button style={s.btnSave} onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
      <label style={{ fontSize: '12px', color: 'var(--text2)', fontWeight: 500 }}>
        {label}{required && <span style={{ color: '#ff4d4d' }}> *</span>}
      </label>
      {children}
    </div>
  )
}

const s = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' },
  modal: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '560px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' },
  title: { fontSize: '16px', fontWeight: 600 },
  close: { background: 'none', border: 'none', color: 'var(--text2)', fontSize: '18px', cursor: 'pointer', padding: '4px' },
  body: { padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' },
  row: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  footer: { display: 'flex', alignItems: 'center', padding: '1rem 1.5rem', borderTop: '1px solid var(--border)' },
  btnDel: { background: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d55', borderRadius: 'var(--radius)', padding: '8px 16px', fontSize: '13px' },
  btnCancel: { background: 'transparent', color: 'var(--text2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '8px 16px', fontSize: '13px' },
  btnSave: { background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: '8px 20px', fontSize: '13px', fontWeight: 600 },
}
