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
    serverRPCname: '',
    networkMode: config.networkMode,
    approvalObj: {},
    email: '',
    connect: '',
    selectPubKey: '',
    CCCD: [
      {"from":"mzEh4n6syEvTYXEWRdSzbyXJMThfJqCfH6","to":"mhn4NNGfxrZmB3ao7Eze8Z8UQ64BceLotm","swapTo":"mhn4NNGfxrZmB3ao7Eze8Z8UQ64BceLotm","value":"1000","nonce":"31","coinType":"BTC","hash":"","status":0,"pubKey":"045bf1235cb6114b6fb05445c1cd8490f6f39f175c611bebeca90e001c552b79b41f4c453af10b6ace02e5bd4fb5b03e709e41ad80958e959c57257d1906161150","key":"0x4d385674fa8f48e3616e69d38de0c911e08e38dcd4368f436bbfdf72188ae525","mode":"5/5","gId":"d43599d32b93d3500ae05b9b06985f30b831b9516eff9a1e8ee3b96865375ddc25b0940c25d6b60c2363dbb20eb420beeddfa2746b35c4e1d79f6d409fef5a33","data":"SWAPTO:0x76c2ae4281fe1ee1a79ccbdda2516d4d7eb0eb37","kId":"0x03C3AE504ca540049Fd6bFff9BC6Ffe403ea4616","eNode":"enode://fa93e6d82b859ddf5344ae39a6e1de3c38e0172f0678e0fda5b83cd245cbbabea5e89ff80c65dfac4aee25b93051b0e460388fb6c7f3ed5a368d501a48b96099@47.92.168.85:13331"}
    ] // Cross chain cache data
  },
  mutations: {
    setEnode (state, data) {
      state.eNode = data
    },
    setEnodeTx (state, data) {
      let info = data && data.info !== '' ? data.info.toString() : ''
      state.eNodeTx = info
      if (!data.type) {
        cookies.setCookies(config.cookies.eNodeTx, info)
      }
    },
    setAddress (state, data) {
      let info = data && data.info !== '' ? data.info.toString() : ''
      state.address = info
      if (!data.type) {
        cookies.setCookies(config.cookies.address, info)
      }
    },
    setToken (state, data) {
      let info = data && data.info !== '' ? data.info.toString() : ''
      state.token = info
      if (!data.type) {
        cookies.setCookies(config.cookies.token, info)
      }
    },
    setAccountType (state, data) {
      let info = data && data.info !== '' ? data.info.toString() : config.modeInit
      state.accountType = info
      if (!data.type) {
        db.updateBaseInfo({
          key: config.cookies.accountType,
          value: info
        })
      }
    },
    setDayAndNight (state, data) {
      let info = data && data.info !== '' ? data.info.toString() : config.dayAndNight
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
      let info = data && data.info !== '' ? data.info : ''
      state.language = info
      if (!data.type) {
        db.updateBaseInfo({
          key: 'language',
          value: info
        })
      }
    },
    setServerRPC (state, data) {
      let info = data && data.info !== '' ? data.info : ''
      state.serverRPC = info
      if (!data.type) {
        db.updateBaseInfo({
          key: 'serverRPC',
          value: info
        })
      }
    },
    setServerRPCname (state, data) {
      let info = data && data.info !== '' ? data.info : ''
      state.serverRPCname = info
      if (!data.type) {
        db.updateBaseInfo({
          key: 'serverRPCname',
          value: info
        })
      }
    },
    setNetworkMode (state, data) {
      // console.log(data)
      let info = data && data.info !== '' ? data.info : ''
      state.networkMode = info
    },
    setApprovalObj (state, data) {
      state.approvalObj = data
    },
    setEmail (state, data) {
      state.email = data
    },
    SOCKET_CONNECT(state, data) {
      state.connect = data
    },
    setSelectPubKey (state, data) {
      state.selectPubKey = data
    },
    setCCCD (state, data) {
      console.log(data)
      if (data.type === 'push') {
        state.CCCD.push(data.data)
      } else {
        state.CCCD.forEach((item, index, arr) => {
          if (item.key && item.key === data.data) {
            arr.splice(index, 1)
          }
        })
      }
    },
  },
  actions: {
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
    getServerRPCname ({commit}) {
      let data = { type: 1, info: ''}
      db.findBaseInfo({key: 'serverRPCname'}).then(res => {
        // console.log(res)
        if (res.length > 0) {
          data.info = res[0].value
        } else {
          data.info = ''
        }
        commit('setServerRPCname', data)
      }).catch(err => {
        data.info = ''
        commit('setServerRPCname', data)
        console.log(err)
      })
    },
  }
})

export default store
