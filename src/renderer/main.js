import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import store from './store'

import i18n from '@/local'
import $$ from '@/libs/index'

import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/css.css'
import './assets/css/style.css'

import {
  Button,
  Collapse,
  CollapseItem,
  Dialog,
  Icon,
  Message,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxGroup,
  Form,
  FormItem,
  Input,
  InputNumber,
  Row,
  Col,
  Table,
  TableColumn,
  Popover,
  Loading,
  Switch,
  Select,
  Menu,
  Submenu,
  Scrollbar,
  MenuItem,
  Pagination,
  Option,
  Backtop,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
} from 'element-ui'

Vue.use(Button)
Vue.use(Dialog)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Icon)
Vue.component(Message.name, Message)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Popover)
Vue.use(Loading)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(Scrollbar)
Vue.use(MenuItem)
Vue.use(Pagination)
Vue.use(Option)
Vue.use(Backtop)
Vue.use(Badge)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)

Vue.use(Vuex)

Vue.config.productionTip = false

Vue.prototype.$$ = $$
Vue.prototype.$message = Message
// Vue.prototype.toUrl = (url, params) => {
//   console.log(this)
//   console.log(router)
//   router.push({path: url, query: params})
// }
Vue.prototype.toUrl = function(url, params) {
  this.$router.push({path: url, query: params})
}

import pwdSure from '@/pages/public/pwdSure'

Vue.component('pwdSure', pwdSure)

/* eslint-disable no-new */
new Vue({
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
}).$mount('#app')
