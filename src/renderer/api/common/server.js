import SocketIO from '@/api/socketIO/index.js'

function server (that, url, params) {
  return new Promise((resolve, reject) => {
    SocketIO(that, url, params).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}

export default server