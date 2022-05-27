import React from 'react'
import { contextWrapper } from './utility'
import { invokeEvent, TypedEventType } from 'happening-react'

// export interface DocumentOrViewLocation {
//   type: 'document',
//   id: string
// }
//
// export interface ViewLocation {
//   type: 'view',
//   id: string
// }
//
// export type NoneLocation = {
//   type: 'none',
//   id: void,
// }

export const noneLocation: UiLocation = '~/none'

export type UiLocation = string

export const navigationEvent: TypedEventType<UiLocation> = () => 'navigateTo'

// export const focusedViewState = atom<NavigationLocation>({
//   key: 'focusedView',
//   default: noneLocation,
// })

export type NavigateTo = (location: UiLocation) => void

export interface NavigationProps {
  navigateTo: NavigateTo
}

export const NavigationContext = React.createContext<NavigationProps>({
  navigateTo: (_) => {
  }
})

export const withNavigation = contextWrapper(NavigationContext)

export function newNavigationProps(): NavigationProps {
  return {
    navigateTo: (location) => {
      invokeEvent(navigationEvent, location)
    }
  }
}
