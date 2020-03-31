import db from '@/db/db.js'
const AddPersonTxns = (params) => {
  return new Promise((resolve, reject) => {
    let dateNow = Date.now()
    let query = {
      keyId: dateNow + params.key,
      key: params.key ? params.key : '',
      from: params.from ? params.from : '',
      to: params.to ? params.to : '',
      value: params.value ? params.value : 0,
      nonce: params.nonce ? params.nonce : 0,
      gId: params.gId ? params.gId : '',
      coinType: params.coinType ? params.coinType : 0,
      hash: params.hash ? params.hash : '',
      status: params.status ? params.status : 0,
      timestamp: dateNow,
      kId: params.kId ? params.kId : 0,
      eNode: params.eNode ? params.eNode : '',
      pubKey: params.pubKey ? params.pubKey : '',
    }
    let data = {
      msg: 'Error',
      info: ''
    }
    db.historyPersonTxns.insert(query, (err, res) => {
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

const EditPersonTxns = (params) => {
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
    db.historyPersonTxns.update(query, {$set: updateParams}, {}, (err, res) => {
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

const FindPersonTxns = (params) => {
  return new Promise((resolve, reject) => {
    let _params = {
      pageSize: params && params.pageSize ? params.pageSize : 50,
      skip: 0
    }
    _params.skip = params && params.pageNum ? (Number(params.pageNum) * Number(_params.pageSize)) : 0
  
    let data = { msg: 'Error', info: [] },
        query = {}
  
    if (params) {
      if (params.kId) {
        query.kId = params.kId
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
    }
    db.historyPersonTxns.count(query, (err, count) => {
      if (err) {
        data.error = err
        reject(data)
      } else {
        db.historyPersonTxns.find(query).sort({ timestamp: -1 }).skip(Number(_params.skip)).limit(Number(_params.pageSize)).exec((err, res) => {
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
  AddPersonTxns,
  EditPersonTxns,
  FindPersonTxns
}