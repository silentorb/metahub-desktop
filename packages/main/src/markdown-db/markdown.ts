import { MarkdownTree } from './types'
import { RecordInfo } from 'metahub-protocol'
import { none, Option, some } from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import unified from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import * as A from 'fp-ts/lib/Array'
import remarkFrontmatter from 'remark-frontmatter'
import { Node, Parent } from 'unist'
import { Heading, Text } from 'mdast'
import { predicate } from 'fp-ts'
import { Predicate } from 'fp-ts/Predicate'

// export const findNode = (predicate: (node: Node | Parent) => boolean, node: Node| Parent): Option<Node> {
//   if (predicate(node))
//     return some(node)
//
//   if ('children' in node) {
//     for (const child in node.children) {
//       const result = findNode(predicate, child)
//       ret
//     }
//   }
//   return none
// }

export function findFirstAndCast<C, A>(predicate: Predicate<A | C>): <B extends A>(bs: Array<B>) => Option<C> {
  return A.findFirst(predicate) as <B extends A>(bs: Array<B>) => Option<C>
}

export function getMarkdownTitleOrUndefined(content: Parent): Option<string> {
  const h1: Option<Heading> = pipe(
    content.children,
    findFirstAndCast<Heading, Node>((child: Node | Heading) => 'depth' in child && child.type === 'heading' && child.depth === 1),
  )

  const title = pipe(
    h1,
    O.chain(node => pipe(
      node.children,
      findFirstAndCast<Text, Node>((child: Node | Text) => 'value' in child && child.type === 'text'),
      O.map(child => child.value)
    ))
  )
  //     O.chain((child: Node | Parent) => 'children' in child)
  return title
}

export function getMarkdownTitle(content: MarkdownTree, info: Omit<RecordInfo, 'title'>): string {
  return pipe(
    getMarkdownTitleOrUndefined(content),
    O.getOrElse(() => info.path[info.path.length - 1])
  )
}

export const parseMarkdown = (content: string) =>
  E.tryCatch(
    () => unified()
      .use(remarkParse)
      // .use(remarkFrontmatter, ['toml'])
      // .use(remarkGfm)
      .parse(content),
    reason => new Error(`${reason}`)
  )
