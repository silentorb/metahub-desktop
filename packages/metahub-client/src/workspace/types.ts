import { DocumentInfo } from 'metahub-protocol'

export interface TreeNodeFolder extends Omit<DocumentInfo, 'path'> {
  type: 'folder'
  isOpen: boolean,
  children: TreeNodeData[]
}

export interface TreeNodeDocument extends Omit<DocumentInfo, 'path'> {
  type: 'document'
}

export type TreeNodeData = TreeNodeFolder | TreeNodeDocument

export type Transform<T> = (value: T) => T
