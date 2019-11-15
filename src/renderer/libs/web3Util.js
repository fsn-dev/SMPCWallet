import web3 from '@/assets/js/web3'
// const Tx = require("ethereumjs-tx")
import Tx from 'ethereumjs-tx'
export default {
  getEnode () {
    let eNode = web3.dcrm.getEnode()
    return JSON.parse(eNode).Enode
  },
  getGroup () {
    let gArr = web3.dcrm.getSDKGroup(this.getEnode(), 'ALL')
    gArr = gArr && JSON.parse(gArr).Group ? JSON.parse(gArr).Group : []
    // console.log(gArr)
    return gArr
  },
  getGroupObj (gID) {
    let obj = {}
    let gArr = this.getGroup()
    // console.log(gArr)
    for (let obj1 of gArr) {
      if (gID === obj1.Gid) {
        obj = obj1
        break
      }
    }
    return obj
  },
  createGroup(name, mode, nodeArr) {
    let gInfo = web3.dcrm.createSDKGroup(name, mode, nodeArr)
    // console.log(gInfo)
    gInfo = gInfo && JSON.parse(gInfo) ? JSON.parse(gInfo) : ''
    return gInfo
  },
  getNonce (addr, coin) {
    let nonce = web3.dcrm.getNonce(addr, coin)
    return nonce
  },
  getBaseInfo (data) {
    return new Promise((resolve, reject) => {
      let batch = web3.createBatch()
      batch.add(web3.eth.getGasPrice.request())
      batch.add(web3.eth.estimateGas.request({to: data.to}))
      batch.add(web3.eth.getTransactionCount.request(data.from, 'pending'))
      batch.requestManager.sendBatch(batch.requests, (err, res) => {
        if (err) {
          reject(err.toString())
        } else {
          if (res[0].result || Number(res[0].result) === 0) {
            data.gasPrice = parseInt(res[0].result)
          } else {
            reject(res)
          }
          if (res[1].result || Number(res[1].result) === 0) {
            data.gasLimit = parseInt(res[1].result)
          } else {
            data.gasLimit = 800000
          }
          if (res[2].result || Number(res[2].result) === 0) {
            data.nonce = parseInt(res[2].result)
          } else {
            reject(res)
          }
          resolve(data)
        }
      })
    })
  },
  toSign (data, pwd, type) {
    pwd = pwd.indexOf("0x") === 0 ? pwd.substr(2) : pwd
    pwd = new Buffer(pwd, "hex")
    let rawTx = {
      nonce: data.nonce ? Number(data.nonce) : 0,
      gasPrice: data.gasPrice ? Number(data.gasPrice) : 0,
      gasLimit: data.gasLimit ? Number(data.gasLimit) : 0,
      from: data.from,
      to: data.to,
      value: Number(data.value),
      data: data.data ? data.data : ''
    }
    if (type) {
      return new Promise((resolve, reject) => {
        let tx = new Tx(rawTx)
        tx.sign(pwd)
        let signTx = tx.serialize().toString("hex")
        signTx = signTx.indexOf("0x") === 0 ? signTx : ("0x" + signTx)
        rawTx.signTx = signTx
        resolve(rawTx)
      })
    } else {
      return new Promise((resolve, reject) => {
        this.getBaseInfo(rawTx)
          .then(res => {
            rawTx.nonce = res.nonce
            rawTx.gasPrice = res.gasPrice
            rawTx.gasLimit = res.gasLimit
            let tx = new Tx(rawTx)
            tx.sign(pwd)
            let signTx = tx.serialize().toString("hex")
            signTx = signTx.indexOf("0x") === 0 ? signTx : ("0x" + signTx)
            rawTx.signTx = signTx
            resolve(rawTx)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  },
  sendTxns (signTx) {
    return new Promise((resolve, reject) => {
      web3.eth.sendRawTransaction(signTx, (err, hash) => {
        if (err) {
          reject(err)
        } else {
          resolve(hash)
        }
      })
    })
  }
}