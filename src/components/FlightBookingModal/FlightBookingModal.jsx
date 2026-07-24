import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import FlightLandIcon from '@mui/icons-material/FlightLand'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import PeopleIcon from '@mui/icons-material/People'
import CloseIcon from '@mui/icons-material/Close'
import styles from './FlightBookingModal.module.scss'

const EMPTY_PAYMENT = { cardHolder: '', cardNumber: '', expiry: '', cvv: '' }
const EMPTY_ERRORS  = { cardHolder: '', cardNumber: '', expiry: '', cvv: '' }

function fmtDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const dd  = String(d.getUTCDate()).padStart(2, '0')
  const mm  = String(d.getUTCMonth() + 1).padStart(2, '0')
  const hh  = String(d.getUTCHours()).padStart(2, '0')
  const min = String(d.getUTCMinutes()).padStart(2, '0')
  return `${dd}/${mm} ${hh}:${min}`
}

/** Format raw digits as groups of 4, max 16 digits → "1234 5678 9012 3456" */
function formatCardNumber(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(.{4})/g, '$1 ').trimEnd()
}

/** Format as MM/YY */
function formatExpiry(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

function validatePayment(fields) {
  const errs = { ...EMPTY_ERRORS }
  let valid = true

  if (!fields.cardHolder.trim()) {
    errs.cardHolder = 'Cardholder name is required.'
    valid = false
  }

  const digits = fields.cardNumber.replace(/\D/g, '')
  if (digits.length !== 16) {
    errs.cardNumber = 'Card number must be exactly 16 digits.'
    valid = false
  }

  const expiryDigits = fields.expiry.replace(/\D/g, '')
  if (expiryDigits.length !== 4) {
    errs.expiry = 'Enter a valid expiry date (MM/YY).'
    valid = false
  } else {
    const month = parseInt(expiryDigits.slice(0, 2), 10)
    const year  = parseInt(`20${expiryDigits.slice(2)}`, 10)
    const now   = new Date()
    const expDate = new Date(year, month - 1)
    if (month < 1 || month > 12) {
      errs.expiry = 'Month must be between 01 and 12.'
      valid = false
    } else if (expDate < new Date(now.getFullYear(), now.getMonth())) {
      errs.expiry = 'This card has expired.'
      valid = false
    }
  }

  const cvvDigits = fields.cvv.replace(/\D/g, '')
  if (cvvDigits.length < 3 || cvvDigits.length > 4) {
    errs.cvv = 'CVV must be 3 or 4 digits.'
    valid = false
  }

  return { errs, valid }
}

export default function FlightBookingModal({ open, flight, onClose, onConfirm }) {
  const [step,       setStep]       = useState(1)
  const [passengers, setPassengers] = useState(1)
  const [payment,    setPayment]    = useState(EMPTY_PAYMENT)
  const [errors,     setErrors]     = useState(EMPTY_ERRORS)
  const [loading,    setLoading]    = useState(false)
  const [seatError,  setSeatError]  = useState('')

  const maxPassengers = Math.min(9, flight?.seatsAvailable ?? 9)
  const totalPrice    = flight ? flight.price * passengers : 0

  const handleClose = () => {
    setStep(1)
    setPassengers(1)
    setPayment(EMPTY_PAYMENT)
    setErrors(EMPTY_ERRORS)
    setSeatError('')
    onClose()
  }

  const handleConfirmInfo = () => {
    if (passengers > (flight?.seatsAvailable ?? Infinity)) {
      setSeatError(`Only ${flight.seatsAvailable} seat(s) available.`)
      return
    }
    setSeatError('')
    setStep(2)
  }

  const handleBack = () => {
    setStep(1)
    setErrors(EMPTY_ERRORS)
  }

  const handlePaymentChange = (field) => (e) => {
    let value = e.target.value
    if (field === 'cardNumber') value = formatCardNumber(value)
    if (field === 'expiry')     value = formatExpiry(value)
    if (field === 'cvv')        value = value.replace(/\D/g, '').slice(0, 4)
    setPayment((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handlePay = async () => {
    const { errs, valid } = validatePayment(payment)
    if (!valid) { setErrors(errs); return }

    setLoading(true)
    try {
      await onConfirm(flight, passengers)
    } finally {
      setLoading(false)
      handleClose()
    }
  }

  if (!flight) return null

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth slotProps={{ paper: { className: styles.paper } }}>
      {step === 1 && (
        <>
          <DialogTitle className={styles.title}>
            <Box className={styles.titleRow}>
              <span>Flight Details</span>
              <IconButton size="small" onClick={handleClose} className={styles.closeBtn}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent className={styles.content}>
            {/* Route */}
            <Box className={styles.routeRow}>
              <Box className={styles.endpoint}>
                <FlightTakeoffIcon className={styles.routeIcon} />
                <Typography className={styles.city}>{flight.from}</Typography>
                <Typography className={styles.timeLabel}>{fmtDate(flight.departure)}</Typography>
              </Box>

              <Box className={styles.middle}>
                <Typography className={styles.duration}>{flight.duration}</Typography>
                <Box className={styles.line} />
                <Typography className={styles.stops}>{flight.stops}</Typography>
              </Box>

              <Box className={styles.endpoint}>
                <FlightLandIcon className={styles.routeIcon} />
                <Typography className={styles.city}>{flight.to}</Typography>
                <Typography className={styles.timeLabel}>{fmtDate(flight.arrival)}</Typography>
              </Box>
            </Box>

            <Divider className={styles.divider} />

            {/* Details grid */}
            <Box className={styles.infoGrid}>
              <Box className={styles.infoItem}>
                <Typography className={styles.label}>Airline</Typography>
                <Typography className={styles.value}>{flight.airline}</Typography>
              </Box>
              <Box className={styles.infoItem}>
                <Typography className={styles.label}>Class</Typography>
                <Typography className={styles.value}>{flight.class ?? 'Economy'}</Typography>
              </Box>
              <Box className={styles.infoItem}>
                <Typography className={styles.label}>Seats available</Typography>
                <Typography className={styles.value}>{flight.seatsAvailable ?? '—'}</Typography>
              </Box>
              <Box className={styles.infoItem}>
                <Typography className={styles.label}>Price per passenger</Typography>
                <Typography className={`${styles.value} ${styles.price}`}>€{flight.price}</Typography>
              </Box>
            </Box>

            {/* Passenger picker */}
            <Box className={styles.passengerRow}>
              <Box className={styles.passengerLabel}>
                <PeopleIcon className={styles.passengerIcon} />
                <Typography className={styles.label}>Passengers</Typography>
              </Box>
              <FormControl size="small" className={styles.passengerSelect} error={!!seatError}>
                <InputLabel>Passengers</InputLabel>
                <Select
                  label="Passengers"
                  value={passengers}
                  onChange={(e) => { setPassengers(e.target.value); setSeatError('') }}
                >
                  {Array.from({ length: maxPassengers }, (_, i) => i + 1).map((n) => (
                    <MenuItem key={n} value={n}>{n} passenger{n > 1 ? 's' : ''}</MenuItem>
                  ))}
                </Select>
                {seatError && <Typography className={styles.seatError}>{seatError}</Typography>}
              </FormControl>
            </Box>

            {/* Total */}
            <Box className={styles.totalRow}>
              <Typography className={styles.totalLabel}>Total</Typography>
              <Typography className={styles.totalPrice}>€{totalPrice}</Typography>
            </Box>
          </DialogContent>

          <DialogActions className={styles.actions}>
            <Button onClick={handleClose} className={styles.cancelBtn}>Cancel</Button>
            <Button variant="contained" onClick={handleConfirmInfo} className={styles.primaryBtn}>
              Continue to Payment
            </Button>
          </DialogActions>
        </>
      )}

      {step === 2 && (
        <>
          <DialogTitle className={styles.title}>
            <Box className={styles.titleRow}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCardIcon className={styles.titleIcon} />
                Payment — €{totalPrice} ({passengers} passenger{passengers > 1 ? 's' : ''})
              </Box>
              <IconButton size="small" onClick={handleClose} className={styles.closeBtn}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent className={styles.content}>
            <Typography className={styles.paymentNote}>
              Enter your card details to complete the booking.
            </Typography>

            <Box className={styles.form}>
              <TextField
                label="Cardholder name"
                value={payment.cardHolder}
                onChange={handlePaymentChange('cardHolder')}
                error={!!errors.cardHolder}
                helperText={errors.cardHolder}
                fullWidth
                autoComplete="cc-name"
              />

              <TextField
                label="Card number"
                value={payment.cardNumber}
                onChange={handlePaymentChange('cardNumber')}
                error={!!errors.cardNumber}
                helperText={errors.cardNumber || 'Up to 16 digits'}
                inputProps={{ inputMode: 'numeric', maxLength: 19 }}
                fullWidth
                autoComplete="cc-number"
              />

              <Box className={styles.row}>
                <TextField
                  label="Expiry (MM/YY)"
                  value={payment.expiry}
                  onChange={handlePaymentChange('expiry')}
                  error={!!errors.expiry}
                  helperText={errors.expiry}
                  inputProps={{ inputMode: 'numeric', maxLength: 5 }}
                  autoComplete="cc-exp"
                />
                <TextField
                  label="CVV"
                  value={payment.cvv}
                  onChange={handlePaymentChange('cvv')}
                  error={!!errors.cvv}
                  helperText={errors.cvv}
                  inputProps={{ inputMode: 'numeric', maxLength: 4 }}
                  autoComplete="cc-csc"
                />
              </Box>
            </Box>
          </DialogContent>

          <DialogActions className={styles.actions}>
            <Button onClick={handleBack} className={styles.cancelBtn} disabled={loading}>Back</Button>
            <Button
              variant="contained"
              onClick={handlePay}
              className={styles.primaryBtn}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {loading ? 'Processing…' : `Pay €${totalPrice}`}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}
