import { createContext, useContext, useState, useCallback } from 'react'
import * as bookingsApi from '../api/bookings'

const BookingsContext = createContext(null)

export function BookingsProvider({ children }) {
  // Flat array of server booking objects: { _id, type, flight|hotel|car, totalPrice, status, createdAt }
  const [bookings, setBookings] = useState([])
  const [loading,  setLoading]  = useState(false)

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    try {
      const data = await bookingsApi.getMyBookings()
      setBookings(data)
    } catch {
      setBookings([])
    } finally {
      setLoading(false)
    }
  }, [])

  const clearBookings = useCallback(() => setBookings([]), [])

  /**
   * addBooking — creates a booking on the server and refreshes the list.
   * @param {'flight'|'hotel'|'car'} type
   * @param {object} item        — the full item object from the listing (must have ._id)
   * @param {number} [passengers] — number of passengers (flights only)
   */
  const addBooking = useCallback(async (type, item, passengers = 1, dates = {}) => {
    const nights = (dates.checkin && dates.checkout)
      ? Math.max(1, Math.round((new Date(dates.checkout) - new Date(dates.checkin)) / 86400000))
      : 1
    const body = { type, totalPrice: (item.price ?? item.pricePerDay) * (type === 'flight' ? passengers : (type === 'hotel' ? nights : 1)) }
    if (type === 'flight') { body.flight     = item._id; body.passengers = passengers }
    if (type === 'hotel')  {
      body.hotel = item._id
      if (dates.checkin)  body.checkIn  = dates.checkin
      if (dates.checkout) body.checkOut = dates.checkout
    }
    if (type === 'car')    body.car    = item._id

    await bookingsApi.createBooking(body)
    await fetchBookings()
  }, [fetchBookings])

  const cancelBooking = useCallback(async (bookingId) => {
    await bookingsApi.cancelBooking(bookingId)
    setBookings((prev) => prev.filter((b) => b._id !== bookingId))
  }, [])

  // Derived views
  const flightBookings = bookings.filter((b) => b.type === 'flight')
  const hotelBookings  = bookings.filter((b) => b.type === 'hotel')
  const carBookings    = bookings.filter((b) => b.type === 'car')
  const totalBookings  = bookings.length

  return (
    <BookingsContext.Provider value={{
      bookings, loading,
      flightBookings, hotelBookings, carBookings, totalBookings,
      fetchBookings, clearBookings, addBooking, cancelBooking,
    }}>
      {children}
    </BookingsContext.Provider>
  )
}

export function useBookings() {
  return useContext(BookingsContext)
}
