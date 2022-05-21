
export function flatten<T>(input: T[][]): T[] {
  return [].concat.apply([], input as any)
}

export function getRequiredConfigString(name: string): string {
  const value = process.env[name]
  if (!value)
    throw Error(`Missing required environment variable ${name}`)

  return value
}
