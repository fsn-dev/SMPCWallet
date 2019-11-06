
let wallet = {
  state: {
    safeMode: false
  },
  mutations: {
    storeSafeMode (state, data) {
      state.safeMode = data
    },
  }
}

export default wallet
