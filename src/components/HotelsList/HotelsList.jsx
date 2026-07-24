import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { useSearchParams } from 'react-router-dom'
import { getHotels } from '../../api/hotels'
import { useAuth } from '../../context/AuthContext'
import { useBookings } from '../../context/BookingsContext'
import HotelBookingModal from '../HotelBookingModal/HotelBookingModal'
import styles from './HotelsList.module.scss'

export default function HotelsList() {
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('city') ?? ''

  const [hotels,   setHotels]  = useState([])
  const [loading,  setLoading] = useState(true)
  const [fetchErr, setFetchErr] = useState('')
  const [query,    setQuery]   = useState(initialQuery)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [selectedHotel, setSelectedHotel] = useState(null)
  const { user, openLoginModal } = useAuth()
  const { addBooking } = useBookings()

  useEffect(() => {
    getHotels()
      .then(setHotels)
      .catch(() => setFetchErr('Could not load hotels. Please try again later.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = hotels.filter(({ name, city, country }) =>
    [name, city, country].some((v) => v.toLowerCase().includes(query.toLowerCase()))
  )

  const handleBook = async (hotel, dates = {}) => {
    if (!user) { openLoginModal(); return }
    try {
      await addBooking('hotel', hotel, 1, dates)
      setSnackbar({ open: true, message: `${hotel.name} booked!`, severity: 'success' })
    } catch {
      setSnackbar({ open: true, message: 'Booking failed. Please try again.', severity: 'error' })
    }
  }

  return (
    <Box component="section" className={styles.section}>
      <Typography variant="h5" className={styles.heading}>Available Hotels</Typography>

      <TextField
        placeholder="Search by hotel name, city or country…"
        variant="outlined"
        size="small"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.searchBar}
        slotProps={{ input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}}
      />

      {loading && <Box className={styles.loaderWrap}><CircularProgress size={32} /></Box>}
      {fetchErr && <Typography className={styles.empty}>{fetchErr}</Typography>}

      {!loading && !fetchErr && filtered.length === 0 && (
        <Typography className={styles.empty}>No hotels match your search.</Typography>
      )}

      {!loading && !fetchErr && filtered.length > 0 && (
        <Box className={styles.grid}>
          {filtered.map((hotel) => (
            <Box key={hotel._id} className={styles.card}>
              <Typography className={styles.name}>{hotel.name}</Typography>
              <Typography className={styles.location}>{hotel.city}, {hotel.country}</Typography>

              <Box className={styles.amenities}>
                {hotel.amenities.map((a) => (
                  <Typography key={a} className={styles.tag}>{a}</Typography>
                ))}
              </Box>

              <Box className={styles.footer}>
                <Typography className={styles.price}>€{hotel.price}<span>/night</span></Typography>
                <Button variant="contained" className={styles.btn} onClick={() => {
                  if (!user) { openLoginModal(); return }
                  setSelectedHotel(hotel)
                }}>Book</Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      <HotelBookingModal
        open={!!selectedHotel}
        hotel={selectedHotel}
        onClose={() => setSelectedHotel(null)}
        onConfirm={handleBook}
      />
    </Box>
  )
}
