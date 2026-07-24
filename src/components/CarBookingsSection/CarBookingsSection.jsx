import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import PeopleIcon from '@mui/icons-material/People'
import SettingsIcon from '@mui/icons-material/Settings'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CancelIcon from '@mui/icons-material/Cancel'
import styles from './CarBookingsSection.module.scss'

const STATUS_LABEL = { pending: 'Confirmed', confirmed: 'Confirmed', cancelled: 'Cancelled' }
const STATUS_CLASS = { pending: 'confirmed', confirmed: 'confirmed', cancelled: 'cancelled' }

export default function CarBookingsSection({ bookings, onCancel }) {
  return (
    <Box className={styles.section}>
      <Box className={styles.sectionHeader}>
        <DirectionsCarIcon className={styles.sectionIcon} />
        <Typography variant="h6" className={styles.sectionTitle}>Rental Cars</Typography>
        <Chip label={bookings.length} size="small" className={styles.chip} />
      </Box>
      <Divider className={styles.divider} />

      {bookings.length === 0
        ? <Typography className={styles.empty}>No rental cars booked yet.</Typography>
        : (
          <Box className={styles.grid}>
            {bookings.map((b) => {
              const c = b.car
              return (
                <Box key={b._id} className={styles.card}>
                  <Box className={styles.cardBadge}>Car Rental</Box>
                  <Typography className={styles.cardTitle}>{c?.make} {c?.model} {c?.year}</Typography>
                  <Typography className={styles.detail} sx={{ textTransform: 'capitalize' }}>{c?.category}</Typography>
                  <Box className={styles.carMeta}>
                    <Box className={styles.metaItem}>
                      <PeopleIcon className={styles.metaIcon} />
                      <Typography className={styles.detail}>{c?.seats} seats</Typography>
                    </Box>
                    <Box className={styles.metaItem}>
                      <SettingsIcon className={styles.metaIcon} />
                      <Typography className={styles.detail} sx={{ textTransform: 'capitalize' }}>{c?.transmission}</Typography>
                    </Box>
                  </Box>
                  <Box className={styles.metaItem}>
                    <LocationOnIcon className={styles.metaIcon} />
                    <Typography className={styles.detail}>{c?.city}, {c?.country}</Typography>
                  </Box>
                  <Box className={styles.cardFooter}>
                    <Box>
                      <Typography className={styles.price}>€{b.totalPrice}<span>/day</span></Typography>
                      <Chip label={STATUS_LABEL[b.status] ?? b.status} size="small"
                        className={`${styles.statusChip} ${styles[STATUS_CLASS[b.status] ?? b.status]}`} />
                    </Box>
                    <Button size="small" color="error" startIcon={<CancelIcon />} className={styles.cancelBtn}
                      onClick={() => onCancel(b._id)}>Cancel</Button>
                  </Box>
                </Box>
              )
            })}
          </Box>
        )}
    </Box>
  )
}
