import React from 'react'
import { documentState } from '../data'
import styled from 'styled-components'
import { useLoading } from '../utility'
import { right } from 'fp-ts/Either'
import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core'
import { nord } from '@milkdown/theme-nord'
import { ReactEditor, useEditor } from '@milkdown/react'
import { gfm } from '@milkdown/preset-gfm'
import { DataDocument } from 'metahub-protocol'
import { listener, listenerCtx } from '@milkdown/plugin-listener'

interface Props {
  id: string
}

const DocumentMargin = styled.div`
  margin: 10px;
  font-family: 'Open Sans', sans-serif;
`

interface InternalEditorProps {
  document: DataDocument
}

const InternalEditor = ({ document }: InternalEditorProps) => {
  const editor = useEditor((root) =>
    Editor.make()
      .config(context => {
        context.set(rootCtx, root)
        context.set(defaultValueCtx, document.textContent)
        context.get(listenerCtx)
          .markdownUpdated((ctx, markdown, prevMarkdown) => {
            console.log('markdown', markdown)
            // output = markdown
          })
      })
      .use(nord)
      .use(gfm)
      .use(listener)
  )

  return <ReactEditor editor={editor}/>
}

export const MarkdownEditor = (props: Props) => {
  const { id } = props

  return useLoading(documentState(id), (document, setDocument) => {

    let timer = 0
    console.log('Rendering editor')
    const onChange: (value: () => string) => void = getValue => {
      console.log('changed', '@', document.textContent, '@', getValue(), '@')
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        timer = 0
        console.log('Timer finished')
        const textContent = getValue()
        if (textContent !== document.textContent) {
          const newDocument = {
            ...document,
            textContent,
          }
          console.log('Updated document')
          setDocument(right(newDocument))
        }
      }, 1000) as any
    }

    return <InternalEditor document={document}/>
  })
}
