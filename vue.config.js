'use strict'

require('events').EventEmitter.defaultMaxListeners = 0

const path = require('path')
const webpack = require("webpack");

const config = require('./config')
const cfg = config[process.env.NODE_ENV]

let proxy = {}
for (const v of cfg) {
    //需要代理的路径   例如 '/api'
    proxy[v.key] = {
        target: v.url, //代理到 目标路径
        changeOrigin: true,
        pathRewrite: { // 修改路径数据
            [v.key]: '' // 举例 '^/api:""' 把路径中的/api字符串删除
        }
    }
}

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    // 基础配置 详情看文档
    publicPath: './',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: process.env.NODE_ENV === 'development',
    productionSourceMap: false,
    devServer: {
        port: 8080,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: proxy,
    },
    configureWebpack: {
        //    @路径走src文件夹
        resolve: {
            alias: {
                '@': resolve('src')
            }
        },
        plugins: [
            new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 10, // 限制最大chunk数为5，可根据你的项目情况和预期调整
                minChunkSize: 10000 // 设置chunk的最小大小（单位：字节），小于此值的chunk会被尝试合并。例如 10000 表示10KB
            })
        ],
        performance: {
            hints:'warning',
            //入口起点的最大体积
            maxEntrypointSize: 50000000,
            //生成文件的最大体积
            maxAssetSize: 30000000,
            //只给出 js 文件的性能提示
            assetFilter: function(assetFilename) {
                return assetFilename.endsWith('.js');
            }
        }
    },
    chainWebpack(config) {
        // set preserveWhitespace
        config.module
            .rule('vue')
            .use('vue-loader')
            .loader('vue-loader')
            .tap(options => {
                options.compilerOptions.preserveWhitespace = true
                return options
            })
            .end()
        config
            // https://webpack.js.org/configuration/devtool/#development
            .when(process.env.NODE_ENV === 'development',
                config => config.devtool('cheap-source-map')
            )

        config
            .when(process.env.NODE_ENV !== 'development',
                config => {
                    config
                        .plugin('ScriptExtHtmlWebpackPlugin')
                        .after('html')
                        .use('script-ext-html-webpack-plugin', [{
                            // `runtime` must same as runtimeChunk name. default is `runtime`
                            inline: /runtime\..*\.js$/
                        }])
                        .end()
                    config
                        .optimization.splitChunks({
                        chunks: 'all',
                        cacheGroups: {
                            libs: {
                                name: 'chunk-libs',
                                test: /[\\/]node_modules[\\/]/,
                                priority: 10,
                                chunks: 'initial' // only package third parties that are initially dependent
                            },
                            elementUI: {
                                name: 'chunk-elementUI', // split elementUI into a single package
                                priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                                test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                            },
                            commons: {
                                name: 'chunk-commons',
                                test: resolve('src/components'), // can customize your rules
                                minChunks: 3, //  minimum common number
                                priority: 5,
                                reuseExistingChunk: true
                            }
                        }
                    })
                    config.optimization.runtimeChunk('single')
                }
            )
    }
}
