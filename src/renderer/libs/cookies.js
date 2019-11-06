import Cookies from 'js-cookie'

const TOKEN_KEY = 'token'
export default {
  setToken (val, expires) {
    Cookies.set(TOKEN_KEY, val, { expires: expires || 1 })
  },
  getToken () {
    const token = Cookies.get(TOKEN_KEY)
    if (token) return token
    else return false
  },
  setCookies (key, val, expires) {
    Cookies.set(key, val, { expires: expires || 1 })
  },
  getCookies (key) {
    const token = Cookies.get(key)
    if (token) return token
    else return false
  }
}