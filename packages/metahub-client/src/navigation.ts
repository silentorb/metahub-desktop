import React from 'react'
import { contextWrapper } from './utility'

export interface DocumentLocation {
  type: 'document',
  data: string
}

export type NavigationLocation = DocumentLocation

export type NavigateTo = (location: NavigationLocation) => void

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
    navigateTo: (_) => {
    }
  }
}
