const path = require('path');

module.exports = {
  entry: './src/electron/main.ts',
  target: 'electron-main',
  output: {
    path: path.resolve(__dirname, 'dist/electron'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  node: {
    __dirname: false,
    __filename: false
  }
}; 