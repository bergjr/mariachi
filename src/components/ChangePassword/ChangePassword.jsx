import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import LockIcon from '@mui/icons-material/Lock'
import SaveIcon from '@mui/icons-material/Save'
import { useAuth } from '../../context/AuthContext'
import styles from './ChangePassword.module.scss'

export default function ChangePassword() {
  const { updateUser } = useAuth()
  const [form,     setForm]    = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [errors,   setErrors]  = useState({})
  const [saving,   setSaving]  = useState(false)
  const [success,  setSuccess] = useState(false)
  const [apiError, setApiError] = useState('')

  const validate = () => {
    const e = {}
    if (!form.currentPassword)                          e.currentPassword = 'Required'
    if (!form.newPassword)                              e.newPassword     = 'Required'
    else if (form.newPassword.length < 8)               e.newPassword     = 'At least 8 characters'
    else if (form.newPassword === form.currentPassword) e.newPassword     = 'New password must differ from current'
    if (!form.confirmPassword)                          e.confirmPassword = 'Required'
    else if (form.confirmPassword !== form.newPassword) e.confirmPassword = 'Passwords do not match'
    return e
  }

  const handleSubmit = async () => {
    setApiError(''); setSuccess(false)
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setSaving(true)
    try {
      await updateUser({ password: form.newPassword, currentPassword: form.currentPassword })
      setSuccess(true)
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setErrors({})
    } catch (err) {
      setApiError(err.message)
    } finally { setSaving(false) }
  }

  const f = (label, key, extra = {}) => (
    <TextField label={label} size="small" type="password" value={form[key]}
      onChange={(e) => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: '' }) }}
      error={!!errors[key]} helperText={errors[key]} className={styles.field} {...extra} />
  )

  return (
    <Box className={styles.card}>
      <Box className={styles.cardHeader}>
        <LockIcon className={styles.cardIcon} />
        <Typography variant="h6" className={styles.cardTitle}>Change Password</Typography>
      </Box>
      <Divider className={styles.divider} />

      {success  && <Alert severity="success" className={styles.alert}>Password updated successfully.</Alert>}
      {apiError && <Alert severity="error"   className={styles.alert}>{apiError}</Alert>}

      <Box className={styles.form}>
        {f('Current Password',     'currentPassword')}
        {f('New Password',         'newPassword', { helperText: errors.newPassword || 'Minimum 8 characters' })}
        {f('Confirm New Password', 'confirmPassword')}
        <Button variant="contained" className={styles.submitBtn} onClick={handleSubmit} disabled={saving}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}>
          Update Password
        </Button>
      </Box>
    </Box>
  )
}
