// // const Datastore = require('nedb')
// import Datastore from 'nedb'
// import path from 'path'
// import { remote } from 'electron'
// const db = {}

// // const path = 'C:/Program Files/SMPC'
// // const path = './data'

// // console.log()

// db.ks = new Datastore({
//   filename: path.join(remote.app.getPath('userData'), 'db/ks.db')
// })
// db.ks.insert({
//   name: 'test',
//   ks: '123',
//   timestamp: Date.now()
// }, (err, res) => {
//   console.log(err)
//   console.log(res)
// })

// console.log(db)
// // export const ks = db.ks
// // console.log(remote.app)
// export const ks = new Datastore({
//   filename: path.join(remote.app.getPath('userData'), 'db/ks.db')
// })

import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'

const ks = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/db/ks.db')
})
ks.ensureIndex({fieldName: 'name', unique: true}, err => {
  console.log(123)
  if (err) {
    console.log(err)
  }
})


const node = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/db/node.db')
})
node.ensureIndex({fieldName: 'url', unique: true}, err => {
  if (err) {
    console.log(err)
  }
})

const headerImg = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/db/headerImg.db')
})
headerImg.ensureIndex({fieldName: 'name', unique: true}, err => {
  if (err) {
    console.log(err)
  }
})

export {
  ks,
  node,
  headerImg
}


// export const ks = new Datastore({
//   autoload: true,
//   filename: path.join(remote.app.getPath('userData'), '/db/fs.db')
// })