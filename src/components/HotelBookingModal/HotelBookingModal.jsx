import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import HotelIcon from '@mui/icons-material/Hotel'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import StarIcon from '@mui/icons-material/Star'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import CloseIcon from '@mui/icons-material/Close'
import styles from './HotelBookingModal.module.scss'

const TODAY = new Date().toISOString().split('T')[0]
const EMPTY_PAYMENT = { cardHolder: '', cardNumber: '', expiry: '', cvv: '' }
const EMPTY_ERRORS  = { cardHolder: '', cardNumber: '', expiry: '', cvv: '' }

function formatCardNumber(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(.{4})/g, '$1 ').trimEnd()
}

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

export default function HotelBookingModal({ open, hotel, onClose, onConfirm }) {
  const [step,      setStep]      = useState(1)
  const [checkin,   setCheckin]   = useState('')
  const [checkout,  setCheckout]  = useState('')
  const [dateError, setDateError] = useState('')
  const [payment,   setPayment]   = useState(EMPTY_PAYMENT)
  const [errors,    setErrors]    = useState(EMPTY_ERRORS)
  const [loading,   setLoading]   = useState(false)

  const nights = (checkin && checkout)
    ? Math.max(1, Math.round((new Date(checkout) - new Date(checkin)) / 86400000))
    : 1
  const totalPrice = hotel ? hotel.price * nights : 0

  const handleClose = () => {
    setStep(1)
    setCheckin('')
    setCheckout('')
    setDateError('')
    setPayment(EMPTY_PAYMENT)
    setErrors(EMPTY_ERRORS)
    onClose()
  }

  const handleNext = () => {
    if (!checkin || !checkout) {
      setDateError('Please select both check-in and check-out dates.')
      return
    }
    if (checkout <= checkin) {
      setDateError('Check-out date must be after check-in date.')
      return
    }
    setDateError('')
    setStep(2)
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
      await onConfirm(hotel, { checkin, checkout, nights })
    } finally {
      setLoading(false)
      handleClose()
    }
  }

  if (!hotel) return null

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth slotProps={{ paper: { className: styles.paper } }}>
      {step === 1 && (
        <>
          <DialogTitle className={styles.title}>
            <Box className={styles.titleRow}>
              <span>Hotel Details</span>
              <IconButton size="small" onClick={handleClose} className={styles.closeBtn}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </DialogTitle>

          <DialogContent className={styles.content}>
            {/* Hotel header */}
            <Box className={styles.hotelHeader}>
              <HotelIcon className={styles.hotelIcon} />
              <Box>
                <Typography className={styles.hotelName}>{hotel.name}</Typography>
                <Box className={styles.locationRow}>
                  <LocationOnIcon className={styles.locationIcon} />
                  <Typography className={styles.locationText}>{hotel.city}, {hotel.country}</Typography>
                </Box>
              </Box>
            </Box>

            {/* Star rating if present */}
            {hotel.stars && (
              <Box className={styles.stars}>
                {Array.from({ length: hotel.stars }).map((_, i) => (
                  <StarIcon key={i} className={styles.starIcon} />
                ))}
              </Box>
            )}

            <Divider className={styles.divider} />

            {/* Amenities */}
            {hotel.amenities?.length > 0 && (
              <Box>
                <Typography className={styles.label}>Amenities</Typography>
                <Box className={styles.amenities}>
                  {hotel.amenities.map((a) => (
                    <Chip key={a} label={a} size="small" className={styles.amenityChip} />
                  ))}
                </Box>
              </Box>
            )}

            {/* Dates */}
            <Box>
              <Typography className={styles.label}>Dates</Typography>
              <Box className={styles.dateRow}>
                <Box className={styles.dateField}>
                  <TextField
                    label="Check-in"
                    type="date"
                    value={checkin}
                    onChange={(e) => { setCheckin(e.target.value); setDateError('') }}
                    size="small"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: TODAY } }}
                  />
                </Box>
                <Box className={styles.dateField}>
                  <TextField
                    label="Check-out"
                    type="date"
                    value={checkout}
                    onChange={(e) => { setCheckout(e.target.value); setDateError('') }}
                    size="small"
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: checkin || TODAY } }}
                  />
                </Box>
              </Box>
              {dateError && (
                <Typography className={styles.dateError}>{dateError}</Typography>
              )}
            </Box>

            <Box className={styles.priceRow}>
              <Typography className={styles.priceLabel}>
                €{hotel.price}/night × {nights} night{nights !== 1 ? 's' : ''}
              </Typography>
              <Typography className={styles.price}>€{totalPrice}</Typography>
            </Box>
          </DialogContent>

          <DialogActions className={styles.actions}>
            <Button onClick={handleClose} className={styles.cancelBtn}>Cancel</Button>
            <Button variant="contained" onClick={handleNext} className={styles.primaryBtn}>
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
                Payment — €{totalPrice}
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
            <Button onClick={() => { setStep(1); setErrors(EMPTY_ERRORS) }} className={styles.cancelBtn} disabled={loading}>Back</Button>
            <Button
              variant="contained"
              onClick={handlePay}
              className={styles.primaryBtn}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {loading ? 'Processing…' : `Pay €${hotel.price}/night`}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}
