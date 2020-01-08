const path = require("path").resolve(".")
const pathLink = path

const Web3 = require('web3')
import config from '@etc/js/config.js'
let web3
try {
  // web3 = new Web3(new Web3.providers.HttpProvider('https://10.192.32.92'))
  web3 = new Web3(new Web3.providers.HttpProvider(config.serverRPC))
} catch (error) {
  web3 = new Web3()
}

web3.extend({
  property: 'dcrm',
  methods: [
    {
      name: 'reqDcrmAddr',
      call: 'dcrm_reqDcrmAddr',
      params: 2,
      inputFormatter: [null, null],
      outputFormatter: null
    },
    {
      name: 'acceptLockOut',
      call: 'dcrm_acceptLockOut',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'lockOut',
      call: 'dcrm_lockOut',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'getCurNodeLockOutInfo',
      call: 'dcrm_getCurNodeLockOutInfo',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'getBalance',
      call: 'dcrm_getBalance',
      params: 3,
      inputFormatter: [null, null, null],
      outputFormatter: null
    },
    {
      name: 'getLockOutNonce',
      call: 'dcrm_getLockOutNonce',
      params: 3,
      inputFormatter: [null, null, null],
      outputFormatter: null
    },
    {
      name: 'getEnode',
      call: 'dcrm_getEnode',
      params: 0,
      inputFormatter: [],
      outputFormatter: null
    },
    {
      name: 'getSDKGroupPerson',
      call: 'dcrm_getSDKGroupPerson',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'getEnodeStatus',
      call: 'dcrm_getEnodeStatus',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'createSDKGroup',
      call: 'dcrm_createSDKGroup',
      params: 2,
      inputFormatter: [null, null],
      outputFormatter: null
    },
    {
      name: 'setGroupNodeStatus',
      call: 'dcrm_setGroupNodeStatus',
      params: 3,
      inputFormatter: [null, null, null],
      outputFormatter: null
    },
    {
      name: 'getGroupNodeStatus',
      call: 'dcrm_getGroupNodeStatus',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'getSDKGroup',
      call: 'dcrm_getSDKGroup',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'getAccounts',
      call: 'dcrm_getAccounts',
      params: 2,
      inputFormatter: [null, null],
      outputFormatter: null
    },
    {
      name: 'getAccountsBalance',
      call: 'dcrm_getAccountsBalance',
      params: 2,
      inputFormatter: [null, null],
      outputFormatter: null
    },
    {
      name: 'getCurNodeReqAddrInfo',
      call: 'dcrm_getCurNodeReqAddrInfo',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'getReqAddrStatus',
      call: 'dcrm_getReqAddrStatus',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'acceptReqAddr',
      call: 'dcrm_acceptReqAddr',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'getReqAddrNonce',
      call: 'dcrm_getReqAddrNonce',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    },
    {
      name: 'getLockOutStatus',
      call: 'dcrm_getLockOutStatus',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    }
  ]
})


export default web3
// module.exports = web3
