import {headerImg} from './index.js'

function insertHeaderImg (data) {
  if (!data.address) return
  const params = {
    name: data.name,
    address: data.address,
    imgData: data.imgData,
    timestamp: Date.now()
  }
  return new Promise((resolve, reject) => {
    headerImg.insert(params, (err, res) => {
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

function findHeaderImg (params) {
  params = params ? params : {}
  return new Promise((resolve, reject) => {
    // console.log(params)
    headerImg.find(params).sort({ timestamp: -1 }).exec((err, res) => {
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
  insertHeaderImg,
  findHeaderImg
}