import SocketIO from '@/api/socketIO/index.js'
import {findNode} from '@/db/node/node'

function GetNodes (that, url, params) {
  let noRepeat = new Set()
  let arr = []
  return new Promise((resolve, reject) => {
    SocketIO(that, url, params).then(res => {
      // console.log(res)
      if (res.msg === 'Success') {
        for (let obj of res.info) {
          arr.push({
            url: obj.url,
            name: obj.name ? obj.name : obj.url
          })
          noRepeat.add(obj.url)
        }
      }
      findNode().then(res => {
        // console.log(res)
        for (let obj of res) {
          if (!noRepeat.has(obj.url)) {
            arr.push({
              url: obj.url,
              name: obj.name ? obj.name : obj.url
            })
            noRepeat.add(obj.url)
          }
        }
        resolve(arr)
      })
    }).catch(error => {
      console.log(error)
      findNode().then(res => {
        // console.log(res)
        for (let obj of res) {
          if (!noRepeat.has(obj.url)) {
            arr.push({
              url: obj.url,
              name: obj.name ? obj.name : obj.url
            })
            noRepeat.add(obj.url)
          }
        }
        resolve(arr)
      })
    })
  })
}

export default GetNodes