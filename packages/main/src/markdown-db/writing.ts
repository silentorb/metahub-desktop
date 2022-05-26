import { DataDocument, RecordInfo } from 'metahub-protocol'
import { writeFile } from './file-operations'
import { getMarkdownTitle } from 'metahub-markdown'

export async function updateRecord(info: RecordInfo, record: DataDocument): Promise<RecordInfo> {
  const title = getMarkdownTitle(record.content, info)
  await writeFile(info.id, '')
  return {
    ...info,
    title,
  }
}
