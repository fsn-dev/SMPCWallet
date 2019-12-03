
import Identicon from 'identicon.js'
export default {
  createHeader (hex, address) {
    let fileUrl = this.$$.config.file.img.url + address + this.$$.config.file.img.type
    let imgData = new Identicon(hex).toString()
    let dataBuffer = new Buffer(imgData, 'base64')
    // let imgUrl = 'data:image/png;base64,'+imgData // 这就是头像的base64码
    this.$$.validFile(address, this.$$.config.file.img.url, this.$$.config.file.img.type).then(res => {
      if (res.msg !== 'Repeat') {
        this.$$.fs.writeFile(fileUrl, dataBuffer, (err, res) => {
          console.log(err)
          console.log(res)
        })
      }
    }).catch(err => {
      console.log(err)
    })
  },
}