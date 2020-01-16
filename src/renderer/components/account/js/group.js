export const gMethods = {
  initGroupData () {
    this.loading.account = true
    this.gID = this.$route.query.gID ? this.$route.query.gID : ''
    this.pubKey = this.$route.query.publicKey ? this.$route.query.publicKey : ''
    // console.log(this.$route.query)
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
      this.gMemberInit = []
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
    let arr = []
    for (let obj of data) {
      if (obj.substr(0, obj.indexOf('@')) === this.eNode.substr(0, this.eNode.indexOf('@'))) continue
      arr.push({
        p1: 'dcrm',
        p2: 'getEnodeStatus',
        p3: [obj]
      })
    }
    this.gMemberSelect.push(this.eNode)
    this.$$.batchRequest(arr).then(res => {
      // console.log(res)
      for (let obj of res) {
        let cbData = JSON.parse(obj), status
        // console.log(cbData)
        if (cbData.Data && cbData.Data.Status && cbData.Data.Status === 'OnLine') {
          status = 'OnLine'
        } else {
          status = 'OffLine'
        }
        this.gMemberInit.push({
          eNode: cbData.Data.Enode,
          status: status === 'OnLine' ? 1 : 0
        })
        this.gMemberSelect.push(cbData.Data.Enode)
      }
      this.loading.nodeSelect = false
    })
  },
}