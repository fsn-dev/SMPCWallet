import db from '@/db/db.js'
const AddPersonAccounts = (params) => {
  return new Promise((resolve, reject) => {
    let data = {
      msg: 'Error',
      info: ''
    }
    let dateNow = Date.now()
    let query = {
      keyId: dateNow + params.key,
      key: params.key ? params.key : '',
      kId: params.kId ? params.kId : '',
      member: params.member ? params.member : [],
      gId: params.gId ? params.gId : '',
      nonce: params.nonce ? params.nonce : 0,
      timestamp: dateNow,
      status: 0,
      mode: params.mode ? params.mode : 0,
    }
    db.historyPersonAccpunts.insert(query, (err, res) => {
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

const EditPersonAccounts = (params) => {
  return new Promise((resolve, reject) => {
    let query = {}, updateParams = {}
    let data = { msg: 'Error', info: [] }
    if (params) {
      if (params.id || params.id === 0) {
        query._id = params.id
      }
      if (params.status || params.status === 0) {
        updateParams.status = params.status
      }
      if (params.pubKey || params.pubKey === 0) {
        updateParams.pubKey = params.pubKey
      }
    }
    db.historyPersonAccpunts.update(query, {$set: updateParams}, {}, (err, res) => {
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

const FindPersonAccounts = (params) => {
  return new Promise((resolve, reject) => {
    let _params = {
      pageSize: params && params.pageSize ? params.pageSize : 50,
      skip: 0
    }
    _params.skip = params && params.pageNum ? (Number(params.pageNum - 1) * Number(_params.pageSize)) : 0
  
    let data = { msg: 'Error', info: [] },
        query = {}
  
    if (params) {
      if (params.key) {
        query.key = params.key
      }
      if (params.keyId) {
        query.keyId = params.keyId
      }
      if (params.gId || params.gId === 0) {
        query.gId = params.gId
      }
      if (params.nonce || params.nonce === 0) {
        query.nonce = params.nonce
      }
      if (params.kId || params.kId === 0) {
        query.kId = params.kId
      }
      if (params.status || params.status === 0) {
        query.status = params.status
      }
    }
    // console.log(query)
    db.historyPersonAccpunts.count(query, (err, count) => {
      // console.log(count)
      if (err) {
        data.error = err
        reject(data)
      } else {
        db.historyPersonAccpunts.find(query).sort({ timestamp: -1 }).skip(Number(_params.skip)).limit(Number(_params.pageSize)).exec((err, res) => {
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
  AddPersonAccounts,
  EditPersonAccounts,
  FindPersonAccounts
}