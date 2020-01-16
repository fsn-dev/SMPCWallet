import {status} from './index.js'

function uodateStatus (data) {
  const params = {
    key: data.key,
    type: data.type,
    status: data.status,
    updatetime: Date.now()
  }
  
  return new Promise((resolve, reject) => {
    status.update({key: data.key, type: data.type}, params, {upsert: true}, (err, res) => {
      if (err) {
        // console.log(err)
        reject(err)
      } else {
        // console.log(res)
        resolve(res)
      }
    })
  })
}

function findStatus (params) {
  params = params ? params : {}
  return new Promise((resolve, reject) => {
    // console.log(params)
    status.find(params).sort({ timestamp: -1 }).exec((err, res) => {
      if (err) {
        // console.log(err)
        reject(err)
      } else {
        // console.log(res)
        resolve(res)
      }
    })
  })
}

function removeStatus (params) {
  params = params ? params : {}
  return new Promise((resolve, reject) => {
    // console.log(params)
    status.remove(params, {}, (err, res) => {
      if (err) {
        // console.log(err)
        reject(err)
      } else {
        // console.log(res)
        resolve(res)
      }
    })
  })
}

export {
  uodateStatus,
  findStatus,
  removeStatus
}