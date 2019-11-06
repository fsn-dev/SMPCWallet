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
    new web3._extend.Method({
      name: 'genPubkey',
      call: 'dcrm_genPubkey',
      params: 0,
      inputFormatter: [],
      outputFormatter: null
    }),
    new web3._extend.Method({
      name: 'sign',
      call: 'dcrm_sign',
      params: 2,
      inputFormatter: [null, null],
      outputFormatter: null
    }),
  ]
})


export default web3
// module.exports = web3
