import {group} from './index.js'

function uodateGroup (data) {
  const params = {
    gId: data.gId,
    name: data.name,
    updatetime: Date.now()
  }
  return new Promise((resolve, reject) => {
    group.update({gId: data.gId}, params, {upsert: true}, (err, res) => {
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

function findGroup (params) {
  params = params ? params : {}
  return new Promise((resolve, reject) => {
    // console.log(params)
    group.find(params, (err, res) => {
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

function removeGroup (params) {
  params = params ? params : {}
  return new Promise((resolve, reject) => {
    // console.log(params)
    group.remove(params, {}, (err, res) => {
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
  uodateGroup,
  findGroup,
  removeGroup
}