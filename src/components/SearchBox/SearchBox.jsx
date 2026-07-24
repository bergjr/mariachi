import { useState, useRef, useCallback } from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FlightIcon from '@mui/icons-material/Flight'
import HotelIcon from '@mui/icons-material/Hotel'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import FlightLandIcon from '@mui/icons-material/FlightLand'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PeopleIcon from '@mui/icons-material/People'
import SearchIcon from '@mui/icons-material/Search'
import { useNavigate } from 'react-router-dom'
import { getFlights } from '../../api/flights'
import { getHotels } from '../../api/hotels'
import styles from './SearchBox.module.scss'

const TODAY = new Date().toISOString().split('T')[0]

/** Debounced autocomplete hook — fetches options from an async function */
function useAutoOptions(apiFn, extractFn, delay = 300) {
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const timer = useRef(null)

  const fetch = useCallback((input) => {
    clearTimeout(timer.current)
    if (!input || input.length < 1) { setOptions([]); return }
    timer.current = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await apiFn(input)
        setOptions(extractFn(data))
      } catch {
        setOptions([])
      } finally {
        setLoading(false)
      }
    }, delay)
  }, [apiFn, extractFn, delay])

  return { options, loading, fetch, setOptions }
}

/** Labelled field wrapper for plain TextFields */
function Field({ label, ...props }) {
  return (
    <Box className={styles.fieldGroup}>
      <Typography component="label" className={styles.fieldLabel}>{label}</Typography>
      <TextField variant="outlined" size="small" className={styles.field} fullWidth {...props} />
    </Box>
  )
}

/** Labelled autocomplete field */
function AcField({ label, options, loading, inputValue, onInputChange, placeholder }) {
  return (
    <Box className={styles.fieldGroup}>
      <Typography component="label" className={styles.fieldLabel}>{label}</Typography>
      <Autocomplete
        freeSolo
        options={options}
        loading={loading}
        inputValue={inputValue}
        onInputChange={onInputChange}
        className={styles.field}
        slotProps={{
          listbox: { className: styles.listbox },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            variant="outlined"
            size="small"
          />
        )}
      />
    </Box>
  )
}

