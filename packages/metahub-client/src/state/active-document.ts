import { IJsonModel } from 'flexlayout-react'
import * as O from 'fp-ts/Option'
import { defaultPanels } from '../paneling'
import { selector } from 'recoil'
import { pipe } from 'fp-ts/function'
import { ignoreLoading } from '../api'
import { configWorkspaceLayoutState } from '../config'

const findActiveDocumentState = (layout: IJsonModel): string | undefined => {
  const panel = layout.layout.children
    .filter(c => c.id === defaultPanels.editor)[0]

  return panel
    ? panel.children['selected' in panel ? panel.selected || 0 : 0]?.id
    : undefined
}

export const activeDocumentState = selector<string | undefined>({
  key: 'activeDocument',
  get: ({ get }) => pipe(
    ignoreLoading(get(configWorkspaceLayoutState)),
    O.map(layoutState => findActiveDocumentState(layoutState.layout)),
    O.toUndefined,
  )
})
