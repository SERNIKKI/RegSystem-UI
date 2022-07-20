import Vue from "vue";
import Router from 'vue-router'
import Layout from "@/views/menu/index";

Vue.use(Router)

const doctorRouter = [{
  path: '/',
  component: Layout,
  children: [
    {
      name: 'main',
      path: '/doctorMain',
      meta: {
          title: '首页',
          noCache: true,
          login: true
      },
      component: () => import('@/views/doctor-page/doctorMain/index')
    },
    {
      name: 'beforeWork',
      path: '/beforeWork',
      meta: {
          title: '诊前',
          noCache: true,
          login: true
      },
      component: () => import('@/views/doctor-page/workbench/beforeWork/index')
    },
    {
      name: 'transferWork',
      path: '/transferWork',
      meta: {
          title: '转诊',
          noCache: true,
          login: true
      },
      component: () => import('@/views/doctor-page/workbench/transferWork/index')
    },
    {
      name: 'work',
      path: '/work',
      meta: {
          title: '诊中',
          noCache: true,
          login: true
      },
      component: () => import('@/views/doctor-page/workbench/work/index')
    },
    {
      name: 'afterWork',
      path: '/afterWork',
      meta: {
          title: '诊后',
          noCache: true,
          login: true
      },
      component: () => import('@/views/doctor-page/workbench/afterWork/index')
    },
    {
      name: 'regMang',
      path: '/regMang/list',
      meta: {
          title: '我的预约',
          noCache: true,
          login: true
      },
      component: () => import('@/views/doctor-page/regMang/regList/index')
    },
    {
      name: 'regMang',
      path: '/regMang/history',
      meta: {
          title: '历史预约',
          noCache: true,
          login: true
      },
      component: () => import('@/views/doctor-page/regMang/regHistory/index')
    },
    {
      name: 'prescriptionMang',
      path: '/doctor/prescriptionMang',
      meta: {
          title: '我的处方单',
          noCache: true,
          login: true
      },
      component: () => import('@/views/doctor-page/prescriptionMang/index')
    }
  ]
}]

export default doctorRouter