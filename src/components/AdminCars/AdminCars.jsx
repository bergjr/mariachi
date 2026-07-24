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
import { getCars, createCar, updateCar, deleteCar } from '../../api/cars'
import styles from './AdminCars.module.scss'

const EMPTY = { make: '', model: '', year: '', category: 'economy', city: '', country: '', seats: '', transmission: 'automatic', pricePerDay: '' }

export default function AdminCars() {
  const [list,      setList]      = useState([])
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form,      setForm]      = useState(EMPTY)
  const [errors,    setErrors]    = useState({})

  useEffect(() => { getCars().then(setList).finally(() => setLoading(false)) }, [])

  const validate = () => {
    const e = {}
    if (!form.make.trim())  e.make  = 'Required'
    if (!form.model.trim()) e.model = 'Required'
    if (!form.year || isNaN(Number(form.year))) e.year = 'Valid year required'
    if (!form.city.trim())    e.city    = 'Required'
    if (!form.country.trim()) e.country = 'Required'
    if (!form.seats || isNaN(Number(form.seats)) || Number(form.seats) <= 0) e.seats = 'Valid number required'
    if (!form.pricePerDay || isNaN(Number(form.pricePerDay)) || Number(form.pricePerDay) <= 0) e.pricePerDay = 'Valid price required'
    return e
  }

  const handleEdit = (c) => {
    setEditingId(c._id)
    setForm({ make: c.make, model: c.model, year: String(c.year), category: c.category,
      city: c.city, country: c.country, seats: String(c.seats), transmission: c.transmission, pricePerDay: String(c.pricePerDay) })
    setErrors({})
  }

  const handleCancelEdit = () => { setEditingId(null); setForm(EMPTY); setErrors({}) }

  const handleSave = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSaving(true)
    try {
      const payload = { ...form, year: Number(form.year), seats: Number(form.seats), pricePerDay: Number(form.pricePerDay) }
      if (editingId) {
        const updated = await updateCar(editingId, payload)
        setList((l) => l.map((c) => c._id === editingId ? updated : c))
        setEditingId(null)
      } else {
        const created = await createCar(payload)
        setList((l) => [...l, created])
      }
      setForm(EMPTY); setErrors({})
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (editingId === id) handleCancelEdit()
    await deleteCar(id)
    setList((l) => l.filter((c) => c._id !== id))
  }

  const field = (label, key, placeholder = '') => (
    <TextField label={label} size="small" value={form[key]}
      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      error={!!errors[key]} helperText={errors[key]} placeholder={placeholder} className={styles.field} />
  )

  return (
    <Box className={styles.adminSection}>
      <Typography variant="h6" className={styles.sectionTitle}>
        {editingId ? 'Edit Car' : 'Add New Car'}
        {editingId && <Button size="small" startIcon={<CloseIcon />} onClick={handleCancelEdit} className={styles.cancelBtn}>Cancel</Button>}
      </Typography>

      <Box className={styles.formGrid}>
        {field('Make', 'make', 'Toyota')}
        {field('Model', 'model', 'Corolla')}
        {field('Year', 'year', '2024')}
        <TextField select label="Category" size="small" value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })} className={styles.field}>
          {['economy', 'compact', 'midsize', 'suv', 'luxury', 'van'].map((c) =>
            <MenuItem key={c} value={c} sx={{ textTransform: 'capitalize' }}>{c}</MenuItem>
          )}
        </TextField>
        {field('City', 'city', 'Cancún')}
        {field('Country', 'country', 'Mexico')}
        {field('Seats', 'seats', '5')}
        <TextField select label="Transmission" size="small" value={form.transmission}
          onChange={(e) => setForm({ ...form, transmission: e.target.value })} className={styles.field}>
          {['automatic', 'manual'].map((t) =>
            <MenuItem key={t} value={t} sx={{ textTransform: 'capitalize' }}>{t}</MenuItem>
          )}
        </TextField>
        {field('Price per day (€)', 'pricePerDay', '35')}
      </Box>

      <Button variant="contained" className={styles.addBtn} onClick={handleSave} disabled={saving}
        startIcon={saving ? <CircularProgress size={16} color="inherit" /> : editingId ? <SaveIcon /> : <AddIcon />}>
        {editingId ? 'Save Changes' : 'Add Car'}
      </Button>

      <Divider className={styles.divider} />
      <Typography variant="h6" className={styles.sectionTitle}>
        Existing Cars <Chip label={list.length} size="small" className={styles.chip} />
      </Typography>

      {loading ? <CircularProgress size={28} /> : (
        <Box className={styles.table} style={{ '--cols': '1.5fr 0.6fr 1fr 1.5fr 0.5fr 1fr 0.8fr 80px' }}>
          <Box className={styles.tableHeader}>
            <span>Make & Model</span><span>Year</span><span>Category</span><span>Location</span><span>Seats</span><span>Transmission</span><span>Price/day</span><span></span>
          </Box>
          {list.map((c) => (
            <Box key={c._id} className={`${styles.tableRow} ${editingId === c._id ? styles.tableRowEditing : ''}`}>
              <span>{c.make} {c.model}</span><span>{c.year}</span>
              <span style={{ textTransform: 'capitalize' }}>{c.category}</span>
              <span>{c.city}, {c.country}</span><span>{c.seats}</span>
              <span style={{ textTransform: 'capitalize' }}>{c.transmission}</span>
              <span>€{c.pricePerDay}</span>
              <span className={styles.rowActions}>
                <Button size="small" onClick={() => handleEdit(c)} disabled={!!editingId && editingId !== c._id}><EditIcon fontSize="small" /></Button>
                <Button size="small" color="error" onClick={() => handleDelete(c._id)}><DeleteIcon fontSize="small" /></Button>
              </span>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}
