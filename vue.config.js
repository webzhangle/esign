// vue.config.js
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin");
function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    // 公共路径
    publicPath: './',

    // 不同的环境打不同包名
    outputDir: process.env.NODE_ENV === "development" ? 'devdist' : 'dist',

    // 使用运行时编译器的 Vue 构建版本
    runtimeCompiler: true,

    // 开启生产环境SourceMap，设为false打包时不生成.map文件
    productionSourceMap: false,

    // 关闭ESLint，如果你需要使用ESLint，把lintOnSave设为true即可
    lintOnSave: false,

    devServer: {
        open: false, // 是否自动打开浏览器页面
        host: '0.0.0.0', // 指定使用一个 host，默认是 localhost
        port: 8080, // 端口地址
        https: false, // 使用https提供服务
        // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
        proxy: 'http://api.zhuishushenqi.com'
    },
    chainWebpack: (config) => {
        // 设置一些常用alias
        config.resolve.alias
            .set('@', resolve('src'))
            .set('@assets', resolve('src/assets'))
            .set('@common', resolve('src/common'))
            .set('@config', resolve('src/config'))
            .set('@components', resolve('src/components'))
        config.optimization.splitChunks({
            chunks:'all',//同时分割同步和异步代码,推荐。
            automaticNameDelimiter:'-',//名称分隔符，默认是~
            maxInitialRequests: 100,
            cacheGroups: {
            vendors: {  
                name: 'vendors',  
                test: /[/]node_modules[/]/,  
                priority: -10,  
                chunks: 'initial'  
            },
            commons: { // split async commons chunk
                name: 'commons',
                minChunks: 2,
                priority: 20,
                chunks: 'async'
            },
            vue: {
                name: 'vue',
                test: /[\\/]node_modules[\\/]_?vue(.*)/,
                priority: 20
            },
            vuex: {
                name: 'vuex',
                test: /[\\/]node_modules[\\/]vuex[\\/]/,
                priority: 30
            },
            'vue-router': {
                name: 'vue-router',
                test: /[\\/]node_modules[\\/]vue-router[\\/]/,
                priority: 40
            },
            'element-ui': {
                name: 'element-ui', // split elementUI into a single package
                priority: 30, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
            },
            swiper: {
                name: 'swiper', // split elementUI into a single package
                priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                test: /[\\/]node_modules[\\/]_?swiper(.*)/ // in order to adapt to cnpm
            },
            'vue-awesome-swiper': {
                name: 'vue-awesome-swiper', // split elementUI into a single package
                priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                test: /[\\/]node_modules[\\/]_?vue-awesome-swiper(.*)/ // in order to adapt to cnpm
            }
            }
        });
        // 移除 prefetch 插件，减少首屏加载
        config.plugins.delete('prefetch')
    },

    configureWebpack: config => {
        // 生产环境
        if (process.env.NODE_ENV === 'production') {
            // 生产环境去除console
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true

            // 生产环境打包分析体积
            return {
                plugins: [
                    new BundleAnalyzerPlugin(),
                    // new CompressionPlugin({
                    //     test: /\.js$|\.html$|\.css$|\.jpg$|\.jpeg$|\.png/, // 需要压缩的文件类型
                    //     threshold: 10240, // 归档需要进行压缩的文件大小最小值，我这个是10K以上的进行压缩
                    //     deleteOriginalAssets: true // 是否删除原文件
                    // })
                ]
            }
        }
    },
    css: {
        loaderOptions: {
            // 全局使用的一些scss样式
            sass: {
                data: `
                @import "@/style/mixin.scss";
                @import "@/style/_var.scss";
                `
            }
        }
    },
};
