const path = require('path').resolve('.')

let publicSet = {
  /**
   * @description 主币种，默认币种
   */
  initCoin: 'FSN',
  /**
   * @description 链接node请求的地址
   */
  appURL: 'wss://api.ccdex.top',
  /**
   * @description 水龙头请求数据地址
   */
  faucetURL: 'wss://walletapp.dcrm.network/faucet',
  /**
   * @description 浏览器网页地址
   */
  explorerURL: 'https://dcrm.network/explorer/#/',
  /**
   * @description 钱包网页地址
   */
  walletURL: 'https://dcrm.network/wallet/#/',
  /**
   * @description DEX网页地址
   */
  dexappURL: 'https://dcrm.network/trade/#/',
  /**
   * @description 区块节点请求地址
   */
  serverRPC: 'http://127.0.0.1:4449',
  /**
   * @description 数据请求时间间隔
   */
  refreshDataTime: 15, // page refersh time
  /**
   * @description 页面title设置
   */
  title: 'FUSION | DCRM Wallet',
  /**
   * @description 项目所属
   */
  AppName: 'Fusion',
  /**
   * @description copyRight
   */
  copyRight: '2018 FUSION Foundation. All rights reserved.',
  /**
   * @description 其他相关地址
   */
  otherUrl: {
    github: 'https://github.com/FUSIONFoundation/dcrm-go', // GitHub
    gitter: 'https://gitter.im/FUSIONDC/', // 
    mainNetwork: 'https://fusion.org' // 
  },
  /**
   * @description 本地文件存储地址
   */
  file: {
    ks: { // keystore 地址和后缀名
      url: path + '/data/ks/',
      type: '.json'
    },
    ga: { // keystore 地址和后缀名
      url: path + '/data/ga/',
      type: '.json'
    },
  },
  personFilename: 'Person',
  /**
   * @description 监听页面，超时时间
   */
  watchPageTime: 1000 * 60 * 30,
  /**
   * @description Cookie key
   */
  cookies: {
    token: 'token',
    address: 'address',
    safeMode: 'safeMode'
  },
  /**
   * @description 启动gdcrm路径
   */
  gDcrm: path + '/gdcrm.exe',
  /**
   * @description 启动gdcrm路径
   */
  rawTx: {
    to: '0x00000000000000000000000000000000000000dc',
    gasLimit: 80000,
    gasPrice: 100000,
  }
}

// publicSet.appURL = 'http://localhost:8100'
// publicSet.appURL = 'http://192.168.1.153:7700'
// publicSet.serverRPC = 'http://192.168.1.104:9010'
// publicSet.serverRPC = 'http://192.168.1.104:9011'
// publicSet.serverRPC = 'http://192.168.1.104:9012'
publicSet.serverRPC = 'http://192.168.1.187:12391'
// publicSet.serverRPC = 'http://192.168.1.187:12392'
// publicSet.serverRPC = 'http://192.168.1.187:12393'
// module.exports = publicSet
export default publicSet


// data: {
//   code: 0, // 'Success' 'Error' 'Null' 'Repeat' 'Pending'
//   tip: 'offline',
//   error: '',
//   info: ''
// }