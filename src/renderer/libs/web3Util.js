import web3 from '@/assets/js/web3'
// const Tx = require("ethereumjs-tx")
import Tx from 'ethereumjs-tx'

let eNodeInit

let web3Utils = {
  againTmie: 500,
  async getEnode () {
    return new Promise((resolve) => {
      try {
        web3.dcrm.getEnode().then(res => {
          let cbData = res
          cbData = JSON.parse(cbData)
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
          cbData = JSON.parse(cbData)
          console.log(cbData)
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
          console.log(err)
          data = 0
          resolve(data)
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
          console.log(err)
          data = 0
          resolve(data)
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
  async getGroupPerson () {
    let data = {msg: '', info: ''}
    return new Promise((resolve, reject) => {
      try {
        // console.log(eNodeInit)
        if (eNodeInit) {
          let cbData = ''
          web3.dcrm.getSDKGroupPerson(eNodeInit).then(res => {
            cbData = JSON.parse(res)
            if (cbData.Status !== 'Error') {
              data = {msg: 'Success', info: cbData.Data.GroupList[0]}
              resolve(data)
            } else {
              data = {msg: 'Error', error: cbData.Tip}
              reject(data)
            }
          }).catch(err => {
            console.log(err)
            data = {msg: 'Error', error: cbData.Tip}
            reject(data)
          })
        } else {
          setTimeout(() => {
            this.getGroupPerson()
          }, this.againTmie)
        }
      } catch (error) {
        console.log(error)
        data = {msg: 'Error', error: error.toString()}
        reject(data)
      }
    })
  },
  async getAccounts (gID, mode) {
    let data = {msg: '', info: ''}
    return new Promise((resolve, reject) => {
      try {
        let cbData = ''
        web3.dcrm.getAccounts(gID, mode).then(res => {
          cbData = res
          if (cbData.Status !== 'Error') {
            data = {msg: 'Success', info: cbData.Data.result.Group}
          } else {
            data = {msg: 'Success', info: []}
          }
          resolve(data)
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
  async getAccountsBalance (pubk) {
    let data = {msg: '', info: ''}
    return new Promise((resolve, reject) => {
      try {
        let cbData = ''
        web3.dcrm.getAccountsBalance(pubk).then(res => {
          // cbData = JSON.parse(res)
          cbData = res
          // console.log(cbData)
          if (cbData.Status !== 'Error') {
            data = {msg: 'Success', info: cbData.Data.result.Balances}
          } else {
            data = {msg: 'Success', info: []}
          }
          resolve(data)
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
  async getGroup () {
    let data = {msg: '', info: ''}
    return new Promise((resolve, reject) => {
      try {
        if (eNodeInit) {
          let cbData = ''
          web3.dcrm.getSDKGroup(eNodeInit).then(res => {
            cbData = JSON.parse(res)
            // console.log(cbData)
            if (cbData.Status !== 'Error') {
              data = {msg: 'Success', info: cbData.Data.GroupList}
              // resolve(data)
            } else {
              data = {msg: 'Success', info: []}
              // reject(data)
            }
            resolve(data)
          }).catch(err => {
            console.log(err)
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
          cbData = res && JSON.parse(res) ? JSON.parse(res) : ''
          // console.log(cbData)
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
          cbData = JSON.parse(res)
          // console.log(cbData)
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
  async reqAccount (signTx, mode) {
    let data = {msg: '', info: ''}
    return new Promise((resolve, reject) => {
      try {
        let cbData = ''
        web3.dcrm.reqDcrmAddr(signTx, mode).then(res => {
          cbData = res
          if (cbData.Status !== 'Error') {
            // let obj = JSON.parse(cbData.Data.result)
            // console.log(obj)
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
  async reqAccountList () {
    let data = {msg: '', info: ''}
    return new Promise((resolve, reject) => {
      try {
        let cbData = ''
        web3.dcrm.getCurNodeReqAddrInfo().then(res => {
          cbData = res
          if (cbData.Status !== 'Error') {
            let arr = cbData.Data ? cbData.Data : []
            // console.log(arr)
            let list = []
            for (let obj in arr) {
              list.push(JSON.parse(arr[obj]))
              // console.log(arr[obj])
            }
            data = {msg: 'Success', info: list}
          } else {
            data = {msg: 'Error', info: []}
          }
          resolve(data)
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
          console.log(res)
          cbData = res
          if (cbData.Status !== 'Error') {
            console.log(cbData.Data.result)
            console.log(JSON.parse(cbData.Data.result))
            let status = cbData.Data && cbData.Data.result ? JSON.parse(cbData.Data.result) : 'Failure'
            console.log(status)
            status = status.Status
            data = {msg: 'Success', info: status}
          } else {
            data = {msg: 'Error', info: 'Failure'}
          }
          resolve(data)
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
  async getTxnsList () {
    let data = {msg: '', info: ''}
    return new Promise((resolve, reject) => {
      try {
        if (eNodeInit) {
          let arr = [], cbData = ''
          web3.dcrm.getCurNodeLockOutInfo(eNodeInit).then(res => {
            cbData = res
            if (cbData.Status !== 'Error') {
              cbData = cbData.Data
              for (let obj in cbData) {
                let obj1 = cbData[obj]
                obj1 = JSON.parse(obj1)
                arr.push(obj1)
              }
            }
            data = {msg: 'Success', info: arr}
            resolve(data)
          }).catch(err => {
            console.log(err)
            data = {msg: 'Error', error: err.toString()}
            reject(data)
          })
        } else {
          setTimeout(() => {
            this.getTxnsList()
          }, this.againTmie)
        }
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
          console.log(res)
          cbData = res
          if (cbData.Status !== 'Error') {
            // console.log(JSON.parse(cbData.Data.result))
            let status = cbData.Data && cbData.Data.result ? JSON.parse(cbData.Data.result) : 'Failure'
            console.log(status)
            // status = status.Status
            data = {msg: 'Success', status: status.Status, info: status}
          } else {
            data = {msg: 'Error', info: 'Failure'}
          }
          resolve(data)
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
  sendTxnsValid (signTx) {
    let data = {msg: '', info: ''}
    return new Promise((resolve, reject) => {
      try {
        let cbData = ''
        web3.dcrm.acceptLockOut(signTx).then(res => {
          cbData = res
          if (cbData.Status !== 'Error') {
            cbData = cbData.Data && cbData.Data.result ? JSON.parse(cbData.Data.result) : ''
            data = {msg: 'Success', info: cbData}
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