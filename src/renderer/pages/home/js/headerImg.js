
import Identicon from 'identicon.js'
import {insertHeaderImg} from '@/db/headerImg'
export default {
  createHeader (hex, address, name) {
    // let fileUrl = this.$$.config.file.img.url + address + this.$$.config.file.img.type
    let imgData = new Identicon(hex).toString()
    let imgInfo = 'data:image/png;base64,' + imgData // 这就是头像的base64码
    // console.log(imgInfo)
    let data = {
      name: name,
      address: address,
      imgData: imgInfo
    }
    // console.log(data)
    insertHeaderImg(data).then(res => {
      console.log(res)
    })
  },
}