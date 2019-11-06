const path = require("path").resolve(".")
const pathLink = path

const Web3 = require('web3')
// const $$ = require('./methods')
// const configData = require(pathLink + '/static/js/config.js')
import config from '@etc/js/config.js'
let web3
try {
  // web3 = new Web3(new Web3.providers.HttpProvider('https://10.192.32.92'))
  web3 = new Web3(new Web3.providers.HttpProvider(config.serverRPC))
} catch (error) {
  web3 = new Web3()
}
web3._extend({
  property: 'lilo',
  methods: [
    new web3._extend.Method({
      name: 'dcrmReqAddr',
      call: 'lilo_dcrmReqAddr',
      params: 2,
      inputFormatter: [null, null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'dcrmConfirmAddr',
      getter: 'lilo_dcrmConfirmAddr',
      inputFormatter: [null, null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'dcrmGetAddr',
      call: 'lilo_dcrmGetAddr',
      params: 2,
      inputFormatter: [null, null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'dcrmLockin',
      call: 'lilo_dcrmLockin',
      params: 3,
      inputFormatter: [null, null, null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'dcrmGetBalance',
      call: 'lilo_dcrmGetBalance',
      params: 2,
      inputFormatter: [null, null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'dcrmCoinStatus',
      call: 'lilo_dcrmCoinStatus',
      params: 0,
      inputFormatter: null,
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'xproOrderCreate',
      call: 'lilo_xproOrderCreate',
      params: 6,
      inputFormatter: [null, null, null, null, null, null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'xproOrderStatus',
      call: 'lilo_xproOrderStatus',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'xproOrderDealedInfo',
      call: 'lilo_xproOrderDealedInfo',
      params: 2,
      inputFormatter: [null, null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'getPairList',
      call: 'lilo_getPairList',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'GetTransactionCountByPoolType',
      call: 'lilo_GetTransactionCountByPoolType',
      params: 3,
      inputFormatter: [null, null, null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'xproAddNewTrade',
      call: 'lilo_xproAddNewTrade',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'xproOrderCancel',
      call: 'lilo_xproOrderCancel',
      params: 1,
      inputFormatter: [null],
      outputFormatter: null
    }),
  ]
})


web3._extend({
  property: 'fsn',
  methods: [
    new web3._extend.Method({
      name: 'getAddressByNotation',
      call: 'fsn_getAddressByNotation',
      params: 2,
      inputFormatter: [null, null],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'fsnGetBalance',
      call: 'fsn_getBalance',
      params: 3,
      inputFormatter: [null, null, null],
      outputFormatter: null
    }),
  ]
})

export default web3
// module.exports = web3
