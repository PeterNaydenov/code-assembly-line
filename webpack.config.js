const 
        path = require('path')
      , webpack = require('webpack')
      , webpackAnalyzer = require ('webpack-bundle-analyzer').BundleAnalyzerPlugin
      ;

const 
      PROD = (process.env.NODE_ENV === 'production') ? true : false
    , uglifyOptions = { 
                          minimize : true
                        , mangle   : true
                      }
    ;



module.exports = {
    entry: './src/index.js',
    output: {
          path: path.resolve(__dirname, 'dist')
        , filename: 'code-assembly-line.min.js'
        , library: 'CodeAssemblyLine'
        , libraryTarget : 'umd'
        , umdNamedDefine : true
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/, query: { presets: ['env'] } }
        ],
    },
    plugins: PROD ? [
                          new webpack.optimize.UglifyJsPlugin( uglifyOptions )
                    ] 
                  : []
};


