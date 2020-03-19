
const SocketIO = (that, url, params) => {
  return new Promise((resolve, reject) => {
    if (that.$socket.connected) {
      that.sockets.unsubscribe(url)
      that.$socket.emit(url, params)
      that.sockets.subscribe(url, res => {
        // console.log(res)
        resolve(res)
      })
    } else {
      reject('DISCONNECT')
    }
  })
}

export default SocketIO