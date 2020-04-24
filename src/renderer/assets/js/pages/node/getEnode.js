
export default {
  getEnode1 (url) {
    return new Promise(resolve => {
      let enodeObj = {status: 'Error', enode: ''}
      this.$$.web3.setProvider(url)
      this.$$.web3.dcrm.getEnode().then(res => {
        let cbData = res
        if (typeof res === 'string') {
          cbData = JSON.parse(cbData)
        }
        // console.log(cbData)
        if (cbData.Status === "Success") {
          enodeObj.status = 'Success'
          enodeObj.enode = cbData.Data.Enode
        }
        resolve(enodeObj)
      }).catch(err => {
        console.log(err)
        resolve(enodeObj)
      })
    })
  },
  getEnode2 () {
    return new Promise(resolve => {
      setTimeout(() => {
        let data = { status: 0, enode: '' }
        resolve(data)
      }, 1000 * 30)
    })
  },
  getEnode (url, isReset) {
    return new Promise(resolve => {
      Promise.race([this.getEnode1(url), this.getEnode2()]).then(res => {
        if (!isReset) {
          this.$$.web3.setProvider(this.serverRPC)
        }
        // console.log(res)
        resolve(res)
      })
    })
  }
}