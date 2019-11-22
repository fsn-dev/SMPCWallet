import web3 from '@/assets/js/web3'
// const Tx = require("ethereumjs-tx")
import Tx from 'ethereumjs-tx'

let getEnode = () => {
  try {
    let data = web3.dcrm.getEnode()
    data = JSON.parse(data)
    console.log(data)
    if (data.Status === "Success") {
      return data.Data.Enode
    } else {
      console.log(data.Error)
      setTimeout(() => {
        getEnode()
      }, 1000 * 3)
      // return data.Error
    }
  } catch (error) {
    console.log(error)
    setTimeout(() => {
      getEnode()
    }, 1000 * 3)
    // return error
  }
}
let eNode = getEnode()

export default {
  eNode: eNode,
  getEnodeState (eNode) {
    try {
      let data = web3.dcrm.getEnodeStatus(eNode)
      data = JSON.parse(data)
      console.log(data)
      if (data.Status === 'Success') {
        return 'OnLine'
      } else {
        return 'OffLine'
      }
    } catch (error) {
      console.log(error)
      return 'OffLine'
    }
  },
  getNonce (addr, coinType, dcrmAddr) {
    try {
      let nonce = web3.dcrm.getNonce(addr, coinType, dcrmAddr)
      console.log(nonce)
      if (nonce.Status !== 'Error') {
        nonce = nonce.Data.result
      } else {
        nonce = 0
      }
      return nonce
    } catch (error) {
      console.log(error)
      return 0
    }
  },

  async getBalance (addr, coinObj) {
    let data = {msg: '', info: ''}
    return new Promise((resolve, reject) => {
      let batch = web3.createBatch()
      for (let obj in coinObj) {
        batch.add(web3.dcrm.getBalance.request(addr, obj, coinObj[obj]))
      }
      batch.requestManager.sendBatch(batch.requests, (err, res) => {
        if (err) {
          data = {msg: 'Error', error: err}
          reject(data)
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
          resolve(data)
        }
      })
    })
  },
  async getPendingGroup () {
    // let eNode = this.getEnode()
    let data = {msg: '', info: ''}
    return new Promise((resolve, reject) => {
      try {
        let arr = []
        let status = web3.dcrm.getGroupNodeStatus(eNode)
        status = JSON.parse(status)
        if (status.Status !== 'Error') {
          arr = status.Data.GroupList && status.Data.GroupList.length > 0 ? status.Data.GroupList : []
        }
        console.log(status)
        data = {msg: 'Success', info: arr}
        resolve(data)
      } catch (error) {
        data = {msg: 'Error', error: error}
        reject(data)
      }
    })
  },
  async getGroupPerson () {
    // let eNode = this.getEnode()
    let data = {msg: '', info: ''}
    return new Promise((resolve, reject) => {
      try {
        let gArr = web3.dcrm.getSDKGroupPerson(eNode)
        gArr = JSON.parse(gArr)
        console.log(gArr)
        if (gArr.Status !== 'Error') {
          data = {msg: 'Success', info: gArr.Data.GroupList[0]}
          resolve(data)
        } else {
          data = {msg: 'Error', error: gArr.Tip}
          reject(data)
        }
      } catch (error) {
        console.log(error)
        data = {msg: 'Error', error: error}
        reject(data)
      }
    })
  },
  async getGroup () {
    // let eNode = this.getEnode()
    let data = {msg: '', info: ''}
    return new Promise((resolve, reject) => {
      try {
        let gArr = web3.dcrm.getSDKGroup(eNode)
        gArr = JSON.parse(gArr)
        console.log(gArr)
        if (gArr.Status !== 'Error') {
          data = {msg: 'Success', info: gArr.Data.GroupList}
          resolve(data)
        } else {
          data = {msg: 'Error', error: gArr.Tip}
          reject(data)
        }
      } catch (error) {
        console.log(error)
        data = {msg: 'Error', error: error}
        reject(data)
      }
    })
  },
  async getGroupObj (gID) {
    let data = {msg: '', info: ''}
    return new Promise((resolve, reject) => {
      try {
        let obj = {}
        // let gArr = this.getGroup()
        let gArr = []
        this.getGroup().then(res => {
          gArr = res.info
          for (let obj1 of gArr) {
            if (gID === obj1.Gid) {
              obj = obj1
              break
            }
          }
          data = {msg: 'Success', info: obj}
          resolve(data)
        }).catch(err => {
          data = err
          reject(data)
        })
      } catch (error) {
        console.log(error)
        data = {msg: 'Error', error: error}
        reject(data)
      }
    })
  },
  async createGroup(name, mode, nodeArr) {
    let data = {msg: '', info: ''}
    return new Promise((resolve, reject) => {
      try {
        let gInfo = web3.dcrm.createSDKGroup(name, mode, nodeArr)
        gInfo = gInfo && JSON.parse(gInfo) ? JSON.parse(gInfo) : ''
        console.log(gInfo)
        if (gInfo.Status !== 'Error') {
          data = {msg: 'Success', info: gInfo.data}
          resolve(data)
        } else {
          data = {msg: 'Error', error: gInfo.Tip}
          reject(data)
        }
      } catch (error) {
        console.log(error)
        data = {msg: 'Error', error: error}
        reject(data)
      }
    })
  },
  async validGroup (name, eNode, type) {
    let data = {msg: '', info: ''}
    return new Promise((resolve, reject) => {
      try {
        let cbData = web3.dcrm.setGroupNodeStatus(name, eNode, type)
        cbData = JSON.parse(cbData)
        console.log(cbData)
        if (cbData.Status !== 'Error') {
          data = {msg: 'Success', info: cbData.Data}
          resolve(data)
        } else {
          data = {msg: 'Error', error: cbData.Tip}
          reject(data)
        }
      } catch (error) {
        console.log(error)
        data = {msg: 'Error', error: error}
        reject(data)
      }
    })
  },
  async getAccount (signTx, mode) {
    let data = {msg: '', info: ''}
    return new Promise((resolve, reject) => {
      try {
        let account = web3.dcrm.reqDcrmAddr(signTx, mode)
        if (account.Status !== 'Error') {
          let obj = JSON.parse(account.Data.result)
          console.log(obj)
          data = {msg: 'Success', info: obj}
          resolve(data)
        } else {
          data = {msg: 'Error', error: cbData.Tip}
          reject(data)
        }
      } catch (error) {
        console.log(error)
        data = {msg: 'Error', error: error.toString()}
        reject(data)
      }
    })
  },
  async getTxnsList () {
    // let eNode = this.getEnode()
    let data = {msg: '', info: ''}
    return new Promise((resolve, reject) => {
      try {
        let arr = []
        let list = web3.dcrm.getCurNodeLockOutInfo(eNode)
        if (list.Status !== 'Error') {
          list = list.Data
          // console.log(list)
          for (let obj in list) {
            let obj1 = list[obj]
            obj1 = JSON.parse(obj1)
            // console.log(obj1)
            // console.log(JSON.parse(obj1))
            arr.push(obj1)
          }
          data = {msg: 'Success', info: arr}
          resolve(data)
        }
      } catch (error) {
        console.log(error)
        data = {msg: 'Error', error: error}
        reject(data)
      }
    })
  },
  sendTxnsValid (signTx) {
    let data = {msg: '', info: ''}
    try {
      let cb = web3.dcrm.acceptLockOut(signTx)
      console.log(cb)
      data = {msg: 'Success', info: cb}
    } catch (error) {
      data = {msg: 'Error', error: error}
    }
    return data
  },
  toSign (data, pwd) {
    pwd = pwd.indexOf("0x") === 0 ? pwd.substr(2) : pwd
    pwd = new Buffer(pwd, "hex")
    // console.log(data)
    let rawTx = {
      nonce: data.nonce ? Number(data.nonce) : 0,
      gasPrice: data.gasPrice ? Number(data.gasPrice) : 0,
      gasLimit: data.gasLimit ? Number(data.gasLimit) : 0,
      from: data.from,
      to: data.to,
      value: Number(data.value),
      data: data.data ? data.data : ''
    }
    return new Promise((resolve, reject) => {
      let tx = new Tx(rawTx)
      tx.sign(pwd)
      let signTx = tx.serialize().toString("hex")
      signTx = signTx.indexOf("0x") === 0 ? signTx : ("0x" + signTx)
      rawTx.signTx = signTx
      resolve(rawTx)
    })
  }
}