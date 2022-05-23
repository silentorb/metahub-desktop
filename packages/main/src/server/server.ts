import { DataSource } from '../core'
import { MarkdownDatabase, MarkdownDatabaseConfig } from '../markdown-db'

export interface ServerConfig {
  database: MarkdownDatabaseConfig
}

export interface Server {
  config: ServerConfig
  db: DataSource<any>
}

export function newServer(config: ServerConfig): Server {
  return {
    config,
    db: new MarkdownDatabase(config.database)
  }
}
