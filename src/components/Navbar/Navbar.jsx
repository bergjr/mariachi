import { useState, useEffect } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoginModal from '../LoginModal/LoginModal'
import mariachiLogo from '../../assets/mariachi.png'
import styles from './Navbar.module.scss'

const HERO_ROUTES = ['/', '/flights', '/hotels', '/rent-a-car']

const navLinks = [
  { label: 'Flights', to: '/flights' },
  { label: 'Hotels', to: '/hotels' },
  { label: 'Rent a Car', to: '/rent-a-car' },
]

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const { user, logout, loginModalOpen, openLoginModal, closeLoginModal } = useAuth()
  const location = useLocation()
  const hasHero = HERO_ROUTES.includes(location.pathname)
  const isTransparent = hasHero && !scrolled

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeDrawer = () => setMobileOpen(false)

  return (
    <>
      <AppBar
        position="fixed"
        elevation={isTransparent ? 0 : 4}
        className={`${styles.navbar} ${isTransparent ? styles.transparent : styles.scrolled}`}
      >
        <Toolbar className={styles.toolbar}>
          {/* Logo */}
          <Box component={Link} to="/" className={styles.logo}>
            <img src={mariachiLogo} alt="Mariachi" className={styles.logoImg} />
            Mariachi
          </Box>

          {/* Desktop nav links (centered) */}
          <Box className={styles.navLinks} sx={{ display: { xs: 'none', md: 'flex' } }}>
            {navLinks.map(({ label, to }) => (
              <Button key={to} component={NavLink} to={to} className={styles.navLink}>
                {label}
              </Button>
            ))}
          </Box>

          {/* Desktop auth area */}
          <Box className={styles.authArea} sx={{ display: { xs: 'none', md: 'flex' } }}>
            {user?.role === 'admin' && (
              <Button component={NavLink} to="/admin" startIcon={<AdminPanelSettingsIcon />} className={styles.adminLink}>
                Admin
              </Button>
            )}
            {user && (
              <Button component={NavLink} to="/my-bookings" className={styles.adminLink}>
                My Bookings
              </Button>
            )}
            {user && (
              <Button component={NavLink} to="/account" className={styles.adminLink}>
                Account
              </Button>
            )}
            {user ? (
              <Button variant="outlined" className={styles.loginBtn} onClick={logout}>Sign out</Button>
            ) : (
              <Button variant="outlined" className={styles.loginBtn} onClick={openLoginModal}>Login</Button>
            )}
          </Box>

          {/* Mobile hamburger */}
          <IconButton className={styles.hamburger} sx={{ display: { xs: 'flex', md: 'none' } }} onClick={() => setMobileOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={closeDrawer}
        slotProps={{ paper: { className: styles.drawerPaper } }}>
        <Box className={styles.drawerHeader}>
          <Box component={Link} to="/" className={styles.drawerLogo} onClick={closeDrawer}>
            <img src={mariachiLogo} alt="Mariachi" className={styles.logoImg} />
            Mariachi
          </Box>
          <IconButton onClick={closeDrawer} sx={{ color: '#fff' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <List disablePadding>
          {navLinks.map(({ label, to }) => (
            <ListItem key={to} disablePadding>
              <ListItemButton component={NavLink} to={to} onClick={closeDrawer} className={styles.drawerItem}>
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider className={styles.drawerDivider} />

        <Box className={styles.drawerAuth}>
          {user?.role === 'admin' && (
            <Button fullWidth component={NavLink} to="/admin" onClick={closeDrawer}
              startIcon={<AdminPanelSettingsIcon />} className={styles.drawerBtn}>
              Admin
            </Button>
          )}
          {user && (
            <Button fullWidth component={NavLink} to="/my-bookings" onClick={closeDrawer} className={styles.drawerBtn}>
              My Bookings
            </Button>
          )}
          {user && (
            <Button fullWidth component={NavLink} to="/account" onClick={closeDrawer} className={styles.drawerBtn}>
              Account
            </Button>
          )}
          {user ? (
            <Button fullWidth className={styles.drawerSignOut} onClick={() => { logout(); closeDrawer() }}>
              Sign out
            </Button>
          ) : (
            <Button fullWidth className={styles.drawerSignOut} onClick={() => { openLoginModal(); closeDrawer() }}>
              Login
            </Button>
          )}
        </Box>
      </Drawer>

      <LoginModal open={loginModalOpen} onClose={closeLoginModal} />
    </>
  )
}
