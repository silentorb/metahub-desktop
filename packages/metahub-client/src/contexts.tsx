import React, { ComponentType } from 'react'
import { DocumentDatabase } from 'metahub-protocol'
import { DatabaseStub } from './database-stub'

export interface DatabaseProps {
  database: DocumentDatabase
}

export const DatabaseContext = React.createContext<DatabaseProps>({
  database: new DatabaseStub(),
})

export function withDatabase<P extends DatabaseProps>(WrappedComponent: ComponentType<P>) {
  return (props: Pick<P, Exclude<keyof P, keyof DatabaseProps>>) => (
    <DatabaseContext.Consumer>
      {context => <WrappedComponent {...props as P} {...context}/>}
    </DatabaseContext.Consumer>
  )
}
