import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * Route guard for admin-only pages (e.g. /admin). Without this, anyone could
 * reach the Admin page directly by typing the URL — the Navbar link was
 * hidden for non-admins, but the route itself had no access check.
 *
 * While the stored auth token is still being re-validated on initial load we
 * show a spinner instead of redirecting, so a legitimate admin refreshing
 * /admin isn't briefly bounced out before their session finishes loading.
 */
export default function RequireAdmin({ children }) {
  const { user, authLoading } = useAuth()

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}
