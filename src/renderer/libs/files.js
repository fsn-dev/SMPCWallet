import fs from 'fs'
export default {
  fs,
  validFile (username, fileUrl, type) {
    return new Promise((resolve, reject) => {
      fs.exists(fileUrl, (exists) => {
        if (exists) {
          fs.readdir(fileUrl, (err, files) => {
            if (err) {
              reject({ msg: 'Error', error: err })
            } else {
              // console.log(files)
              if (files.length > 0) {
                let _flag = true
                for (let obj of files) {
                  if (obj.replace(type, '') === username) {
                    _flag = false
                    break
                  }
                }
                if (!_flag) {
                  resolve({ msg: 'Repeat', tip: '账户已存在' })
                } else {
                  resolve({ msg: 'Success' })
                }
              } else {
                resolve({ msg: 'Null' })
              }
            }
          })
        } else {
          fs.mkdir(fileUrl, (err) => {
            if (err) {
              reject({ msg: 'Error', error: err })
            } else {
              resolve({ msg: 'Null' })
            }
          })
        }
      })
    })
  },
  readFile (fileUrl) {
    return new Promise((resolve, reject) => {
      fs.readFile(fileUrl, (err, res) => {
        if (err) {
          reject({ msg: 'Error', error: err })
        } else {
          resolve({ msg: 'Success', info: res.toString() })
        }
      })
    })
  }
}