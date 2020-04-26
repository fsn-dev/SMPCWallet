import coininfo from '@/assets/js/config/coininfo.js'
/**
 * @description web3方法及配置
 */
import web3 from '@/assets/js/web3'

import {BigNumber} from 'bignumber.js'
// let BN = web3.utils.BN
/**
 * @description 生成随机图片
 */
import Identicon from 'identicon.js'

export default {
  fromTime (timestamp) {
    if (timestamp.toString().length === 10) {
      timestamp = Number(timestamp) * 1000
    } else if (timestamp.toString().length > 13) {
      timestamp = timestamp.toString().substring(0, 13)
    }
    return Number(timestamp)
  },
  toTime (timestamp) {
    // console.log(timestamp.toString().length)
    if (timestamp.toString().length >= 13) {
      timestamp = timestamp.toString().substring(0, 10)
    }
    return Number(timestamp)
  },
  thousandBit (num, dec = 2) {
    let _num = num = Number(num)
    if (isNaN(num)) {
      num = 0
      num = num.toFixed(dec)
    } else {
      if (isNaN(dec)) {
        if (num.toString().indexOf('.') === -1) {
          num = Number(num).toLocaleString()
        } else {
          let numSplit = num.toString().split('.')
          numSplit[1] = numSplit[1].length > 9 ? numSplit[1].substr(0, 8) : numSplit[1]
          num = Number(numSplit[0]).toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toLocaleString()
          num = num.toString().split('.')[0] + '.' + numSplit[1]
        }
      } else {
        num = num.toFixed(dec).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toLocaleString()
      }
    }
    if (_num < 0 && num.toString().indexOf('-') < 0) {
      num = '-' + num
    }
    return num
  },
  thousandChange (num, dec) {
    num = this.thousandToNum(num)
    return this.thousandBit(num, dec)
  },
  thousandToNum (num) {
    // console.log(num)
    return num.toString().replace(/,/g, '')
  },
  bigNumber (num) {
    let m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
    return num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
  },
  timeChange (timestamp, type, format) {
    let time = timestamp ? new Date(this.fromTime(timestamp)) : new Date()
    let formatType = format ? format : '/'
    let Y = time.getFullYear()
    let M = (time.getMonth() + 1) < 10 ? ('0' + (time.getMonth() + 1)) : (time.getMonth() + 1)
    let D = time.getDate() < 10 ? ('0' + time.getDate()) : time.getDate()
    let h = time.getHours() < 10 ? ('0' + time.getHours()) : time.getHours()
    let m = time.getMinutes() < 10 ? ('0' + time.getMinutes()) : time.getMinutes()
    let s = time.getSeconds() < 10 ? ('0' + time.getSeconds()) : time.getSeconds()

    if (type === 'yyyy-mm-dd') {
      time = Y + formatType + M + formatType + D
    } else if (type === 'yyyy-mm-dd hh:mm') {
      time = Y + formatType + M + formatType + D + ' ' + h + ':' + m
    } else if (type === 'yyyy-mm-dd hh:mm:ss') {
      time = Y + formatType + M + formatType + D + ' ' + h + ':' + m + ':' + s
    } else if (type === 'yyyy-mm-dd hh') {
      time = Y + formatType + M + formatType + D + ' ' + h
    } else if (type === 'yyyy-mm') {
      time = Y + formatType + M
    } else if (type === 'yyyy') {
      time = Y
    } else if (type === 'yy-mm-dd hh:mm') {
      Y = Y.toString().substr(2)
      time = Y + formatType + M + formatType + D + ' ' + h + ':' + m
    }
    return time
  },
  limitCoin (num, limit, type) {
    let callback = {
      flag: true,
      msg: ''
    }
    if (num < limit) {
      callback = {
        flag: true,
        msg: 'The amount cannot be less than ' + limit
      }
    } else if (type && type === 'INT' && Number(num).toString().indexOf('.') !== -1) {
      callback = {
        flag: true,
        msg: 'Please enter an integer'
      }
    } else {
      callback = {
        flag: false,
        msg: ''
      }
    }
    return callback
  },
  getCoinInfo (coin, param) {
    coin = coin.toUpperCase()
    if (param) {
      if (typeof coininfo[coin] !== 'undefined' && typeof coininfo[coin][param] !== 'undefined') {
        return coininfo[coin]
      }
    } else if (!param) {
      if (typeof coininfo[coin] !== 'undefined') {
        return coininfo[coin]
      }
    }
    return ''
  },
  fromWei (balance, coin) {
    if (!balance) return 0
    balance = balance.toString()
    coin = coin.toUpperCase()
    let coinInfo = this.getCoinInfo(coin, 'rate')
    // console.log(coin)
    // console.log(coinInfo)
    if (coinInfo && typeof coinInfo.rate !== 'undefined') {
      let d = Number(coinInfo.rate)
      balance = Number(balance) / Math.pow(10, d)
      balance = new BigNumber(balance)
      balance = balance.toFormat().replace(/,/g, '')
    } else {
      if (coin === 'GWEI') {
        balance = web3.utils.fromWei(balance, 'gwei')
      } else {
        balance = web3.utils.fromWei(balance, 'ether')
      }
    }
    return balance
  },
  toWei (balance, coin) {
    if (!balance) return 0
    balance = balance.toString()
    coin = coin.toUpperCase()
    let coinInfo = this.getCoinInfo(coin, 'rate')
    if (coinInfo && coinInfo.rate) {
      let d = Number(coinInfo.rate)
      balance = Number(balance).toFixed(d)
      balance = Number(balance) * Math.pow(10, d)
      balance = new BigNumber(balance)
      balance = balance.toFormat().replace(/,/g, '')
    } else {
      if (coin === 'GWEI') {
        balance = web3.utils.toWei(balance, 'gwei')
      } else {
        balance = web3.utils.toWei(balance, 'ether')
      }
    }
    balance = Number(balance).toFixed(0)
    return balance
  },
  fixPkey (key) {
    if (key.indexOf('0x') === 0) {
      return key.slice(2)
    }
    return key
  },
  strToHexCharCode (str) {
    if (!str) return ''
    var hexCharCode = []
    hexCharCode.push('0x')
    for (var i = 0; i < str.length; i++) {
      hexCharCode.push((str.charCodeAt(i)).toString(16))
    }
    return hexCharCode.join('')
  },
  cutOut (str, start, end) {
    // console.log(str)
    if (!str) return ''
    var str1 = str.substr(0, start)
    var str2 = str.substr(str.length - end)
    return str = str1 + '…' + str2
  },
  changeState (code) {
    code = Number(code)
    // console.log(code)
    let status = ''
    switch (code) {
      case 0: 
        status = 'Pending'
        break
      case 1:
        status = 'Success'
        break
      case 2:
        status = 'Failure'
        break
      case 3:
        status = 'New'
        break
      case 4:
        status = 'Refuse'
        break
      case 5:
        status = 'Agree'
        break
      case 6:
        status = 'Timeout'
        break
    }
    // console.log(status)
    return status
  },
  replaceStr (val, str) {
    str = str ? str : 'ERC20'
    return val.replace(str, '')
  },
  cutERC20 (str) {
    if (!str) {
      return {
        type: 0,
        coinType: ''
      }
    }
    if (str.indexOf('ERC20') === 0) {
      return {
        type: 1,
        coinType: str.replace('ERC20', '')
      }
    } else {
      return {
        type: 0,
        coinType: str.replace('ERC20', '')
      }
    }
  },
  titleCase (str) {
    if (!str) return
    str = str.substr(0, 1).toUpperCase()
    return str
  },
  getBlob (mime, str) {
    var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? function (obj) {
      return typeof obj
    } : function (obj) {
      return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj
    }
    var str1 = (typeof str === 'undefined' ? 'undefined' : _typeof(str)) === 'object' ? JSON.stringify(str) : str
    if (str1 == null) return ''

    let blob
    try {
      blob = new Blob([str1], {type: mime})
    } catch (e) {
      // TypeError old chrome and FF
      let BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder
      if (e.name === 'TypeError' && window.BlobBuilder) {
        blob = new BlobBuilder()
        blob.append([str1.buffer])
        blob = blob.getBlob(mime)
      } else {
        let tip = 'Browser does not support'
        alert(tip)
        throw tip
      }
    }
    return window.URL.createObjectURL(blob)
  },
  walletRequirePass (ethjson) {
    let jsonArr
    try {
      jsonArr = JSON.parse(ethjson)
    } catch (err) {
      let errtxt1 = 'This is not a valid wallet file. '
      throw errtxt1
    }
    if (jsonArr.encseed != null) {
      return true
    } else if (jsonArr.Crypto != null || jsonArr.crypto != null) {
      return true
    } else if (jsonArr.hash != null && jsonArr.locked) {
      return true
    } else if (jsonArr.hash != null && !jsonArr.locked) {
      return false
    } else if (jsonArr.publisher === 'MyEtherWallet' && !jsonArr.encrypted) {
      return false
    } else {
      let errtxt2 = 'Sorry! We don\'t recognize this type of wallet file. '
      throw errtxt2
    }
  },
  smallToBigSort () {
    return (a, b) => {
      for (let obj in arguments) {
        if (Number(a[arguments[obj]]) > Number(b[arguments[obj]])) {
          return 1
        }
      }
      return -1
    }
  },
  bigToSmallSort () {
    return (a, b) => {
      for (let obj in arguments) {
        if (Number(a[arguments[obj]]) > Number(b[arguments[obj]])) {
          return -1
        }
      }
      return 1
    }
  },
  eNodeCut (enode) {
    let obj = {
      key: '',
      ip: '',
      enode: ''
    }
    if (!enode || enode.indexOf('enode://') === -1 || enode.indexOf('@') === -1) return obj
    let enodeObj = enode.match(/enode:\/\/(\S*)@/)
    let ip = enode.match(/@(\S*)/)[1]
    // console.log(enodeObj)
    // console.log(ip)
    return {
      key: enodeObj[1],
      ip: ip,
      enode: enodeObj.input
    }
  },
  splitTx (tx) {
    if (!tx) return{
      address: '',
      signTx: '',
      eNode: '',
      ip: '',
      eNodeId: ''
    }
    tx = tx.split('0x')
    let obj = this.eNodeCut(tx[0])
    return {
      address: tx[2] ? '0x' + tx[2] : '',
      signTx: tx[1] ? '0x' + tx[1] : '',
      eNode: tx[0],
      ip: obj && obj.ip ? obj.ip : '',
      eNodeId: obj && obj.key ? obj.key : ''
    }
  },
  createImg (hex) {
    let imgData = new Identicon(hex).toString()
    let imgInfo = 'data:image/png;base64,' + imgData // 这就是头像的base64码
    return imgInfo
  }
}