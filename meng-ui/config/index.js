// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsEnvPath:  path.resolve(__dirname, '../env'),
    assetsSubDirectory: '',
    assetsPublicPath: '../',
    productionSourceMap: false,
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    env: require('./dev.env'),
    port: 9000,
    assetsSubDirectory: '',
    assetsPublicPath: '/',
    proxyTable: {
        '/api': {
            target: 'http://10.88.26.189:9084/api', // 接口的域名
            ws: true,
            changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
            pathRewrite: {
              '^/api': '' 
            }
        },
        '/locales': {
            target: 'http://10.88.26.189:9084/locales', // 语言包
            ws: true,
            changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
            pathRewrite: {
                '^/locales': ''
            }
        },
        '/maintenanceDefect/': {
            target: 'http://10.88.26.32:8098/maintenanceDefect', // 接口的域名
            ws: true,
            changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
            pathRewrite: {
              '^/maintenanceDefect': '' 
            }
        },
        '/gateway': {
            target: 'http://10.88.26.161:9901', // 接口的域名
            ws: true,
            changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
            pathRewrite: {
                '^/gateway': ''
            }
        },
    },
    cssSourceMap: true,
    cacheBusting: true
  }
}
