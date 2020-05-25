import Vue from 'vue'
import Router from 'vue-router'

import routes from './routers/index'

import $$ from '@/libs/index'
import store from '@/store/index'
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(error=> error)
}


Vue.use(Router)

// console.log(store)

const routers = new Router({
  routes
})
// routers.beforeEach((to, from, next) => {
//   console.log(to)
//   next()
// })
routers.beforeEach((to, from, next) => {
  // console.log(to)
  const token = store.state.address
  const hideSearchURL = ['/login', '/register']
  if (token) {
    next()
  } else {
    let toFlag = false
    for (let i of hideSearchURL) {
      if (to.path.toUpperCase().indexOf(i.toUpperCase()) !== -1 || to.path.toUpperCase() === '/') {
        toFlag = true
        break
      }
    }
    if (toFlag) {
      next()
    } else {
      next('/')
      $$.clearCookies()
    }
  }
})

export default routers
