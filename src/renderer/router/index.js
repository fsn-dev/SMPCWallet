import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import $$ from '@/assets/js/methods'
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(error=> error)
}


Vue.use(Router)

// console.log(routes)

const routers = new Router({
  routes
})

// routers.beforeEach((to, from, next) => {
//   const hideSearchURL = ['/createWallet', '/importWallet']
//   // console.log(to)
//   if ($$.getToken()) {
//     next()
//   } else {
//     let toFlag = false
//     for (let i of hideSearchURL) {
//       if (to.path.toUpperCase().indexOf(i.toUpperCase()) !== -1 || to.path.toUpperCase() === '/') {
//         toFlag = true
//         break
//       }
//     }
//     if (toFlag) {
//       next()
//     } else {
//       next('/')
//     }
//   }
// })

export default routers
