import { useState, useEffect } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { Link, NavLink } from 'react-router-dom'
import styles from './Navbar.module.scss'

const navLinks = [
  { label: 'Flights', to: '/flights' },
  { label: 'Hotels', to: '/hotels' },
  { label: 'Rent a Car', to: '/rent-a-car' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AppBar
      position="fixed"
      elevation={scrolled ? 4 : 0}
      className={`${styles.navbar} ${scrolled ? styles.scrolled : styles.transparent}`}
    >
      <Toolbar className={styles.toolbar}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          className={styles.logo}
        >
          Mariachi
        </Typography>

        <Box className={styles.navLinks}>
          {navLinks.map(({ label, to }) => (
            <Button
              key={to}
              component={NavLink}
              to={to}
              className={styles.navLink}
            >
              {label}
            </Button>
          ))}
        </Box>

        <Button variant="outlined" className={styles.loginBtn}>
          Login
        </Button>
      </Toolbar>
    </AppBar>
  )
}
