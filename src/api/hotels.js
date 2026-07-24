import { get, post, patch, del } from './client'

export const getHotels    = (params)    => get('/hotels', params)
export const createHotel  = (body)      => post('/hotels', body)
export const updateHotel  = (id, body)  => patch(`/hotels/${id}`, body)
export const deleteHotel  = (id)        => del(`/hotels/${id}`)
