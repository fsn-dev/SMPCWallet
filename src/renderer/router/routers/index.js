
const Main = resolve => require.ensure([], () => resolve(require('@/components/main/index.vue')) )
import accounts from './accounts'
import home from './home'
import dapp from './dapp'
import set from './set'
export default [
  ...accounts,
  ...home,
  ...dapp,
  ...set,
  {
    path: '/history',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/',
        meta: {
          title: '历史',
          notCache: true
        },
        component: resolve => require.ensure([], () => resolve(require('@/pages/history/index.vue')) )
      }
    ]
  },
  {
    path: '/tValid',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/',
        meta: {
          title: '交易',
          notCache: true
        },
        component: resolve => require.ensure([], () => resolve(require('@/pages/txns/tValid.vue')) )
      }
    ]
  },
  {
    path: '/sValid',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/',
        meta: {
          title: '签名',
          notCache: true
        },
        component: resolve => require.ensure([], () => resolve(require('@/pages/txns/sValid.vue')) )
      }
    ]
  },
  {
    path: '/approvalList',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/',
        meta: {
          title: '消息',
          notCache: true
        },
        component: resolve => require.ensure([], () => resolve(require('@/pages/news/index.vue')) )
      }
    ]
  },
  {
    path: '/social',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/',
        meta: {
          title: '好友',
          notCache: true
        },
        component: resolve => require.ensure([], () => resolve(require('@/pages/social/index.vue')) ),
      }
    ]
  },
  {
    path: '/network',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/',
        meta: {
          title: '节点',
          notCache: true
        },
        component: resolve => require.ensure([], () => resolve(require('@/pages/node/index.vue')) ),
      }
    ]
  },
  {
    path: '*',
    component: resolve => require.ensure([], () => resolve(require('@/components/error/index.vue')) )
  }
]