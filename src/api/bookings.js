import { get, post, del } from './client'

export const getMyBookings  = ()           => get('/bookings/mine')
export const createBooking  = (body)       => post('/bookings', body)
export const cancelBooking  = (id)         => del(`/bookings/${id}`)
export const getAllBookings  = ()           => get('/bookings')          // admin only
