import db from '@/db/db.js'

function insertAccount (data) {
  if (!data.address) return
  const params = {
    username: data.username,
    ks: data.ks,
    address: data.address,
    // password: data.address,
    timestamp: data.timestamp ? data.timestamp : Date.now()
  }
  return new Promise((resolve, reject) => {
    db.ks.insert(params, (err, res) => {
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

function findAccount (params) {
  params = params ? params : {}
  return new Promise((resolve, reject) => {
    // console.log(params)
    db.ks.find(params).sort({ timestamp: -1 }).exec((err, res) => {
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
  insertAccount,
  findAccount
}