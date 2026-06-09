import { useState } from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import FlightIcon from '@mui/icons-material/Flight'
import HotelIcon from '@mui/icons-material/Hotel'
import styles from './SearchBox.module.scss'

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
            <TextField label="From" placeholder="City or airport" variant="outlined" size="small" className={styles.field} />
            <TextField label="To" placeholder="City or airport" variant="outlined" size="small" className={styles.field} />
            <TextField label="Departure" type="date" variant="outlined" size="small" className={styles.field} InputLabelProps={{ shrink: true }} />
            <TextField label="Return" type="date" variant="outlined" size="small" className={styles.field} InputLabelProps={{ shrink: true }} />
            <TextField label="Passengers" type="number" placeholder="1" variant="outlined" size="small" className={styles.fieldNarrow} inputProps={{ min: 1 }} />
          </>
        )}

        {tab === 1 && (
          <>
            <TextField label="Destination" placeholder="City or hotel" variant="outlined" size="small" className={styles.fieldWide} />
            <TextField label="Check-in" type="date" variant="outlined" size="small" className={styles.field} InputLabelProps={{ shrink: true }} />
            <TextField label="Check-out" type="date" variant="outlined" size="small" className={styles.field} InputLabelProps={{ shrink: true }} />
            <TextField label="Guests" type="number" placeholder="1" variant="outlined" size="small" className={styles.fieldNarrow} inputProps={{ min: 1 }} />
          </>
        )}

        <Button variant="contained" className={styles.submitBtn}>
          Explore
        </Button>
      </Box>
    </Box>
  )
}
