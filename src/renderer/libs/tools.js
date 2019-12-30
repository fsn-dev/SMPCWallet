import coininfo from '@etc/js/config/coininfo.js'
/**
 * @description web3方法及配置
 */
import web3 from '@/assets/js/web3'

// let BN = web3.utils.BN

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
    balance = balance.toString()
    coin = coin.toUpperCase()
    let coinInfo = this.getCoinInfo(coin, 'rate')
    if (typeof coinInfo[coin] !== 'undefined' && coinInfo[coin].rate) {
      let d = Number(coinInfo[coin].rate)
      if (d === 18) {
        balance = web3.utils.fromWei(balance, 'ether')
      } else {
        balance = Number(balance) / Math.pow(10, d)
      }
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
    balance = balance.toString()
    let coinInfo = this.getCoinInfo(coin, 'rate')
    coin = coin.toUpperCase()
    if (typeof coinInfo[coin] !== 'undefined' && coinInfo[coin].rate) {
      let d = Number(coinInfo[coin].rate)
      if (d === 18) {
        balance = web3.utils.toWei(balance, 'ether')
      } else {
        balance = Number(balance) * Math.pow(10, d)
      }
    } else {
      if (coin === 'GWEI') {
        balance = web3.utils.toWei(balance, 'gwei')
      } else {
        balance = web3.utils.toWei(balance, 'ether')
      }
    }
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
  }
}