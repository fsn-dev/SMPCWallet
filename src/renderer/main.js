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




import ElementUI from 'element-ui'
Vue.use(ElementUI)

Vue.use(Vuex)

import VueSocketIO from 'vue-socket.io'
Vue.use(new VueSocketIO({
	connection: $$.config.appURL,
}))

Vue.config.productionTip = false

Vue.prototype.$$ = $$
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
