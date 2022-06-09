import { newApp } from './app'
import { program } from 'commander'
import { sanitizeDirectoryPath } from './markdown-db'

if (process.env.NODE_ENV !== 'production') {
  require('source-map-support').install()
  // require('electron-reloader')(module)
}

export function main() {
  program
    .option('--source <path>', 'path to a data source root directory')

  program.parse()
  const options = program.opts()
  const rawSource = options.source
  if (!rawSource)
    throw new Error('--source CLI argument is temporarily required')

  const source = sanitizeDirectoryPath(rawSource)
  newApp(source)
}

main()
