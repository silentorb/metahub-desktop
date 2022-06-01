import React from 'react'
import { documentState } from '../data'
import Editor from 'rich-markdown-editor'
import styled from 'styled-components'
import { useLoading } from '../utility'

interface Props {
  id: string
}

const DocumentMargin = styled.div`
  margin: 10px;
  font-family: 'Open Sans', sans-serif;
`

export const MarkdownEditor = (props: Props) => {
  const { id } = props
  return useLoading(documentState(id), document => (
    <DocumentMargin>
      <Editor
        defaultValue={document.textContent}
      />
    </DocumentMargin>
  ))
}
