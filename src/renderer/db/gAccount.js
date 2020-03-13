import {gAccount} from './index.js'

// console.log(gAccount)

function updateGaccount (data) {
  if (!data.publicKey) return
  const params = {
    name: data.name,
    publicKey: data.publicKey,
    updatetime: Date.now()
  }
  return new Promise((resolve, reject) => {
    gAccount.update({publicKey: data.publicKey}, params, {upsert: true}, (err, res) => {
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
    gAccount.find(params).sort({ timestamp: -1 }).exec((err, res) => {
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