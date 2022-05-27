import React, { DependencyList } from 'react'

// Would normally be a string constant but is a function so
// that a type can be attached to it.
export type TypedEventType<T> = () => string

export type GenericEventListener<T> = (e: T) => void

export type LightEventListener = GenericEventListener<any>

// The key is the constant (memoized) version of the listener
// The value can be updated over time with function versions containing different closure values
const listeners: Map<string, Map<LightEventListener, LightEventListener>> = new Map()

function newListenerSet(type: string): Map<LightEventListener, LightEventListener> {
  const map = new Map<LightEventListener, LightEventListener>()
  listeners.set(type, map)
  return map
}

export function addEventListener(type: string, key: LightEventListener, listener: LightEventListener) {
  const set = listeners.get(type) || newListenerSet(type)
  set.set(key, listener)
}

export function removeEventListener(type: string, key: LightEventListener) {
  const map = listeners.get(type)
  if (map && map.has(key)) {
    map.delete(key)
  }
}

export function clearEventListener() {
  listeners.clear()
}

export function invokeEvent<T>(type: TypedEventType<T>, e: T) {
  const map = listeners.get(type())
  if (map) {
    for (const listener of map.values()) {
      listener(e)
    }
  }
}

export function useEventListener<T>(type: TypedEventType<T>, listener: GenericEventListener<T>, dependencies: DependencyList = []) {
  const f = React.useCallback(listener, [])
  const localType = type()

  React.useEffect(() => {
    addEventListener(localType, f, listener)

    return () => {
      removeEventListener(localType, f)
    }
  }, [listener].concat(dependencies))
}
