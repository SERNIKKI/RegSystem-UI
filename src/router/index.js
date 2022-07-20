import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Layout from '@/views/menu/index'
import adminRouter from './adminRouter/index.js'
import doctorRouter from './doctorRouter/index.js'
import request from '@/utils/request'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(Router)

const constRouter = [
  ...adminRouter,
  ...doctorRouter,
  {
    path: '/login',
    name: '登录',
    component: () => import('@/views/login/index')
  },
  {
    path: '/profile',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'index',
        meta: { title: '个人中心', login: true, noCache: true }
      },
      {
        path: 'accountInfo',
        component: () => import('@/views/profile/accountInfo/index'),
        name: 'accountInfo',
        meta: { title: '账号信息', login: true, noCache: true }
      },
      {
        path: 'loginInfo',
        component: () => import('@/views/profile/loginInfo/index'),
        name: 'loginInfo',
        meta: { title: '登陆历史', login: true, noCache: true }
      },
      {
        path: 'messageSetting',
        component: () => import('@/views/profile/messageSetting/index'),
        name: 'messageSetting',
        meta: { title: '通知设置', login: true, noCache: true }
      },
      {
        path: 'myMessage',
        component: () => import('@/views/profile/myMessage/index'),
        name: 'myMessage',
        meta: { title: '我的消息', login: true, noCache: true }
      },
      {
        path: 'reserveSetting',
        component: () => import('@/views/profile/reserveSetting/index'),
        name: 'reserveSetting',
        meta: { title: '预约设置', login: true, noCache: true }
      },
      {
        path: 'approval',
        component: () => import('@/views/profile/approval/index'),
        name: 'approval',
        meta: { title: '发起审批', login: true, noCache: true }
      },
      {
        path: 'myApproval',
        component: () => import('@/views/profile/approval/myApproval'),
        name: 'myApproval',
        meta: { title: '我的审批', login: true, noCache: true }
      }
    ]
  },
]

const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constRouter
})

//控制登录 验证才能进入页面
router.beforeEach((to,from,next)=>{
  NProgress.start();
  if (to.path == "/") {
    next('/login')
  } else if(to.meta.login){
    //判断 用户是否登录 用户名密码 以及Token是否已过期
    if(localStorage.getItem("user")){
      request.get('/reg/system/user/isLogin').then((res) => {
        if(res.data.code === 200) {
          if(res.data.data) {
            next();
          } else {
            router.push("/login");
          }
        } else {
          router.push("/login");
        }
      })
    } else {
      router.push("/login");
    }
  }else{
    next();
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
