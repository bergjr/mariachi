import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import FlightIcon from '@mui/icons-material/Flight'
import HotelIcon from '@mui/icons-material/Hotel'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import { Link } from 'react-router-dom'
import styles from './OffersSection.module.scss'

const offers = [
  {
    icon: <FlightIcon className={styles.icon} />,
    title: 'Flights',
    description:
      'Search hundreds of routes and find the best fares for your next trip, whether near or far.',
    to: '/flights',
    label: 'Search Flights',
  },
  {
    icon: <HotelIcon className={styles.icon} />,
    title: 'Hotels',
    description:
      'Browse thousands of hotels worldwide, from budget-friendly stays to luxury resorts.',
    to: '/hotels',
    label: 'Browse Hotels',
  },
  {
    icon: <DirectionsCarIcon className={styles.icon} />,
    title: 'Rent a Car',
    description:
      'Pick up a vehicle at your destination and explore at your own pace, on your own schedule.',
    to: '/rent-a-car',
    label: 'Find a Car',
  },
]

export default function OffersSection() {
  return (
    <Box component="section" className={styles.section}>
      <Typography variant="h4" className={styles.heading}>
        Everything You Need for Your Trip
      </Typography>
      <Typography variant="body1" className={styles.subheading}>
        Book flights, hotels, and rental cars all in one place.
      </Typography>

      <Box className={styles.grid}>
        {offers.map(({ icon, title, description, to, label }) => (
          <Box key={to} className={styles.card}>
            <Box className={styles.iconWrapper}>{icon}</Box>
            <Typography variant="h6" className={styles.cardTitle}>
              {title}
            </Typography>
            <Typography variant="body2" className={styles.cardDescription}>
              {description}
            </Typography>
            <Button
              component={Link}
              to={to}
              variant="outlined"
              className={styles.cardBtn}
            >
              {label}
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
