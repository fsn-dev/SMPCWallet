import {findStatus} from '@/db/status'

export const approvalMethods = {
  getGroupAccounts (res) {
    let arr = [], cbData = res
    if (cbData.Status !== 'Error') {
      cbData = cbData.Data
      for (let obj in cbData) {
        let obj1 = cbData[obj]
        obj1 = JSON.parse(obj1)
        arr.push(obj1)
      }
    }
  },
  getGroupTxns () {
    return 
  },
  getAllApproval () {
    let arr = [
      { p1: 'dcrm', p2: 'getCurNodeReqAddrInfo', p3: [this.address] },
      { p1: 'dcrm', p2: 'getCurNodeLockOutInfo', p3: [this.address] },
    ]
    this.$$.batchRequest(arr).then(res => {
      console.log(res)
      this.getGroupAccounts(res[0])
      this.getGroupTxns(res[1])
    })
    // Promise.all([
    //   this.getGroupAccounts(),
    //   this.getGroupTxns()
    // ]).then(res => {
    //   console.log(res)
    // })
  },
  intervalNews () {

  }
}