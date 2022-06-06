import { Transform, TreeNodeData } from './types'

export interface ArrayPredicate<T> {
  check: (value: T) => boolean
  single: boolean
}

export const matchesId = <T extends { id: string }>(id: string): ArrayPredicate<T> => ({
  check: value => value.id === id,
  single: true,
})

export const setExpanded = (isOpen: boolean): Transform<TreeNodeData> => node => ({ ...node, isOpen })

// Makes a copy of the tree, changing any nodes based on a predicate and transform.
// When nested objects are modified, their parents are modified as well to ensure the original
// tree structure is not modified.
// Also returns a boolean value indicating whether the output tree is different from the original
export const modifyTreeNodesRecursive = (predicate: ArrayPredicate<TreeNodeData>, transform: Transform<TreeNodeData>) =>
  (node: TreeNodeData): [boolean, TreeNodeData] => {
    let result = node
    let modified = false
    if (predicate.check(result)) {
      result = transform(result)
      if (predicate.single)
        return [true, result]
      else {
        modified = true
      }
    }

    if (result.type == 'folder') {
      let children = result.children
      for (let i = 0; i < children.length; ++i) {
        const child = children[i]
        const [childModified, nextChild] = modifyTreeNodesRecursive(predicate, transform)(child)
        if (childModified) {
          children = children.map((c, index) => index === i ? nextChild : c)
          result = { ...result, children, }
          if (predicate.single) {
            return [true, result]
          }
        }

        modified = childModified
      }
    }

    return [modified, result]
  }
