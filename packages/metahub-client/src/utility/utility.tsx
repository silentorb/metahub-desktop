import React, { ComponentType, Context } from 'react'

export function contextWrapper<C>(WrappedContext: Context<C>) {
  return function wrapper<P>(WrappedComponent: ComponentType<P>) {
    return (props: Pick<P, Exclude<keyof P, keyof C>>) => (
      <WrappedContext.Consumer>
        {context => <WrappedComponent {...props as P} {...context}/>}
      </WrappedContext.Consumer>
    )
  }
}
