import {findNode} from '@/db/node/node'

function GetNodes (that, url, params) {
  let noRepeat = new Set()
  return new Promise((resolve, reject) => {
    findNode().then(res => {
      // console.log(res)
      let arr = []
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
}

export default GetNodes