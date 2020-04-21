export const nodeDatas = {
  baseUrl: 'getNodeInfos',
  netUrlArr: [],
  localUrlArr: [],
  loadingSelect: true,
}

export const nodeSockets = {
  getNodeInfos (res) {
    this.formatData(res)
  },
  getNodeInfosDev (res) {
    this.formatData(res)
  }
}

export const nodeMethods = {
  formatData (res) {
    let noRepeat = new Set(), arr = []
    if (res.msg === 'Success') {
      for (let obj of res.info) {
        arr.push({
          url: obj.url,
          name: obj.name ? obj.name : obj.url,
          status: obj.status
        })
        noRepeat.add(obj.url)
      }
    }
    for (let obj of this.localUrlArr) {
      if (!noRepeat.has(obj.url)) {
        arr.push({
          url: obj.url,
          name: obj.name ? obj.name : obj.url,
          status: ''
        })
        noRepeat.add(obj.url)
      }
    }
    this.netUrlArr = arr
    this.loadingSelect = false
  },
  getNetUrl () {
    // if (this.$$.config.env === 'dev') {
    //   this.baseUrl = 'getNodeInfosDev'
    // }
    this.$db.findNode().then(res => {
      // console.log(res)
      this.netUrlArr = []
      this.localUrlArr = res
      if (this.networkMode) {
        this.$socket.emit(this.baseUrl)
      } else {
        let arr = []
        for (let obj of this.localUrlArr) {
          if (!arr.includes(obj.url)) {
            this.netUrlArr.push({
              url: obj.url,
              name: obj.name ? obj.name : obj.url,
              status: ''
            })
            arr.push(obj.url)
          }
        }
        // this.netUrlArr = this.localUrlArr
        this.loadingSelect = false
      }
    })
  },
  saveRpcDB (url) {
    let params = {url: url}
    this.$db.findNode(params).then(res => {
      // console.log(res)
      if (res > 0 || res.length > 0) {
        // resolve(0)
        // console.log(res)
      } else {
        this.$db.insertNode(params).then(res1 => {
          // resolve(1)
          // console.log(res1)
        })
      }
    })
  },
}