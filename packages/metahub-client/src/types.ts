import { DocumentDatabase } from 'metahub-protocol'
import { Application } from 'metahub-common'

export interface AppServices {
  application: Application
  database: DocumentDatabase
}
