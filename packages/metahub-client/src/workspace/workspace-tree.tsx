import React, { useEffect, useRef, useState } from 'react'
import { Tree, TreeApi } from 'react-arborist'
import { TreeNode } from './tree-node'
import { DocumentInfo, NonEmptyStringArray } from 'metahub-protocol'
import { TreeState } from 'metahub-common'
import { documentsState } from '../data'
import { DataResourceSetter, withOptionalLoading, withRequiredLoading } from '../utility'
import { arrangeDocumentTree } from './arranging'
import { matchesId, modifyTreeNodesRecursive, setExpanded } from './transforming'
import { configWorkspaceTreeState } from '../config'
import { TreeNodeData, TreeNodeFolder } from './types'
import * as E from 'fp-ts/Either'
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
  setDocuments: DataResourceSetter<readonly DocumentInfo[]>
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
      const { documents, setDocuments, treeConfig, setTreeConfig } = props
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
          setTreeConfig(E.right(nextTreeConfig))
        }
      }

      // const newButtonEnabled = tree.current?.getSelectedIds().length === 1
      const newButtonEnabled = true

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
        const parent = tree.current!.getSelectedIds()[0]
        const title = newProps.name
        const key = title.toLowerCase().replace(/ +/g, '-')
        const id = `${parent}/${key}`
        const path = id.split('/') as NonEmptyStringArray
        if (path.length == 0)
          throw new Error('Path cannot be empty')

        const info: DocumentInfo = {
          id,
          title,
          path,
        }
        const nextDocuments = documents.concat(info)
        setDocuments(E.right(nextDocuments))
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
