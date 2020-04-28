import web3 from '@/assets/js/web3/index.js'
export default {
  async createGroup(mode, nodeArr) {
    let data = {msg: '', info: ''}
    return new Promise(resolve => {
      let cbData = ''
      web3.dcrm.createSDKGroup(mode, nodeArr).then(res => {
        cbData = res
        if (res && typeof res === 'string') {
          cbData = JSON.parse(cbData)
        }
        if (cbData.Status !== 'Error') {
          data = {msg: 'Success', info: cbData.Data}
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
  async getSDKGroup (enode) {
    let data = {msg: '', info: ''}
    return new Promise(resolve => {
      web3.dcrm.getSDKGroup(enode).then(res => {
        cbData = res
        if (typeof res === 'string') {
          cbData = JSON.parse(cbData)
        }
        if (cbData.Status !== 'Error') {
          data = {msg: 'Success', info: cbData.Data.GroupList}
        } else {
          data = {msg: 'Error', info: [], error: cbData.Tip}
        }
        resolve(data)
      }).catch(err => {
        console.log(err)
        data = {msg: 'Error', info: [], error: err.toString()}
        resolve(data)
      })
    })
  },
  async getGroupObj (gID) {
    let data = {msg: '', info: ''}
    return new Promise(resolve => {
      let cbData = ''
      web3.dcrm.getGroupByID(gID).then(res => {
        cbData = res
        if (res && typeof res === 'string') {
          cbData = JSON.parse(cbData)
        }
        if (cbData.Status !== 'Error') {
          data = {msg: 'Success', info: cbData.Data.Enodes, mode: cbData.Data.Mode}
        } else {
          data = {msg: 'Error', error: cbData.Tip}
        }
        resolve(data)
      }).catch(err => {
        data = {msg: 'Error', error: err.toString()}
        resolve(data)
      })
    })
  },
}