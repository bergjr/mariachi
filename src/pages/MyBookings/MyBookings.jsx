import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import LuggageIcon from '@mui/icons-material/Luggage'
import { useBookings } from '../../context/BookingsContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import FlightBookingsSection from '../../components/FlightBookingsSection/FlightBookingsSection'
import HotelBookingsSection from '../../components/HotelBookingsSection/HotelBookingsSection'
import CarBookingsSection from '../../components/CarBookingsSection/CarBookingsSection'
import styles from './MyBookings.module.scss'

export default function MyBookings() {
  const { flightBookings, hotelBookings, carBookings, totalBookings, cancelBooking, loading } = useBookings()
  const { user, openLoginModal } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) { navigate('/'); openLoginModal() }
  }, [user, navigate, openLoginModal])

  if (!user) return null

  return (
    <Box className={styles.page}>
      <Box className={styles.pageHeader}>
        <LuggageIcon className={styles.pageIcon} />
        <Box>
          <Typography variant="h4" className={styles.pageTitle}>My Bookings</Typography>
          <Typography className={styles.pageSubtitle}>
            Hello, <strong>{user.name}</strong> — you have {totalBookings} booking{totalBookings !== 1 ? 's' : ''}
          </Typography>
        </Box>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box className={styles.container}>
          <FlightBookingsSection bookings={flightBookings} onCancel={cancelBooking} />
          <HotelBookingsSection  bookings={hotelBookings}  onCancel={cancelBooking} />
          <CarBookingsSection    bookings={carBookings}    onCancel={cancelBooking} />
        </Box>
      )}
    </Box>
  )
}