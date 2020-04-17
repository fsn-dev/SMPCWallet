import Vue from 'vue'
import Vuex from 'vuex'
/**
 * @description cookies设置
 */
import cookies from '@/libs/cookies'
/**
 * @description 配置文件
 */
import config from '@/assets/js/config/base.js'
/**
 * @description web3文件
 */
import web3 from '@/libs/web3Util'
/**
 * @description 基本信息设置
 */
import db from '@/db/index.js'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    eNode: '',
    eNodeTx: '',
    address: '',
    token: '',
    // wallet: '',
    accountType: config.modeInit,
    dayAndNight: config.dayAndNight,
    language: '',
    serverRPC: '',
    networkMode: config.networkMode,
    approvalObj: {}
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
    setAccountType (state, data) {
      let info = data.info ? data.info.toString() : config.modeInit
      state.accountType = info
      if (!data.type) {
        db.updateBaseInfo({
          key: config.cookies.accountType,
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
        db.updateBaseInfo({
          key: 'dayAndNight',
          value: info
        })
      }
    },
    setLanguage (state, data) {
      let info = data.info ? data.info : ''
      state.language = info
      if (!data.type) {
        db.updateBaseInfo({
          key: 'language',
          value: info
        })
      }
    },
    setServerRPC (state, data) {
      let info = data.info ? data.info : ''
      state.serverRPC = info
      if (!data.type) {
        db.updateBaseInfo({
          key: 'serverRPC',
          value: info
        })
      }
    },
    setNetworkMode (state, data) {
      // console.log(data)
      let info = data.info ? data.info : ''
      state.networkMode = info
    },
    setApprovalObj (state, data) {
      state.approvalObj = data
    },
  },
  actions: {
    getEnode ({commit}) {
      try {
        if (this.state.serverRPC) {
          setTimeout(() => {
            web3.getEnode().then(res => {
              commit('setEnode', res)
            })
          }, 500)
          // web3.getEnode().then(res => {
          //   commit('setEnode', res)
          // })
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
    getAccountType ({commit}) {
      let data = { type: 1, info: ''}
      db.findBaseInfo({key: config.cookies.accountType}).then(res => {
        if (res.length > 0) {
          data.info = res[0].value
        } else {
          data.info = config.modeInit
        }
        commit('setAccountType', data)
      }).catch(err => {
        data.info = config.modeInit
        commit('setAccountType', data)
        console.log(err)
      })
    },
    getDayAndNight ({commit}) {
      let data = { type: 1, info: ''}
      db.findBaseInfo({key: 'dayAndNight'}).then(res => {
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
      db.findBaseInfo({key: 'language'}).then(res => {
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
      db.findBaseInfo({key: 'serverRPC'}).then(res => {
        // console.log(res)
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
    },
  }
})

export default store
