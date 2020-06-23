export const nodeDatas = {
  baseUrl: 'getNodeInfos',
  netUrlArr: [],
  localUrlArr: [],
  loadingSelect: true,
  limitVersion: []
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
    this.limitVersion = []
    let noRepeat = new Set(), noRepeat1 = new Set(), arr = []
    if (res.msg === 'Success') {
      for (let obj of res.info) {
        obj.url = obj.url.replace(/\s/g, '')
        arr.push({
          url: obj.url,
          name: obj.name ? obj.name : obj.url,
          status: obj.status,
        })
        if (obj.version) {
          let level = this.$$.compareVersion(obj.version, '5.2.0')
          // console.log(obj.version)
          // console.log(level)
          if (level > 2 || level === 0) {
            this.limitVersion.push(obj)
            noRepeat1.add(obj.url)
          }
        }
        noRepeat.add(obj.url)
      }
      // console.log(this.limitVersion)
    }
    for (let obj of this.localUrlArr) {
      if (!noRepeat.has(obj.url)) {
        obj.url = obj.url.replace(/\s/g, '')
        let obj1 = {
          url: obj.url,
          name: obj.name ? obj.name : obj.url,
          status: ''
        }
        arr.push(obj1)
        this.limitVersion.push(obj1)
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
            obj.url = obj.url.replace(/\s/g, '')
            this.netUrlArr.push({
              url: obj.url,
              name: obj.name ? obj.name : obj.url,
              status: ''
            })
            arr.push(obj.url)
          }
        }
        this.limitVersion = this.netUrlArr
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