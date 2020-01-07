const path = require("path").resolve(".")
const pathLink = path
const web3 = require(pathLink + '/src/renderer/assets/js/web3').default
console.log(web3)
web3 = new Web3(new Web3.providers.HttpProvider('http://192.168.1.187:12391'))
console.log(web3.isConnected())