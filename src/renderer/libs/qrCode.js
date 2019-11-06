import QRCode from 'qrcodejs2'
export default {
  qrCode (cont, id) {
    document.getElementById(id).innerHTML = ''
    let qrcodeInit = new QRCode(id, {
      width: 270,
      height: 270, // 高度
      text: cont, // 二维码内容
      // render: "canvas" // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
      background: "none"
      // foreground: "#ff0"
    })
  }
}