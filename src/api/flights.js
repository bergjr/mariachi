import { get, post, patch, del } from './client'

export const getFlights    = (params)    => get('/flights', params)
export const createFlight  = (body)      => post('/flights', body)
export const updateFlight  = (id, body)  => patch(`/flights/${id}`, body)
export const deleteFlight  = (id)        => del(`/flights/${id}`)
