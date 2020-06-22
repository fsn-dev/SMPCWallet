export const methods = {
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
              // if (obj.status === 4) stateObj.r ++ 
              if (obj.status === 5) stateObj.a ++ 
            }
            if (stateObj.a === dataObj.member.length) {
              state = 5
              // this.getHistoryState(dataObj._id, dataObj.key, i)
            }
            // else if ((nowTime - dataObj.timestamp) > this.$$.config.timeout && stateObj.p > 0) {
            //   state = 6
            //   dataObj.status = state
            //   this.setDBState(dataObj._id, i, '', state)
            // }
            this.getHistoryState(dataObj._id, dataObj.key, i)
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
      if (dataObj.gId) {
        this.getGName(dataObj.gId, i)
      }
      if (dataObj.pubKey) {
        this.getAccountName(dataObj.pubKey, i)
      }
      // console.log(dataObj.status)
      this.tableData.push(dataObj)
      this.loading.history = false
    }
  },
}