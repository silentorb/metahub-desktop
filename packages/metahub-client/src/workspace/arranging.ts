import { DocumentInfo } from 'metahub-protocol'
import { TreeNodeData, TreeNodeFolder } from './types'

// Sorts tree children by Directory/Doc first and Alphabetical second
export const sortChildren = (children: TreeNodeData[]): TreeNodeData[] =>
  children.sort((a, b) =>
    a.type !== b.type
      ? a.type === 'folder' ? -1 : 1
      : a.title.localeCompare(b.title)
  )

export const sortChildrenRecursive = (children: TreeNodeData[]): TreeNodeData[] =>
  sortChildren(children)
    .map(node =>
      node.type == 'folder'
        ? { ...node, children: sortChildrenRecursive(node.children) }
        : node
    )

export const arrangeDocumentTree = (activeDocument: string | undefined, expandedFolders: string[]) => (documents: readonly DocumentInfo[]): TreeNodeData[] => {
  const result: TreeNodeData[] = []
  const directories: Map<string, TreeNodeFolder> = new Map()
  for (const info of documents) {
    const { path } = info
    for (let i = 0; i < path.length; ++i) {
      let node: TreeNodeData
      if (i < path.length - 1) {
        const subPath = path.slice(0, i + 1)
        const id = subPath.join('/')
        if (directories.has(id))
          continue

        node = {
          id,
          type: 'folder',
          isOpen: expandedFolders.includes(id),
          title: subPath[subPath.length - 1],
          children: []
        }
        directories.set(id, node)
      } else {
        node = {
          type: 'document',
          isActive: activeDocument === info.id,
          ...info,
        }
      }

      if (i === 0) {
        result.push(node)
      } else {
        const parentPath = path.slice(0, i).join('/')
        const parent = directories.get(parentPath)
        if (parent) {
          parent.children.push(node)
        }
      }
    }
  }

  return sortChildren(result)
}
