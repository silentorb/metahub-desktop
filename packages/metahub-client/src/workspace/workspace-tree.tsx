import React, { useEffect, useState } from 'react'
import { Tree } from 'react-arborist'
import { TreeNode } from './tree-node'
import { DocumentInfo } from 'metahub-protocol'
import { TreeConfig } from 'metahub-common'
import { documentsState } from '../data'
import { DataResourceSetter, withOptionalLoading, withRequiredLoading } from '../utility'
import { arrangeDocumentTree } from './arranging'
import { matchesId, modifyTreeNodesRecursive, setExpanded } from './transforming'
import { configWorkspaceTreeState } from '../config'
import * as O from 'fp-ts/Option'
import { Option } from 'fp-ts/Option'
import { TreeNodeData, TreeNodeFolder } from './types'
import { right } from 'fp-ts/Either'

const defaultTreeConfig = (): TreeConfig => ({
  expandedFolders: []
})

interface Props {
  documents: readonly DocumentInfo[]
  treeConfig: Option<TreeConfig>
  setTreeConfig: DataResourceSetter<TreeConfig>
}

export const newRootNode = (children: TreeNodeData[] = []): TreeNodeFolder => ({
  id: '.',
  type: 'folder',
  title: 'Root',
  isOpen: true,
  children,
})

export const WorkspaceTree = withOptionalLoading(configWorkspaceTreeState, 'treeConfig',
  withRequiredLoading(documentsState, 'documents',
    (props: Props) => {
      const { documents, treeConfig, setTreeConfig } = props
      const [tree, setTree] = useState<TreeNodeData>(newRootNode)

      useEffect(() => {
        const { expandedFolders } = O.getOrElse(defaultTreeConfig)(treeConfig)
        const children = arrangeDocumentTree(expandedFolders)(documents)
        setTree(newRootNode(children))
      }, [documents, treeConfig])

      const onToggle = (id: string, isOpen: boolean) => {
        const [modified, nextTree] = modifyTreeNodesRecursive(matchesId(id), setExpanded(isOpen))(tree)
        if (modified) {
          setTree(nextTree)
          const previousTreeConfig = O.getOrElse(defaultTreeConfig)(treeConfig)
          const expandedFolders = isOpen
            ? previousTreeConfig.expandedFolders.concat(id)
            : previousTreeConfig.expandedFolders.filter(i => i !== id)

          const nextTreeConfig = { ...previousTreeConfig, expandedFolders }
          setTreeConfig(right(nextTreeConfig))
        }
      }

      return <Tree data={tree} onToggle={onToggle} hideRoot>{TreeNode}</Tree>
    }
  )
)
