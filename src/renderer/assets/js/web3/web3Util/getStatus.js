import web3 from '@/assets/js/web3/index.js'
export default {
  async getEnodeState (eNode) {
    let data = ''
    return new Promise(resolve => {
      web3.dcrm.getEnodeStatus(eNode).then(res => {
        let cbData = res
        if (typeof res === 'string') {
          cbData = JSON.parse(cbData)
        }
        if (cbData.Status === 'Success' && cbData.Data.Status === 'OnLine') {
          data = 1
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
  async getReqAddrStatus (key) {
    let data = {msg: '', info: ''}
    return new Promise(resolve => {
      let cbData = ''
      web3.dcrm.getReqAddrStatus(key).then(res => {
        cbData = res
        if (res && typeof res === 'string') {
          cbData = JSON.parse(cbData)
        }
        if (cbData.Status !== 'Error') {
          let result = cbData.Data && cbData.Data.result ? JSON.parse(cbData.Data.result) : ''
          let status = result ? result.Status : ''
          let hash = result && result.PubKey ? result.PubKey : ''
          let list = result && result.AllReply ? result.AllReply : []
          data = {msg: 'Success', status: status, hash: hash, info: list,timestamp: result.TimeStamp}
        } else {
          data = {msg: 'Error', status: 'Failure', hash: '', error: cbData.Error, info: []}
        }
        resolve(data)
      }).catch(err => {
        console.log(err)
        data = {msg: 'Error', status: '', hash: '', error: err.toString(), info: []}
        resolve(data)
      })
    })
  },
  async getLockOutStatus (key) {
    let data = {msg: '', info: ''}
    return new Promise(resolve => {
      let cbData = ''
      web3.dcrm.getLockOutStatus(key).then(res => {
        cbData = res
        if (res && typeof res === 'string') {
          cbData = JSON.parse(cbData)
        }
        if (cbData.Status !== 'Error') {
          let status = cbData.Data && cbData.Data.result ? JSON.parse(cbData.Data.result) : ''
          data = {msg: 'Success', status: status.Status, info: status.AllReply, hash: status.OutTxHash, timestamp: status.TimeStamp}
        } else {
          data = {msg: 'Error', status: 'Failure', hash: '', error: cbData.Error, info: []}
        }
        resolve(data)
      }).catch(err => {
        console.log(err)
        data = {msg: 'Error', status: '', hash: '', error: err.toString(), info: []}
        resolve(data)
      })
    })
  },
}