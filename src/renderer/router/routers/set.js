const Main = resolve => require.ensure([], () => resolve(require('@/components/main/index.vue')) )
export default [
  {
    path: '/set',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/',
        meta: {
          title: '设置',
          notCache: true
        },
        component: resolve => require.ensure([], () => resolve(require('@/pages/set/index.vue')) ),
        children: [
          {
            path: '/',
            meta: {
              title: '设置网络',
              notCache: true
            },
            component: resolve => require.ensure([], () => resolve(require('@/pages/set/network.vue')) ),
          },
          {
            path: '/set/groupSet',
            meta: {
              title: '设置组信息',
              notCache: true
            },
            component: resolve => require.ensure([], () => resolve(require('@/pages/set/group.vue')) ),
          },
          {
            path: '/set/gAccount',
            meta: {
              title: '设置共管账户信息',
              notCache: true
            },
            component: resolve => require.ensure([], () => resolve(require('@/pages/set/gAccount.vue')) ),
          },
          {
            path: '/set/release',
            meta: {
              title: '设置共管账户信息',
              notCache: true
            },
            component: resolve => require.ensure([], () => resolve(require('@/pages/set/releaseNode.vue')) ),
          }
        ]
      }
    ]
  }
]