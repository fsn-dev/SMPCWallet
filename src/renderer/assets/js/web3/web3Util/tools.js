import web3 from '@/assets/js/web3/index.js'
import Tx from 'ethereumjs-tx'
// const Account = require('eth-lib/lib/account')
// const ethUtil = require('ethereumjs-util')
const ethers = require('ethers')
// const secp256k1 = require('secp256k1')
// const EdDSA = require('elliptic')
export default {
  toSign (data, pwd) {
    pwd = pwd.indexOf("0x") === 0 ? pwd.substr(2) : pwd
    pwd = new Buffer(pwd, "hex")
    // console.log(data)
    let rawTx = {
      // gasPrice: data.gasPrice ? Number(data.gasPrice) : config.rawTx.gasPrice,
      // gasLimit: data.gasLimit ? Number(data.gasLimit) : config.rawTx.gasLimit,
      // to: data.to ? data.to : config.rawTx.to,
      // from: data.from,
      value: data.value ? Number(data.value) : 0,
      nonce: data.nonce ? Number(data.nonce) : 0,
      data: data.data ? data.data : ''
    }
    return new Promise(resolve => {
      let tx = new Tx(rawTx)
      tx.sign(pwd)
      let signTx = tx.serialize().toString("hex")
      signTx = signTx.indexOf("0x") === 0 ? signTx : ("0x" + signTx)
      rawTx.signTx = signTx
      resolve(rawTx)
    })
  },
  hexToSign (str, pwd) {
    // let hex = web3.utils.keccak256(str)
    let signingKey = new ethers.SigningKey(pwd)
    let message = str
    let messageBytes = ethers.utils.toUtf8Bytes(message)
    let messageDigest = ethers.utils.keccak256(messageBytes)
    let signature = signingKey.signDigest(messageDigest)
    let v = signature.s
    if (signature.recoveryParam === 0) {
      v = '00'
    } else if (signature.recoveryParam === 1) {
      v = '01'
    }
    let sign = signature.r + signature.s.replace('0x', '') + v
    return sign
  },
  batchRequest (reqArr) {
    let data = {msg: '', info: ''}
    return new Promise((resolve, reject) => {
      try {
        const batch = new web3.BatchRequest()
        let arr = []
        for (let i = 0, len  = reqArr.length; i < len; i++) {
          batch.add(web3[reqArr[i].p1][reqArr[i].p2].request(...reqArr[i].p3, (err, res) => {
            if (err) {
              arr.push(err)
            } else {
              arr.push(res)
            }
            if ((i + 1) === reqArr.length) {
              resolve(arr)
            }
          }))
        }
        batch.execute()
      } catch (error) {
        data = {msg: 'Error', error: error.toString()}
        reject(data)
      }
    })
  }
}