
export interface Left<E> {
  readonly _tag: 'Left'
  readonly left: E
}

export interface Right<A> {
  readonly _tag: 'Right'
  readonly right: A
}

export declare type Either<E, A> = Left<E> | Right<A>
export interface Task<A> {
  (): Promise<A>
}
export interface TaskEither<E, A> extends Task<Either<E, A>> {}
