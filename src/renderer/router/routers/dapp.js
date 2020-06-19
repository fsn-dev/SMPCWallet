const Main = resolve => require.ensure([], () => resolve(require('@/components/main/index.vue')) )
export default [
  {
    path: '/dapp',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/',
        meta: {
          title: '应用市场',
          notCache: true
        },
        component: resolve => require.ensure([], () => resolve(require('@/pages/apply/index.vue')) ),
      }
    ]
  },
  {
    path: '/dapp/mBTC',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/',
        meta: {
          title: 'mBTC',
          notCache: true
        },
        component: resolve => require.ensure([], () => resolve(require('@/pages/apply/mBTC/index.vue')) ),
      }
    ]
  },
  {
    path: '/dapp/dao',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/',
        meta: {
          title: 'DAO',
          notCache: true
        },
        component: resolve => require.ensure([], () => resolve(require('@/pages/apply/DAO/index.vue')) ),
      }
    ]
  },
]