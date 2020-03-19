
// import {AddPersonTxns, EditPersonTxns, FindPersonTxns} from './server'
import server from '@/api/common/server.js'
import {
  AddPersonTxns,
  EditPersonTxns,
  FindPersonTxns
} from './local'

const AddPersonTxnsFn = (that, url, params) => {
  return new Promise((resolve, reject) => {
    if (that.$$.config.networkMode) {
      server(that, url, params).then(res => {
        resolve(res)
      })
    } else {
      AddPersonTxns(that, url, params).then(res => {
        resolve(res)
      })
    }
  })
}

const EditPersonTxnsFn = (that, url, params) => {
  return new Promise((resolve, reject) => {
    if (that.$$.config.networkMode) {
      server(that, url, params).then(res => {
        resolve(res)
      })
    } else {
      EditPersonTxns(that, url, params).then(res => {
        resolve(res)
      })
    }
  })
}

const FindPersonTxnsFn = (that, url, params) => {
  return new Promise((resolve, reject) => {
    if (that.$$.config.networkMode) {
      server(that, url, params).then(res => {
        resolve(res)
      })
    } else {
      FindPersonTxns(that, url, params).then(res => {
        resolve(res)
      })
    }
  })
}

export {
  AddPersonTxnsFn,
  EditPersonTxnsFn,
  FindPersonTxnsFn
}