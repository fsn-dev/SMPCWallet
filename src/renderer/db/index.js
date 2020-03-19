
import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'
console.log(remote.app.getPath('userData'))

function getPath (name) {
  let url = '/db/' + name + '.db'
  return path.join(remote.app.getPath('userData'), url)
}

const ks = new Datastore({
  autoload: true,
  filename: getPath('ks')
})

const node = new Datastore({
  autoload: true,
  filename: getPath('node')
})

const headerImg = new Datastore({
  autoload: true,
  filename: getPath('headerImg')
})

const group = new Datastore({
  autoload: true,
  filename: getPath('group')
})

const gAccount = new Datastore({
  autoload: true,
  filename: getPath('gAccount')
})

const baseInfo = new Datastore({
  autoload: true,
  filename: getPath('baseInfo')
})

const status = new Datastore({
  autoload: true,
  filename: getPath('status')
})

const historyPersonAccpunts = new Datastore({
  autoload: true,
  filename: getPath('historyPersonAccpunts')
})
const historyPersonTxns = new Datastore({
  autoload: true,
  filename: getPath('historyPersonTxns')
})
const historyGroupAccpunts = new Datastore({
  autoload: true,
  filename: getPath('historyGroupAccpunts')
})
const historyGroupTxns = new Datastore({
  autoload: true,
  filename: getPath('historyGroupTxns')
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

ks.ensureIndex({fieldName: 'address', unique: true}, cb)
node.ensureIndex({fieldName: 'url', unique: true}, cb)
headerImg.ensureIndex({fieldName: 'address', unique: true}, cb)
group.ensureIndex({fieldName: 'gId', unique: true}, cb)
gAccount.ensureIndex({fieldName: 'pubKey', unique: true}, cb)
status.ensureIndex({fieldName: 'key', unique: true}, cb)


export {
  ks,
  node,
  headerImg,
  group,
  gAccount,
  baseInfo,
  status,
  historyPersonAccpunts,
  historyPersonTxns,
  historyGroupAccpunts,
  historyGroupTxns,
}


// export const ks = new Datastore({
//   autoload: true,
//   filename: path.join(remote.app.getPath('userData'), '/db/fs.db')
// })