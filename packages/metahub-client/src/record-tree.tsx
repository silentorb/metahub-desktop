import React, { useEffect, useState } from 'react'
import { Tree } from 'react-arborist'
import { TreeNode } from './tree-node'
import { RecordInfo } from 'metahub-protocol'
import { DatabaseProps, withDatabase } from './contexts'

interface Props extends DatabaseProps {

}

export const RecordTree = withDatabase((props: Props) => {
    const { database } = props
    const [documents, setDocuments] = useState([] as Array<RecordInfo>)
    useEffect(() => {
      database.getAllRecords()
        .then(([error, result]) => {
          console.log('records', result)
          if (result) {
            setDocuments(result)
          }
        })
    }, [])

    const data = {
      id: 'A',
      name: 'Root',
      children: documents.map(info => (
        { id: info.id, name: info.title }
      ))
    }

    return <Tree data={data}>{TreeNode}</Tree>
  }
)
