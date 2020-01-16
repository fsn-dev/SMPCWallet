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
/**
 * @description web3文件
 */
import web3 from '@/libs/web3Util'
/**
 * @description 基本信息设置
 */
import {findBaseInfo, uodateBaseInfo} from '@/db/baseInfo'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    eNode: '',
    eNodeTx: '',
    address: '',
    token: '',
    wallet: '',
    safeMode: config.modeInit,
    dayAndNight: '',
    language: '',
    serverRPC: ''
  },
  mutations: {
    setEnode (state, data) {
      state.eNode = data
    },
    setEnodeTx (state, data) {
      let info = data.info ? data.info.toString() : ''
      state.eNodeTx = info
      if (!data.type) {
        cookies.setCookies(config.cookies.eNodeTx, info)
      }
    },
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
    setWallet (state, data) {
      // state.wallet = data
      let info = data.info ? data.info : ''
      state.wallet = info
      if (!data.type) {
        cookies.setCookies('wallet', info, 0.1)
      }
    },
    setSafeMode (state, data) {
      let info = data.info ? data.info.toString() : config.modeInit
      state.safeMode = info
      if (!data.type) {
        uodateBaseInfo({
          key: config.cookies.safeMode,
          value: info
        })
      }
    },
    setDayAndNight (state, data) {
      let info = data.info ? data.info.toString() : config.dayAndNight
      // console.log(data)
      // console.log(info)
      state.dayAndNight = info
      if (!data.type) {
        uodateBaseInfo({
          key: 'dayAndNight',
          value: info
        })
      }
    },
    setLanguage (state, data) {
      let info = data.info ? data.info : ''
      state.language = info
      if (!data.type) {
        uodateBaseInfo({
          key: 'language',
          value: info
        })
      }
    },
    setServerRPC (state, data) {
      let info = data.info ? data.info : ''
      state.serverRPC = info
      if (!data.type) {
        uodateBaseInfo({
          key: 'serverRPC',
          value: info
        })
      }
    },
  },
  actions: {
    getEnode ({commit}) {
      try {
        if (this.state.serverRPC) {
          web3.getEnode().then(res => {
            commit('setEnode', res)
          })
        }
      } catch (error) {
        commit('setEnode', '')
      }
    },
    getEnodeTx ({commit}) {
      cookies.getCookies(config.cookies.eNodeTx).then(res => {
        let data = { type: 1, info: res}
        commit('setEnodeTx', data)
      })
    },
    getAddress ({commit}) {
      cookies.getCookies(config.cookies.address).then(res => {
        let data = { type: 1, info: res}
        commit('setAddress', data)
      })
    },
    getToken ({commit}) {
      cookies.getCookies(config.cookies.token).then(res => {
        let data = { type: 1, info: res}
        commit('setToken', data)
      })
    },
    getWallet ({commit}) {
      cookies.getCookies('wallet').then(res => {
        let data = { type: 1, info: res}
        commit('setWallet', data)
      })
    },
    getSafeMode ({commit}) {
      let data = { type: 1, info: ''}
      findBaseInfo({key: config.cookies.safeMode}).then(res => {
        if (res.length > 0) {
          data.info = res[0].value
        } else {
          data.info = config.modeInit
        }
        commit('setSafeMode', data)
      }).catch(err => {
        data.info = config.modeInit
        commit('setSafeMode', data)
        console.log(err)
      })
    },
    getDayAndNight ({commit}) {
      let data = { type: 1, info: ''}
      findBaseInfo({key: 'dayAndNight'}).then(res => {
        if (res.length > 0) {
          data.info = res[0].value
        } else {
          data.info = config.dayAndNight
        }
        commit('setDayAndNight', data)
      }).catch(err => {
        data.info = config.dayAndNight
        commit('setDayAndNight', data)
        console.log(err)
      })
    },
    getLanguage ({commit}) {
      let data = { type: 1, info: ''}
      findBaseInfo({key: 'language'}).then(res => {
        // console.log(res)
        if (res.length > 0) {
          data.info = res[0].value
        } else {
          data.info = ''
        }
        commit('setLanguage', data)
      }).catch(err => {
        data.info = ''
        commit('setLanguage', data)
        console.log(err)
      })
    },
    getServerRPC ({commit}) {
      let data = { type: 1, info: ''}
      findBaseInfo({key: 'serverRPC'}).then(res => {
        console.log(res)
        if (res.length > 0) {
          data.info = res[0].value
        } else {
          data.info = config.serverRPC
        }
        commit('setServerRPC', data)
      }).catch(err => {
        data.info = config.serverRPC
        commit('setServerRPC', data)
        console.log(err)
      })
    }
  }
})

export default store
