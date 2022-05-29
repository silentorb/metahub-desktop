import { DataDocument, RecordInfo } from 'metahub-protocol'
import { writeFile } from '../io'
import { getMarkdownTitleOrFilename } from 'metahub-markdown'

export async function updateRecord(info: RecordInfo, record: DataDocument): Promise<RecordInfo> {
  const title = getMarkdownTitleOrFilename(record.content, info)
  await writeFile(info.id, record.textContent)
  return {
    ...info,
    title,
  }
}