/** Labelled passenger / guest counter (Select) */
function CounterField({ label, value, onChange, max = 9 }) {
  return (
    <Box className={styles.fieldGroup}>
      <Typography component="label" className={styles.fieldLabel}>{label}</Typography>
      <FormControl size="small" fullWidth>
        <Select value={value} onChange={(e) => onChange(e.target.value)} className={styles.field}>
          {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
            <MenuItem key={n} value={n}>
              <Box className={styles.counterItem}>
                <PeopleIcon className={styles.counterIcon} />
                {n} {label.toLowerCase()}{n > 1 ? '' : ''}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default function SearchBox() {
  const [tab, setTab] = useState(0)
  const navigate = useNavigate()

  // ── Flights state ─────────────────────────────────────────────
  const [flightFrom,      setFlightFrom]      = useState('')
  const [flightTo,        setFlightTo]        = useState('')
  const [flightDeparture, setFlightDeparture] = useState('')
  const [flightReturn,    setFlightReturn]    = useState('')
  const [passengers,      setPassengers]      = useState(1)

  const fromAc = useAutoOptions(
    (q) => getFlights({ from: q }),
    (data) => [...new Set(data.map((f) => f.from))].sort(),
  )
  const toAc = useAutoOptions(
    (q) => getFlights({ to: q }),
    (data) => [...new Set(data.map((f) => f.to))].sort(),
  )

  // ── Hotels state ──────────────────────────────────────────────
  const [hotelDest,    setHotelDest]    = useState('')
  const [hotelCheckin, setHotelCheckin] = useState('')
  const [hotelCheckout,setHotelCheckout]= useState('')
  const [guests,       setGuests]       = useState(1)

  const destAc = useAutoOptions(
    (q) => getHotels({ city: q }),
    (data) => [
      ...new Set([
        ...data.map((h) => h.city),
        ...data.map((h) => h.name),
      ])
    ].sort(),
  )

  // ── Submit ────────────────────────────────────────────────────
  const handleFlightSearch = () => {
    const params = new URLSearchParams()
    if (flightFrom) params.set('from', flightFrom)
    if (flightTo)   params.set('to',   flightTo)
    if (passengers > 1) params.set('passengers', passengers)
    navigate(`/flights${params.size ? '?' + params.toString() : ''}`)
  }

  const handleHotelSearch = () => {
    const params = new URLSearchParams()
    if (hotelDest)    params.set('city',     hotelDest)
    if (hotelCheckin) params.set('checkin',  hotelCheckin)
    if (hotelCheckout)params.set('checkout', hotelCheckout)
    if (guests > 1)   params.set('guests',   guests)
    navigate(`/hotels${params.size ? '?' + params.toString() : ''}`)
  }

  return (
    <Box className={styles.wrapper}>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        className={styles.tabs}
        slotProps={{ indicator: { className: styles.indicator } }}
      >
        <Tab icon={<FlightIcon fontSize="small" />} iconPosition="start" label="Flights" className={styles.tab} />
        <Tab icon={<HotelIcon fontSize="small" />} iconPosition="start" label="Hotels" className={styles.tab} />
      </Tabs>

      <Box className={styles.form}>
        {tab === 0 && (
          <>
            <Box className={styles.row}>
              <AcField
                label={<><FlightTakeoffIcon className={styles.labelIcon} /> From</>}
                placeholder="City or airport"
                options={fromAc.options}
                loading={fromAc.loading}
                inputValue={flightFrom}
                onInputChange={(_, val) => { setFlightFrom(val); fromAc.fetch(val) }}
              />
              <AcField
                label={<><FlightLandIcon className={styles.labelIcon} /> To</>}
                placeholder="City or airport"
                options={toAc.options}
                loading={toAc.loading}
                inputValue={flightTo}
                onInputChange={(_, val) => { setFlightTo(val); toAc.fetch(val) }}
              />
            </Box>
            <Box className={styles.row}>
              <Field
                label="Departure"
                type="date"
                value={flightDeparture}
                onChange={(e) => setFlightDeparture(e.target.value)}
                slotProps={{ htmlInput: { min: TODAY } }}
              />
              <Field
                label="Return (optional)"
                type="date"
                value={flightReturn}
                onChange={(e) => setFlightReturn(e.target.value)}
                slotProps={{ htmlInput: { min: flightDeparture || TODAY } }}
              />
            </Box>
            <CounterField label="Passengers" value={passengers} onChange={setPassengers} max={9} />
          </>
        )}

        {tab === 1 && (
          <>
            <AcField
              label={<><LocationOnIcon className={styles.labelIcon} /> Destination</>}
              placeholder="City or hotel name"
              options={destAc.options}
              loading={destAc.loading}
              inputValue={hotelDest}
              onInputChange={(_, val) => { setHotelDest(val); destAc.fetch(val) }}
            />
            <Box className={styles.row}>
              <Field
                label="Check-in"
                type="date"
                value={hotelCheckin}
                onChange={(e) => setHotelCheckin(e.target.value)}
                slotProps={{ htmlInput: { min: TODAY } }}
              />
              <Field
                label="Check-out"
                type="date"
                value={hotelCheckout}
                onChange={(e) => setHotelCheckout(e.target.value)}
                slotProps={{ htmlInput: { min: hotelCheckin || TODAY } }}
              />
            </Box>
            <CounterField label="Guests" value={guests} onChange={setGuests} max={10} />
          </>
        )}

        <Button
          variant="contained"
          className={styles.submitBtn}
          startIcon={<SearchIcon />}
          onClick={tab === 0 ? handleFlightSearch : handleHotelSearch}
        >
          Search
        </Button>
      </Box>
    </Box>
  )
}
