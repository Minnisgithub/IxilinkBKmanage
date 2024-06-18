import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  }
  //   {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  // },
]
export const asyncRoutes = [
  {
    path: '/dashboard',
    component: Layout,
    name: '/dashboard',
    redirect: '/dashboard/index',
    meta: { title: '首页', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'index',
        name: '/dashboard/index',
        component: () => import('@/views/dashboard/index'),
        hidden: true
      }
    ]
  },
  {
    path: '/company',
    component: Layout,
    redirect: '/company/offer',
    name: '/company',
    meta: { title: '厂商订阅', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'offer',
        name: '/company/offer',
        component: () => import('@/views/company/offer'),
        meta: { title: '提供方' }
      },
      {
        path: 'consumer',
        name: '/company/consumer',
        component: () => import('@/views/company/consumer'),
        meta: { title: '消费方' }
      }
    ]
  },
  {
    path: '/port',
    component: Layout,
    redirect: '/port/offer',
    name: '/port',
    meta: { title: '接口订阅', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'offer',
        name: '/port/offer',
        component: () => import('@/views/port/offer'),
        meta: { title: '提供方' }
      },
      {
        path: 'consumer',
        name: '/port/consumer',
        component: () => import('@/views/port/consumer'),
        meta: { title: '消费方' }
      }
    ]
  },
  {
    path: '/subscriptionFind',
    component: Layout,
    name: '/subscriptionFind',
    redirect: '/subscriptionFind/byService',
    meta: { title: '订阅查询', icon: 'form' },
    children: [
      {
        path: 'byService',
        name: '/subscriptionFind/byService',
        component: () => import('@/views/subscriptionFind/ByService'),
        meta: { title: '按服务' }
      },
      {
        path: 'ByManufacturer',
        name: '/subscriptionFind/ByManufacturer',
        component: () => import('@/views/subscriptionFind/ByManufacturer'),
        meta: { title: '按厂商' }
      }
    ]
  },
  {
    path: '/messageLog',
    component: Layout,
    redirect: '/messageLog/index',
    name: '/messageLog',
    meta: { title: '消息日志', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'index',
        name: '/messageLog/index',
        component: () => import('@/views/messageLog/index'),
        hidden: true
      }
    ]
  },
  {
    path: '/followUpMessage',
    component: Layout,
    redirect: '/followUpMessage/index',
    name: '/followUpMessage',
    meta: { title: '消息补推', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'index',
        name: '/followUpMessage/index',
        component: () => import('@/views/followUpMessage/index'),
        hidden: true
      }
    ]
  },
  {
    path: '/reciprocalService',
    component: Layout,
    redirect: '/reciprocalService/index',
    name: '/reciprocalService',
    meta: { title: '交互服务', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'index',
        name: '/reciprocalService/index',
        component: () => import('@/views/reciprocalService/index'),
        hidden: true
      }
    ]
  },
  {
    path: '/log-manage',
    component: Layout,
    name: '/log-manage',
    redirect: '/log-manage/message-log',
    meta: {
      title: '日志管理',
      icon: 'nested'
    },
    children: [
      // {
      //   path: 'message-log',
      //   component: () => import('@/views/logManage/messageLog.vue'),
      //   name: '/log-manage/message-log',
      //   meta: { title: '消息日志' }
      // },
      {
        path: 'operation-log',
        component: () => import('@/views/logManage/operationLog.vue'),
        name: '/log-manage/operation-log',
        meta: { title: '操作日志' }
      },
      {
        path: 'login-log',
        component: () => import('@/views/logManage/loginLog.vue'),
        name: '/log-manage/login-log',
        meta: { title: '登录日志' }
      }
    ]
  },
  {
    path: '/systemM',
    component: Layout,
    name: '/systemM',
    redirect: '/systemM/userM',
    meta: {
      title: '系统管理',
      icon: 'nested'
    },
    children: [
      {
        path: 'userM',
        component: () => import('@/views/systemM/userM'),
        name: '/systemM/userM',
        meta: { title: '用户管理' }
      },
      {
        path: 'roleM',
        component: () => import('@/views/systemM/roleM'),
        name: '/systemM/roleM',
        meta: { title: '角色管理' }
      },
      {
        path: 'companySort',
        component: () => import('@/views/systemM/companySort'),
        name: 'companySort',
        meta: { title: '厂商排序' }
      },
      {
        path: 'systemConfiguration',
        component: () => import('@/views/systemM/systemConfiguration'),
        name: 'systemConfiguration',
        meta: { title: '系统配置' }
      }
    ]
  }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
