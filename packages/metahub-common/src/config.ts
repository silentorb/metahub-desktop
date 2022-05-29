import { Nested } from './validation'

export interface OpenDocumentConfig {
  path: string
  caretPosition: [number, number]
}

export interface WorkspaceConfig {
  openDocuments: OpenDocumentConfig[]
}

export class COpenDocumentConfig implements OpenDocumentConfig {
  path!: string
  caretPosition!: [number, number]
}

export class CWorkspaceConfig {
  @Nested(COpenDocumentConfig)
  openDocuments!: OpenDocumentConfig[]
}
