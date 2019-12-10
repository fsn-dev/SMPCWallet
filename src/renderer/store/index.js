import Vue from 'vue'
import Vuex from 'vuex'
/**
 * @description cookies设置
 */
import cookies from '@/libs/cookies'
/**
 * @description 配置文件
 */
import config from '@etc/js/config'
// import wallet from './store-wallet.js'
// import exchange from './store-exchange.js'
Vue.use(Vuex)
// console.log(cookies)
// let langEn = require('@/assets/js/language/en')
// console.log(config.modeInit)
const store = new Vuex.Store({
  state: {
    address: '',
    token: '',
    safeMode: config.modeInit,
    dayAndNight: '',
    wallet: '',
    language: ''
    // coininfoArr: [],
    // network: {},
    // coinDollarArr: '',
  },
  modules: {
    // wallet,
    // exchange
  },
  mutations: {
    setAddress (state, data) {
      let info = data.info ? data.info.toString() : ''
      state.address = info
      if (!data.type) {
        cookies.setCookies(config.cookies.address, info)
      }
    },
    setToken (state, data) {
      let info = data.info ? data.info.toString() : ''
      state.token = info
      if (!data.type) {
        cookies.setCookies(config.cookies.token, info)
      }
    },
    setSafeMode (state, data) {
      let info = data.info ? data.info.toString() : config.modeInit
      state.safeMode = info
      if (!data.type) {
        cookies.setCookies(config.cookies.safeMode, info)
      }
    },
    setDayAndNight (state, data) {
      let info = data.info ? data.info.toString() : config.dayAndNight
      // console.log(data)
      // console.log(info)
      state.dayAndNight = info
      if (!data.type) {
        // console.log(info)
        cookies.setCookies('dayAndNight', info, 7)
      }
    },
    setWallet (state, data) {
      // state.wallet = data
      let info = data.info ? data.info : ''
      state.wallet = info
      if (!data.type) {
        cookies.setCookies('wallet', info, 0.1)
      }
    },
    setLanguage (state, data) {
      let info = data.info ? data.info : ''
      state.language = info
      if (!data.type) {
        cookies.setCookies('language', info, 30)
      }
    }
  },
  actions: {
    getAddress ({commit}) {
      cookies.getCookies(config.cookies.address).then(res => {
        // console.log(res)
        let data = { type: 1, info: res}
        commit('setAddress', data)
      })
    },
    getToken ({commit}) {
      cookies.getCookies(config.cookies.token).then(res => {
        // console.log(res)
        let data = { type: 1, info: res}
        commit('setToken', data)
      })
    },
    getSafeMode ({commit}) {
      cookies.getCookies(config.cookies.safeMode).then(res => {
        // console.log(res)
        let data = { type: 1, info: res}
        commit('setSafeMode', data)
      })
    },
    getDayAndNight ({commit}) {
      cookies.getCookies('dayAndNight').then(res => {
        // console.log(res)
        let data = { type: 1, info: res}
        commit('setDayAndNight', data)
      })
    },
    getWallet ({commit}) {
      cookies.getCookies('wallet').then(res => {
        // console.log(res)
        let data = { type: 1, info: res}
        commit('setWallet', data)
      })
    },
    getLanguage ({commit}) {
      cookies.getCookies('language').then(res => {
        console.log(res)
        let data = { type: 1, info: res}
        commit('setLanguage', data)
      })
    }
  }
})

export default store
