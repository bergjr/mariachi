import { get, post, patch, del } from './client'

export const getCars    = (params)    => get('/cars', params)
export const createCar  = (body)      => post('/cars', body)
export const updateCar  = (id, body)  => patch(`/cars/${id}`, body)
export const deleteCar  = (id)        => del(`/cars/${id}`)
