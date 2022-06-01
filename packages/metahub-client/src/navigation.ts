import React from 'react'
import { contextWrapper } from './utility/utility'
import { invokeEvent, TypedEventType } from 'happening-react'

export interface NavigationEvent {
  id: string
  title?: string
}

export const noneLocation: UiLocation = '~/none'

export type UiLocation = string

export const navigationEvent: TypedEventType<NavigationEvent> = () => 'navigateTo'

export type NavigateTo = (navigation: NavigationEvent) => void

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
    navigateTo: (navigation) => {
      invokeEvent(navigationEvent, navigation)
    }
  }
}
