
export type BoxDockMode = 'horizontal' | 'vertical' | 'float' | 'window' | 'maximize'

export interface LayoutTab {
  id: string
}

export interface TabContainer {
  id?: string
  size?: number
  tabs: LayoutTab[]
  activeId?: string
}

export interface LayoutParent {
  id?: string
  mode: BoxDockMode
  size?: number
  panelLock?: {}
  children: (LayoutParent | TabContainer)[]
}
