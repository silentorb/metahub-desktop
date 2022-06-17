
export interface GenericEvent<T, V> {
  type: string
  target?: T
  value?: V
}

export type CommonAnyEvent = GenericEvent<any, any>

export type Events = CommonAnyEvent[]
