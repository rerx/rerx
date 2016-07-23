const path = require('path');
const src = path.join(__dirname, 'src');

module.exports = {
  context: src,
  devtool: 'inline-source-map',
  entry: {
    main: [ './index.js' ]
  },
  output: {
    path: 'dist',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: src,
        loader: 'babel',
        query: {
          presets: ["react", "es2015"],
          cacheDirectory: true
        }
      }
    ]
  },
  resolve: {
    extensions: ["", ".js"],
    modulesDirectories: [ 'node_modules' ],

    // Use full bundle of RxJS.
    alias: {
      'rxjs/Observable': 'rxjs/Rx',
      'rxjs/Subject': 'rxjs/Rx'
    }
  }
};
