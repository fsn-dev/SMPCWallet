import {ks} from './index.js'

// console.log(ks)

function insertAccount (data) {
  const params = {
    name: data.name,
    ks: data.ks,
    timestamp: Date.now()
  }
  return new Promise((resolve, reject) => {
    ks.insert(params, (err, res) => {
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
    console.log(params)
    ks.find(params).sort({ timestamp: -1 }).exec((err, res) => {
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