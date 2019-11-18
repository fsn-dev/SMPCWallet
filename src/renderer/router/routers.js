// const Main = resolve => require.ensure([], () => resolve(require('@/components/main/index')) )
const Bg = resolve => require.ensure([], () => resolve(require('@/components/bg/index')) )
const Content = resolve => require.ensure([], () => resolve(require('@/components/content/index')) )


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
        component: resolve => require.ensure([], () => resolve(require('@/pages/home/enter')) )
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
        component: resolve => require.ensure([], () => resolve(require('@/pages/home/login')) )
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
        component: resolve => require.ensure([], () => resolve(require('@/pages/home/register')) )
      }
    ]
  },
  {
    path: '/createGroup',
    component: Content,
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
        component: resolve => require.ensure([], () => resolve(require('@/pages/group/createGroup')) )
      }
    ]
  },
  {
    path: '/gValid',
    component: Content,
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
        component: resolve => require.ensure([], () => resolve(require('@/pages/group/gValid')) )
      }
    ]
  },
  {
    path: '/group',
    component: Content,
    meta: {
      notCache: true
    },
    children: [
      {
        path: '/',
        meta: {
          title: '组',
          notCache: true
        },
        component: resolve => require.ensure([], () => resolve(require('@/pages/group/index')) ),
        children: [
          {
            path: '/',
            meta: {
              title: '组',
              notCache: true
            },
            component: resolve => require.ensure([], () => resolve(require('@/pages/group/gDtil')) )
          },
          {
            path: '/group/receive',
            meta: {
              title: '组',
              notCache: true
            },
            component: resolve => require.ensure([], () => resolve(require('@/pages/group/receive')) )
          },
        ]
      },
    ]
  },
  {
    path: '/sendTxns',
    component: Content,
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
        component: resolve => require.ensure([], () => resolve(require('@/pages/txns/index')) )
      }
    ]
  },
  {
    path: '/tValid',
    component: Content,
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
        component: resolve => require.ensure([], () => resolve(require('@/pages/txns/tValid')) )
      }
    ]
  },
  {
    path: '/tNewsList',
    component: Content,
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
        component: resolve => require.ensure([], () => resolve(require('@/pages/news/tNewsList')) )
      }
    ]
  },
  {
    path: '/gNewsList',
    component: Content,
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
        component: resolve => require.ensure([], () => resolve(require('@/pages/news/gNewsList')) )
      }
    ]
  },
]