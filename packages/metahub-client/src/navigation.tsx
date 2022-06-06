import React, { useEffect, useState } from 'react'
import { contextWrapper } from './utility'
import { invokeEvent, TypedEventType, useEventListener } from 'happening-react'
import { documentState } from './data'
import { useRecoilValue } from 'recoil'
import { loadingState } from './api'
import { Either } from 'fp-ts/Either'
import { DataDocument } from 'metahub-protocol'
import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'

export interface NavigationEvent {
  id: string
  title?: string
}

export const navigationEvent: TypedEventType<NavigationEvent> = () => 'navigateTo'
export const preNavigationEvent: TypedEventType<{ id: string }> = () => 'preNavigateTo'

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
      if (navigation.title) {
        invokeEvent(navigationEvent, navigation)
      } else {
        invokeEvent(preNavigationEvent, navigation)
      }
    }
  }
}

export type NavigationLoaderFinished = (id: string, result: Either<Error, DataDocument>) => void

export interface NavigationLoaderProps extends NavigationProps {
  id: string
  onFinished: NavigationLoaderFinished
}

// NavigationLoader and NavigationManager never render any meaningful DOM elements and
// just exist to integrate async recoil data fetching into the navigation process
export const NavigationLoader = withNavigation((props: NavigationLoaderProps) => {
  const { id } = props
  const result = useRecoilValue(documentState(id))

  useEffect(() => {
    if (result !== loadingState) {
      props.onFinished(id, result)
    }
  }, [result])

  return <span></span>
})

export const NavigationManager = () => {
  const [loaders, setLoaders] = useState<string[]>([])
  useEventListener(preNavigationEvent, navigation => {
    const nextLoaders = loaders.concat(navigation.id)
    setLoaders(nextLoaders)
  })

  const onFinished: NavigationLoaderFinished = (id, result) => {
    setLoaders(loaders.filter(i => i !== id))
    pipe(
      result,
      E.map(document => invokeEvent(navigationEvent, { id, title: document.title })),
      E.getOrElse(error => console.error(`Unable to find ${id} to navigate to (${error.message})`))
    )
  }

  return <span>
    {
      loaders.map(id => (
        <NavigationLoader key={id} id={id} onFinished={onFinished}/>
      ))
    }
  </span>
}
