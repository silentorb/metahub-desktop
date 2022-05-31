import { DataDocument, RecordInfo } from 'metahub-protocol'
import { writeFile } from '../io'
import { getMarkdownTitleOrFilename } from 'metahub-markdown'
import { TaskEither } from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'

export function updateRecord(info: RecordInfo, record: DataDocument): TaskEither<Error, RecordInfo> {
  const title = getMarkdownTitleOrFilename(record.content, info)
  return pipe(
    record.textContent,
    writeFile(info.id),
    TE.map(() => ({
      ...info,
      title,
    }))
  )
}
