import db from '@/db/db.js'
const AddSigns = (params) => {
  return new Promise((resolve, reject) => {
    let dateNow = Date.now()
    let query = {
      keyId: dateNow + params.key,
      key: params.key ? params.key : '',
      from: params.from ? params.from : '',
      to: params.to ? params.to : '',
      hash: params.hash ? params.hash : '',
      value: params.value ? params.value : 0,
      nonce: params.nonce ? params.nonce : 0,
      coinType: params.coinType ? params.coinType : 0,
      status: params.status ? params.status : 0,
      pubKey: params.pubKey ? params.pubKey : '',
      mode: params.mode ? params.mode : 0,
      gId: params.gId ? params.gId : '',
      data: params.data ? params.data : '',
      member: params.gArr ? params.gArr : [],
      timestamp: dateNow,
      rsv: params.rsv && params.rsv.length > 0 ? params.rsv : [],
      extendObj: params.extendObj ? params.extendObj : '',
      accountType: params.accountType ? params.accountType : 0,
    }
    let data = {
      msg: 'Error',
      info: ''
    }
    db.historySigns.insert(query, (err, res) => {
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

const EditSigns = (params) => {
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
      if (params.rsv || params.rsv === 0) {
        updateParams['rsv'] = params.rsv
      }
    }
    db.historySigns.update(query, {$set: updateParams}, {}, (err, res) => {
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

const EditMemberSigns = (params) => {
  return new Promise((resolve, reject) => {
    let dateNow = Date.now()
    let query = {key: params.local.key}
    let updateParams = {
      keyId: dateNow + params.local.key,
      key: params.local.key ? params.local.key : '',
      from: params.local.from ? params.local.from : '',
      to: params.local.to ? params.local.to : '',
      hash: params.local.hash ? params.local.hash : '',
      value: params.local.value ? params.local.value : 0,
      nonce: params.local.nonce ? params.local.nonce : 0,
      coinType: params.local.coinType ? params.local.coinType : 0,
      status: params.local.status ? params.local.status : 0,
      pubKey: params.local.pubKey ? params.local.pubKey : '',
      mode: params.local.mode ? params.local.mode : '',
      gId: params.local.gId ? params.local.gId : '',
      data: params.local.data ? params.local.data : '',
      member: params.local.gArr ? params.local.gArr : [],
      timestamp: dateNow,
      rsv: params.local.rsv && params.local.rsv.length > 0 ? params.local.rsv : [],
      extendObj: params.local.extendObj ? params.local.extendObj : '',
      accountType: params.accountType ? params.accountType : 0,
    }
    let data = {
      msg: 'Error',
      info: ''
    }
    // console.log(query)
    // console.log(updateParams)
    // db.historySigns.insert(query, (err, res) => {
    db.historySigns.find(query).sort({ timestamp: -1 }).exec((err, res) => {
      if (err) {
        data.error = err
        reject(data)
      } else {
        console.log(res)
        if (res < 0 || res.length <= 0) {
          db.historySigns.insert(updateParams, (err, res) => {
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
          db.historySigns.update(query, updateParams, {}, (err, res) => {
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

const FindSigns = (params) => {
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
      if (params.pubKey) {
        query.pubKey = params.pubKey
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
      if (params.extendObj && params.extendObj.type) {
        query['extendObj.type'] = params.extendObj.type
        // query['extendObj']['type'] = params.extendObj.type
      }
    }
    console.log(query)
    db.historySigns.count(query, (err, count) => {
      if (err) {
        data.error = err
        reject(data)
      } else {
        db.historySigns.find(query).sort({ timestamp: -1 }).skip(Number(_params.skip)).limit(Number(_params.pageSize)).exec((err, res) => {
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
  AddSigns,
  EditSigns,
  EditMemberSigns,
  FindSigns
}