const path = require('path').resolve('.')
let publicSet = {
  initCoin: 'FSN', // main coin
  appURL: 'wss://api.ccdex.top', // app url
  faucetURL: 'wss://walletapp.dcrm.network/faucet', // faucet url
  explorerURL: 'https://dcrm.network/explorer/#/',
  walletURL: 'https://dcrm.network/wallet/#/',
  dexappURL: 'https://dcrm.network/trade/#/',
  serverRPC: '',
  refreshDataTime: 15, // page refersh time
  title: 'FUSION | DCRM Wallet',
  AppName: 'Fusion',
  copyRight: '2018 FUSION Foundation. All rights reserved.',
  otherUrl: {
    github: 'https://github.com/FUSIONFoundation/dcrm-go',
    gitter: 'https://gitter.im/FUSIONDC/',
    mainNetwork: 'https://fusion.org'
  },
  baseFileUrl: path + '/data'
}
publicSet.appURL = 'http://localhost:8100'
// publicSet.appURL = 'http://192.168.1.153:7700'
// module.exports = publicSet
export default publicSet