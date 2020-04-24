export const datas = {
  eDialog: {
    pwd: false,
    confirm: false
  },
  loading: {
    creat: false,
    confirm: false,
    search: false
  },
  mode: {
    init: '',
    select: ''
  },
  node: {
    select: [],
    min: 0,
    max: 0,
    add: '',
    refresh: true
  },
  dataPage: {},
  gID: '',
  signTx: '',
  checkList: [],
  searchVal: '',
  userlist: [],
}

export const watchs = {
  accountType (cur) {
    if (Number(cur) === 1) {
      this.toUrl('/createPerson')
    } else {
      this.toUrl('/createGroup')
    }
  },
  'mode.select' (cur, old) {
    this.changeMode(cur, old)
  }
}

export const methods = {
  init () {
    this.mode = {
      init: this.$$.mode,
      select: this.$$.config.initGroupMode
    }
    this.changeMode()
  },
  modalClick () {
    this.eDialog.pwd = false
    this.eDialog.confirm = false
    this.loading.creat = false
    this.$$.web3.setProvider(this.serverRPC)
    this.$emit('closeModal')
    // console.log(123)
    // this.$emit('closeDrawer')
  },
  getMode (mode) {
    // console.log(mode)
    this.mode.select = mode
  },
  createAndGetGid (mode, arr, signStr) {
    this.eDialog.confirm = false
    this.loading.creat = true
    this.$$.createGroup(mode, arr).then(res => {
      let gInfo = res
      console.log(gInfo)
      if (gInfo.msg === 'Success') {
        this.gID = res.info.Gid
        this.openPwdDialog(signStr)
      } else {
        this.msgError(gInfo.info.toString())
        this.modalClick()
      }
    }).catch(err => {
      this.msgError(err)
      this.modalClick()
    })
  },
  openPwdDialog (signStr) {
    if (!this.gID) {
      this.msgError(this.$t('warn').w_3)
      this.modalClick()
      return
    }
    let data = 'REQDCRMADDR:' + this.gID + ':' + this.mode.select + ':' + this.accountType + ':' + Date.now()
    if (signStr) {
      data += signStr
    }
    console.log(data)
    this.dataPage = {
      from: this.address,
    }
    this.$$.getReqNonce(this.address).then(nonce => {
      this.dataPage.nonce = nonce
      this.dataPage.value = 0
      this.dataPage.data = data
      console.log(this.dataPage)
      this.eDialog.pwd = true
      this.loading.creat = false
    })
  },
  getSignData (data) {
    this.eDialog.pwd = false
    this.loading.creat = true
    if (data.signTx) {
      this.signTx = data.signTx
      this.reqAccount()
    } else {
      this.loading.creat = false
      this.msgError('Error')
    }
  },
  reqAccount () {
    this.$$.reqAccount(this.signTx).then(res => {
      console.log(res)
      if (res.msg === 'Success') {
        if (Number(this.accountType) !== 1) {
          this.updateStatus(res.info)
        }
        this.saveDB(res.info)
        this.msgSuccess(this.$t('success').s_3)
      }
      this.modalClick()
      if (Number(this.accountType) !== 1) {
        // this.toUrl('/approvalList')
      }
    }).catch(err => {
      console.log(err)
      this.msgError(err.error)
      this.modalClick()
    })
  },
  resetForm() {
    this.mode.select = this.$$.config.initGroupMode
    this.node.select = []
    this.gID = ''
    this.checkList = []
    this.changeMode()
  },
  refreshNode () {
    this.node.refresh = false
    this.$nextTick(() => {
      this.node.refresh = true
    })
  },
}