import { newApp } from './app/app'
import { program } from 'commander'

if (process.env.NODE_ENV !== 'production') {
  require('source-map-support').install()
  require('electron-reloader')(module)
}

export function main() {
  program
    .option('--source <path>', 'path to a data source root directory')

  program.parse()
  const options = program.opts()
  const { source } = options
  if (!source)
    throw new Error('--source CLI argument is temporarily required')

  newApp(source)
}

main()
