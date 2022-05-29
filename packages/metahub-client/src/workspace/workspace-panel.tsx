import React, { useEffect, useState } from 'react'
import { Tree } from 'react-arborist'
import { TreeNode } from './tree-node'
import { DocumentInfo } from 'metahub-protocol'
import { DatabaseProps, withDatabase } from '../data'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/function'

interface Props extends DatabaseProps {

}

export const WorkspacePanel = withDatabase((props: Props) => {
    const { database } = props
    const [documents, setDocuments] = useState([] as Array<DocumentInfo>)
    useEffect(() => {
      database.getAllRecords()
        .then(response => {
          const records = pipe(
            response,
            E.getOrElse(() => new Array<DocumentInfo>)
          )
          console.log('records', records)
          if (records) {
            setDocuments(records)
          }
        })
    }, [])

    const data = {
      id: '.',
      name: 'Root',
      children: documents,
    } as any

    return <Tree data={data}>{TreeNode}</Tree>
  }
)
