import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'
import FlightIcon from '@mui/icons-material/Flight'
import HotelIcon from '@mui/icons-material/Hotel'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import styles from './Footer.module.scss'

const pages = [
  { label: 'Flights', to: '/flights', icon: <FlightIcon fontSize="small" /> },
  { label: 'Hotels', to: '/hotels', icon: <HotelIcon fontSize="small" /> },
  { label: 'Rent a Car', to: '/rent-a-car', icon: <DirectionsCarIcon fontSize="small" /> },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <Box component="footer" className={styles.footer}>
      <Box className={styles.grid}>

        {/* Column 1 — Brand */}
        <Box className={styles.column}>
          <Typography variant="h6" className={styles.brand}>Mariachi</Typography>
          <Typography variant="body2" className={styles.tagline}>
            Your journey starts here. Flights, hotels, and car rentals — all in one place.
          </Typography>
        </Box>

        {/* Column 2 — Navigation links */}
        <Box className={styles.column}>
          <Typography variant="subtitle2" className={styles.columnHeading}>Explore</Typography>
          <Box className={styles.linkList}>
            {pages.map(({ label, to, icon }) => (
              <Link key={to} to={to} className={styles.link}>
                {icon}
                <span>{label}</span>
              </Link>
            ))}
          </Box>
        </Box>

        {/* Column 3 — Contact / info */}
        <Box className={styles.column}>
          <Typography variant="subtitle2" className={styles.columnHeading}>Contact</Typography>
          <Typography variant="body2" className={styles.contactText}>hello@mariachi.travel</Typography>
          <Typography variant="body2" className={styles.contactText}>+353 444-4125</Typography>
          <Typography variant="body2" className={styles.contactText}>Available 24 / 7</Typography>
        </Box>

      </Box>

      <Box className={styles.bottom}>
        <Typography variant="body2" className={styles.copy}>
          © {year} Mariachi. All rights reserved.
        </Typography>
      </Box>
    </Box>
  )
}
