let $$ = {}
import fs from 'fs'
import Cookies from 'js-cookie'
import web3 from '@/assets/js/web3'
import config from '@etc/js/config'
import coininfo from '@etc/js/config/coininfo.js'
import wallet from '@/assets/js/wallet'



$$.config = config
$$.baseUrl = config.serverRPC
$$.serverURL = config.appURL

$$.wallet = wallet
$$.web3 = web3
$$.fs = fs

$$.coinOtherArr = coininfo

$$.thousandBit = (num, dec = 2) => {
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
}

$$.thousandChange = function (num, dec) {
  num = this.thousandToNum(num)
  return this.thousandBit(num, dec)
}

$$.thousandToNum = (num) => {
  // console.log(num)
  return num.toString().replace(/,/g, '')
}

$$.bigNumber = (num) => {
  let m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
  return num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
}

$$.timeChange = (data) => {
  // console.log(data)
  let time = data.date ? new Date(data.date.toString().length > 10 ? data.date : (Number(data.date) * 1000)) : new Date()
  let formatType = data.format ? data.format : '/'
  let Y = time.getFullYear()
  let M = (time.getMonth() + 1) < 10 ? ('0' + (time.getMonth() + 1)) : (time.getMonth() + 1)
  let D = time.getDate() < 10 ? ('0' + time.getDate()) : time.getDate()
  let h = time.getHours() < 10 ? ('0' + time.getHours()) : time.getHours()
  let m = time.getMinutes() < 10 ? ('0' + time.getMinutes()) : time.getMinutes()
  let s = time.getSeconds() < 10 ? ('0' + time.getSeconds()) : time.getSeconds()
  // console.log(Date.parse(data.date))
  // console.log(new Date(Date.parse(data.date)).getDate())
  if (data.type === 'yyyy-mm-dd') {
    time = Y + formatType + M + formatType + D
  } else if (data.type === 'yyyy-mm-dd hh:mm') {
    time = Y + formatType + M + formatType + D + ' ' + h + ':' + m
  } else if (data.type === 'yyyy-mm-dd hh:mm:ss') {
    time = Y + formatType + M + formatType + D + ' ' + h + ':' + m + ':' + s
  } else if (data.type === 'yyyy-mm-dd hh') {
    time = Y + formatType + M + formatType + D + ' ' + h
  } else if (data.type === 'yyyy-mm') {
    time = Y + formatType + M
  } else if (data.type === 'yyyy') {
    time = Y
  }
  return time
}


$$.limitCoin = function (num, limit, type) {
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
}

$$.getCoinInfo = (coin, param) => {
  coin = coin.toUpperCase()
  if (param) {
    if (typeof $$.coinOtherArr[coin] !== 'undefined' && typeof $$.coinOtherArr[coin][param] !== 'undefined') {
      return $$.coinOtherArr[coin]
    }
  } else if (!param) {
    if (typeof $$.coinOtherArr[coin] !== 'undefined') {
      return $$.coinOtherArr[coin]
    }
  }
  return ''
}

$$.fromWei = (balance, coin) => {
  let coinObj = $$.getCoinInfo(coin, 'rate')
  if (coinObj) {
    balance = Number(balance) / Math.pow(10, coinObj.rate)
  } else {
		if (coin === 'gwei') {
			balance = Number(balance) /  Math.pow(10, 9)
		} else {
			balance = Number(balance) /  Math.pow(10, 18)
		}
  }
  return balance
}

$$.toWei = (balance, coin) => {
  let coinObj = $$.getCoinInfo(coin, 'rate')
  if (coinObj) {
    balance = Number(balance) * Math.pow(10, coinObj.rate)
  } else {
		if (coin === 'gwei') {
			balance = Number(balance) *  Math.pow(10, 9)
		} else {
			balance = Number(balance) *  Math.pow(10, 18)
		}
  }
  return Number(balance).toFixed()
}


$$.fixPkey = (key) => {
  if (key.indexOf('0x') === 0) {
    return key.slice(2)
  }
  return key
}

$$.strToHexCharCode = (str) => {
  if (!str) return ''
  var hexCharCode = []
  hexCharCode.push('0x')
  for (var i = 0; i < str.length; i++) {
    hexCharCode.push((str.charCodeAt(i)).toString(16))
  }
  return hexCharCode.join('')
}

$$.qrCode = (cont, id) => {
  let QRCode = require('qrcodejs2')
  document.getElementById(id).innerHTML = ''
  let qrcodeInit = new QRCode(id, {
    width: 270,
    height: 270, // 高度
    text: cont // 二维码内容
    // render: "canvas" // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
    // background: "#f0f"
    // foreground: "#ff0"
  })
  // console.log(qrcodeInit)
  // qrcodeInit = null
}

$$.cutOut = (str, start, end) => {
  if (!str) return ''
  var str1 = str.substr(0, start)
  var str2 = str.substr(str.length - end)
  return str = str1 + '…' + str2
}

$$.changeState = (code) => {
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
  }
  return status
}

$$.replaceStr = (val, str) => {
  str = str ? str : 'ERC20'
  return val.replace(str, '')
}

$$.validFile = (username) => {
  return new Promise((resolve, reject) => {
    fs.exists($$.config.baseFileUrl, (exists) => {
      if (exists) {
        fs.readdir($$.config.baseFileUrl + '/', (err, files) => {
          if (err) {
            reject({ msg: 'Error', error: err })
          } else {
            if (files.length > 0) {
              let _flag = true
              for (let obj of files) {
                if (obj.replace('.json', '') === username) {
                  _flag = false
                  break
                }
              }
              if (!_flag) {
                resolve({ msg: 'Repeat', tip: '账户已存在' })
              } else {
                resolve({ msg: 'Success' })
              }
            } else {
              resolve({ msg: 'Success' })
            }
          }
        })
      } else {
        fs.mkdir($$.config.baseFileUrl, (err) => {
          if (err) {
            reject({ msg: 'Error', error: err })
          } else {
            resolve({ msg: 'Success' })
          }
        })
      }
    })
  })
}

$$.readFile = (username) => {
  return new Promise((resolve, reject) => {
    fs.readFile($$.config.baseFileUrl + '/' + username + '.json', (err, res) => {
      if (err) {
        reject({ msg: 'Error', error: err })
      } else {
        if (wallet.walletRequirePass(res.toString())) {
          // console.log(wallet.walletRequirePass(res.toString()))
          resolve({ msg: 'Success', info: res.toString() })
        } else {
          reject({ msg: 'Error', error: 'Error' })
        }
      }
    })
  })
}

const TOKEN_KEY = 'token'
$$.setToken = (val, expires) => {
  Cookies.set(TOKEN_KEY, val, { expires: expires || 1 })
}
$$.getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  if (token) return token
  else return false
}
$$.setCookies = (key, val, expires) => {
  Cookies.set(key, val, { expires: expires || 1 })
}
$$.getCookies = (key) => {
  const token = Cookies.get(key)
  if (token) return token
  else return false
}

export default $$
