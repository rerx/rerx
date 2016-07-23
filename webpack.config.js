const path = require('path');
const webpack = require('webpack');
const src = path.join(__dirname, 'src');

const reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react'
};

module.exports = {
  context: src,
  devtool: 'source-map',
  entry: {
    index: [ './index.js' ],
    core: [ './core.js' ],
    createReactiveComponent: [ './createReactiveComponent.js' ],
    DOM: [ './DOM.js' ],
    utils: [ './utils.js' ]
  },
  output: {
    path: 'lib',
    filename: '[name].js',
    library: 'Rerx',
    libraryTarget: 'commonjs2'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: src,
        loader: 'babel',
        query: {
          presets: ["es2015", "stage-2"],
          plugins: ["transform-function-bind"],
          cacheDirectory: true
        }
      }
    ]
  },
  resolve: {
    extensions: ["", ".js"],
    modulesDirectories: [ 'node_modules' ]
  },
  externals: [
    {
      react: reactExternal
    },
    /^rxjs/
  ]
};
