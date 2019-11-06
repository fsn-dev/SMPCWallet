import fs from 'fs'
import wallet from '@/assets/js/wallet'
import config from '@etc/js/config'
export default {
  fs,
  validFile (username) {
    return new Promise((resolve, reject) => {
      fs.exists(config.file.url, (exists) => {
        if (exists) {
          fs.readdir(config.file.url + '/', (err, files) => {
            if (err) {
              reject({ msg: 'Error', error: err })
            } else {
              if (files.length > 0) {
                let _flag = true
                for (let obj of files) {
                  if (obj.replace(config.file.type, '') === username) {
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
                resolve({ msg: 'Success' })
              }
            }
          })
        } else {
          fs.mkdir(config.file.url, (err) => {
            if (err) {
              reject({ msg: 'Error', error: err })
            } else {
              resolve({ msg: 'Success' })
            }
          })
        }
      })
    })
  },
  readFile (username) {
    return new Promise((resolve, reject) => {
      fs.readFile(config.file.url + '/' + username + config.file.type, (err, res) => {
        if (err) {
          reject({ msg: 'Error', error: err })
        } else {
          if (wallet.walletRequirePass(res.toString())) {
            // console.log(wallet.walletRequirePass(res.toString()))
            resolve({ msg: 'Success', info: res.toString() })
          } else {
            reject({ msg: 'Error', error: 'Error' })
          }
        }
      })
    })
  }
}