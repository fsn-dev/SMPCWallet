// import Cookies from 'js-cookie'
import config from '@etc/js/config'
const session = require('electron').remote.session;

const url = config.url || 'http://127.0.0.1'

/**
 * 保存cookie
 * @param name  cookie名称
 * @param value cookie值
 * @param expires 过期时间
 */
let setCookie = (name, value, expires) => {
  let Days = expires || 1
  let exp = new Date()
  let date = Math.round(exp.getTime() / 1000) + Days * 24 * 60 * 60
  const cookie = {
    url: url,
    name: name,
    value: value,
    expirationDate: date
  }
  // console.log(cookie)
  session.defaultSession.cookies.set(cookie, (error) => {
    if (error) console.error(error)
  })
}
export default {
  clearCookies () {
    session.defaultSession.clearStorageData({
      origin: url,
      storages: ['cookies']
    }, function (error) {
      if (error) console.error(error)
    })
  },
  setCookies (key, val, expires) {
    setCookie(key, val.toString(), expires || 1)
  },
  getCookies (key) {
    return new Promise((resolve, reject) => {
      session.defaultSession.cookies.get({ url: url }, function (error, cookies) {
        // console.log(cookies)
        if (cookies.length > 0) {
          for (let obj of cookies) {
            // console.log(obj)
            if (key === obj.name) {
              resolve(obj.value)
              return
            }
          }
          resolve(false)
        } else {
          resolve(false)
        }
      })
    })
    // const token = Cookies.get(key)
    // if (token) return token
    // else return false
  }
}