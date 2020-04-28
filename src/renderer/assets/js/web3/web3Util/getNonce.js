import web3 from '@/assets/js/web3/index.js'
export default {
  async getLockOutNonce (addr) {
    let data = 0
    return new Promise(resolve => {
      web3.dcrm.getLockOutNonce(addr).then(res => {
        let cbData = res
        if (cbData.Status !== 'Error') {
          data = cbData.Data.result
        } else {
          data = 0
        }
        resolve(data)
      }).catch(err => {
        console.log(err)
        data = 0
        resolve(data)
      })
    })
  },
  async getReqAddrNonce (addr) {
    let data = 0
    return new Promise(resolve => {
      web3.dcrm.getReqAddrNonce(addr).then(res => {
        let cbData = res
        if (cbData.Status !== 'Error') {
          data = cbData.Data.result
        } else {
          data = 0
        }
        resolve(data)
      }).catch(err => {
        console.log(err)
        data = 0
        resolve(data)
      })
    })
  },
}