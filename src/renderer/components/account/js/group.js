export const gMethods = {
  initGroupData () {
    this.loading.account = true
    this.gID = this.$route.query.gID ? this.$route.query.gID : ''
    this.pubKey = this.$route.query.pubKey ? this.$route.query.pubKey : ''
    this.getAccounts()
    this.getGroupData()
  },
  getGroupData () {
    this.$$.getGroup().then(res => {
      console.log(res)
      this.getGroup = res.info ? res.info : []
      if (this.$route.query.gID) {
        this.gID = this.$route.query.gID
      }
      this.getMemberList()
    }).catch(err => {
      console.log(err)
      this.msgError(err.error)
    })
  },
  getMemberList () {
    for (let obj of this.getGroup) {
      if (this.gID === obj.Gid) {
        this.gMode = obj.Mode
        this.setMemberList(obj.Enodes)
        break
      }
    }
  },
  setMemberList (data) {
    this.gMemberInit = []
    // console.log(arr)
    let arr = []
    for (let obj of data) {
      if (obj === this.$$.eNode) continue
      arr.push({
        p1: 'dcrm',
        p2: 'getEnodeStatus',
        p3: [obj]
      })
    }
    this.$$.batchRequest(arr).then(res => {
      console.log(res)
      for (let obj of res) {
        let cbData = JSON.parse(obj), status
        if (cbData.Status === 'Success') {
          status = 'OnLine'
        } else {
          status = 'OffLine'
        }
        this.gMemberInit.push({
          eNode: obj,
          status: status === 'OnLine' ? 1 : 0
        })
      }
    })
    console.log(this.gMemberInit)
  },
}