import {baseInfo} from './index.js'

function uodateBaseInfo (data) {
  const params = {
    key: data.key,
    value: data.value,
  }
  return new Promise((resolve, reject) => {
    baseInfo.update({key: data.key}, params, {upsert: true}, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

function findBaseInfo (params) {
  params = params ? params : {}
  return new Promise((resolve, reject) => {
    // console.log(params)
    baseInfo.find(params).sort({ timestamp: -1 }).exec((err, res) => {
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
  uodateBaseInfo,
  findBaseInfo
}