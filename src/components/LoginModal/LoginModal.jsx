import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import CircularProgress from '@mui/material/CircularProgress'
import CloseIcon from '@mui/icons-material/Close'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useAuth } from '../../context/AuthContext'
import styles from './LoginModal.module.scss'

const empty = { name: '', email: '', password: '' }

export default function LoginModal({ open, onClose }) {
  const { login, register } = useAuth()
  const [tab,     setTab]    = useState(0)   // 0 = sign in, 1 = register
  const [form,    setForm]   = useState(empty)
  const [showPw,  setShowPw] = useState(false)
  const [error,   setError]  = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const reset = () => { setForm(empty); setError(''); setShowPw(false) }

  const handleClose = () => { reset(); onClose() }

  const handleTabChange = (_, v) => { reset(); setTab(v) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (tab === 0) {
        await login(form.email.trim(), form.password)
      } else {
        if (!form.name.trim()) { setError('Name is required.'); return }
        await register(form.name.trim(), form.email.trim(), form.password)
      }
      reset()
      onClose()
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isLoginDisabled  = !form.email || !form.password
  const isRegDisabled    = !form.name || !form.email || !form.password

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { className: styles.paper } }}
    >
      <DialogContent className={styles.content}>
        <IconButton className={styles.closeBtn} onClick={handleClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>

        <Box className={styles.iconWrap}>
          <LockOutlinedIcon className={styles.lockIcon} />
        </Box>

        <Tabs
          value={tab}
          onChange={handleTabChange}
          className={styles.tabs}
          slotProps={{ indicator: { className: styles.indicator } }}
          centered
        >
          <Tab label="Sign in"  className={styles.tab} />
          <Tab label="Register" className={styles.tab} />
        </Tabs>

        <Box component="form" onSubmit={handleSubmit} className={styles.form} noValidate>
          {tab === 1 && (
            <TextField
              label="Full name"
              variant="outlined"
              size="small"
              fullWidth
              autoFocus={tab === 1}
              value={form.name}
              onChange={set('name')}
              autoComplete="name"
            />
          )}

          <TextField
            label="Email"
            type="email"
            variant="outlined"
            size="small"
            fullWidth
            autoFocus={tab === 0}
            value={form.email}
            onChange={set('email')}
            autoComplete="email"
          />

          <TextField
            label="Password"
            variant="outlined"
            size="small"
            fullWidth
            type={showPw ? 'text' : 'password'}
            value={form.password}
            onChange={set('password')}
            autoComplete={tab === 0 ? 'current-password' : 'new-password'}
            slotProps={{ input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowPw((v) => !v)} edge="end">
                    {showPw ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}}
          />

          {error && (
            <Typography className={styles.error}>{error}</Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className={styles.submitBtn}
            disabled={loading || (tab === 0 ? isLoginDisabled : isRegDisabled)}
          >
            {loading
              ? <CircularProgress size={20} color="inherit" />
              : tab === 0 ? 'Sign in' : 'Create account'
            }
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
