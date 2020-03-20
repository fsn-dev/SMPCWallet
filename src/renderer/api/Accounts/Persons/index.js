
// import {AddPersonAccounts, EditPersonAccounts, FindPersonAccounts} from './server'
import server from '@/api/common/server.js'
import {
  AddPersonAccounts,
  EditPersonAccounts,
  FindPersonAccounts
} from './local'

const AddPersonAccountsFn = (that, url, params) => {
  return new Promise((resolve, reject) => {
    if (that.$store.state.networkMode) {
      server(that, url, params).then(res => {
        resolve(res)
      })
    } else {
      AddPersonAccounts(that, url, params).then(res => {
        resolve(res)
      })
    }
  })
}

const EditPersonAccountsFn = (that, url, params) => {
  return new Promise((resolve, reject) => {
    if (that.$store.state.networkMode) {
      server(that, url, params).then(res => {
        resolve(res)
      })
    } else {
      EditPersonAccounts(that, url, params).then(res => {
        resolve(res)
      })
    }
  })
}

const FindPersonAccountsFn = (that, url, params) => {
  return new Promise((resolve, reject) => {
    if (that.$store.state.networkMode) {
      server(that, url, params).then(res => {
        resolve(res)
      })
    } else {
      FindPersonAccounts(that, url, params).then(res => {
        resolve(res)
      })
    }
  })
}

export {
  AddPersonAccountsFn,
  EditPersonAccountsFn,
  FindPersonAccountsFn
}