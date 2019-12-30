
import Identicon from 'identicon.js'
import {insertHeaderImg, findHeaderImg} from '@/db/headerImg'
export default {
  createHeader (hex, address, name) {
    // let fileUrl = this.$$.config.file.img.url + address + this.$$.config.file.img.type
    let imgData = new Identicon(hex).toString()
    let imgInfo = 'data:image/png;base64,' + imgData // 这就是头像的base64码
    // console.log(imgInfo)
    insertHeaderImg({
      name: name,
      address: address,
      imgData: imgInfo
    }).then(res => {
      console.log(res)
    })
  },
}