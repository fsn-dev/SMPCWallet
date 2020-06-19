const fs = require('fs')

export default {
  readFile (url) {
    return new Promise(resolve => {
      fs.exists(url, isExist => {
        if (isExist) {
          let data = fs.readFileSync(url)
          if (data) {
            resolve(data.toString())
          } else {
            resolve(null)
          }
        } else {
          resolve(null)
        }
      })
    })
  }
}