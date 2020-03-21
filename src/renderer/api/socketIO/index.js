
let count = 0
const SocketIO = (that, url, params) => {
  return new Promise((resolve, reject) => {
    // console.log(that.$socket.connected)
    // console.log(url)
    // console.log(params)
    if (that.$socket.connected) {
      that.sockets.unsubscribe(url)
      that.$socket.emit(url, params)
      that.sockets.subscribe(url, res => {
        // console.log(res)
        count = 0
        resolve(res)
      })
    } else {
      let interval = setInterval(() => {
        count ++
        if (that.$socket.connected) {
          that.$socket.emit(url, params)
          that.sockets.subscribe(url, res => {
            count = 0
            clearInterval(interval)
            resolve(res)
          })
        } else if (count > 6) {
          count = 0
          clearInterval(interval)
          reject('DISCONNECT')
        }
      }, 500)
    }
  })
}

export default SocketIO