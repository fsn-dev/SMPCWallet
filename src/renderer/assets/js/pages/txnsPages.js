export const data = {
  historyData: [],
  loading: {
    screen: true,
    history: true,
    btn: false
  },
  rawTx: {
    from: '',
    to: '',
    value: '',
    nonce: '',
    gasLimit: '',
    gasPrice: ''
  },
  maxFee: "",
  netWorkInfo: "",
  refreshTable: null,
  pageInfo: {
    pageNum: 1,
    total: 0,
    pageSize: 20,
  },
  signTx: '',
  activeNames: "",
  privateSureVisible: false,
  sendBtnFlag: false
}

export const computed = {

}

export const methods = {
  prevClick () {
    this.pageInfo --
    this.getHistory()
  },
  nextClick () {
    this.pageInfo ++
    this.getHistory()
  },
  getElDialogView () {
    this.modalClick()
  },
  keyPressBtn (e) {
    if (e.which === 13) {
      this.privateSure()
    }
  },
  privateSure () {
    event.preventDefault()
    this.loading.btn = true
    if (!this.rawTx.to) {
      this.msgError(this.selectData.coinType + this.$t('ERROR_TIP').TIP_2)
      this.loading.btn = false
      return
    }
    if (this.rawTx.to.toLowerCase() === this.selectData.address.toLowerCase()) {
      this.msgError(this.selectData.coinType + this.$t('ERROR_TIP').TIP_4)
      this.loading.btn = false
      return
    }
    if (this.selectData.coinType !== "BTC" && this.rawTx.to.indexOf("0x") !== 0) {
      this.msgError(this.selectData.coinType + this.$t('ERROR_TIP').TIP_5)
      this.loading.btn = false
      return
    }
    let getAmountTip = this.$$.limitCoin(this.sendAmound, this.selectData.limit, this.selectData.number)
    if (getAmountTip.flag) {
      this.msgError(getAmountTip.msg)
      this.loading.btn = false
      return
    }
    this.rawTx.data = "LOCKOUT:" + this.toAddress + ":" + this.toValue + ":" + this.selectData.ERC20coin,
    // this.maxFee = this.$$.fromWei(Number(this.gasLimitNum) * Number(this.gasPriceNum), "ether")
    // this.rawTx.from = this.selectData.address
    this.privateSureVisible = true
    this.loading.btn = false
  },
  getSignData (data) {
    console.log(data)
    console.log(data.signTx)
    if (data.signTx) {
      if (Number(this.$$.getCookies(this.$$.config.cookies.accountType))) {
        this.serializedTxView = true
        this.sendInfoVisible = false
        // this.qrcode(this.signTx)
      } else {
        // this.sendDatabase(data.signTx)
        this.rawTx.nonce = data.nonce
        this.rawTx.gasLimit = data.gasLimit
        this.rawTx.gasPrice = data.gasPrice
        this.rawTx.data = data.data
        this.sendInfoVisible = true
      }
      this.signTx = data.signTx ? data.signTx : ''
      this.maxFee = this.$$.fromWei(Number(data.gasPrice) * Number(data.gasLimit), "ether")
    } else {
      this.sendInfoVisible = false
      this.msgError(this.selectData.coinType + this.$t('ERROR_TIP').TIP_6)
    }
    this.privateSureVisible = false
  },
  sendDatabase (signTx) {
    // console.log(signTx)
    this.sendBtnFlag = true
    this.$$.sendTxns(this.signTx).then(res => {
      this.msgSuccess('Success')
    }).catch(err => {
      this.msgError(err.error)
    })
  },
}