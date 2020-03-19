
// import {AddGroupAccounts, EditGroupAccounts, FindGroupAccounts} from './server'
import server from '@/api/common/server.js'
import {
  AddGroupAccounts,
  EditGroupAccounts,
  EditGroupMemberAccounts,
  FindGroupAccounts
} from './local'

const AddGroupAccountsFn = (that, url, params) => {
  return new Promise((resolve, reject) => {
    // console.log(that.$$)
    if (that.$$.config.networkMode) {
      server(that, url, params).then(res => {
        resolve(res)
      })
    } else {
      AddGroupAccounts(that, url, params).then(res => {
        resolve(res)
      })
    }
  })
}

const EditGroupAccountsFn = (that, url, params) => {
  return new Promise((resolve, reject) => {
    if (that.$$.config.networkMode) {
      server(that, url, params).then(res => {
        resolve(res)
      })
    } else {
      EditGroupAccounts(that, url, params).then(res => {
        resolve(res)
      })
    }
  })
}

const EditGroupMemberAccountsFn = (that, url, params) => {
  return new Promise((resolve, reject) => {
    if (that.$$.config.networkMode) {
      server(that, url, params).then(res => {
        resolve(res)
      })
    } else {
      EditGroupMemberAccounts(that, url, params).then(res => {
        resolve(res)
      })
    }
  })
}

const FindGroupAccountsFn = (that, url, params) => {
  return new Promise((resolve, reject) => {
    if (that.$$.config.networkMode) {
      server(that, url, params).then(res => {
        resolve(res)
      })
    } else {
      FindGroupAccounts(that, url, params).then(res => {
        resolve(res)
      })
    }
  })
}

export {
  AddGroupAccountsFn,
  EditGroupAccountsFn,
  EditGroupMemberAccountsFn,
  FindGroupAccountsFn
}