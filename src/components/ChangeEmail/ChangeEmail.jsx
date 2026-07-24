import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import EmailIcon from '@mui/icons-material/Email'
import SaveIcon from '@mui/icons-material/Save'
import { useAuth } from '../../context/AuthContext'
import styles from './ChangeEmail.module.scss'

export default function ChangeEmail() {
  const { user, updateUser } = useAuth()
  const [form,     setForm]    = useState({ email: '', currentPassword: '' })
  const [errors,   setErrors]  = useState({})
  const [saving,   setSaving]  = useState(false)
  const [success,  setSuccess] = useState(false)
  const [apiError, setApiError] = useState('')

  const validate = () => {
    const e = {}
    if (!form.email.trim())                      e.email           = 'Required'
    else if (!/\S+@\S+\.\S+/.test(form.email))  e.email           = 'Enter a valid email'
    else if (form.email === user?.email)         e.email           = 'This is already your current email'
    if (!form.currentPassword)                   e.currentPassword = 'Required'
    return e
  }

  const handleSubmit = async () => {
    setApiError(''); setSuccess(false)
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSaving(true)
    try {
      await updateUser({ email: form.email, currentPassword: form.currentPassword })
      setSuccess(true)
      setForm({ email: '', currentPassword: '' })
      setErrors({})
    } catch (err) {
      setApiError(err.message)
    } finally { setSaving(false) }
  }

  return (
    <Box className={styles.card}>
      <Box className={styles.cardHeader}>
        <EmailIcon className={styles.cardIcon} />
        <Typography variant="h6" className={styles.cardTitle}>Change Email</Typography>
      </Box>
      <Typography className={styles.currentValue}>
        Current email: <strong>{user?.email}</strong>
      </Typography>
      <Divider className={styles.divider} />

      {success  && <Alert severity="success" className={styles.alert}>Email updated successfully.</Alert>}
      {apiError && <Alert severity="error"   className={styles.alert}>{apiError}</Alert>}

      <Box className={styles.form}>
        <TextField label="New Email" size="small" type="email"
          value={form.email}
          onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }) }}
          error={!!errors.email} helperText={errors.email} className={styles.field} />
        <TextField label="Current Password" size="small" type="password"
          value={form.currentPassword}
          onChange={(e) => { setForm({ ...form, currentPassword: e.target.value }); setErrors({ ...errors, currentPassword: '' }) }}
          error={!!errors.currentPassword} helperText={errors.currentPassword} className={styles.field} />
        <Button variant="contained" className={styles.submitBtn} onClick={handleSubmit} disabled={saving}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}>
          Update Email
        </Button>
      </Box>
    </Box>
  )
}
