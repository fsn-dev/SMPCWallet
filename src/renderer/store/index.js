import Vue from 'vue'
import Vuex from 'vuex'

// import wallet from './store-wallet.js'
// import exchange from './store-exchange.js'
Vue.use(Vuex)

// let langEn = require('@/assets/js/language/en')

const store = new Vuex.Store({
  state: {
    address: '',
    coininfoArr: [],
    network: {},
    coinDollarArr: '',
  },
  mutations: {
    storeAddress (state, address) {
      state.address = address
    },
    storeCoininfoArr (state, data) {
      state.coininfoArr = data
    },
    storeNetwork (state, data) {
      state.network = data
    },
    storeCoinDollarArr (state, data) {
      state.coinDollarArr = data
    },
  },
  modules: {
    // wallet,
    // exchange
  }
})

export default store
