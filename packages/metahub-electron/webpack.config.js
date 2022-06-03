const path = require('path')

module.exports = [
  {
    mode: 'development',
    entry: './src/main.ts',
    target: 'electron-main',
    devtool: 'source-map',
    module: {
      rules: [{
        test: /\.ts$/,
        include: /src/,
        use: [{ loader: 'ts-loader' }],
        exclude: /node_modules/,
      }]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      path: path.resolve(__dirname, '../..', 'dist/main'),
      filename: 'main.js'
    }
  }
]
