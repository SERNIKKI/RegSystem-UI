// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import request from '@/utils/request'
import axios from 'axios'
import VEmojiPicker from 'v-emoji-picker';
//引入 echarts
import * as echarts from 'echarts'
// 引入全局scss
import './assets/css/index.css'
// 可拖拽
import '@/utils/directives2'
import print from '@/utils/print'
Vue.use(print)
// 格式化时间
import moment from 'moment'
Vue.prototype.$moment = moment

Vue.prototype.$axios = axios

Vue.prototype.$post = request.post
Vue.prototype.$get = request.get
Vue.prototype.$postJson = request.postJson
Vue.prototype.$put = request.put
Vue.prototype.$login = request.login
Vue.prototype.$delete = request.delete
Vue.prototype.$download = request.download
Vue.prototype.$upload = request.upload
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VEmojiPicker);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>',
  created() {
    const userInfoStr = window.localStorage.getItem('user')
    console.log('初始化' + userInfoStr)
    const userInfo = JSON.parse(userInfoStr)
    if(userInfo) {
      const name = userInfo.userName
    }
  },
})
