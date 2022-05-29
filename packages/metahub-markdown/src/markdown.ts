import { RecordInfo } from 'metahub-protocol'
import { Option } from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import unified from 'unified'
import remarkParse from 'remark-parse'
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import * as A from 'fp-ts/lib/Array'
import { Node, Parent } from 'unist'
import { Heading, Text } from 'mdast'
import { Predicate } from 'fp-ts/Predicate'
import { Either } from 'fp-ts/lib/Either'

export function findFirstAndCast<A2, C>(predicate: Predicate<A2 | C>): <B extends A2>(bs: Array<B>) => Option<C> {
  return A.findFirst(predicate) as <B extends A2>(bs: Array<B>) => Option<C>
}

export function getOptionalMarkdownTitle(content: Parent): Option<string> {
  const h1: Option<Heading> = pipe(
    content.children,
    findFirstAndCast<Node, Heading>(child => 'depth' in child && child.type === 'heading' && child.depth === 1),
  )

  return pipe(
    h1,
    O.chain(node => pipe(
      node.children,
      findFirstAndCast<Node, Text>(child => 'value' in child && child.type === 'text'),
      O.map(child => child.value)
    ))
  )
}

export function getMarkdownTitleOrFilename(content: Parent, info: Omit<RecordInfo, 'title'>): string {
  return pipe(
    getOptionalMarkdownTitle(content),
    O.getOrElse(() => info.path[info.path.length - 1])
  )
}

export const parseMarkdown = (content: string): Either<Error, Parent> =>
  E.tryCatch(
    () => unified()
      .use(remarkParse)
      // .use(remarkFrontmatter, ['toml'])
      // .use(remarkGfm)
      .parse(content) as Parent,
    reason => new Error(`${reason}`)
  )
