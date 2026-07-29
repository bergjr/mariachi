import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import FlightLandIcon from '@mui/icons-material/FlightLand'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { useSearchParams } from 'react-router-dom'
import { getFlights } from '../../api/flights'
import { useAuth } from '../../context/AuthContext'
import { useBookings } from '../../context/BookingsContext'
import FlightBookingModal from '../FlightBookingModal/FlightBookingModal'
import { formatFlightDateTime, parseFlightDateTime } from '../../utils/flightDate'
import styles from './FlightsList.module.scss'

export default function FlightsList() {
  const [searchParams] = useSearchParams()
  const initialQuery = [searchParams.get('from'), searchParams.get('to')].filter(Boolean).join(' ')
  const departureParam = searchParams.get('departure')
  const returnParam = searchParams.get('return')

  const [flights,  setFlights]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [fetchErr, setFetchErr] = useState('')
  const [query,    setQuery]    = useState(initialQuery)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [selectedFlight, setSelectedFlight] = useState(null)
  const { user, openLoginModal } = useAuth()
  const { addBooking } = useBookings()

  useEffect(() => {
    getFlights()
      .then(setFlights)
      .catch(() => setFetchErr('Could not load flights. Please try again later.'))
      .finally(() => setLoading(false))
  }, [])

  const refreshFlights = () => getFlights().then(setFlights).catch(() => {})

  const filtered = flights.filter(({ from, to, airline, departure }) => {
    // Match every typed word against the combined fields (not the whole query as
    // a single substring) so "From" + "To" values entered separately in the
    // SearchBox — which get joined into one query string — still both match,
    // even though neither the `from` nor the `to` field alone contains both.
    const haystack = `${from} ${to} ${airline}`.toLowerCase()
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
    const matchesQuery = words.every((w) => haystack.includes(w))
    if (!matchesQuery) return false
    if (!departureParam) return true

    const flightDay = parseFlightDateTime(departure)
    if (!flightDay) return false

    const rangeStart = parseFlightDateTime(departureParam)
    const rangeEnd = parseFlightDateTime(returnParam) || rangeStart
    if (!rangeStart) return true

    return !flightDay.isBefore(rangeStart, 'day') && !flightDay.isAfter(rangeEnd, 'day')
  })

  const handleBook = async (flight, passengers = 1) => {
    if (!user) { openLoginModal(); return }
    try {
      await addBooking('flight', flight, passengers)
      await refreshFlights()
      setSnackbar({ open: true, message: `Flight ${flight.from} → ${flight.to} booked for ${passengers} passenger${passengers > 1 ? 's' : ''}!`, severity: 'success' })
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Booking failed. Please try again.', severity: 'error' })
    }
  }

  const fmt = (iso) => formatFlightDateTime(iso, '')

  return (
    <Box component="section" className={styles.section}>
      <Typography variant="h5" className={styles.heading}>Available Flights</Typography>

      <TextField
        placeholder="Search by destination, origin or airline…"
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
        <Typography className={styles.empty}>No flights match your search.</Typography>
      )}

      {!loading && !fetchErr && filtered.length > 0 && (
        <Box className={styles.grid}>
          {filtered.map((flight) => (
            <Box key={flight._id} className={styles.card}>
              <Box className={styles.route}>
                <Box className={styles.airport}>
                  <FlightTakeoffIcon className={styles.icon} />
                  <Typography className={styles.city}>{flight.from}</Typography>
                </Box>
                <Typography className={styles.duration}>{flight.duration}</Typography>
                <Box className={styles.airport}>
                  <FlightLandIcon className={styles.icon} />
                  <Typography className={styles.city}>{flight.to}</Typography>
                </Box>
              </Box>

              <Typography className={styles.airline}>{flight.airline}</Typography>

              <Box className={styles.times}>
                <Typography className={styles.time}>{fmt(flight.departure)}</Typography>
                <Typography className={styles.stops}>{flight.stops}</Typography>
                <Typography className={styles.time}>{fmt(flight.arrival)}</Typography>
              </Box>

              <Box className={styles.footer}>
                <Typography className={styles.price}>€{flight.price}</Typography>
                <Box className={styles.footerRight}>
                  <Typography className={styles.seats}>{flight.seatsAvailable ?? 0} seat{flight.seatsAvailable !== 1 ? 's' : ''}</Typography>
                  <Button
                    variant="contained"
                    className={styles.btn}
                    disabled={!flight.seatsAvailable}
                    onClick={() => {
                      if (!user) { openLoginModal(); return }
                      setSelectedFlight(flight)
                    }}
                  >
                    {flight.seatsAvailable ? 'Book' : 'Full'}
                  </Button>
                </Box>
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

      <FlightBookingModal
        open={!!selectedFlight}
        flight={selectedFlight}
        onClose={() => setSelectedFlight(null)}
        onConfirm={handleBook}
      />
    </Box>
  )
}
