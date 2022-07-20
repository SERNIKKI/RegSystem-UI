import Vue from "vue";
import Router from 'vue-router'
import Layout from "@/views/menu/index";

Vue.use(Router)

const adminRouter = [{
  path: '/',
  component: Layout,
  children: [
    {
      name: 'main',
      path: '/adminMain',
      meta: {
          title: '首页',
          noCache: true,
          login: true
      },
      component: () => import('@/views/admin-page/adminMain/index')
    },
    {
      name: 'accountMang',
      path: '/system/accountMang',
      meta: {
          title: '账号管理',
          noCache: true,
          login: true
      },
      component: () => import('@/views/admin-page/accountMang/index')
    },
    {
      name: 'bulletinMang',
      path: '/system/bulletinMang',
      meta: {
          title: '公告管理',
          noCache: true,
          login: true
      },
      component: () => import('@/views/admin-page/bulletinMang/index')
    },
    {
      name: 'departMang',
      path: '/medical/departMang',
      meta: {
          title: '科室管理',
          noCache: true,
          login: true
      },
      component: () => import('@/views/admin-page/departMang/index')
    },
    {
      name: 'doctorManagement',
      path: '/customer/doctorManagement',
      meta: {
          title: '医生管理',
          noCache: true,
          login: true
      },
      component: () => import('@/views/admin-page/doctorManagement/index')
    },
    {
      name: 'patientManagement',
      path: '/customer/patientManagement',
      meta: {
          title: '患者管理',
          noCache: true,
          login: true
      },
      component: () => import('@/views/admin-page/patientManagement/index')
    },
    {
      name: 'permissionSetting',
      path: '/permissionSetting',
      meta: {
          title: '权限设置',
          noCache: true,
          login: true
      },
      component: () => import('@/views/admin-page/permissionSetting/index')
    },
    {
      name: 'doctorFeedback',
      path: '/customer/doctorFeedback',
      meta: {
          title: '医生反馈',
          noCache: true,
          login: true
      },
      component: () => import('@/views/admin-page/doctorFeedback/index')
    },
    {
      name: 'permissionFeedback',
      path: '/customer/permissionFeedback',
      meta: {
          title: '患者反馈',
          noCache: true,
          login: true
      },
      component: () => import('@/views/admin-page/permissionFeedback/index')
    },
    {
      name: 'dutyRosterMang',
      path: '/medical/dutyRosterMang',
      meta: {
          title: '值班表管理',
          noCache: true,
          login: true
      },
      component: () => import('@/views/admin-page/dutyRosterMang/index')
    },
    {
      name: 'reportFormMang',
      path: '/medical/reportFormMang',
      meta: {
          title: '报告单模板管理',
          noCache: true,
          login: true
      },
      component: () => import('@/views/admin-page/reportFormMang/index')
    },
    {
      name: 'drugMang',
      path: '/drug/drugMang',
      meta: {
          title: '西药',
          noCache: true,
          login: true
      },
      component: () => import('@/views/admin-page/drugMang/index')
    },
    {
      name: 'chineseMedicine',
      path: '/drug/ch/drugMang',
      meta: {
          title: '中成药',
          noCache: true,
          login: true
      },
      component: () => import('@/views/admin-page/drugMang/ch/index')
    },
    {
      name: 'herbs',
      path: '/drug/ch/herbs',
      meta: {
          title: '中药材',
          noCache: true,
          login: true
      },
      component: () => import('@/views/admin-page/drugMang/ch/herbs')
    },
    {
      name: 'recipe',
      path: '/drug/ch/recipe',
      meta: {
          title: '方剂',
          noCache: true,
          login: true
      },
      component: () => import('@/views/admin-page/drugMang/ch/recipe')
    },
    {
      name: 'drugPrice',
      path: '/drug/drugPrice',
      meta: {
          title: '价格管理',
          noCache: true,
          login: true
      },
      component: () => import('@/views/admin-page/drugMang/drugPrice')
    },
    {
      name: 'drugStock',
      path: '/drug/drugStock',
      meta: {
          title: '库存管理',
          noCache: true,
          login: true
      },
      component: () => import('@/views/admin-page/drugMang/drugStock')
    },
    {
      name: 'drugProdMang',
      path: '/drug/drugProdMang',
      meta: {
          title: '制药企业',
          noCache: true,
          login: true
      },
      component: () => import('@/views/admin-page/drugMang/drugProdMang/index')
    },
    {
      name: 'messageMang',
      path: '/system/messageMang',
      meta: {
          title: '通知管理',
          noCache: true,
          login: true
      },
      component: () => import('@/views/admin-page/messageMang/index')
    },
    {
      name: 'mainMang',
      path: '/system/mainMang',
      meta: {
          title: '首页管理',
          noCache: true,
          login: true
      },
      component: () => import('@/views/admin-page/mainMang/index')
    },
    {
      name: 'systemLog',
      path: '/system/log',
      meta: {
          title: '系统日志',
          noCache: true,
          login: true
      },
      component: () => import('@/views/admin-page/systemLog/index')
    },
    {
      name: 'systemPreview',
      path: '/system/previewMang',
      meta: {
          title: '轮播图管理',
          noCache: true,
          login: true
      },
      component: () => import('@/views/admin-page/previewMang/index')
    },
    {
      name: 'systemApproval',
      path: '/system/approval',
      meta: {
          title: '审批单管理',
          noCache: true,
          login: true
      },
      component: () => import('@/views/admin-page/approval/index')
    },
    {
      name: 'regMang',
      path: '/medical/regMang',
      meta: {
          title: '预约管理',
          noCache: true,
          login: true
      },
      component: () => import('@/views/admin-page/regMang/index')
    },
    {
      name: 'prescriptionMang',
      path: '/medical/prescriptionMang',
      meta: {
          title: '就诊单管理',
          noCache: true,
          login: true
      },
      component: () => import('@/views/admin-page/prescriptionMang/index')
    },
    {
      name: 'regOrderMang',
      path: '/order/regOrderMang',
      meta: {
          title: '预约订单管理',
          noCache: true,
          login: true
      },
      component: () => import('@/views/admin-page/regOrderMang/index')
    },
    {
      name: 'prescriptionOrderMang',
      path: '/order/prescriptionOrderMang',
      meta: {
          title: '处方订单管理',
          noCache: true,
          login: true
      },
      component: () => import('@/views/admin-page/prescriptionOrderMang/index')
    },
  ]
}]

export default adminRouter