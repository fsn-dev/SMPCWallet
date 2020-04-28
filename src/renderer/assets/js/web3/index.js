const Web3 = require('web3')
/**
 * @description 基本信息设置
 */
import accounts from '@/assets/js/web3/extends/account.js'
import lockout from '@/assets/js/web3/extends/lockout.js'
import p2p from '@/assets/js/web3/extends/p2p.js'
import reqAddr from '@/assets/js/web3/extends/reqAddr.js'
import sign from '@/assets/js/web3/extends/sign.js'
import coins from '@/assets/js/web3/extends/coins.js'

let web3 = new Web3()
// try {
//   web3 = new Web3(new Web3.providers.HttpProvider(config.serverRPC))
// } catch (error) {
//   web3 = new Web3()
// }
web3.extend({
  property: 'dcrm',
  methods: [
    ...accounts,
    ...lockout,
    ...p2p,
    ...reqAddr,
    ...sign
  ]
})
web3.extend({
  property: 'coins',
  methods: [
    ...coins
  ]
})
export default web3