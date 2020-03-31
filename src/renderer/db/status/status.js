import db from '@/db/db.js'
function updateStatus (data) {
  if (!data.key) return
  const params = {
    key: data.key,
    type: data.type,
    address: data.address,
    status: data.status,
    updatetime: Date.now()
  }
  
  return new Promise((resolve, reject) => {
    db.status.update({key: data.key, type: data.type}, params, {upsert: true}, (err, res) => {
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