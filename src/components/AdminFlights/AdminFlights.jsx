import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import MenuItem from '@mui/material/MenuItem'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
import SaveIcon from '@mui/icons-material/Save'
import { getFlights, createFlight, updateFlight, deleteFlight } from '../../api/flights'
import styles from './AdminFlights.module.scss'

const EMPTY = { from: '', to: '', airline: '', departure: '', arrival: '', duration: '', price: '', stops: 'Non-stop' }

const fmt = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return `${String(d.getUTCDate()).padStart(2,'0')}/${String(d.getUTCMonth()+1).padStart(2,'0')} ${String(d.getUTCHours()).padStart(2,'0')}:${String(d.getUTCMinutes()).padStart(2,'0')}`
}

export default function AdminFlights() {
  const [list,      setList]      = useState([])
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form,      setForm]      = useState(EMPTY)
  const [errors,    setErrors]    = useState({})

  useEffect(() => { getFlights().then(setList).finally(() => setLoading(false)) }, [])

  const validate = () => {
    const e = {}
    if (!form.from.trim())      e.from      = 'Required'
    if (!form.to.trim())        e.to        = 'Required'
    if (!form.airline.trim())   e.airline   = 'Required'
    if (!form.departure.trim()) e.departure = 'Required'
    if (!form.arrival.trim())   e.arrival   = 'Required'
    if (!form.duration.trim())  e.duration  = 'Required'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Valid price required'
    return e
  }

  const handleEdit = (f) => {
    setEditingId(f._id)
    setForm({ from: f.from, to: f.to, airline: f.airline, departure: f.departure,
      arrival: f.arrival, duration: f.duration, price: String(f.price), stops: f.stops })
    setErrors({})
  }

  const handleCancelEdit = () => { setEditingId(null); setForm(EMPTY); setErrors({}) }

  const handleSave = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSaving(true)
    try {
      if (editingId) {
        const updated = await updateFlight(editingId, { ...form, price: Number(form.price) })
        setList((l) => l.map((f) => f._id === editingId ? updated : f))
        setEditingId(null)
      } else {
        const created = await createFlight({ ...form, price: Number(form.price) })
        setList((l) => [...l, created])
      }
      setForm(EMPTY); setErrors({})
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (editingId === id) handleCancelEdit()
    await deleteFlight(id)
    setList((l) => l.filter((f) => f._id !== id))
  }

  const field = (label, key, placeholder = '') => (
    <TextField label={label} size="small" value={form[key]}
      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      error={!!errors[key]} helperText={errors[key]} placeholder={placeholder} className={styles.field} />
  )

  return (
    <Box className={styles.adminSection}>
      <Typography variant="h6" className={styles.sectionTitle}>
        {editingId ? 'Edit Flight' : 'Add New Flight'}
        {editingId && <Button size="small" startIcon={<CloseIcon />} onClick={handleCancelEdit} className={styles.cancelBtn}>Cancel</Button>}
      </Typography>

      <Box className={styles.formGrid}>
        {field('From', 'from', 'Madrid')}
        {field('To', 'to', 'Cancún')}
        {field('Airline', 'airline', 'Iberia')}
        {field('Departure', 'departure', '10:00')}
        {field('Arrival', 'arrival', '15:30')}
        {field('Duration', 'duration', '10h 30m')}
        {field('Price (€)', 'price', '420')}
        <TextField select label="Stops" size="small" value={form.stops}
          onChange={(e) => setForm({ ...form, stops: e.target.value })} className={styles.field}>
          {['Non-stop', '1 stop', '2+ stops'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
      </Box>

      <Button variant="contained" className={styles.addBtn} onClick={handleSave} disabled={saving}
        startIcon={saving ? <CircularProgress size={16} color="inherit" /> : editingId ? <SaveIcon /> : <AddIcon />}>
        {editingId ? 'Save Changes' : 'Add Flight'}
      </Button>

      <Divider className={styles.divider} />
      <Typography variant="h6" className={styles.sectionTitle}>
        Existing Flights <Chip label={list.length} size="small" className={styles.chip} />
      </Typography>

      {loading ? <CircularProgress size={28} /> : (
        <Box className={styles.table} style={{ '--cols': '3fr 1.5fr 2.5fr 1fr 1fr 0.8fr 80px' }}>
          <Box className={styles.tableHeader}>
            <span>Route</span><span>Airline</span><span>Times</span><span>Duration</span><span>Stops</span><span>Price</span><span></span>
          </Box>
          {list.map((f) => (
            <Box key={f._id} className={`${styles.tableRow} ${editingId === f._id ? styles.tableRowEditing : ''}`}>
              <span>{f.from} → {f.to}</span><span>{f.airline}</span>
              <span>{fmt(f.departure)} – {fmt(f.arrival)}</span><span>{f.duration}</span>
              <span>{f.stops}</span><span>€{f.price}</span>
              <span className={styles.rowActions}>
                <Button size="small" onClick={() => handleEdit(f)} disabled={!!editingId && editingId !== f._id}><EditIcon fontSize="small" /></Button>
                <Button size="small" color="error" onClick={() => handleDelete(f._id)}><DeleteIcon fontSize="small" /></Button>
              </span>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}
