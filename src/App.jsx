import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { BookingsProvider, useBookings } from './context/BookingsContext'
import Layout from './pages/Layout/Layout'
import Home from './pages/Home/Home'
import Flights from './pages/Flights/Flights'
import Hotels from './pages/Hotels/Hotels'
import RentACar from './pages/RentACar/RentACar'
import Admin from './pages/Admin/Admin'
import MyBookings from './pages/MyBookings/MyBookings'
import Account from './pages/Account/Account'
import './App.css'

// Syncs bookings with auth state: fetch on login, clear on logout
function BookingsSyncer() {
  const { user } = useAuth()
  const { fetchBookings, clearBookings } = useBookings()

  useEffect(() => {
    if (user) fetchBookings()
    else      clearBookings()
  }, [user, fetchBookings, clearBookings])

  return null
}

function App() {
  return (
    <AuthProvider>
      <BookingsProvider>
        <BookingsSyncer />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/flights" element={<Flights />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/rent-a-car" element={<RentACar />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/account" element={<Account />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </BookingsProvider>
    </AuthProvider>
  )
}

export default App
