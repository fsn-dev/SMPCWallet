import {node} from './index.js'

function insertNode (data) {
  if (!data.url) return
  const params = {
    url: data.url,
    timestamp: Date.now()
  }
  return new Promise((resolve, reject) => {
    node.insert(params, (err, res) => {
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

function findNode (params) {
  params = params ? params : {}
  return new Promise((resolve, reject) => {
    // console.log(params)
    node.find(params).sort({ timestamp: -1 }).exec((err, res) => {
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

function removeNode (params) {
  params = params ? params : {}
  return new Promise((resolve, reject) => {
    // console.log(params)
    node.remove(params, {}, (err, res) => {
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
  insertNode,
  findNode,
  removeNode
}