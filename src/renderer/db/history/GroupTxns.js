import db from '@/db/db.js'
const AddGroupTxns = (params) => {
  return new Promise((resolve, reject) => {
    let dateNow = Date.now()
    let query = {
      keyId: dateNow + params.key,
      key: params.key ? params.key : '',
      from: params.from ? params.from : '',
      to: params.to ? params.to : '',
      value: params.value ? params.value : 0,
      nonce: params.nonce ? params.nonce : 0,
      member: params.gArr ? params.gArr : [],
      gId: params.gId ? params.gId : '',
      txnId: params.txnId ? params.txnId : '',
      coinType: params.coinType ? params.coinType : 0,
      hash: params.hash ? params.hash : '',
      status: params.status ? params.status : 0,
      timestamp: dateNow,
      mode: params.mode ? params.mode : 0,
      pubKey: params.pubKey ? params.pubKey : '',
      data: params.data ? params.data : '',
    }
    let data = {
      msg: 'Error',
      info: ''
    }
    db.historyGroupTxns.insert(query, (err, res) => {
      if (err) {
        // console.log(err)
        data.error = err
        reject(data)
      } else {
        // console.log(res)
        data.msg = 'Success'
        data.info = res
        resolve(data)
      }
    })
  })
}

const EditGroupTxns = (params) => {
  return new Promise((resolve, reject) => {
    let query = {}, updateParams = {}
    let data = {
      msg: 'Error',
      info: ''
    }
    if (params) {
      if (params.id || params.id === 0) {
        query._id = params.id
      }

      if (params.status || params.status === 0) {
        updateParams['status'] = params.status
      }
      if (params.hash || params.hash === 0) {
        updateParams['hash'] = params.hash
      }
    }
    db.historyGroupTxns.update(query, {$set: updateParams}, {}, (err, res) => {
      if (err) {
        // console.log(err)
        data.error = err
        reject(data)
      } else {
        // console.log(res)
        data.msg = 'Success'
        data.info = res
        resolve(data)
      }
    })
  })
}

const EditGroupMemberTxns = (params) => {
  return new Promise((resolve, reject) => {
    let dateNow = Date.now()
    let query = {key: params.local.key}
    let updateParams = {
      keyId: dateNow + params.local.key,
      key: params.local.key ? params.local.key : '',
      from: params.local.from ? params.local.from : '',
      to: params.local.to ? params.local.to : '',
      value: params.local.value ? params.local.value : 0,
      nonce: params.local.nonce ? params.local.nonce : 0,
      member: params.local.gArr ? params.local.gArr : [],
      gId: params.local.gId ? params.local.gId : '',
      txnId: params.local.txnId ? params.local.txnId : '',
      coinType: params.local.coinType ? params.local.coinType : 0,
      hash: params.local.hash ? params.local.hash : '',
      status: params.local.status ? params.local.status : 0,
      timestamp: dateNow,
      pubKey: params.local.pubKey ? params.local.pubKey : '',
      mode: params.local.mode ? params.local.mode : '',
      data: params.local.data ? params.local.data : '',
    }
    let data = {
      msg: 'Error',
      info: ''
    }
    // console.log(query)
    // console.log(updateParams)
    // db.historyGroupTxns.insert(query, (err, res) => {
    db.historyGroupTxns.find(query).sort({ timestamp: -1 }).exec((err, res) => {
      if (err) {
        data.error = err
        reject(data)
      } else {
        console.log(res)
        if (res < 0 || res.length <= 0) {
          db.historyGroupTxns.insert(updateParams, (err, res) => {
            if (err) {
              // console.log(err)
              data.error = err
              reject(data)
            } else {
              console.log(res)
              data.msg = 'Success'
              data.info = res
              resolve(data)
            }
          })
        } else {
          let oldParams = res[0], arr = []
          for (let obj of oldParams.member) {
            if (obj.nodeKey === params.local.nodeKey) {
              obj.kId = params.local.kId
            }
            arr.push(obj)
          }
          updateParams.member = arr
          db.historyGroupTxns.update(query, updateParams, {}, (err, res) => {
            if (err) {
              // console.log(err)
              data.error = err
              reject(data)
            } else {
              // console.log(res)
              data.msg = 'Success'
              data.info = res
              resolve(data)
            }
          })
        }
      }
    })
  })
}

const FindGroupTxns = (params) => {
  return new Promise((resolve, reject) => {
    let _params = {
      pageSize: params && params.pageSize ? params.pageSize : 50,
      skip: 0
    }
    _params.skip = params && params.pageNum ? (Number(params.pageNum - 1) * Number(_params.pageSize)) : 0
  
    let data = { msg: 'Error', info: [] },
        query = {}
  
    if (params) {
      if (params.gId) {
        query.gId = params.gId
      }
      if (params.key) {
        query.key = params.key
      }
      if (params.from || params.from === 0) {
        query.from = params.from
      }
      if (params.to || params.to === 0) {
        query.to = params.to
      }
      if (params.coinType || params.coinType === 0) {
        query.coinType = params.coinType
      }
      if (params.hash || params.hash === 0) {
        query.hash = params.hash
      }
      if (params.status || params.status === 0) {
        query.status = params.status
      }
      if (params.kId || params.kId === 0) {
        query.member = {$elemMatch: {kId: params.kId}}
      }
    }
    db.historyGroupTxns.count(query, (err, count) => {
      if (err) {
        data.error = err
        reject(data)
      } else {
        db.historyGroupTxns.find(query).sort({ timestamp: -1 }).skip(Number(_params.skip)).limit(Number(_params.pageSize)).exec((err, res) => {
          if (err) {
            data.error = err
            reject(data)
          } else {
            // console.log(res)
            data.msg = 'Success'
            data.info = res ? res : []
            data.total = count
            resolve(data)
          }
        })
      }
    })
  })
}

export {
  AddGroupTxns,
  EditGroupTxns,
  EditGroupMemberTxns,
  FindGroupTxns
}