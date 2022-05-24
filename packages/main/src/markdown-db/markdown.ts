import { MarkdownTree } from './types'
import { RecordInfo } from 'metahub-common'

export function getMarkdownTitleOrUndefined(content: MarkdownTree): string | undefined {
  if (false) {
    return '' // TODO: Get title from top heading
  }

  return undefined
}

export function getMarkdownTitle(content: MarkdownTree, info: RecordInfo): string {
  return getMarkdownTitleOrUndefined(content) || info.name
}

