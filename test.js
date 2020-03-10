const path = require("path").resolve(".")
const pathLink = path
// const web3 = require(pathLink + '/src/renderer/assets/js/web3').default
const Web3 = require('web3')
let web3
try {
  web3 = new Web3(new Web3.providers.HttpProvider('http://54.183.185.30:5015'))
} catch (error) {
  web3 = new Web3()
}
web3.extend({
  property: 'dcrm',
  methods: [
    {
      name: 'getEnode',
      call: 'dcrm_getEnode',
      params: 0,
      inputFormatter: [],
      outputFormatter: null
    }
  ]
})
// console.log(web3)
// web3 = new Web3(new Web3.providers.HttpProvider('http://192.168.1.187:12391'))
// web3 = new Web3(new Web3.providers.HttpProvider('http://54.183.185.30:5015'))
// console.log(web3.isConnected())
web3.dcrm.getEnode().then(res => {
  console.log(res)
})
