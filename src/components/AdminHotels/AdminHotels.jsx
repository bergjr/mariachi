import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
import SaveIcon from '@mui/icons-material/Save'
import { getHotels, createHotel, updateHotel, deleteHotel } from '../../api/hotels'
import styles from './AdminHotels.module.scss'

const EMPTY = { name: '', city: '', country: '', price: '', amenities: '' }

export default function AdminHotels() {
  const [list,      setList]      = useState([])
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form,      setForm]      = useState(EMPTY)
  const [errors,    setErrors]    = useState({})

  useEffect(() => { getHotels().then(setList).finally(() => setLoading(false)) }, [])

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'Required'
    if (!form.city.trim())    e.city    = 'Required'
    if (!form.country.trim()) e.country = 'Required'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Valid price required'
    return e
  }

  const handleEdit = (h) => {
    setEditingId(h._id)
    setForm({ name: h.name, city: h.city, country: h.country, price: String(h.price),
      amenities: Array.isArray(h.amenities) ? h.amenities.join(', ') : h.amenities })
    setErrors({})
  }

  const handleCancelEdit = () => { setEditingId(null); setForm(EMPTY); setErrors({}) }

  const handleSave = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSaving(true)
    try {
      const amenities = form.amenities.split(',').map((a) => a.trim()).filter(Boolean)
      if (editingId) {
        const updated = await updateHotel(editingId, { ...form, price: Number(form.price), amenities })
        setList((l) => l.map((h) => h._id === editingId ? updated : h))
        setEditingId(null)
      } else {
        const created = await createHotel({ ...form, price: Number(form.price), amenities })
        setList((l) => [...l, created])
      }
      setForm(EMPTY); setErrors({})
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (editingId === id) handleCancelEdit()
    await deleteHotel(id)
    setList((l) => l.filter((h) => h._id !== id))
  }

  const field = (label, key, placeholder = '', helper = '') => (
    <TextField label={label} size="small" value={form[key]}
      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      error={!!errors[key]} helperText={errors[key] || helper}
      placeholder={placeholder} className={styles.field} />
  )

  return (
    <Box className={styles.adminSection}>
      <Typography variant="h6" className={styles.sectionTitle}>
        {editingId ? 'Edit Hotel' : 'Add New Hotel'}
        {editingId && <Button size="small" startIcon={<CloseIcon />} onClick={handleCancelEdit} className={styles.cancelBtn}>Cancel</Button>}
      </Typography>

      <Box className={styles.formGrid}>
        {field('Hotel Name', 'name', 'Grand Velas Riviera Maya')}
        {field('City', 'city', 'Playa del Carmen')}
        {field('Country', 'country', 'Mexico')}
        {field('Price per night (€)', 'price', '520')}
        {field('Amenities', 'amenities', 'Beach, Pool, Spa', 'Comma-separated')}
      </Box>

      <Button variant="contained" className={styles.addBtn} onClick={handleSave} disabled={saving}
        startIcon={saving ? <CircularProgress size={16} color="inherit" /> : editingId ? <SaveIcon /> : <AddIcon />}>
        {editingId ? 'Save Changes' : 'Add Hotel'}
      </Button>

      <Divider className={styles.divider} />
      <Typography variant="h6" className={styles.sectionTitle}>
        Existing Hotels <Chip label={list.length} size="small" className={styles.chip} />
      </Typography>

      {loading ? <CircularProgress size={28} /> : (
        <Box className={styles.table} style={{ '--cols': '2fr 1fr 1fr 2fr 0.8fr 80px' }}>
          <Box className={styles.tableHeader}>
            <span>Name</span><span>City</span><span>Country</span><span>Amenities</span><span>Price/night</span><span></span>
          </Box>
          {list.map((h) => (
            <Box key={h._id} className={`${styles.tableRow} ${editingId === h._id ? styles.tableRowEditing : ''}`}>
              <span>{h.name}</span><span>{h.city}</span><span>{h.country}</span>
              <span>{h.amenities.join(', ')}</span><span>€{h.price}</span>
              <span className={styles.rowActions}>
                <Button size="small" onClick={() => handleEdit(h)} disabled={!!editingId && editingId !== h._id}><EditIcon fontSize="small" /></Button>
                <Button size="small" color="error" onClick={() => handleDelete(h._id)}><DeleteIcon fontSize="small" /></Button>
              </span>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}
