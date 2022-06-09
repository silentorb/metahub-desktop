import { DataSource } from 'metahub-protocol'
import { MarkdownDatabaseConfig } from '../markdown-db'

export interface ServerConfig {
  database: MarkdownDatabaseConfig
}

export interface Server {
  config: ServerConfig
  database: DataSource<any>
}

// export function newServer(config: ServerConfig): Server {
//   return {
//     config,
//     database: new MarkdownDatabase(config.database)
//   }
// }
