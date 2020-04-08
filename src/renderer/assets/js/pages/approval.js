
export const approvalMethods = {
  getStatusInfo (key) {
    return new Promise((resolve) => {
      // console.log({
      //   key: key,
      //   address: this.address
      // })
      this.$db.findStatus({
        key: key,
        address: this.address
      }).then(res => {
        // console.log(res)
        if (res.length > 0 && res[0].status) {
          resolve(1)
        } else {
          resolve(0)
        }
      })
    })
  },
  getGroupList (res) {
    return new Promise((resolve) => {
      let arr = [], cbData = res, data = {msg: 'Error', info: [], total: 0, approved: 0}
      if (cbData.Status !== 'Error') {
        cbData = cbData.Data ? cbData.Data : {}
        // console.log(cbData)
        data.total = Object.getOwnPropertyNames(cbData).length
        if (data.total > 0) {
          for (let obj in cbData) {
            let obj1 = cbData[obj]
            obj1 = JSON.parse(obj1)
            this.getStatusInfo(obj1.Key).then(status => {
              let _s = 1
              if (!status && obj1.Account !== this.address) {
                _s = 0
                data.approved ++
              }
              Object.assign(obj1, {status: _s})
              // console.log(obj1)
              arr.push(obj1)
              if (data.total === arr.length) {
                data.msg = 'Success'
                arr = arr.sort(this.$$.bigToSmallSort('TimeStamp'))
                data.info = arr
                resolve(data)
              }
            })
          }
        } else {
          data.msg = 'Success'
          resolve(data)
        }
      } else {
        data.error = res.Error
        resolve(data)
      }
    })
  },
  getAllApproval () {
    return new Promise((resolve) => {
      let arr = [
        { p1: 'dcrm', p2: 'getCurNodeReqAddrInfo', p3: [this.address] },
        { p1: 'dcrm', p2: 'getCurNodeLockOutInfo', p3: [this.address] },
      ]
      this.$$.batchRequest(arr).then(res => {
        let arr = [
          this.getGroupList(res[0]),
          this.getGroupList(res[1])
        ]
        Promise.all(arr).then(data => {
          // console.log(data)
          resolve(data)
        })
      })
    })
  },
}