import coininfo from '@etc/js/config/coininfo.js'
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
  timeChange (data) {
    // console.log(data)
    // let time = data.date ? new Date(data.date.toString().length > 10 ? data.date : (Number(data.date) * 1000)) : new Date()
    let time = data.date ? new Date(this.fromTime(data.date)) : new Date()
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
    let coinObj = this.getCoinInfo(coin, 'rate')
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
  },
  toWei (balance, coin) {
    let coinObj = this.getCoinInfo(coin, 'rate')
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
    }
    return status
  },
  replaceStr (val, str) {
    str = str ? str : 'ERC20'
    return val.replace(str, '')
  }
}