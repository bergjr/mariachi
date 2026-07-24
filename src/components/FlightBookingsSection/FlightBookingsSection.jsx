import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import FlightLandIcon from '@mui/icons-material/FlightLand'
import CancelIcon from '@mui/icons-material/Cancel'
import styles from './FlightBookingsSection.module.scss'

const fmtDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${String(d.getUTCDate()).padStart(2,'0')}/${String(d.getUTCMonth()+1).padStart(2,'0')}/${d.getUTCFullYear()} ${String(d.getUTCHours()).padStart(2,'0')}:${String(d.getUTCMinutes()).padStart(2,'0')}`
}

const STATUS_LABEL = { pending: 'Confirmed', confirmed: 'Confirmed', cancelled: 'Cancelled' }
const STATUS_CLASS = { pending: 'confirmed', confirmed: 'confirmed', cancelled: 'cancelled' }

export default function FlightBookingsSection({ bookings, onCancel }) {
  return (
    <Box className={styles.section}>
      <Box className={styles.sectionHeader}>
        <FlightTakeoffIcon className={styles.sectionIcon} />
        <Typography variant="h6" className={styles.sectionTitle}>Flights</Typography>
        <Chip label={bookings.length} size="small" className={styles.chip} />
      </Box>
      <Divider className={styles.divider} />

      {bookings.length === 0
        ? <Typography className={styles.empty}>No flights booked yet.</Typography>
        : (
          <Box className={styles.grid}>
            {bookings.map((b) => {
              const f = b.flight
              return (
                <Box key={b._id} className={styles.card}>
                  <Box className={styles.cardBadge}>Flight</Box>
                  <Box className={styles.flightRoute}>
                    <Box className={styles.flightCity}>
                      <FlightTakeoffIcon className={styles.routeIcon} />
                      <Typography className={styles.cityLabel}>{f?.from}</Typography>
                    </Box>
                    <Box className={styles.flightLine}>
                      <Typography className={styles.duration}>{f?.duration}</Typography>
                      <Box className={styles.line} />
                    </Box>
                    <Box className={styles.flightCity}>
                      <FlightLandIcon className={styles.routeIcon} />
                      <Typography className={styles.cityLabel}>{f?.to}</Typography>
                    </Box>
                  </Box>
                  <Typography className={styles.detail}>{f?.airline} · {f?.stops}</Typography>
                  <Typography className={styles.detail}>{fmtDate(f?.departure)} → {fmtDate(f?.arrival)}</Typography>
                  <Box className={styles.cardFooter}>
                    <Box>
                      <Typography className={styles.price}>€{b.totalPrice}</Typography>
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
