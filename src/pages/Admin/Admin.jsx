import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'
import HotelIcon from '@mui/icons-material/Hotel'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import AdminFlights from '../../components/AdminFlights/AdminFlights'
import AdminHotels from '../../components/AdminHotels/AdminHotels'
import AdminCars from '../../components/AdminCars/AdminCars'
import styles from './Admin.module.scss'

function TabPanel({ children, value, index }) {
  return value === index ? <Box className={styles.panel}>{children}</Box> : null
}

export default function Admin() {
  const [tab, setTab] = useState(0)

  return (
    <Box className={styles.page}>
      <Box className={styles.header}>
        <Typography variant="h4" className={styles.title}>Admin Panel</Typography>
        <Typography className={styles.subtitle}>Manage flights, hotels and rental cars</Typography>
      </Box>
      <Box className={styles.container}>
        <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)} className={styles.tabs}
          slotProps={{ indicator: { className: styles.indicator } }}>
          <Tab icon={<FlightTakeoffIcon />} iconPosition="start" label="Flights" className={styles.tab} />
          <Tab icon={<HotelIcon />}         iconPosition="start" label="Hotels"  className={styles.tab} />
          <Tab icon={<DirectionsCarIcon />} iconPosition="start" label="Cars"    className={styles.tab} />
        </Tabs>
        <TabPanel value={tab} index={0}><AdminFlights /></TabPanel>
        <TabPanel value={tab} index={1}><AdminHotels /></TabPanel>
        <TabPanel value={tab} index={2}><AdminCars /></TabPanel>
      </Box>
    </Box>
  )
}
