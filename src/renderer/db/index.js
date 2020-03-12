
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

function cb (err) {
  if (err) {
    console.log(err)
  }
}

ks.removeIndex('address', cb)
ks.removeIndex('name', cb)
node.removeIndex('url', cb)
headerImg.removeIndex('address', cb)
headerImg.removeIndex('name', cb)
group.removeIndex('gId', cb)
gAccount.removeIndex('pubKey', cb)
status.removeIndex('key', cb)
setTimeout(() => {
  ks.ensureIndex({fieldName: 'address', unique: true}, cb)
  node.ensureIndex({fieldName: 'url', unique: true}, cb)
  headerImg.ensureIndex({fieldName: 'address', unique: true}, cb)
  group.ensureIndex({fieldName: 'gId', unique: true}, cb)
  gAccount.ensureIndex({fieldName: 'pubKey', unique: true}, cb)
  status.ensureIndex({fieldName: 'key', unique: true}, cb)
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