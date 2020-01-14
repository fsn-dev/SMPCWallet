// const Main = resolve => require.ensure([], () => resolve(require('@/components/main/index')) )
const Bg = resolve => require.ensure([], () => resolve(require('@/components/bg/index.vue')) )
const Main = resolve => require.ensure([], () => resolve(require('@/components/main/index.vue')) )
const Account = resolve => require.ensure([], () => resolve(require('@/components/account/index.vue')) )
const Receive = resolve => require.ensure([], () => resolve(require('@/components/account/receive.vue')) )

export default [
  {
    path: '/',
    component: Bg,
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
        component: resolve => require.ensure([], () => resolve(require('@/pages/home/enter.vue')) )
      }
    ]
  },
  {
    path: '/login',
    component: Bg,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/',
        meta: {
          title: '登陆',
          notCache: true
        },
        component: resolve => require.ensure([], () => resolve(require('@/pages/home/login.vue')) )
      }
    ]
  },
  {
    path: '/register',
    component: Bg,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/',
        meta: {
          title: '注册',
          notCache: true
        },
        component: resolve => require.ensure([], () => resolve(require('@/pages/home/register.vue')) )
      }
    ]
  },
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
          title: '创建组',
          notCache: true
        },
        component: resolve => require.ensure([], () => resolve(require('@/pages/group/createGroup.vue')) )
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
    path: '/person',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/',
        meta: {
          title: '个人账户',
          notCache: true
        },
        component: Account,
      },
      {
        path: '/person/receive',
        name: 'personReceive',
        meta: {
          title: '接收',
          notCache: true
        },
        component: Receive
      }
    ]
  },
  {
    path: '/group',
    component: Main,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/',
        meta: {
          title: '共管账户',
          notCache: true
        },
        component: resolve => require.ensure([], () => resolve(require('@/pages/group/index.vue')) ),
        children: [
          {
            path: '/',
            meta: {
              title: '共管账户',
              notCache: true
            },
            component: Account
          },
          {
            path: '/group/receive',
            name: 'groupReceive',
            meta: {
              title: '接收',
              notCache: true
            },
            component: Receive
          },
        ]
      },
    ]
  },
  {
    path: '/sendTxns',
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
        component: resolve => require.ensure([], () => resolve(require('@/pages/txns/index.vue')) )
      }
    ]
  },
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
  // {
  //   path: '/txnsHistory',
  //   component: Main,
  //   meta: {
  //     notCache: true
  //   },
  //   children: [
  //     {
  //       path: '/',
  //       meta: {
  //         title: '交易历史',
  //         notCache: true
  //       },
  //       component: resolve => require.ensure([], () => resolve(require('@/pages/txns/history.vue')) )
  //     }
  //   ]
  // },
  // {
  //   path: '/groupHistory',
  //   component: Main,
  //   meta: {
  //     notCache: true
  //   },
  //   children: [
  //     {
  //       path: '/',
  //       meta: {
  //         title: '创建共管账户历史',
  //         notCache: true
  //       },
  //       component: resolve => require.ensure([], () => resolve(require('@/pages/group/history.vue')) )
  //     }
  //   ]
  // },
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
    path: '/waitNews',
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
    path: '/tNewsList',
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
        component: resolve => require.ensure([], () => resolve(require('@/pages/news/tNewsList.vue')) )
      }
    ]
  },
  {
    path: '/gNewsList',
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
        component: resolve => require.ensure([], () => resolve(require('@/pages/news/gNewsList.vue')) )
      }
    ]
  },
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
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: resolve => require.ensure([], () => resolve(require('@/pages/public/error')) )
  }
]