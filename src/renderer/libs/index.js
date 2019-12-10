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
/**
 * @description mode基本选项
 */
import mode from '@etc/js/config/mode'
/**
 * @description 复制粘贴
 */
import clipboard from '@/libs/clipboard'

let $$ = {
  ...tools,
  ...cookies,
  ...qrCode,
  ...files,
  ...web3Util,
  ...clipboard,
  config,
  wallet,
  web3,
  coininfo,
  mode,
  setDollar (coin) {
    if (!coin) return
    for (let obj in coininfo) {
      if (obj === coin) {
        // console.log(coininfo[obj])
        return coininfo[obj]
      }
    }
    return ''
  },
  quitApp (that) {
    let dayAndNight = that.$store.state.dayAndNight
    let language = that.$store.state.language
    cookies.clearCookies()
    that.$store.commit('setAddress', '')
    that.$store.commit('setToken', '')
    that.$store.commit('setWallet', '')
    that.$store.commit('setDayAndNight', {info: dayAndNight})
    that.$store.commit('setSafeMode', {info: config.modeInit})
    that.$store.commit('setLanguage', {info: language})
    that.$router.push('/')
  }
}

export default $$