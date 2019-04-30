const 
        path = require ( 'path' )
      , webpackAnalyzer = require ('webpack-bundle-analyzer').BundleAnalyzerPlugin
      ;

let plugins = [];

// plugins = [ new webpackAnalyzer() ]

module.exports = {
    entry: './src/index.js',
    module: {
        rules: [
                  { test : /\.js$/,  use  :['babel-loader'], exclude: /node_modules/ }
               ],
        },
    output: {
                path: path.resolve(__dirname, 'dist')
              , publicPath : '/'
              , filename: 'code-assembly-line.min.js'
              , library: 'CodeAssemblyLine'
          },
    plugins
}


