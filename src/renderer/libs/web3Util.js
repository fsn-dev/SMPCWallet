import web3 from '@/assets/js/web3'
import Tx from 'ethereumjs-tx'
import config from '@/assets/js/config/base.js'
import db from '@/db/index.js'
let eNodeInit

let connectNum = 0
function breakAgaing () {
  connectNum ++
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (connectNum < 5) {
        db.findBaseInfo({key: 'serverRPC'}).then(res => {
          let url = config.serverRPC
          if (res.length > 0) {
            url = res[0].value
          }
          resolve(1)
        }).catch(err => {
          console.log(err)
          resolve(1)
        })
      } else {
        reject(0)
      }
    }, 1000)
  })
}

let web3Utils = {
  againTmie: 500,
  async getEnode () {
    return new Promise((resolve) => {
      try {
        web3.dcrm.getEnode().then(res => {
          let cbData = res
          if (typeof res === 'string') {
            cbData = JSON.parse(cbData)
          }
          // console.log(cbData)
          if (cbData.Status === "Success") {
            eNodeInit = cbData.Data.Enode
            resolve(eNodeInit)
          } else {
            eNodeInit = ''
            setTimeout(() => {
              this.getEnode()
            }, 1000 * 3)
          }
          // console.log(eNodeInit)
        }).catch(err => {
          console.log(err)
          setTimeout(() => {
            this.getEnode()
          }, 1000 * 3)
        })
      } catch (error) {
        console.log(error)
        eNodeInit = ''
        setTimeout(() => {
          this.getEnode()
        }, 1000 * 3)
        // return error
      }
    })
  },
  async getEnodeState (eNode) {
    let data = ''
    return new Promise((resolve) => {
      try {
        web3.dcrm.getEnodeStatus(eNode).then(res => {
          let cbData = res
          if (typeof res === 'string') {
            cbData = JSON.parse(cbData)
          }
          if (cbData.Status === 'Success' && cbData.Data.Status === 'OnLine') {
            data = 'OnLine'
          } else {
            data = 'OffLine'
          }
          resolve(data)
        }).catch(err => {
          console.log(err)
          data = 'OffLine'
          resolve(data)
        })
      } catch (error) {
        console.log(error)
        data = 'OffLine'
        resolve(data)
      }
    })
  },
  async getLockOutNonce (addr, coinType, dcrmAddr) {
    let data = 0
    return new Promise((resolve, reject) => {
      try {
        web3.dcrm.getLockOutNonce(addr, coinType, dcrmAddr).then(res => {
          let cbData = res
          if (cbData.Status !== 'Error') {
            data = cbData.Data.result
          } else {
            data = 0
          }
          resolve(data)
        }).catch(err => {
          // console.log(err)
          // data = 0
          // resolve(data)
          breakAgaing().then(res => {
            this.getLockOutNonce(addr, coinType, dcrmAddr).then(res => {
              resolve(res)
            })
          }).catch(e => {
            console.log(err)
            data = 0
            resolve(data)
          })
        })
      } catch (error) {
        console.log(error)
        data = 0
        resolve(data)
      }
    })
  },
  async getReqNonce (addr) {
    let data = 0
    return new Promise((resolve, reject) => {
      try {
        web3.dcrm.getReqAddrNonce(addr).then(res => {
          let cbData = res
          if (cbData.Status !== 'Error') {
            data = cbData.Data.result
          } else {
            data = 0
          }
          resolve(data)
        }).catch(err => {
          // console.log(err)
          // data = 0
          // resolve(data)
          breakAgaing().then(res => {
            this.getReqNonce(addr).then(res => {
              resolve(res)
            })
          }).catch(e => {
            console.log(err)
            data = 0
            resolve(data)
          })
        })
      } catch (error) {
        console.log(error)
        data = 0
        resolve(data)
      }
    })
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
          data = {msg: 'Error', error: err.toString()}
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
  async getAccounts (address, mode) {
    let data = {msg: '', info: ''}
    return new Promise((resolve, reject) => {
      try {
        let cbData = ''
        web3.dcrm.getAccounts(address, mode).then(res => {
          cbData = res
          // console.log(cbData)
          if (cbData.Status !== 'Error') {
            data = {msg: 'Success', info: cbData.Data.result && cbData.Data.result.Group ? cbData.Data.result.Group : []}
          } else {
            data = {msg: 'Success', info: []}
          }
          resolve(data)
        }).catch(err => {
          breakAgaing().then(res => {
            this.getAccounts(address, mode).then(res => {
              resolve(res)
            })
          }).catch(e => {
            console.log(err)
            data = {msg: 'Error', error: err.toString()}
            reject(data)
          })
        })
      } catch (error) {
        console.log(error)
        data = {msg: 'Error', error: error.toString()}
        reject(data)
      }
    })
  },
  async getAccountsBalance (pubk, address) {
    let data = {msg: '', info: ''}
    return new Promise((resolve, reject) => {
      try {
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
          breakAgaing().then(res => {
            this.getAccountsBalance(pubk, address).then(res => {
              resolve(res)
            })
          }).catch(e => {
            console.log(err)
            data = {msg: 'Error', error: err.toString()}
            reject(data)
          })
        })
      } catch (error) {
        console.log(error)
        data = {msg: 'Error', error: error.toString()}
        reject(data)
      }
    })
  },
  async getGroup () {
    let data = {msg: '', info: ''}
    return new Promise((resolve, reject) => {
      try {
        if (eNodeInit) {
          let cbData = ''
          web3.dcrm.getSDKGroup(eNodeInit).then(res => {
            cbData = res
            if (typeof res === 'string') {
              cbData = JSON.parse(cbData)
            }
            if (cbData.Status !== 'Error') {
              data = {msg: 'Success', info: cbData.Data.GroupList}
              // resolve(data)
            } else {
              data = {msg: 'Success', info: []}
              // reject(data)
            }
            // console.log(data)
            resolve(data)
          }).catch(err => {
            console.log(err)
            breakAgaing().then(res => {
              this.getGroup().then(res => {
                resolve(res)
              })
            }).catch(e => {
              console.log(err)
              data = {msg: 'Error', error: err.toString()}
              reject(data)
            })
          })
        } else {
          setTimeout(() => {
            this.getGroup()
          }, this.againTmie)
        }
      } catch (error) {
        console.log(error)
        data = {msg: 'Error', error: error.toString()}
        reject(data)
      }
    })
  },
  async getGroupObj (gID) {
    let data = {msg: '', info: ''}
    return new Promise((resolve, reject) => {
      try {
        let cbData = ''
        web3.dcrm.getGroupByID(gID).then(res => {
          cbData = res
          if (res && typeof res === 'string') {
            cbData = JSON.parse(cbData)
          }
          if (cbData.Status !== 'Error') {
            data = {msg: 'Success', info: cbData.Data.Enodes, mode: cbData.Data.Mode}
            resolve(data)
          } else {
            data = {msg: 'Error', error: cbData.Tip}
            reject(data)
          }
        }).catch(err => {
          data = {msg: 'Error', error: err.toString()}
          reject(data)
        })
      } catch (error) {
        console.log(error)
        data = {msg: 'Error', error: error.toString()}
        reject(data)
      }
    })
  },
  async createGroup(mode, nodeArr) {
    let data = {msg: '', info: ''}
    return new Promise((resolve, reject) => {
      try {
        let cbData = ''
        web3.dcrm.createSDKGroup(mode, nodeArr).then(res => {
          cbData = res
          if (res && typeof res === 'string') {
            cbData = JSON.parse(cbData)
          }
          if (cbData.Status !== 'Error') {
            data = {msg: 'Success', info: cbData.Data}
            resolve(data)
          } else {
            data = {msg: 'Error', error: cbData.Tip}
            reject(data)
          }
        }).catch(err => {
          console.log(err)
          data = {msg: 'Error', error: err.toString()}
          reject(data)
        })
      } catch (error) {
        console.log(error)
        data = {msg: 'Error', error: error.toString()}
        reject(data)
      }
    })
  },
  async validGroup (name, eNode, type) {
    let data = {msg: '', info: ''}
    return new Promise((resolve, reject) => {
      try {
        let cbData = ''
        web3.dcrm.setGroupNodeStatus(name, eNode, type).then(res => {
          cbData = res
          if (res && typeof res === 'string') {
            cbData = JSON.parse(cbData)
          }
          if (cbData.Status !== 'Error') {
            data = {msg: 'Success', info: cbData.Data}
            resolve(data)
          } else {
            data = {msg: 'Error', error: cbData.Tip}
            reject(data)
          }
        }).catch(err => {
          console.log(err)
          data = {msg: 'Error', error: err.toString()}
          reject(data)
        })
      } catch (error) {
        console.log(error)
        data = {msg: 'Error', error: error.toString()}
        reject(data)
      }
    })
  },
  async reqAccount (signTx) {
    let data = {msg: '', info: ''}
    return new Promise((resolve, reject) => {
      try {
        let cbData = ''
        web3.dcrm.reqDcrmAddr(signTx).then(res => {
          cbData = res
          if (res && typeof res === 'string') {
            cbData = JSON.parse(cbData)
          }
          if (cbData.Status !== 'Error') {
            data = {msg: 'Success', info: cbData.Data.result}
            resolve(data)
          } else {
            data = {msg: 'Error', error: cbData.Tip}
            reject(data)
          }
        }).catch(err => {
          console.log(err)
          data = {msg: 'Error', error: err.toString()}
          reject(data)
        })
      } catch (error) {
        console.log(error)
        data = {msg: 'Error', error: error.toString()}
        reject(data)
      }
    })
  },
  async reqAccountStatus (key) {
    let data = {msg: '', info: ''}
    return new Promise((resolve, reject) => {
      try {
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
            data = {msg: 'Error', status: 'Failure', hash: '', info: []}
          }
          resolve(data)
        }).catch(err => {
          console.log(err)
          data = {msg: 'Error', error: err.toString(), info: []}
          reject(data)
        })
      } catch (error) {
        console.log(error)
        data = {msg: 'Error', error: error.toString()}
        reject(data)
      }
    })
  },
  async lockout (signTx) {
    let data = {msg: '', info: ''}
    return new Promise((resolve, reject) => {
      try {
        let cbData = ''
        web3.dcrm.lockOut(signTx).then(res => {
          cbData = res
          // console.log(cbData)
          if (cbData.Status !== 'Error') {
            cbData = cbData.Data && cbData.Data.result ? cbData.Data.result : ''
            data = {msg: 'Success', info: cbData}
            resolve(data)
          } else {
            data = {msg: 'Error', error: cbData.Error}
            reject(data)
          }
        }).catch(err => {
          console.log(err)
          data = {msg: 'Error', error: err.toString()}
          reject(data)
        })
      } catch (error) {
        data = {msg: 'Error', error: error.toString()}
        reject(data)
      }
    })
  },
  async getLockOutStatus (key) {
    let data = {msg: '', info: ''}
    return new Promise((resolve, reject) => {
      try {
        let cbData = ''
        web3.dcrm.getLockOutStatus(key).then(res => {
          cbData = res
          if (res && typeof res === 'string') {
            cbData = JSON.parse(cbData)
          }
          if (cbData.Status !== 'Error') {
            // console.log(JSON.parse(cbData.Data.result))
            let status = cbData.Data && cbData.Data.result ? JSON.parse(cbData.Data.result) : ''
            // console.log(status)
            // status = status.Status
            data = {msg: 'Success', status: status.Status, info: status.AllReply, hash: status.OutTxHash, timestamp: status.TimeStamp}
          } else {
            data = {msg: 'Error', status: 'Failure', info: []}
          }
          resolve(data)
        }).catch(err => {
          console.log(err)
          data = {msg: 'Error', error: err.toString(), info: []}
          reject(data)
        })
      } catch (error) {
        console.log(error)
        data = {msg: 'Error', error: error.toString()}
        reject(data)
      }
    })
  },
  sendTxnsValid (signTx) {
    let data = {msg: '', info: ''}
    return new Promise((resolve, reject) => {
      try {
        let cbData = ''
        web3.dcrm.acceptLockOut(signTx).then(res => {
          cbData = res
          if (res && typeof res === 'string') {
            cbData = JSON.parse(cbData)
          }
          if (cbData.Status !== 'Error') {
            cbData = cbData.Data && cbData.Data.result ? JSON.parse(cbData.Data.result) : ''
            data = {msg: 'Success', info: cbData}
            resolve(data)
          } else {
            data = {msg: 'Error', error: cbData.Tip}
            reject(data)
          }
        }).catch(err => {
          breakAgaing().then(res => {
            this.sendTxnsValid(signTx).then(res => {
              resolve(res)
            })
          }).catch(e => {
            console.log(err)
            data = {msg: 'Error', error: err.toString()}
            reject(data)
          })
        })
      } catch (error) {
        data = {msg: 'Error', error: error.toString()}
        reject(data)
      }
    })
  },
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
    return new Promise((resolve, reject) => {
      let tx = new Tx(rawTx)
      tx.sign(pwd)
      let signTx = tx.serialize().toString("hex")
      signTx = signTx.indexOf("0x") === 0 ? signTx : ("0x" + signTx)
      rawTx.signTx = signTx
      resolve(rawTx)
    })
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
// web3Utils.getEnode()
export default web3Utils