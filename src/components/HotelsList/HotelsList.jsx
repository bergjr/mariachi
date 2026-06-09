import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import Button from '@mui/material/Button'
import { hotels } from '../../data/hotels'
import styles from './HotelsList.module.scss'

export default function HotelsList() {
  const [query, setQuery] = useState('')

  const filtered = hotels.filter(({ name, city, country }) =>
    [name, city, country].some((v) => v.toLowerCase().includes(query.toLowerCase()))
  )

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
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      {filtered.length === 0 ? (
        <Typography className={styles.empty}>No hotels match your search.</Typography>
      ) : (
        <Box className={styles.grid}>
          {filtered.map((hotel) => (
            <Box key={hotel.id} className={styles.card}>
              <Typography className={styles.name}>{hotel.name}</Typography>
              <Typography className={styles.location}>{hotel.city}, {hotel.country}</Typography>

              <Box className={styles.amenities}>
                {hotel.amenities.map((a) => (
                  <Typography key={a} className={styles.tag}>{a}</Typography>
                ))}
              </Box>

              <Box className={styles.footer}>
                <Typography className={styles.price}>€{hotel.price}<span>/night</span></Typography>
                <Button variant="contained" className={styles.btn}>Book</Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}
