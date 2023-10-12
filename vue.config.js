const path = require('path')
const webpack = require('webpack')
const createThemeColorReplacerPlugin = require('./config/plugin.config')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const childProcess = require('child_process')

function resolve (dir) {
  return path.join(__dirname, dir)
}

function addStyleResource (rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        // ant-design less 变量
        path.resolve(__dirname, 'node_modules', 'ant-design-vue', 'lib', 'style', 'themes', 'index.less')
      ]
    })
}

const {
  VUE_APP_API_BASE_URL,
  VUE_APP_API_ORIGINAL_URL,
  VUE_APP_API_ZHENHUA_BASE_URL,
  VUE_APP_XUNJIAN_API_BASE_URL,
  VUE_APP_API_XUNJIAN_ORIGINAL_URL,
  VUE_APP_HASURA_IMP_URI,
  VUE_APP_HASURA_IMP_ORIGINAL_URL,
  VUE_APP_VIEW_THUMBNAIL_URI,
  VUE_APP_VIEW_THUMBNAIL_ORIGINAL_URL,
  VUE_APP_ENABLED_CDN,
  VUE_APP_API_ORIGINAL_ZHENHUA_BASE_URL,
  VUE_APP_SDWAN_ORIGINAL_URL,
  VUE_APP_MV_API_BASE_URL,
  VUE_APP_ALARM_BASE_URL,
  VUE_APP_ALARM_ORIGINAL_URL,
  VUE_APP_OTP_BASE_URL,
  VUE_APP_OTP_BASE_ORIGINAL_URL
} = process.env

const useCDN = VUE_APP_ENABLED_CDN === 'true'

const assetsCDN = {
  externals: useCDN ? {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios'
  } : {},
  css: [],
  prefetch: useCDN ? [
    '//unpkg.com',
    '//cdnjs.cloudflare.com'
  ] : [],
  js: useCDN ? [
    '//unpkg.com/vue@2.6.10/dist/vue.min.js',
    '//unpkg.com/vue-router@3.1.2/dist/vue-router.min.js',
    '//unpkg.com/vuex@3.1.1/dist/vuex.min.js',
    '//unpkg.com/axios@0.19.0/dist/axios.min.js',
    '//cdnjs.cloudflare.com/ajax/libs/ace/1.4.1/ace.js',
    '//cdnjs.cloudflare.com/ajax/libs/ace/1.4.1/mode-json.js'
  ] : [
    // ace 无 npm 版本
    '/libs/ace/1.4.1/ace-bundle.js'
  ]
}

const vueConfig = {
  configureWebpack: {
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      createThemeColorReplacerPlugin()
    ],
    externals: {
      ace: 'ace',
      ...assetsCDN.externals
    }
  },

  chainWebpack: (config) => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))

    config.resolve.alias
      .set('@$', resolve('src'))
      .set('~~~', resolve('src/components'))

    config.module
      .rule('graphql')
      .test(/\.graphql$/)
      .use('graphql-tag/loader')
      .loader('graphql-tag/loader')
      .end()

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })

    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 20480 }))
      .end()

    config.plugin('html').tap(args => {
      // CDN 配置
      args[0].cdn = assetsCDN
      // Git log 用于打版本号与回滚调试
      args[0].version = {
        commit: childProcess.execSync('git rev-parse HEAD', { encoding: 'utf8' }),
        date: new Date(childProcess.execSync(`git show -s --format=%cd`, { encoding: 'utf8' })),
        branch: childProcess.execSync('git symbolic-ref --short HEAD', { encoding: 'utf8' })
      }
      return args
    })

    // https://github.com/lodash/lodash-webpack-plugin#readme
    config.plugin('lodashReplace').use(new LodashModuleReplacementPlugin({
      shorthands: true,
      // https://github.com/ant-design/ant-design/issues/3794
      paths: true,
      caching: true
    }))

    // https://www.cnblogs.com/leiting/p/11542608.html
    if (!useCDN) {
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          vue: {
            name: 'chunk-vue',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?vue(.*)/
          },
          vueRouter: {
            name: 'chunk-vue-router',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?vue-router(.*)/
          },
          vuex: {
            name: 'chunk-vuex',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?vuex(.*)/
          },
          axios: {
            name: 'chunk-axios',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?axios(.*)/
          },
          commons: {
            name: 'chunk-common-components',
            test: resolve('src/components'),
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
    }
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {},
        javascriptEnabled: true
      }
    },
    extract: false
  },

  devServer: {
    port: 8080,
    proxy: {
      [VUE_APP_ALARM_BASE_URL]: {
        target: VUE_APP_ALARM_ORIGINAL_URL,
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          [VUE_APP_ALARM_BASE_URL]: ''
        }
      },
      [VUE_APP_MV_API_BASE_URL]: {
        target: VUE_APP_MV_API_BASE_URL,
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          [VUE_APP_MV_API_BASE_URL]: ''
        }
      },
      [VUE_APP_SDWAN_ORIGINAL_URL]: {
        target: VUE_APP_SDWAN_ORIGINAL_URL,
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          [VUE_APP_SDWAN_ORIGINAL_URL]: ''
        }
      },
      // 后端接口
      [VUE_APP_API_ZHENHUA_BASE_URL]: {
        target: VUE_APP_API_ORIGINAL_ZHENHUA_BASE_URL,
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          [VUE_APP_API_ZHENHUA_BASE_URL]: ''
        }
      },
      // 后端接口
      [VUE_APP_API_BASE_URL]: {
        target: VUE_APP_API_ORIGINAL_URL,
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          [VUE_APP_API_BASE_URL]: ''
        }
      },
      // 后端接口
      [VUE_APP_XUNJIAN_API_BASE_URL]: {
        target: VUE_APP_API_XUNJIAN_ORIGINAL_URL,
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          [VUE_APP_XUNJIAN_API_BASE_URL]: ''
        }
      },
      // hasura
      [VUE_APP_HASURA_IMP_URI]: {
        target: VUE_APP_HASURA_IMP_ORIGINAL_URL,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          [VUE_APP_HASURA_IMP_URI]: ''
        }
      },
      // 视图缩略图静态资源目录
      [VUE_APP_VIEW_THUMBNAIL_URI]: {
        target: VUE_APP_VIEW_THUMBNAIL_ORIGINAL_URL,
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          [VUE_APP_VIEW_THUMBNAIL_URI]: ''
        }
      },
      // otp二次免密访问
      [VUE_APP_OTP_BASE_URL]: {
        target: VUE_APP_OTP_BASE_ORIGINAL_URL,
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          [VUE_APP_OTP_BASE_URL]: ''
        }
      }
    }
  },

  productionSourceMap: false,
  lintOnSave: 'warning',
  transpileDependencies: []
}

module.exports = vueConfig
