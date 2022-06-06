import { createPlugin } from '@milkdown/utils'
import { Plugin } from 'prosemirror-state'
import { NavigationProps } from '../navigation'

export const idFromUri = (uri: string): string =>
  uri
    .replace(/^.\//, '')
    .replace(/\.\w+$/, '')

export const linkPlugin = (props: NavigationProps) => createPlugin(() => {
  const { navigateTo } = props
  return {
    prosePlugins: (_, ctx) => {
      const plugin = new Plugin({
        props: {
          handleClickOn: (view, cursorPosition, node, nodePosition, event, direct) => {
            if (direct) {
              const offset = cursorPosition - nodePosition
              const child = node.nodeAt(offset)
              if (child) {
                for (const mark of child.marks) {
                  if (mark.type.name == 'link') {
                    const { href } = mark.attrs
                    if (href) {
                      const id = idFromUri(href)
                      // For some reason running this code immediately within this event handler
                      // causes the anchor click to resolve.
                      setTimeout(() => navigateTo({ id }), 1)
                    }
                  }
                }
              }
            }
          }
        }
      })
      return [plugin]
    }
  }
})()
