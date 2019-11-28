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
web3._extend({
  property: 'dcrm',
  methods: [
    // new web3._extend.Method({
    //   name: 'genPubkey',
    //   call: 'dcrm_genPubkey',
    //   params: 0,
    //   inputFormatter: [],
    //   outputFormatter: null
    // }),
    // new web3._extend.Method({
    //   name: 'sign',
    //   call: 'dcrm_sign',
    //   params: 2,
    //   inputFormatter: [null, null],
    //   outputFormatter: null
    // }),
    new web3._extend.Method({
      name: 'reqDcrmAddr',
      call: 'dcrm_reqDcrmAddr',
      params: 2,
      inputFormatter: [null, null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'acceptLockOut',
      call: 'dcrm_acceptLockOut',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'lockOut',
      call: 'dcrm_lockOut',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'getCurNodeLockOutInfo',
      call: 'dcrm_getCurNodeLockOutInfo',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'getBalance',
      call: 'dcrm_getBalance',
      params: 3,
      inputFormatter: [null, null, null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'getNonce',
      call: 'dcrm_getNonce',
      params: 3,
      inputFormatter: [null, null, null],
      outputFormatter: null
    }),
    // new web3._extend.Method({
    //   name: 'GetReply',
    //   call: 'dcrm_GetReply',
    //   params: 3,
    //   inputFormatter: [null, null, null],
    //   outputFormatter: null
    // }),
    
    new web3._extend.Method({
      name: 'getEnode',
      call: 'dcrm_getEnode',
      params: 0,
      inputFormatter: [],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'getSDKGroupPerson',
      call: 'dcrm_getSDKGroupPerson',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'getEnodeStatus',
      call: 'dcrm_getEnodeStatus',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'createSDKGroup',
      call: 'dcrm_createSDKGroup',
      params: 3,
      inputFormatter: [null, null, null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'setGroupNodeStatus',
      call: 'dcrm_setGroupNodeStatus',
      params: 3,
      inputFormatter: [null, null, null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'getGroupNodeStatus',
      call: 'dcrm_getGroupNodeStatus',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'getSDKGroup',
      call: 'dcrm_getSDKGroup',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'getAccounts',
      call: 'dcrm_getAccounts',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'getAccountsBalance',
      call: 'dcrm_getAccountsBalance',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    }),
  ]
})


export default web3
// module.exports = web3
