import React from 'react'
import { documentState } from '../data'
import Editor from 'rich-markdown-editor'
import styled from 'styled-components'
import { useLoading } from '../utility'
import { right } from 'fp-ts/Either'

interface Props {
  id: string
}

const DocumentMargin = styled.div`
  margin: 10px;
  font-family: 'Open Sans', sans-serif;
`

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

    return (
      <DocumentMargin>
        <Editor
          defaultValue={document.textContent}
          onChange={onChange}
        />
      </DocumentMargin>
    )
  })
}
