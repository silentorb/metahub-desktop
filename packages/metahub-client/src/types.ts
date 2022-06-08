import { DocumentDatabase } from 'metahub-protocol'
import { ConfigStorage } from 'metahub-common'

export interface AppServices {
  config: ConfigStorage
  database: DocumentDatabase
}
