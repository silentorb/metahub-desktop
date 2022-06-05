import React from 'react'
import { Tree } from 'react-arborist'
import { TreeNode } from './tree-node'
import { DocumentInfo } from 'metahub-protocol'
import { documentsState } from '../data'
import { withRequiredLoading } from '../utility'
import { DataResource } from '../api'

interface Props {
  documents: DataResource<readonly DocumentInfo[]>
}

export const WorkspacePanel = withRequiredLoading(documentsState, 'documents', (props: Props) => {
  const { documents } = props
  const data = {
    id: '.',
    name: 'Root',
    children: documents,
  } as any

  return <Tree data={data}>{TreeNode}</Tree>
})
