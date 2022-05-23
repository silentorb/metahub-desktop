import React from "react"
import { Tree } from "react-arborist"
import { TreeNode } from './tree-node'

export const RecordTree = () => {
  const data = {
    id: 'A',
    name: 'Root',
    children: [
      { id: 'B', name: 'Node 1' },
      { id: 'C', name: 'Node 23' },
    ],
  }

  return <Tree data={data}>{TreeNode}</Tree>
}
