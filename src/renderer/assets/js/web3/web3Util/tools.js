import web3 from '@/assets/js/web3/index.js'
import Tx from 'ethereumjs-tx'
const Account = require('eth-lib/lib/account')
const ethUtil = require('ethereumjs-util')
const ethers = require('ethers')
const secp256k1 = require('secp256k1')
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
  testSign (str, pwd) {
    // console.log(ethers)
    // let signingKey = new ethers.utils.SigningKey(pwd)
    // let message = str;
    // let messageBytes = ethers.utils.toUtf8Bytes(message);
    // let messageDigest = ethers.utils.keccak256(messageBytes);
    // let signature = signingKey.signDigest(messageDigest)
    str = ethUtil.rlphash(str)
    pwd = ethUtil.rlphash(pwd)
    let wallet = new ethers.Wallet(pwd)
    wallet.signMessage(str).then(res => {
      console.log(res)
    })
    // let flatSig = wallet.signMessage(str)
    // console.log(wallet.signMessage(str))
    // str = ethUtil.rlphash(str)
    // pwd = ethUtil.rlphash(pwd)
    // let sig = secp256k1.sign(str, pwd)
    // var recovery = sig.recovery;
    // let chainId =''
    // var ret = {
    //     r: sig.signature.slice(0, 32),
    //     s: sig.signature.slice(32, 64),
    //     v: chainId ? recovery + (chainId * 2 + 35) : recovery + 27,
    // }
    // console.log(sig)
    // console.log(ret)
  },
  hexToSign (str, pwd) {
    let hex = web3.utils.keccak256(str)
    pwd = new Buffer(pwd.replace('0x', ''), 'hex')
    hex = new Buffer(hex.replace('0x', ''), 'hex')
    // console.log(str)
    // console.log(pwd)
    // let hex = web3.utils.keccak256(str)
    // // let sign = web3.eth.accounts.sign(str, pwd)
    // // let sign = Account.sign(hex, pwd)
    // hex = ethUtil.rlphash(hex)
    // pwd = ethUtil.rlphash(pwd)
    // console.log(hex)
    let sign = ethUtil.ecsign(hex, pwd)
    let sig = ethUtil.toRpcSig(sign.v, sign.r, sign.s).toString('hex')
    console.log(sig)
    // console.log({
    //   r: ethUtil.bufferToInt(sign.r),
    //   s: ethUtil.bufferToInt(sign.s),
    //   v: ethUtil.bufferToInt(sign.v),
    // })
    return sig
    // return new Promise(resolve => {
    //   hex = ethUtil.rlphash(hex)
    //   pwd = ethUtil.rlphash(pwd)
    //   let wallet = new ethers.Wallet(pwd)
    //   wallet.signMessage(hex).then(res => {
    //     console.log(res)
    //     resolve(res)
    //   })
    // })

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