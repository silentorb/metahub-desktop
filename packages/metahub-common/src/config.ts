import { ConfigElement, StorageLayer } from './types'
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export interface OpenDocumentConfig {
  path: string
  caretPosition: [number, number]
}

export interface LayoutConfig {
  maxTabs: number
}

export class CLayoutConfig implements LayoutConfig {
  @IsInt()
  @Min(0)
  @Max(1024)
  @IsOptional()
  maxTabs: number = 10
}

export const configWorkspaceLayout: ConfigElement<LayoutConfig, 'config/workspace/layout'> = {
  key: 'config/workspace/layout',
  storageLayer: StorageLayer.global,
  validationType: CLayoutConfig,
}
