const path = require('path');
const fs = require('fs');

//need an array of src directories for webpack to search our import statements for
const srcDirs = getModuleDirs("./src");

module.exports = {
  entry: './src/webpack.index.js' //this will be overwritten in karma.conf, per mike ward suggestion
  , loader: {
    test: /\.js$/
    , exclude: /node_modules/
    , loader: "babel-loader"
  }
  , devtool: 'source-map'
  , output: {
    filename: 'bundle.js'
    , path: path.resolve(__dirname, 'wwwroot/dist')
  },
  resolve: {
    modules: srcDirs
  }
}

function getModuleDirs(srcRoot) {
  const isDirectory = root => fs.lstatSync(root).isDirectory();
  const getDirectories = root => fs.readdirSync(root).map(name => path.join(root, name)).filter(isDirectory);
  let directories = getDirectories(srcRoot);
  directories.push('src');
  directories.push('node_modules');
  return directories;
}
