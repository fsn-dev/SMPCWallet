const clipboard = require('electron').clipboard

export default {
  getCopyTxt () {
    const message = clipboard.readText()
    console.log(message)
    return message
  },
  setCopyTxt (text) {
    if (!text) return 'Error'
    clipboard.writeText(text)
    return 'Success'
  }
}

