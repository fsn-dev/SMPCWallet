/**
 * @description 配置文件
 */
import config from '@/assets/js/config/base.js'
/**
 * @description 币种基本信息
 */
import coininfo from '@/assets/js/config/coininfo.js'
/**
 * @description web3方法及配置
 */
import web3 from '@/assets/js/web3'
/**
 * @description 钱包方法
 */
// import wallet from '@/assets/js/wallet'
import wallet from 'ethereumjs-wallet'
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
import web3Util from '@/libs/web3Util/index.js'
/**
 * @description mode基本选项
 */
import mode from '@/assets/js/config/mode.js'
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
  getWalletFromPrivKeyFile (strjson, password) {
    var jsonArr = JSON.parse(strjson);
    if (jsonArr.encseed != null) return wallet.fromEthSale(strjson, password)
    else if (jsonArr.Crypto != null || jsonArr.crypto != null) return wallet.fromV3(strjson, password, true)
    else
      throw 'Keystore is error!'
  },
  walletRequirePass (ethjson) {
    var jsonArr;
    try {
      jsonArr = JSON.parse(ethjson);
    } catch (err) {
      throw 'Keystore error!';
    }
    if (jsonArr.encseed != null) return true;
    else if (jsonArr.Crypto != null || jsonArr.crypto != null) return true
    else if (jsonArr.hash != null && jsonArr.locked) return true;
    else if (jsonArr.hash != null && !jsonArr.locked) return false;
    else if (jsonArr.publisher == config.AppName && !jsonArr.encrypted) return false;
    else
      throw 'Keystore error!';
  }
}

export default $$