import React from 'react'
import { DocumentDatabase } from 'metahub-protocol'
import { DatabaseStub } from './database-stub'
import { contextWrapper } from '../utility'

export interface DatabaseProps {
  database: DocumentDatabase
}

export const DatabaseContext = React.createContext<DatabaseProps>({
  database: new DatabaseStub(),
})

export const withDatabase = contextWrapper(DatabaseContext)
