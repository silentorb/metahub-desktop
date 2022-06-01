import React from 'react'
import { Tree } from 'react-arborist'
import { TreeNode } from './tree-node'
import { DatabaseProps, documentsState, withDatabase } from '../data'
import { useLoading } from '../utility'

interface Props extends DatabaseProps {

}

export const WorkspacePanel = withDatabase((props: Props) => {
  return useLoading(documentsState, documents => {
    const data = {
      id: '.',
      name: 'Root',
      children: documents,
    } as any

    return <Tree data={data}>{TreeNode}</Tree>
  })
})
