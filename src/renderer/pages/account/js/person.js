export const psMethods = {
  getGroupPersonId () {
    // this.getAccounts()
    // return
    this.$$.getGroupPerson().then(res => {
      console.log(res)
      if (res.msg === 'Success' && res.info) {
        this.gID = res.info.Gid
        this.gMode = res.info.Mode ? res.info.Mode : '3/3'
        this.pubKey = res.info.PubKey ? res.info.PubKey : ''
        this.getPersonAccount()
        this.loading.account = true
      } else {
        this.getAccounts()
      }
      // this.getAccounts()
    }).catch(err => {
      console.log(err)
      this.msgError(err.error)
      this.loading.account = false
    })
  },
  getPersonAccount () {
    this.$$.getAccounts(this.gID, this.accountType).then(res => {
      console.log(res)
      if (res.msg === 'Success' && res.info.length > 0) {
        this.gID = res.info[0].GroupID
        this.gMode = res.info.Mode ? res.info.Mode : '3/3'
        this.pubKey = res.info[0].Accounts[0] ? res.info[0].Accounts[0] : ''
        // return
        this.getAccounts()
      } else {
        // this.getGroupPersonId()
        this.reqPersonAccount()
      }
    }).catch(err => {
      console.log(err)
      // this.getGroupPersonId()
      this.reqPersonAccount()
      if (err.error) {
        this.msgError(err.error)
      }
    })
  },
  reqPersonAccount () {
    this.$$.getReqNonce(this.address).then(nonce => {
      let rawTx = {
        from: this.address,
        to: this.$$.config.rawTx.to,
        gasLimit: this.$$.config.rawTx.gasLimit,
        gasPrice: this.$$.config.rawTx.gasPrice,
        nonce: nonce,
        value: 0,
        data: 'REQDCRMADDR:' + this.gID + ':' + this.gMode
      }
      console.log(rawTx)
      // return
      if (this.$store.state.wallet) {
        this.$$.toSign(rawTx, this.$store.state.wallet).then(res => {
          // console.log(res)
          this.$$.reqAccount(res.signTx, this.accountType).then(res => {
          // this.$$.reqAccount(res.signTx, '0').then(res => {
            console.log(res)
            if (res.msg === 'Success') {
              this.pubKey = res.info.PubKey
              this.getAccounts()
            } else {
              this.loading.account = false
            }
            this.$store.commit('setWallet', {info: ''})
            // this.reload()
          })
        })
      } else {
        this.msgError(this.$t('warn').w_13)
        this.loading.account = false
      }
    })
  },
}