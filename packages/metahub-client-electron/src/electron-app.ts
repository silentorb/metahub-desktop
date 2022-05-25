import { startMetaHubClient } from 'metahub-client'
import { newAppServices } from './api'

startMetaHubClient({
  services: newAppServices()
})
