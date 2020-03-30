
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
  filename: getPath('ks'),
  corruptAlertThreshold: 1
})

const node = new Datastore({
  autoload: true,
  filename: getPath('node'),
  corruptAlertThreshold: 1
})

const headerImg = new Datastore({
  autoload: true,
  filename: getPath('headerImg'),
  corruptAlertThreshold: 1
})

const group = new Datastore({
  autoload: true,
  filename: getPath('group'),
  corruptAlertThreshold: 1
})

const gAccount = new Datastore({
  autoload: true,
  filename: getPath('gAccount'),
  corruptAlertThreshold: 1
})

const baseInfo = new Datastore({
  autoload: true,
  filename: getPath('baseInfo'),
  corruptAlertThreshold: 1
})

const status = new Datastore({
  autoload: true,
  filename: getPath('status'),
  corruptAlertThreshold: 1
})

const historyPersonAccpunts = new Datastore({
  autoload: true,
  filename: getPath('historyPersonAccpunts'),
  corruptAlertThreshold: 1
})
const historyPersonTxns = new Datastore({
  autoload: true,
  filename: getPath('historyPersonTxns'),
  corruptAlertThreshold: 1
})
const historyGroupAccpunts = new Datastore({
  autoload: true,
  filename: getPath('historyGroupAccpunts'),
  corruptAlertThreshold: 1
})
const historyGroupTxns = new Datastore({
  autoload: true,
  filename: getPath('historyGroupTxns'),
  corruptAlertThreshold: 1
})

function cb (err) {
  if (err) {
    console.log(err)
  }
}

// ks.removeIndex('address', cb)
// ks.removeIndex('name', cb)
// node.removeIndex('url', cb)
// headerImg.removeIndex('address', cb)
// headerImg.removeIndex('name', cb)
// group.removeIndex('gId', cb)
// gAccount.removeIndex('pubKey', cb)
// status.removeIndex('key', cb)

// historyPersonAccpunts.removeIndex('key', cb)
// historyPersonTxns.removeIndex('key', cb)
// historyGroupAccpunts.removeIndex('key', cb)
// historyGroupTxns.removeIndex('key', cb)

ks.ensureIndex({fieldName: 'address', unique: true}, cb)
node.ensureIndex({fieldName: 'url', unique: true}, cb)
headerImg.ensureIndex({fieldName: 'address', unique: true}, cb)
group.ensureIndex({fieldName: 'gId', unique: true}, cb)
gAccount.ensureIndex({fieldName: 'pubKey', unique: true}, cb)
status.ensureIndex({fieldName: 'key', unique: true}, cb)

historyPersonAccpunts.ensureIndex({fieldName: 'key', unique: true}, cb)
historyPersonTxns.ensureIndex({fieldName: 'key', unique: true}, cb)
historyGroupAccpunts.ensureIndex({fieldName: 'key', unique: true}, cb)
historyGroupTxns.ensureIndex({fieldName: 'key', unique: true}, cb)

// Datastore.onload((err, res) => {
//   console.log(err, res)
// })
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