import HttpRequest from '@/api/axios'
import config from '@/assets/js/config/base.js'

let baseUrlObj = {
  'FSN': {name: 'mBTC (Fusion)', url: 'https://testnet.smpcwallet.com/btc2fsn', coin: 'FSN'},
  'ETH': {name: 'mBTC (Ethereum)', url: 'http://47.92.168.85:11556/rpc', coin: 'ETH'},
}

if (config.env !== 'dev') {
  baseUrlObj = {
    'FSN': {name: 'mBTC (Fusion)', url: 'https://testnet.smpcwallet.com/btc2fsn', coin: 'FSN'},
    'ETH': {name: 'mBTC (Ethereum)', url: 'http://47.92.168.85:11556/rpc', coin: 'ETH'},
  }
}

class swapFn {
  constructor (coinType, params) {
    this.axios = new HttpRequest(baseUrlObj[coinType].url)
  }
  getBaseInfo () {
    return baseUrlObj
  }
}

export default swapFn