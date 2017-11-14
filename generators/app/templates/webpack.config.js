const path = require('path');

module.exports = {
    entry: './src/webpackEntryPointIndex.js'
    , output: {
        filename: 'bundle.js'
        , path: path.resolve(__dirname, 'wwwroot/dist')
    }
    , devtool: 'source-map'
}
