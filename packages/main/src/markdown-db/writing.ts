import { DataDocument, RecordInfo } from 'metahub-protocol'
import { writeFile } from './file-operations'
import { getMarkdownTitleOrFilename } from 'metahub-markdown'

export async function updateRecord(info: RecordInfo, record: DataDocument): Promise<RecordInfo> {
  const title = getMarkdownTitleOrFilename(record.content, info)
  await writeFile(info.id, '')
  return {
    ...info,
    title,
  }
}
