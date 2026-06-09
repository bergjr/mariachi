import { useState } from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import FlightIcon from '@mui/icons-material/Flight'
import HotelIcon from '@mui/icons-material/Hotel'
import styles from './SearchBox.module.scss'

function Field({ label, ...props }) {
  return (
    <Box className={styles.fieldGroup}>
      <Typography component="label" className={styles.fieldLabel}>{label}</Typography>
      <TextField variant="outlined" size="small" className={styles.field} fullWidth {...props} />
    </Box>
  )
}

export default function SearchBox() {
  const [tab, setTab] = useState(0)

  return (
    <Box className={styles.wrapper}>
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        className={styles.tabs}
        TabIndicatorProps={{ className: styles.indicator }}
      >
        <Tab icon={<FlightIcon fontSize="small" />} iconPosition="start" label="Flights" className={styles.tab} />
        <Tab icon={<HotelIcon fontSize="small" />} iconPosition="start" label="Hotels" className={styles.tab} />
      </Tabs>

      <Box className={styles.form}>
        {tab === 0 && (
          <>
            <Box className={styles.row}>
              <Field label="From" placeholder="City or airport" />
              <Field label="To" placeholder="City or airport" />
            </Box>
            <Box className={styles.row}>
              <Field label="Departure" type="date" inputProps={{ placeholder: '' }} onClick={(e) => e.currentTarget.querySelector('input')?.showPicker()} />
              <Field label="Return" type="date" inputProps={{ placeholder: '' }} onClick={(e) => e.currentTarget.querySelector('input')?.showPicker()} />
            </Box>
            <Box className={styles.row}>
              <Field label="Passengers" type="number" inputProps={{ min: 1 }} />
            </Box>
          </>
        )}

        {tab === 1 && (
          <>
            <Box className={styles.row}>
              <Field label="Destination" placeholder="City or hotel" />
              <Field label="Guests" type="number" inputProps={{ min: 1 }} />
            </Box>
            <Box className={styles.row}>
              <Field label="Check-in" type="date" inputProps={{ placeholder: '' }} onClick={(e) => e.currentTarget.querySelector('input')?.showPicker()} />
              <Field label="Check-out" type="date" inputProps={{ placeholder: '' }} onClick={(e) => e.currentTarget.querySelector('input')?.showPicker()} />
            </Box>
          </>
        )}

        <Button variant="contained" className={styles.submitBtn}>
          Explore
        </Button>
      </Box>
    </Box>
  )
}
