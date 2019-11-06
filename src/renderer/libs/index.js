
import web3 from '@/assets/js/web3'
import wallet from '@/assets/js/wallet'
import config from '@etc/js/config'
import coininfo from '@etc/js/config/coininfo.js'
import tools from '@/libs/tools'
import cookies from '@/libs/cookies'
import qrCode from '@/libs/qrCode'
import files from '@/libs/files'

let $$ = {
  ...tools,
  ...cookies,
  ...qrCode,
  ...files,
  config,
  wallet,
  web3,
  baseUrl: config.serverRPC,
  serverURL: config.appURL,
  coinOtherArr: coininfo
}

export default $$