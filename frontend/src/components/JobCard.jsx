const TYPE_COLORS = {
  'On-site': { bg: '#3b82f622', color: '#60a5fa' },
  'Remote': { bg: '#22c55e22', color: '#4ade80' },
  'Hybrid': { bg: '#f59e0b22', color: '#fbbf24' },
}

export default function JobCard({ job, onClick }) {
  const typeStyle = TYPE_COLORS[job.type] || TYPE_COLORS['On-site']

  return (
    <div style={s.card} onClick={onClick}>
      <div style={s.role}>{job.role}</div>
      <div style={s.company}>{job.company}</div>
      {job.notes && (
        <div style={s.notes}>{job.notes.slice(0, 60)}{job.notes.length > 60 ? '…' : ''}</div>
      )}
      <div style={s.footer}>
        <span style={{ ...s.tag, background: typeStyle.bg, color: typeStyle.color }}>
          {job.type}
        </span>
        <span style={s.date}>{job.date || ''}</span>
      </div>
      {job.link && (
        <a
          href={job.link}
          target="_blank"
          rel="noreferrer"
          style={s.link}
          onClick={e => e.stopPropagation()}
        >
          View posting →
        </a>
      )}
    </div>
  )
}

const s = {
  card: {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '12px 14px',
    marginBottom: '8px',
    cursor: 'pointer',
    transition: 'border-color 0.15s, transform 0.1s',
  },
  role: { fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '3px' },
  company: { fontSize: '13px', color: 'var(--text2)', marginBottom: '8px' },
  notes: { fontSize: '12px', color: 'var(--text3)', marginBottom: '8px', lineHeight: 1.5 },
  footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  tag: { fontSize: '11px', padding: '3px 8px', borderRadius: '99px', fontWeight: 500 },
  date: { fontSize: '11px', color: 'var(--text3)' },
  link: { display: 'block', fontSize: '12px', color: 'var(--accent)', marginTop: '8px' },
}
