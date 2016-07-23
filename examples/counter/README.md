# Setting up a minimal Rerx project.

## Start from this preset project

> Dependencies might be outdated.

```
npm install
npm start
open http://localhost:3000
```


## Create from scratch

> You will get the latest version of dependencies.

```
mkdir app
cd app
npm init
npm install --save-dev rerx react-dom rxjs webpack webpack-dev-server babel-core babel-loader babel-preset-es2015 babel-preset-react react
```

Copy `webpack.config.js` and `src/*` into the app folder.

Add start command to your `package.json`
```
webpack-dev-server --content-base src --port 3000 --inline --quiet
```

Run
```
npm start
open http://localhost:3000
```
