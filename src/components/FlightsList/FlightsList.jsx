import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import FlightLandIcon from '@mui/icons-material/FlightLand'
import Button from '@mui/material/Button'
import { flights } from '../../data/flights'
import styles from './FlightsList.module.scss'

export default function FlightsList() {
  const [query, setQuery] = useState('')

  const filtered = flights.filter(({ from, to, airline }) =>
    [from, to, airline].some((v) => v.toLowerCase().includes(query.toLowerCase()))
  )

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
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      {filtered.length === 0 ? (
        <Typography className={styles.empty}>No flights match your search.</Typography>
      ) : (
        <Box className={styles.grid}>
          {filtered.map((flight) => (
            <Box key={flight.id} className={styles.card}>
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
                <Typography className={styles.time}>{flight.departure}</Typography>
                <Typography className={styles.stops}>{flight.stops}</Typography>
                <Typography className={styles.time}>{flight.arrival}</Typography>
              </Box>

              <Box className={styles.footer}>
                <Typography className={styles.price}>€{flight.price}</Typography>
                <Button variant="contained" className={styles.btn}>Book</Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}
