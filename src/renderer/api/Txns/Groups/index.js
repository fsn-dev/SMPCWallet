
// import {AddGroupTxns, EditGroupTxns, FindGroupTxns} from './server'
import server from '@/api/common/server.js'
import {
  AddGroupTxns,
  EditGroupTxns,
  EditGroupMemberTxns,
  FindGroupTxns
} from './local'

const AddGroupTxnsFn = (that, url, params) => {
  return new Promise((resolve, reject) => {
    if (that.$$.config.networkMode) {
      server(that, url, params).then(res => {
        resolve(res)
      })
    } else {
      AddGroupTxns(that, url, params).then(res => {
        resolve(res)
      })
    }
  })
}

const EditGroupTxnsFn = (that, url, params) => {
  return new Promise((resolve, reject) => {
    if (that.$$.config.networkMode) {
      server(that, url, params).then(res => {
        resolve(res)
      })
    } else {
      EditGroupTxns(that, url, params).then(res => {
        resolve(res)
      })
    }
  })
}

const EditGroupMemberTxnsFn = (that, url, params) => {
  return new Promise((resolve, reject) => {
    if (that.$$.config.networkMode) {
      server(that, url, params).then(res => {
        resolve(res)
      })
    } else {
      EditGroupMemberTxns(that, url, params).then(res => {
        resolve(res)
      })
    }
  })
}

const FindGroupTxnsFn = (that, url, params) => {
  return new Promise((resolve, reject) => {
    if (that.$$.config.networkMode) {
      server(that, url, params).then(res => {
        resolve(res)
      })
    } else {
      FindGroupTxns(that, url, params).then(res => {
        resolve(res)
      })
    }
  })
}

export {
  AddGroupTxnsFn,
  EditGroupTxnsFn,
  EditGroupMemberTxnsFn,
  FindGroupTxnsFn
}