import db from '@/db/db.js'
function updateStatus (data) {
  if (!data.key) return
  
  let dataNow = Date.now()
  const params = {
    keyId: dataNow + data.key,
    key: data.key,
    address: data.address,
    status: data.status,
    updatetime: dataNow
  }
  // console.log(params)
  return new Promise((resolve, reject) => {
    db.status.update({key: data.key, address: data.address,}, {$set: params}, {upsert: true}, (err, res) => {
      if (err) {
        // console.log(err)
        reject(err)
      } else {
        console.log(res)
        resolve(res)
      }
    })
  })
}

function findStatus (params) {
  // console.log(params)
  params = params ? params : {}
  return new Promise((resolve, reject) => {
    // console.log(params)
    db.status.find(params).sort({ timestamp: -1 }).exec((err, res) => {
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
    db.status.remove(params, {}, (err, res) => {
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
  updateStatus,
  findStatus,
  removeStatus
}