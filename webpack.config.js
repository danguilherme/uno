const path = require('path');

module.exports = {
  entry: './main.js',
  output: {
    library: 'Uno',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    filename: 'uno.bundle.js'
  }
};