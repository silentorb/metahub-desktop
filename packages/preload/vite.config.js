const path = require('path')
const { builtinModules } = require('module')

// Currently the only way to see styled component names while debugging is to use a babel plugin.
// Vite doesn't normally need babel.
// In this case babel is only being included for development.
// As babel (like jQuery) is mainly a stop-gap that will ideally be replaced by native alternatives,
// hopefully a more native display name solution will be created for styled components.
function newReactConfiguration() {
  return require('@vitejs/plugin-react')({
    babel: {
      plugins: [
        [
          'babel-plugin-styled-components',
          {
            displayName: true,
            fileName: false
          }
        ]
      ]
    }
  })
}

const reactConfiguration = process.env.NODE_ENV === 'development'
  ? [newReactConfiguration()]
  : []

module.exports = {
  root: './',
  base: './',
  build: {
    sourcemap: true,
    outDir: 'dist/preload',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      fileName: (format) => `preload.js`,
      formats: ['cjs'],
    },
    rollupOptions: {
      external: [
        'electron',
        ...builtinModules.flatMap(p => [p, `node:${p}`]),
      ]
    }
  },
  plugins: [].concat(reactConfiguration),
}
