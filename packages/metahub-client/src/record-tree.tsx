import React, { useEffect, useState } from 'react'
import { Tree } from 'react-arborist'
import { TreeNode, TreeNodeData } from './tree-node'
import { RecordInfo } from 'metahub-protocol'
import { DatabaseProps, withDatabase } from './database'
import { TreeProps } from 'react-arborist/dist/types'

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
      id: '.',
      name: 'Root',
      children: documents,
    } as any

    return <Tree data={data}>{TreeNode}</Tree>
  }
)
