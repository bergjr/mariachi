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
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import PeopleIcon from '@mui/icons-material/People'
import SettingsIcon from '@mui/icons-material/Settings'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { getCars } from '../../api/cars'
import { useAuth } from '../../context/AuthContext'
import { useBookings } from '../../context/BookingsContext'
import CarBookingModal from '../CarBookingModal/CarBookingModal'
import styles from './CarsList.module.scss'

export default function CarsList() {
  const [cars,     setCars]    = useState([])
  const [loading,  setLoading] = useState(true)
  const [fetchErr, setFetchErr] = useState('')
  const [query,    setQuery]   = useState('')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [selectedCar, setSelectedCar] = useState(null)
  const { user, openLoginModal } = useAuth()
  const { addBooking } = useBookings()

  useEffect(() => {
    getCars()
      .then(setCars)
      .catch(() => setFetchErr('Could not load cars. Please try again later.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = cars.filter(({ make, model, category, city, country }) =>
    [make, model, category, city, country].some((v) =>
      v?.toLowerCase().includes(query.toLowerCase())
    )
  )

  const handleBook = async (car) => {
    if (!user) { openLoginModal(); return }
    try {
      await addBooking('car', car)
      setSnackbar({ open: true, message: `${car.make} ${car.model} rented!`, severity: 'success' })
    } catch {
      setSnackbar({ open: true, message: 'Booking failed. Please try again.', severity: 'error' })
    }
  }

  return (
    <Box component="section" className={styles.section}>
      <Typography variant="h5" className={styles.heading}>Available Cars</Typography>

      <TextField
        placeholder="Search by make, model, category or city…"
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
        <Typography className={styles.empty}>No cars match your search.</Typography>
      )}

      {!loading && !fetchErr && filtered.length > 0 && (
        <Box className={styles.grid}>
          {filtered.map((car) => (
            <Box key={car._id} className={styles.card}>
              <Box className={styles.cardHeader}>
                <DirectionsCarIcon className={styles.carIcon} />
                <Box>
                  <Typography className={styles.name}>{car.make} {car.model} {car.year}</Typography>
                  <Typography className={styles.category}>{car.category}</Typography>
                </Box>
              </Box>

              <Box className={styles.details}>
                <Box className={styles.detail}>
                  <PeopleIcon className={styles.detailIcon} />
                  <Typography className={styles.detailText}>{car.seats} seats</Typography>
                </Box>
                <Box className={styles.detail}>
                  <SettingsIcon className={styles.detailIcon} />
                  <Typography className={styles.detailText}>{car.transmission}</Typography>
                </Box>
              </Box>

              <Box className={styles.location}>
                <LocationOnIcon className={styles.detailIcon} />
                <Typography className={styles.locationText}>{car.city}, {car.country}</Typography>
              </Box>

              <Box className={styles.footer}>
                <Typography className={styles.price}>€{car.pricePerDay}<span>/day</span></Typography>
                <Button variant="contained" className={styles.btn} onClick={() => {
                  if (!user) { openLoginModal(); return }
                  setSelectedCar(car)
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

      <CarBookingModal
        open={!!selectedCar}
        car={selectedCar}
        onClose={() => setSelectedCar(null)}
        onConfirm={handleBook}
      />
    </Box>
  )
}
