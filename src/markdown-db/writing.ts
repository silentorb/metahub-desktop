import { RecordInfo } from '../core'
import { writeFile } from './file-operations'
import { MarkdownRecord } from './types'
import { getMarkdownTitle } from './markdown'

export async function updateRecord(info: RecordInfo, record: MarkdownRecord): Promise<RecordInfo> {
  const title = getMarkdownTitle(record.content, info)
  await writeFile(info.path, '')
  return {
    ...info,
    title,
  }
}
