import { MarkdownTree } from './types'
import { RecordInfo } from 'metahub-protocol'
import { none, Option } from 'fp-ts/Option'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import unified from 'unified'
import remarkParse from 'remark-parse'
// import remarkGfm from 'remark-gfm'
import * as TE from 'fp-ts/lib/TaskEither'
import remarkFrontmatter from 'remark-frontmatter'

export function getMarkdownTitleOrUndefined(content: MarkdownTree): Option<string> {
  // if (false) {
  //   return '' // TODO: Get title from top heading
  // }
  //
  // return undefined
  return none
}

export function getMarkdownTitle(content: MarkdownTree, info: RecordInfo): string {
  return pipe(
    getMarkdownTitleOrUndefined(content),
    O.getOrElse(() => info.path[info.path.length - 1])
  )
}

export const parseMarkdown = (content: string) =>
  TE.tryCatch(
    () => unified()
      .use(remarkParse)
      .use(remarkFrontmatter, ['toml'])
      // .use(remarkGfm)
      .process(content),
    reason => new Error(`${reason}`)
  )
