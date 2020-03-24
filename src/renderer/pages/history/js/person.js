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
      if (dataObj.status === 0) {
        this.getHistoryState(dataObj._id, dataObj.key, i)
      }
      this.tableData.push(dataObj)
      this.loading.history = false
    }
  },
}