/**
 * @description 配置文件
 */
import config from '@etc/js/config'
/**
 * @description 币种基本信息
 */
import coininfo from '@etc/js/config/coininfo.js'
/**
 * @description web3方法及配置
 */
import web3 from '@/assets/js/web3'
/**
 * @description 钱包方法
 */
import wallet from '@/assets/js/wallet'
/**
 * @description 小工具
 */
import tools from '@/libs/tools'
/**
 * @description cookies设置
 */
import cookies from '@/libs/cookies'
/**
 * @description 二维码生成方法
 */
import qrCode from '@/libs/qrCode'
/**
 * @description 文件相关方法
 */
import files from '@/libs/files'
/**
 * @description web3新增通用方法
 */
import web3Util from '@/libs/web3Util'

let $$ = {
  ...tools,
  ...cookies,
  ...qrCode,
  ...files,
  ...web3Util,
  config,
  wallet,
  web3,
  coininfo,
  quitApp (that) {
    that.$$.setToken('')
    that.$$.setCookies(config.cookies.address, '')
    that.$store.commit('storeAddress', '')
    that.$router.push('/')
  }
}

export default $$