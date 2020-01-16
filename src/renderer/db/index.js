
import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'
console.log(remote.app.getPath('userData'))
const ks = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/db/ks.db')
})

const node = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/db/node.db')
})

const headerImg = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/db/headerImg.db')
})

const group = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/db/group.db')
})

const gAccount = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/db/gAccount.db')
})

const baseInfo = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/db/baseInfo.db')
})

const status = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/db/status.db')
})


setTimeout(() => {
  ks.ensureIndex({fieldName: 'name', unique: true}, err => {
    // console.log(123)
    if (err) {
      console.log(err)
    }
  })

  node.ensureIndex({fieldName: 'url', unique: true}, err => {
    if (err) {
      console.log(err)
    }
  })

  headerImg.ensureIndex({fieldName: 'name', unique: true}, err => {
    if (err) {
      console.log(err)
    }
  })

  group.ensureIndex({fieldName: 'gId', unique: true}, err => {
    if (err) {
      console.log(err)
    }
  })

  gAccount.ensureIndex({fieldName: 'pubKey', unique: true}, err => {
    if (err) {
      console.log(err)
    }
  })

  status.ensureIndex({fieldName: 'key', unique: true}, err => {
    if (err) {
      console.log(err)
    }
  })
}, 0)

export {
  ks,
  node,
  headerImg,
  group,
  gAccount,
  baseInfo,
  status
}


// export const ks = new Datastore({
//   autoload: true,
//   filename: path.join(remote.app.getPath('userData'), '/db/fs.db')
// })