import Vue from 'vue'
import axios from 'axios'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from './store'

import i18n from '@/local'
import $$ from '@/libs/index'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/css.css'
import './assets/css/style.css'

// import {test} from '@/libs/menu'

import ElementUI from 'element-ui'
Vue.use(ElementUI)

Vue.use(Vuex)

import VueSocketIO from 'vue-socket.io'
Vue.use(new VueSocketIO({
	connection: $$.config.appURL,
}))

Vue.config.productionTip = false

Vue.prototype.$$ = $$
// Vue.prototype.$message = Message
Vue.prototype.$axios = axios

Vue.prototype.toUrl = function(url, params) {
  this.$router.push({path: url, query: params})
}

Vue.prototype.copyTxt = function(txt, isShowCont) {
  let status = $$.setCopyTxt(txt)
  let cont = isShowCont ? (' ' + txt + ' ') : ''
  if (status === 'Success') {
    this.msgSuccess('Copy ' + cont + ' succeeded!')
  } else {
    this.msgError('Copy ' + cont + ' failed!')
  }
}

Vue.prototype.msgError = function(txt) {
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
  // console.log(this)
  // console.log(this.$store)
  // console.log($$)
  let dayAndNight = this.$store.state.dayAndNight
  let language = this.$store.state.language
  let serverRPC = this.$store.state.serverRPC
  $$.clearCookies()
  // this.$store.commit('setEnode', '')
  this.$store.commit('setToken', '')
  this.$store.commit('setWallet', '')
  this.$store.commit('setAddress', '')
  this.$store.commit('setDayAndNight', {info: dayAndNight})
  this.$store.commit('setSafeMode', {info: $$.config.modeInit})
  this.$store.commit('setLanguage', {info: language})
  this.$store.commit('setServerRPC', {info: serverRPC})
  this.$router.push('/')
}

import pwdSure from '@/pages/public/pwdSure'
// import wDrawer from '@/components/drawer/index'
import logo from '@/components/logo/index'
import drawerLogo from '@/components/logo/drawerLogo'
Vue.component('pwdSure', pwdSure)
// Vue.component('wDrawer', wDrawer)
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
