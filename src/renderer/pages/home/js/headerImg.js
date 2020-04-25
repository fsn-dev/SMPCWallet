
// import Identicon from 'identicon.js'
export default {
  createHeader (hex, address, name) {
    let imgInfo = this.$$.createImg(hex)
    let data = {
      name: name,
      address: address,
      imgData: imgInfo
    }
    // console.log(data)
    this.$db.insertHeaderImg(data).then(res => {
      console.log(res)
    })
  },
}