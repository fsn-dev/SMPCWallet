import {historyGroupTxns} from '@/db/index.js'
const AddGroupTxns = (that, url, params) => {
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
      pubKey: params.pubKey ? params.pubKey : '',
    }
    let data = {
      msg: 'Error',
      info: ''
    }
    historyGroupTxns.insert(query, (err, res) => {
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

const EditGroupTxns = (that, url, params) => {
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
    historyGroupTxns.update(query, {$set: updateParams}, {}, (err, res) => {
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

const EditGroupMemberTxns = (that, url, params) => {
  return new Promise((resolve, reject) => {
    let query = {}, updateParams = {}
    let data = {
      msg: 'Error',
      info: ''
    }
    if (params) {
      if (params.key || params.key === 0) {
        query.key = params.key
      }
      if (params.keyId || params.keyId === 0) {
        query.keyId = params.keyId
      }
      if (params.eNode) {
        query['member.eNode'] = params.eNode
      }

      if (params.status || params.status === 0) {
        updateParams['member.$.status'] = params.status
      }
      if (params.kId || params.kId === 0) {
        updateParams['member.$.kId'] = params.kId
        updateParams['member.$.timestamp'] = Date.now()
      }
    }
    historyGroupTxns.update(query, {$set: updateParams}, {}, (err, res) => {
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

const FindGroupTxns = (that, url, params) => {
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
    historyGroupTxns.count({}, (err, count) => {
      if (err) {
        data.error = err
        reject(data)
      } else {
        historyGroupTxns.find(query).sort({ timestamp: -1 }).skip(Number(_params.skip)).limit(Number(_params.pageSize)).exec((err, res) => {
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