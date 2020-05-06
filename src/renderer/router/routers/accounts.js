const Main = resolve => require.ensure([], () => resolve(require('@/components/main/index.vue')) )
export default [
  {
    path: '/createGroup',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/',
        meta: {
          title: '创建共管账户',
          notCache: true
        },
        // component: resolve => require.ensure([], () => resolve(require('@/pages/group/createGroup.vue')) )
        component: resolve => require.ensure([], () => resolve(require('@/pages/account/create/createGroup.vue')) )
      }
    ]
  },
  {
    path: '/createPerson',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/',
        meta: {
          title: '创建个人账户',
          notCache: true
        },
        // component: resolve => require.ensure([], () => resolve(require('@/pages/group/createGroup.vue')) )
        component: resolve => require.ensure([], () => resolve(require('@/pages/account/create/createPerson.vue')) )
      }
    ]
  },
  {
    path: '/gValid',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/',
        meta: {
          title: '组确认',
          notCache: true
        },
        component: resolve => require.ensure([], () => resolve(require('@/pages/group/gValid.vue')) )
      }
    ]
  },
  {
    path: '/account',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/',
        meta: {
          title: '',
          notCache: true
        },
        component: resolve => require.ensure([], () => resolve(require('@/pages/account/index.vue')) ),
        children: [
          {
            path: '/',
            meta: {
              title: '账户',
              notCache: true
            },
            component: resolve => require.ensure([], () => resolve(require('@/pages/account/dtil.vue')) ),
          },
          {
            path: '/account/receive',
            name: 'personReceive',
            meta: {
              title: '接收',
              notCache: true
            },
            component: resolve => require.ensure([], () => resolve(require('@/pages/account/receive.vue')) ),
          },
        ]
      },
    ]
  },
]