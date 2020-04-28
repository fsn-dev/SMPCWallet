import web3 from '@/assets/js/web3/index.js'
export default {
  async getBalance (addr, coinObj) {
    let data = {msg: '', info: ''}
    return new Promise(resolve => {
      let batch = web3.createBatch()
      for (let obj in coinObj) {
        batch.add(web3.dcrm.getBalance.request(addr, obj, coinObj[obj]))
      }
      batch.requestManager.sendBatch(batch.requests, (err, res) => {
        if (err) {
          data = {msg: 'Error', error: err.toString()}
        } else {
          let i = 0
          let arr = []
          for (let obj in coinObj) {
            let balance = res[i].result ? res[i].result : 0
            if (balance && (balance.Status === 'Error' || isNaN(balance.Data.result)) ) {
              balance = 0
            } else {
              balance = balance.Data.result
            }
            arr.push({
              coinType: obj,
              address: coinObj[obj],
              balance: balance
            })
          }
          data = {msg: 'Success', info: arr}
        }
        resolve(data)
      })
    })
  },
  async getAccounts (address, mode) {
    let data = {msg: 'Error', info: []}
    return new Promise(resolve => {
      let cbData = ''
      web3.dcrm.getAccounts(address, mode).then(res => {
        cbData = res
        if (cbData.Status !== 'Error') {
          data = {msg: 'Success', info: cbData.Data.result && cbData.Data.result.Group ? cbData.Data.result.Group : []}
        } else {
          data = {msg: 'Success', info: []}
        }
        resolve(data)
      }).catch(err => {
        console.log(err)
        data = {msg: 'Error', info: [], error: err.toString()}
        resolve(data)
      })
    })
  },
  async getAccountsBalance (pubk, address) {
    let data = {msg: '', info: ''}
    return new Promise(resolve => {
      let cbData = ''
      web3.dcrm.getAccountsBalance(pubk, address).then(res => {
        cbData = res
        if (typeof res === 'string') {
          cbData = JSON.parse(cbData)
        }
        if (cbData.Status !== 'Error') {
          data = {msg: 'Success', info: cbData.Data.result.Balances}
        } else {
          data = {msg: 'Success', info: []}
        }
        resolve(data)
      }).catch(err => {
        console.log(err)
        data = {msg: 'Error', error: err.toString()}
        resolve(data)
      })
    })
  },
}