
module.exports = {
  runtimeCompiler: true,
  productionSourceMap: false,
  publicPath: './',
  // outputDir: "prime",
  devServer: {
    // open: true, //是否自动弹出浏览器页面
    // host: "localhost",
    // port: '8080',
    // https: true,
    // hotOnly: false,
    // proxy: {
    //   '/api': {
    //     target: 'https://shopee.sg', //API服务器的地址
    //     ws: true,  //代理websockets
    //     changeOrigin: true, // 虚拟的站点需要更管origin
    //     pathRewrite: {   //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
    //       '^/api': 'https://shopee.sg'
    //     }
    //   }
    // },
  }
}