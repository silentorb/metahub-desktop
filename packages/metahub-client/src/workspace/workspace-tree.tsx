import React, { useEffect, useRef, useState } from 'react'
import { Tree, TreeApi } from 'react-arborist'
import { TreeNode } from './tree-node'
import { DocumentInfo } from 'metahub-protocol'
import { TreeState } from 'metahub-common'
import { documentsState } from '../data'
import { DataResourceSetter, withOptionalLoading, withRequiredLoading } from '../utility'
import { arrangeDocumentTree } from './arranging'
import { matchesId, modifyTreeNodesRecursive, setExpanded } from './transforming'
import { configWorkspaceTreeState } from '../config'
import { TreeNodeData, TreeNodeFolder } from './types'
import { right } from 'fp-ts/Either'
import { useRecoilValue } from 'recoil'
import { activeDocumentState } from '../state'
import { useEventListener } from 'happening-react'
import { CommonCommands } from 'metahub-common/src/commands'
import Modal from 'react-modal'
import { NewDocumentForm } from './new-document-form'

const defaultTreeConfig = (): TreeState => ({
  expandedFolders: []
})

interface Props {
  documents: readonly DocumentInfo[]
  treeConfig: TreeState
  setTreeConfig: DataResourceSetter<TreeState>
}

export const newRootNode = (children: TreeNodeData[] = []): TreeNodeFolder => ({
  id: '.',
  type: 'folder',
  title: 'Root',
  isOpen: true,
  children,
})

export const WorkspaceTree = withOptionalLoading(configWorkspaceTreeState, 'treeConfig', defaultTreeConfig,
  withRequiredLoading(documentsState, 'documents',
    (props: Props) => {
      const { documents, treeConfig, setTreeConfig } = props
      const [treeData, setTreeData] = useState<TreeNodeData>(newRootNode)
      const activeDocument = useRecoilValue(activeDocumentState)
      const tree = useRef<TreeApi<TreeNodeData>>(null)
      const [newModalIsOpen, setNewModalIsOpen] = useState(false)

      useEventListener(CommonCommands.newDocument, () => {

      })

      useEffect(() => {
        const { expandedFolders } = treeConfig
        const children = arrangeDocumentTree(activeDocument, expandedFolders)(documents)
        setTreeData(newRootNode(children))
      }, [documents, treeConfig, activeDocument])

      // useEffect(() => {
      //   if (activeDocument) {
      //     if (tree.current?.idToIndex[activeDocument]) {
      //       tree.current?.selectById(activeDocument)
      //     }
      //     else {
      //
      //     }
      //   }
      // }, [activeDocument, treeData])

      const onToggle = (id: string, isOpen: boolean) => {
        const [modified, nextTree] = modifyTreeNodesRecursive(matchesId(id), setExpanded(isOpen))(treeData)
        if (modified) {
          setTreeData(nextTree)
          const previousTreeConfig = treeConfig
          const expandedFolders = isOpen
            ? previousTreeConfig.expandedFolders.concat(id)
            : previousTreeConfig.expandedFolders.filter(i => i !== id)

          const nextTreeConfig = { ...previousTreeConfig, expandedFolders }
          setTreeConfig(right(nextTreeConfig))
        }
      }

      const newButtonEnabled = tree.current?.getSelectedIds().length === 1

      const onNew = () => {
        if (!newButtonEnabled)
          return

        setNewModalIsOpen(true)
      }

      const closeModal = () => {
        setNewModalIsOpen(false)
      }

      const onSubmitNew = (newProps: {name: string}) => {
        console.log(newProps.name)
        closeModal()
      }

      return <div>
        <button disabled={!newButtonEnabled} onClick={onNew}>New</button>
        <Tree ref={tree} data={treeData} onToggle={onToggle}>{TreeNode}</Tree>
        <Modal
          isOpen={newModalIsOpen}
          // onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          // style={customStyles}
          contentLabel="Example Modal"
        >
          <NewDocumentForm onSubmit={onSubmitNew}/>
        </Modal>
      </div>
    }
  )
)
