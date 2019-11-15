const Main = resolve => require.ensure([], () => resolve(require('@/components/main/index')) )
// const Main = require('@/components/main/index').default

export default [
  {
    path: '/',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/',
        meta: {
          title: '首页',
          notCache: true
        },
        // component: () => import('@/pages/createWallet/index')
        component: resolve => require.ensure([], () => resolve(require('@/pages/createWallet/index')) )
      }
    ]
  },
  {
    path: '/createWallet',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/',
        meta: {
          title: '创建钱包',
          notCache: true
        },
        // component: () => import('@/pages/createWallet/index')
        component: resolve => require.ensure([], () => resolve(require('@/pages/createWallet/create')) )
      }
    ]
  },
  {
    path: '/importWallet',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/',
        meta: {
          title: '导入钱包',
          notCache: true
        },
        // component: () => import('@/pages/createWallet/index')
        component: resolve => require.ensure([], () => resolve(require('@/pages/createWallet/import')) )
      }
    ]
  },
  {
    path: '/myAssets',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/',
        component: resolve => require.ensure([], () => resolve(require('@/pages/myAssets/index')), 'group-assets')
      },
      {
        path: '/Transfer',
        component: resolve => require.ensure([], () => resolve(require('@/pages/transfer/index')), 'group-transfer'), 
        children: [
          {
            path: '/',
            component: resolve => require.ensure([], () => resolve(require('@/pages/transfer/receive')), 'group-transfer')
          },
          {
            path: '/Transfer/tranSend',
            name: 'tranSend',
            component: resolve => require.ensure([], () => resolve(require('@/pages/transfer/send')), 'group-transfer')
          }
        ]
      },
      {
        path: '/LILO',
        component: resolve => require.ensure([], () => resolve(require('@/pages/lilo/index')), 'group-lilo'),
        children: [
          {
            path: '/',
            component: resolve => require.ensure([], () => resolve(require('@/pages/lilo/lockIn')), 'group-lilo')
          }, 
          {
            path: '/LILO/lockOut',
            name: 'lockOut',
            component: resolve => require.ensure([], () => resolve(require('@/pages/lilo/lockOut')), 'group-lilo')
          }
        ]
      },
      {
        path: '/DAPP',
        name: 'DAPP',
        component: resolve => require.ensure([], () => resolve(require('@/pages/dapp/index')), 'group-dapp')
      },
      {
        path: '/backupWallet',
        name: 'backupWallet',
        component: resolve => require.ensure([], () => resolve(require('@/pages/backupWallet/index')), 'group-backup')
      }
    ]
  },
]