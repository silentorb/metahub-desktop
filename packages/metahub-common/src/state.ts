import { ConfigElement, StorageLayer } from './types'
import { IsArray, IsObject, IsOptional, IsString } from 'class-validator'

export interface LayoutState {
  layout: any

  // Is used to determine which tab should be auto-closed when max tabs is exceeded
  tabPriority: string[]
}

export class CLayoutState implements LayoutState {
  @IsObject()
  layout: any

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tabPriority: string[] = []
}

export const stateWorkspaceLayout: ConfigElement<LayoutState, 'state/workspace/layout'> = {
  key: 'state/workspace/layout',
  storageLayer: StorageLayer.project,
  validationType: CLayoutState,
}

export interface TreeState {
  expandedFolders: string[]
}

export class CTreeState implements TreeState {
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  expandedFolders: string[] = []
}

export const stateWorkspaceTree: ConfigElement<TreeState, 'state/workspace/tree'> = {
  key: 'state/workspace/tree',
  storageLayer: StorageLayer.project,
  validationType: CTreeState,
}

export interface ActiveDocumentState {
  activeDocument?: string
}

export class CActiveDocumentState implements ActiveDocumentState {
  @IsString()
  @IsOptional()
  activeDocument?: string
}

export const stateActiveDocument: ConfigElement<ActiveDocumentState, 'state/workspace/activeDocument'> = {
  key: 'state/workspace/activeDocument',
  storageLayer: StorageLayer.project,
  validationType: CActiveDocumentState,
}
