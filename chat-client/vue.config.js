const { defineConfig } = require('@vue/cli-service')
const path = require('path');
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        "@components": path.resolve(__dirname, 'src/components'),
        "@composables": path.resolve(__dirname, 'src/composables'),
        "@plugins": path.resolve(__dirname, 'src/plugins'),
        "@config": path.resolve(__dirname, 'src/config'),
        "@router": path.resolve(__dirname, 'src/router'),
        "@assets": path.resolve(__dirname, 'src/assets'),
      },
      extensions: ['.js', '.vue', '.json']
    }
  }
})
