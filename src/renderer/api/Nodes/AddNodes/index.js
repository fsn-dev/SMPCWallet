import {insertNode, findNode} from '@/db/node/node'
// import findLocalNode from '@/api/Nodes/common/index'
function AddNodes (that, url, params) {
  // console.log(params)
  return new Promise((resolve, reject) => {
    findNode(params).then(res => {
      // console.log(res)
      if (res > 0 || res.length > 0) {
        resolve(0)
      } else {
        insertNode(params).then(res1 => {
          resolve(1)
        })
      }
    })
  })
}

export default AddNodes