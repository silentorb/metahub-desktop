import { AppServices } from './types'

let services: AppServices

export const getServices = () => services

export const setServices = (value: AppServices) => {
  services = value
}
