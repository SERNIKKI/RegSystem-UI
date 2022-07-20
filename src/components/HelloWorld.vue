<template>
  <div>
    <el-button type="primary" size="small" @click="login('蕾咪', 'sernikki000602')">登录</el-button>
    <el-button type="primary" size="small" @click="isLogin()">查询登录状态</el-button>
    <el-button type="primary" size="small" @click="getTokenInfo()">获取token信息</el-button>
    <el-button type="primary" size="small" @click="getSession()">获取session信息</el-button>
  </div>
</template>

<script>
import db from '@/utils/localstorage'
export default {
  name: 'HelloWorld',
  data () {
    return {
      user: JSON.parse(this.$store.state.user),
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    login(userName, userPassword) {
      this.$postJson('/reg/system/user/loginByRemember', {userName, userPassword}).then(res => {
        let result = res.data
        if(result.code === 200) {
          db.save("TOKEN_NAME", result.data.tokenName)
          db.save("TOKEN_VALUE", result.data.tokenValue)
          this.$get(`/reg/system/user/sessionInfo/${'user'}`).then(res => {
            if(res.data.code === 200) {
              this.$store.commit('handleUser',JSON.stringify(res.data.data));
            }
          })
        }
      })
    },
    isLogin() {
      this.$get('/reg/system/user/isLogin').then(res => {
        console.log(res)
      })
    },
    getTokenInfo() {
      this.$get('/reg/system/user/tokenInfo').then(res => {
        console.log(res)
      })
    },
    getSession() {
      let user = 'user'
      this.$get(`/reg/system/user/sessionInfo/${user}`).then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  scoped>
</style>
