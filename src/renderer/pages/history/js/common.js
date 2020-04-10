export const datas = {
  tableData: [],
  coinType: '',
  loading: {
    history: true
  },
  dcrmAddr: '',
  page: {
    cur: 0,
    pageSize: 10,
    total: 0
  },
  refresh: {
    g: true,
    a: true
  }
}

export const commonMethods ={
  initFormat (res) {
    console.log(res)
    if (res.msg === 'Success' && res.info.length > 0) {
      this.page.total = res.total
      this.formatData(res.info)
      // this.tableData = res.info
    } else {
      this.page.total = 0
      this.tableData = []
      this.loading.history = false
    }
  },
  handleCurrentChange (val) {
    this.page.cur = val
    this.init()
  },
  getStateFormat (id, index, res) {
    // console.log(res)
    if (res.msg === 'Success' && (res.status === 'Success' || res.hash)) {
      let hash = res.hash && res.hash.indexOf('0x') === 0 ? res.hash : ('0x' + res.hash)
      this.setDBState(id, index, hash, 1)
      this.tableData[index].hash = hash
      if (!this.tableData[index].pubKey) {
        this.tableData[index].pubKey = hash
      }
      this.tableData[index].status = 1
    } else if (res.status === 'Failure' || res.info === 'Failure') {
      this.setDBState(id, index, '', 2)
      this.tableData[index].status = 2
    } else if (res.status === 'Timeout' || res.info === 'Timeout') {
      this.setDBState(id, index, '', 6)
      this.tableData[index].status = 6
    }
  },
  getGName (id, index) {
    this.$db.findGroup({gId: id, address: this.address,}).then(res => {
      // console.log(res)
      if (res.length > 0) {
        this.tableData[index].gName = res[0].name
        this.refresh.g = false
        this.$nextTick(() => {
          this.refresh.g = true
        })
      }
    })
  },
  getAccountName (id, index) {
    this.$db.findGaccount({publicKey: id, address: this.address}).then(res => {
      // console.log(res)
      if (res.length > 0) {
        this.tableData[index].aName = res[0].name
        this.refresh.a = false
        this.$nextTick(() => {
          this.refresh.a = true
        })
      }
    })
  },
}