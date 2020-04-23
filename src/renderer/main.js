import db from '@/db/index.js'
import $$ from '@/libs/index'
db.findBaseInfo({key: 'serverRPC'}).then(res => {
  // console.log(res)
  if (res.length > 0) {
    $$.web3.setProvider(res[0].value)
  }
})

import Vue from 'vue'
import axios from 'axios'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from './store'

import i18n from '@/local'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/css.css'
import './assets/css/style.css'



import ElementUI from 'element-ui'
Vue.use(ElementUI)

Vue.use(Vuex)

import VueSocketIO from 'vue-socket.io'
let vueSocketIo = new VueSocketIO({
  debug: false,
  connection: $$.config.appURL,
})
// 监听connect事件，设置SOCKET_CONNECT为true
vueSocketIo.io.on('connect', () => {
  store.commit('SOCKET_CONNECT', true)
})
Vue.use(vueSocketIo)
// Vue.use(new VueSocketIO({
//   connection: $$.config.appURL,
//   vuex: {
//     store,
//     actionPrefix: 'SOCKET_',
//     mutationPrefix: 'SOCKET_'
//   },
// }))

Vue.config.productionTip = false

Vue.prototype.$$ = $$
Vue.prototype.$axios = axios
Vue.prototype.$db = db

Vue.prototype.toUrl = function(url, params) {
  this.$router.push({path: url, query: params})
}

Vue.prototype.copyTxt = function(cont) {
  let id = 'copyInputSelectContent'
  let _input = document.createElement('input')
  _input.type = 'text'
  _input.value = cont
  _input.id = id
  document.body.append(_input)
  document.getElementById(id).select()
  document.execCommand("Copy")
  if (cont.length > 60) {
    this.msgSuccess('Copy ' + $$.cutOut(cont, 12, 8) + ' succeeded!')
  } else {
    this.msgSuccess('Copy ' + cont + ' succeeded!')
  }
  document.getElementById(id).remove()
  _input = null
  id = null
}

Vue.prototype.msgError = function(txt) {
  if (txt && txt.error) {
    txt = txt.error
  }
  this.$message({
    showClose: true,
    message: txt,
    type: 'error',
    customClass:'mzindex'
  })
}

Vue.prototype.msgSuccess = function(txt) {
  this.$message({
    showClose: true,
    message: txt,
    type: 'success',
    customClass:'mzindex'
  })
}

Vue.prototype.msgWarning = function(txt) {
  this.$message({
    showClose: true,
    message: txt,
    type: 'warning',
    customClass:'mzindex'
  })
}

Vue.prototype.quitApp = function() {
  $$.clearCookies()
  this.$store.commit('setToken', '')
  this.$store.commit('setAddress', '')
  this.$router.push('/')
}

import pwdSure from '@/components/pwdSure/index.vue'
import logo from '@/components/logo/index'
import drawerLogo from '@/components/logo/drawerLogo'
Vue.component('pwdSure', pwdSure)
Vue.component('logo', logo)
Vue.component('drawerLogo', drawerLogo)

/* eslint-disable no-new */
new Vue({
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
}).$mount('#app')
