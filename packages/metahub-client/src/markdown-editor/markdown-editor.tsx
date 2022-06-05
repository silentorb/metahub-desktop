import React from 'react'
import { documentState } from '../data'
import styled from 'styled-components'
import { DataResourceSetter, useLoading } from '../utility'
import { right } from 'fp-ts/Either'
import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core'
import { nord } from '@milkdown/theme-nord'
import { ReactEditor, useEditor } from '@milkdown/react'
import { gfm } from '@milkdown/preset-gfm'
import { DataDocument } from 'metahub-protocol'
import { listener, listenerCtx } from '@milkdown/plugin-listener'

export const markdownEditorKey = 'markdownEditor'

interface Props {
  id: string
}

const DocumentMargin = styled.div`
  margin: 10px;
  font-family: 'Open Sans', sans-serif;
`

interface InternalEditorProps {
  document: DataDocument
  setDocument: DataResourceSetter<DataDocument>
}

const InternalEditor = (props: InternalEditorProps) => {
  const { document, setDocument } = props

  let timer = 0
  console.log('Rendering editor')
  const onChange = (value: string) => {
    console.log('changed', '@', document.textContent, '@', value, '@')
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      timer = 0
      console.log('Timer finished')
      if (value !== document.textContent) {
        const newDocument = {
          ...document,
          textContent: value,
        }
        console.log('Updated document')
        setDocument(right(newDocument))
      }
    }, 1000) as any
  }

  const editor = useEditor((root) =>
    Editor.make()
      .config(context => {
        context.set(rootCtx, root)
        context.set(defaultValueCtx, document.textContent)
        context.get(listenerCtx)
          .markdownUpdated((ctx, markdown, prevMarkdown) => {
            console.log('markdown', markdown)
            // output = markdown
            onChange(markdown)
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
  return useLoading(documentState(id), (document, setDocument) =>
    <InternalEditor document={document} setDocument={setDocument}/>
  )
}
