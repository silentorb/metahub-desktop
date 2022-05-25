import React, { useEffect, useState } from 'react'
import { Tree } from 'react-arborist'
import { TreeNode } from './tree-node'
import { RecordInfo } from 'metahub-protocol'
import { getDatabase } from './api'

interface Props {

}

export const RecordTree = (props: Props) => {
  const db = getDatabase()
  const [documents, setDocuments] = useState([] as Array<RecordInfo>)
  useEffect(() => {
    db.getAllRecords()
      .then(result => {
        console.log('records', result)
        setDocuments(result)
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
