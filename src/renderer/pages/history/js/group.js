export const methods = {
  // initFormat (res) {
  //   this.loading.history = true
  //   if (res.msg === 'Success' && res.info.length > 0) {
  //     this.page.total = res.total
  //     this.formatData(res.info)
  //     // this.tableData = res.info
  //   } else {
  //     this.page.total = 0
  //     this.tableData = []
  //     this.loading.history = false
  //   }
  // },
  // handleCurrentChange (val) {
  //   this.page.cur = val
  //   this.init()
  // },
  /**
   * 0: Pending;
   * 1: Success;
   * 2: Failure;
   * 4: Refuse;
   * 5: Agree;
   * 6: Timeout
   */
  formatData (data) {
    this.tableData = []
    let nowTime = Date.now()
    for (let i = 0, len = data.length; i < len; i++) {
      let dataObj = data[i]
      // console.log(dataObj.status)
      if (dataObj.status === 0) {
        if (this.networkMode) {
          let state = 0
          if (dataObj.member && dataObj.member.length > 0) {
            let stateObj = { p: 0, a: 0, r: 0 }
            for (let obj of dataObj.member) {
              if (obj.status === 0) stateObj.p ++ 
              if (obj.status === 4) stateObj.r ++ 
              if (obj.status === 5) stateObj.a ++ 
            }
            // if (stateObj.r > 0) {
            //   state = 4
            //   this.setDBState(dataObj._id, i, '', state)
            // } else 
            if (stateObj.a === dataObj.member.length) {
              state = 5
              this.getHistoryState(dataObj._id, dataObj.key, i)
            } else if ((nowTime - dataObj.timestamp) > this.$$.config.timeout && stateObj.p > 0) {
              state = 6
              dataObj.status = state
              this.setDBState(dataObj._id, i, '', state)
            }
            dataObj.status = state
          } else {
            this.getHistoryState(dataObj._id, dataObj.key, i)
          }
        } else {
          this.getHistoryState(dataObj._id, dataObj.key, i)
        }
      } else if (dataObj.status === 5 && !dataObj.hash) {
        this.getHistoryState(dataObj._id, dataObj.key, i)
      }
      // console.log(dataObj.status)
      this.tableData.push(dataObj)
      this.loading.history = false
    }
  },
  // getStateFormat (res) {
  //   console.log(res)
  //   if (res.msg === 'Success' && res.status === 'Success') {
  //     let hash = res.hash && res.hash.indexOf('0x') === 0 ? res.hash : ('0x' + res.hash)
  //     this.setDBState(id, index, hash, 1)
  //     this.tableData[index].hash = hash
  //     this.tableData[index].status = 1
  //   } else if (res.status === 'Failure' || res.info === 'Failure') {
  //     this.setDBState(id, index, '', 2)
  //     this.tableData[index].status = 2
  //   } else if (res.status === 'Timeout' || res.info === 'Timeout') {
  //     this.setDBState(id, index, '', 6)
  //     this.tableData[index].status = 6
  //   }
  // }
}