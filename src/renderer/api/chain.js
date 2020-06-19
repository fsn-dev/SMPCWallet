import HttpRequest from '@/api/axios'
import config from '@/assets/js/config/base.js'
const baseUrl = config.env === 'dev' ? 'https://testnet.fsn.dev/api' : 'https://fsn.dev/api'
// console.log(baseUrl)
const axios = new HttpRequest(baseUrl)

class fsnFn {
  
}

export default fsnFn