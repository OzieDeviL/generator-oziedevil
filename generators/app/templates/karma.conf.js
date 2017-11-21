//documentation on this trick for integrating webpack and karma: http://mike-ward.net/2015/09/07/tips-on-setting-up-karma-testing-with-webpack/
//var webpackConfig = require('./webpack.config.js');

// Karma configuration
// Generated on Mon Oct 16 2017 15:23:30 GMT-0700 (Pacific Daylight Time)

//these are needed for the webpack configuration below
const path = require('path');
const fs = require('fs');
const srcDirs = getModuleDirs("./src");


module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [
      'jasmine'
    ],

    // list of files / patterns to load in the browser
    files: [
      './src/webpack-specs.index.js',
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      //'./src/webpackEntryPoint.js': ['webpack'],
      './src/**.js': ['webpack', 'sourcemap']
    },

    webpack: {
      //for reasons I don't understand, if I try to bring this in via an import of webpack.config.js, the files don't show up in Sources in Chrome dev tools
      loader: {
        test: /\.js$/
        , exclude: /node_modules/
        , loader: "babel-loader"
      }
      , devtool: 'eval-source-map',
      resolve: {
        modules: srcDirs
      }
    },

    webpackMiddleware: {
      noInfo: true,
      stats: {
        chunks: false
      }
    },

    plugins: [
      'karma-webpack'
      , 'karma-jasmine'
      , 'karma-chrome-launcher'
      , 'karma-babel-preprocessor'
      , 'karma-sourcemap-loader'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    //reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    //disabled to allow Grunt to run it as a child process
    //autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    //singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}

function getModuleDirs(srcRoot) {
  const isDirectory = root => fs.lstatSync(root).isDirectory();
  const getDirectories = root => fs.readdirSync(root).map(name => path.join(root, name)).filter(isDirectory);
  let directories = getDirectories(srcRoot);
  directories.push('src');
  directories.push('node_modules');
  return directories;
}

