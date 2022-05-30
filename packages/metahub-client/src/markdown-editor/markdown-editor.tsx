import React from 'react'
import { useRecoilValue } from 'recoil'
import { documentsState, DocumentStatus } from '../data'
import Editor from 'rich-markdown-editor'
import styled from 'styled-components'

interface Props {
  id: string
}

const DocumentMargin = styled.div`
  margin: 10px;
  font-family: 'Open Sans';
`

export const MarkdownEditor = (props: Props) => {
  const { id } = props
  const content = useRecoilValue(documentsState(id))
  console.log('content', content)
  switch (content.status) {
    case DocumentStatus.loading:
      return <div>Loading</div>

    case DocumentStatus.available:
      return (
        <DocumentMargin>
          <Editor
            defaultValue={content.document.textContent}
          />
        </DocumentMargin>
      )

    default:
      return <div>Sorry, this document could not be loaded!</div>
  }
}
