import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import HotelIcon from '@mui/icons-material/Hotel'
import CancelIcon from '@mui/icons-material/Cancel'
import styles from './HotelBookingsSection.module.scss'

const STATUS_LABEL = { pending: 'Confirmed', confirmed: 'Confirmed', cancelled: 'Cancelled' }
const STATUS_CLASS = { pending: 'confirmed', confirmed: 'confirmed', cancelled: 'cancelled' }

export default function HotelBookingsSection({ bookings, onCancel }) {
  return (
    <Box className={styles.section}>
      <Box className={styles.sectionHeader}>
        <HotelIcon className={styles.sectionIcon} />
        <Typography variant="h6" className={styles.sectionTitle}>Hotels</Typography>
        <Chip label={bookings.length} size="small" className={styles.chip} />
      </Box>
      <Divider className={styles.divider} />

      {bookings.length === 0
        ? <Typography className={styles.empty}>No hotels booked yet.</Typography>
        : (
          <Box className={styles.grid}>
            {bookings.map((b) => {
              const h = b.hotel
              return (
                <Box key={b._id} className={styles.card}>
                  <Box className={styles.cardBadge}>Hotel</Box>
                  <Typography className={styles.cardTitle}>{h?.name}</Typography>
                  <Typography className={styles.detail}>{h?.city}, {h?.country}</Typography>
                  <Box className={styles.tags}>
                    {h?.amenities?.map((a) => <Chip key={a} label={a} size="small" className={styles.tag} />)}
                  </Box>
                  <Box className={styles.cardFooter}>
                    <Box>
                      <Typography className={styles.price}>€{b.totalPrice}<span>/night</span></Typography>
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
