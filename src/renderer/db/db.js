
import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'
console.log(remote.app.getPath('userData'))

function getPath (name) {
  let url = '/db/' + name + '.db'
  return path.join(remote.app.getPath('userData'), url)
}
function InitDB (name) {
  return new Datastore({
    autoload: true,
    filename: getPath(name),
    corruptAlertThreshold: 1
  })
}
function cb (err) {
  if (err) {
    console.log(err)
  }
}

const db = {
  ks: InitDB('ks'),
  node: InitDB('node'),
  headerImg: InitDB('headerImg'),
  group: InitDB('group'),
  gAccount: InitDB('gAccount'),
  baseInfo: InitDB('baseInfo'),
  status: InitDB('status'),
  historyPersonAccpunts: InitDB('historyPersonAccpunts'),
  historyPersonTxns: InitDB('historyPersonTxns'),
  historyGroupAccpunts: InitDB('historyGroupAccpunts'),
  historyGroupTxns: InitDB('historyGroupTxns')
}

db.ks.ensureIndex({fieldName: 'address', unique: true}, cb)
db.node.ensureIndex({fieldName: 'url', unique: true}, cb)
db.headerImg.ensureIndex({fieldName: 'address', unique: true}, cb)
db.group.ensureIndex({fieldName: 'gId', unique: true}, cb)
db.gAccount.ensureIndex({fieldName: 'pubKey', unique: true}, cb)
db.status.ensureIndex({fieldName: 'keyId', unique: true}, cb)
db.historyPersonAccpunts.ensureIndex({fieldName: 'key', unique: true}, cb)
db.historyPersonTxns.ensureIndex({fieldName: 'key', unique: true}, cb)
db.historyGroupAccpunts.ensureIndex({fieldName: 'key', unique: true}, cb)
db.historyGroupTxns.ensureIndex({fieldName: 'key', unique: true}, cb)

// db.ks.persistence.setAutocompactionInterval()
// db.status.persistence.setAutocompactionInterval()

export default db