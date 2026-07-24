import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import ChangeEmail from '../../components/ChangeEmail/ChangeEmail'
import ChangePassword from '../../components/ChangePassword/ChangePassword'
import styles from './Account.module.scss'

export default function Account() {
  const { user, openLoginModal } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) { navigate('/'); openLoginModal() }
  }, [user, navigate, openLoginModal])

  if (!user) return null

  return (
    <Box className={styles.page}>
      <Box className={styles.header}>
        <AccountCircleIcon className={styles.headerIcon} />
        <Box>
          <Typography variant="h4" className={styles.title}>Account Settings</Typography>
          <Typography className={styles.subtitle}>{user.name} · {user.email}</Typography>
        </Box>
      </Box>
      <Box className={styles.container}>
        <ChangeEmail />
        <ChangePassword />
      </Box>
    </Box>
  )
}