export default {
  getAllAccountList () {
    return new Promise(resolve => {
      let arr = [
        { p1: 'dcrm', p2: 'getAccounts', p3: [this.address, '0'] },
        { p1: 'dcrm', p2: 'getAccounts', p3: [this.address, '1'] },
      ]
      this.$$.batchRequest(arr).then(res => {
        // console.log(res)
        let groupArr = [], personArr = []
        if (res[0] && res[0].Status) {
          groupArr = this.formatAccount(res[0], 0)
        }
        if (res[1] && res[1].Status) {
          personArr = this.formatAccount(res[1], 1)
        }
        let allArr = [...groupArr, ...personArr]
        allArr = allArr.sort(this.$$.bigToSmallSort('timestamp'))
        resolve(allArr)
      })
    })
  },
  formatAccount (res, type) {
    let arr = [], arr1 = [], arr2 = []
    if (res.Status !== 'Error') {
      arr = res.Data.result && res.Data.result.Group ? res.Data.result.Group : []
    }
    for (let obj1 of arr) {
      for (let obj2 of obj1.Accounts) {
        if (!arr1.includes(obj2.PubKey)) {
          // console.log(obj2)
          let obj3 = {
            publicKey: obj2.PubKey,
            gID: obj1.GroupID,
            mode: obj2.ThresHold,
            name: obj2.PubKey.substr(2),
            timestamp: obj2.TimeStamp,
            accountType: type,
            img: this.$$.createImg(obj2.PubKey)
          }
          arr2.push(obj3)
          arr1.push(obj2.PubKey)
        }
      }
    }
    return arr2
  },
}