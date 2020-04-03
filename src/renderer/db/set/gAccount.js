import db from '@/db/db.js'

function updateGaccount (data) {
  if (!data.publicKey) return
  const params = {
    key: data.publicKey + data.address,
    name: data.name,
    address: data.address,
    publicKey: data.publicKey,
    updatetime: Date.now()
  }
  return new Promise((resolve, reject) => {
    db.gAccount.update({key: data.publicKey + data.address}, params, {upsert: true}, (err, res) => {
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

function findGaccount (params) {
  params = params ? params : {}
  return new Promise((resolve, reject) => {
    // console.log(params)
    db.gAccount.find(params).sort({ timestamp: -1 }).exec((err, res) => {
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
  updateGaccount,
  findGaccount
}