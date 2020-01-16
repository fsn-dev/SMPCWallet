const path = require('path').resolve('.')

let publicSet = {
  /**
   * @description 版本号
   */
  version: '0.1.0',
  /**
   * @description 版本号
   * @param 0: 测试
   * @param 1: 生产
   */
  versionType: 0,
  /**
   * @description 区块节点请求地址
   */
  serverRPC: 'http://127.0.0.1:6691',
  /**
   * @description 通过地址查询外部交易历史
   */
  receiveAddrUrl: 'http://5.189.139.168:5000/',
  /**
   * @description 数据请求时间间隔
   */
  refreshDataTime: 15, // page refersh time
  /**
   * @description 页面title设置
   */
  title: 'SMPC Wallet',
  /**
   * @description 项目所属
   */
  AppName: 'SMPC Wallet',
  /**
   * @description copyRight
   */
  copyRight: '',
  /**
   * @description 超时时间
   */
  timeout: 1000 * 60 * 10,
  /**
   * @description Cookie key
   */
  cookies: {
    token: 'token',
    address: 'address',
    safeMode: 'safeMode',
    eNodeTx: 'eNodeTx'
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
  },
  /**
   * @description 初始模式设置
   */
  modeInit: '0', // '0': 共管模式；'1'：个人模式
  /**
   * @description 日夜模式设置
   */
  dayAndNight: '1', // '0': 夜晚； '1': 白天
  /**
   * @description 默认组模式
   */
  initGroupMode: '5/5',
}

publicSet.appURL = 'http://139.196.26.212:8300'
// publicSet.appURL = 'http://localhost:8300'
// publicSet.appURL = 'http://192.168.1.184:8877'
// publicSet.appURL = 'http://192.168.1.153:7700'

// publicSet.serverRPC = 'http://192.168.1.104:9010'
// publicSet.serverRPC = 'http://192.168.1.104:9011'
// publicSet.serverRPC = 'http://192.168.1.104:9012'
// publicSet.serverRPC = 'http://192.168.1.104:9013'

// publicSet.serverRPC = 'http://192.168.1.187:9991'

// publicSet.serverRPC = 'http://192.168.1.187:12391'
// publicSet.serverRPC = 'http://192.168.1.187:12392'
// publicSet.serverRPC = 'http://192.168.1.187:12393'

// publicSet.serverRPC = 'http://127.0.0.1:12391'
// publicSet.serverRPC = 'http://127.0.0.1:12392'
// publicSet.serverRPC = 'http://127.0.0.1:12393'

// publicSet.serverRPC = 'http://127.0.0.1:6691'
// module.exports = publicSet
export default publicSet
