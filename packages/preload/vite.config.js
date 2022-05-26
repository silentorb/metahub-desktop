const path = require('path')
const { builtinModules } = require('module')

module.exports = {
  root: './',
  base: './',
  build: {
    sourcemap: false,
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
  }
}
