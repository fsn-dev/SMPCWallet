
// import Identicon from 'identicon.js'
export default {
  createHeader (address, name) {
    let imgInfo = this.$$.createImg(address)
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