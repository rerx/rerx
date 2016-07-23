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
    core: [ './core' ],
    component: [ './component' ],
    utils: [ './utils' ]
  },
  output: {
    filename: '[name]/index.js',
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
