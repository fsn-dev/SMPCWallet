import web3 from '@/assets/js/web3/index.js'
export default {
  async reqDcrmAddr (signTx) {
    let data = {msg: '', info: ''}
    return new Promise(resolve => {
      let cbData = ''
      web3.dcrm.reqDcrmAddr(signTx).then(res => {
        cbData = res
        if (res && typeof res === 'string') {
          cbData = JSON.parse(cbData)
        }
        if (cbData.Status !== 'Error') {
          data = {msg: 'Success', info: cbData.Data.result}
        } else {
          data = {msg: 'Error', error: cbData.Tip}
        }
        resolve(data)
      }).catch(err => {
        console.log(err)
        data = {msg: 'Error', error: err.toString()}
        resolve(data)
      })
    })
  },
  async acceptReqAddr (signTx) {
    let data = {msg: 'Error', info: ''}
    return new Promise(resolve => {
      web3.dcrm.acceptReqAddr(signTx).then(res => {
        let cbData = res
        if (cbData.Status !== 'Error') {
          data = {msg: 'Success', info: cbData}
        } else {
          data = {msg: 'Error', info: cbData, error: cbData.Error}
        }
        resolve(data)
      }).catch(err => {
        data = {msg: 'Error', info: '', error: err.toString()}
        resolve(data)
      })
    })
  },
  async lockOut (signTx) {
    let data = {msg: '', info: ''}
    return new Promise(resolve => {
      let cbData = ''
      web3.dcrm.lockOut(signTx).then(res => {
        cbData = res
        // console.log(cbData)
        if (cbData.Status !== 'Error') {
          cbData = cbData.Data && cbData.Data.result ? cbData.Data.result : ''
          data = {msg: 'Success', info: cbData}
        } else {
          data = {msg: 'Error', error: cbData.Error}
        }
        resolve(data)
      }).catch(err => {
        console.log(err)
        data = {msg: 'Error', error: err.toString()}
        resolve(data)
      })
    })
  },
  acceptLockOut (signTx) {
    let data = {msg: '', info: ''}
    return new Promise(resolve => {
      let cbData = ''
      web3.dcrm.acceptLockOut(signTx).then(res => {
        cbData = res
        if (res && typeof res === 'string') {
          cbData = JSON.parse(cbData)
        }
        if (cbData.Status !== 'Error') {
          cbData = cbData.Data && cbData.Data.result ? cbData.Data.result : ''
          data = {msg: 'Success', info: cbData}
        } else {
          data = {msg: 'Error', error: cbData.Tip}
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