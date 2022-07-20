<template>
 <div class="main relative">
    <el-row class="tac bodyHead" style="background-color: #2FAF98">
      <el-col :span="24" class="left">
        <el-menu
          active-text-color="#FFD04B"
          style="background-color: #545C64"
          background-color="#545C64"
          v-if="user.userType === 'admin'"
          text-color="#fff"
          :default-active="activeIndex"
          @open="handleOpen"
          @close="handleClose"
          @select="handleSelect"
          :router="true"
          class="admin-menu"
          mode="horizontal">
          <div class="logo">
            <el-image :src="require('../../assets/logo2.png')" fit="cover" class="img"></el-image>
            <span class="logo-text">医疗健康云</span>
          </div>
          <!-- <el-menu-item index="/adminMain">首页</el-menu-item> -->
          <el-submenu index="/customer">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/customer/doctorManagement">医生管理</el-menu-item>
            <el-menu-item index="/customer/patientManagement">患者管理</el-menu-item>
            <!-- <el-menu-item index="/customer/doctorFeedback">医生反馈</el-menu-item>
            <el-menu-item index="/customer/permissionFeedback">患者反馈</el-menu-item> -->
          </el-submenu>
          <el-submenu index="/medical">
            <template slot="title">
              <i class="el-icon-s-platform"></i>
              医务管理
            </template>
            <el-menu-item index="/medical/departMang">科室管理</el-menu-item>
            <el-menu-item index="/medical/dutyRosterMang">值班表管理</el-menu-item>
            <el-menu-item index="/medical/regMang">预约管理</el-menu-item>
            <el-menu-item index="/medical/prescriptionMang">就诊单管理</el-menu-item>
            <!-- <el-menu-item index="/medical/reportFormMang">报告单模板管理</el-menu-item> -->
          </el-submenu>
          <el-submenu index="/drug">
            <template slot="title">
              <i class="el-icon-s-grid"></i>
              药物管理
            </template>
            <el-menu-item index="/drug/drugMang">西药</el-menu-item>
            <el-submenu index="/drug/ch">
              <template slot="title">中药</template>
              <el-menu-item index="/drug/ch/drugMang">中成药</el-menu-item>
              <el-menu-item index="/drug/ch/herbs">中药材</el-menu-item>
              <el-menu-item index="/drug/ch/recipe">方剂</el-menu-item>
            </el-submenu>
            <el-menu-item index="/drug/drugPrice">价格管理</el-menu-item>
            <el-menu-item index="/drug/drugStock">库存管理</el-menu-item>
            <el-menu-item index="/drug/drugProdMang">生产企业管理</el-menu-item>
          </el-submenu>
          <el-submenu index="/order">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              订单管理
            </template>
            <el-menu-item index="/order/regOrderMang">预约订单管理</el-menu-item>
            <el-menu-item index="/order/prescriptionOrderMang">处方订单管理</el-menu-item>
          </el-submenu>
          <el-submenu index="/system">
            <template slot="title">
              <i class="el-icon-s-tools"></i>
              系统管理
            </template>
            <!-- <el-menu-item index="/system/mainMang">首页管理</el-menu-item> -->
            <el-menu-item index="/system/bulletinMang">公告管理</el-menu-item>
            <el-menu-item index="/system/approval">审批单管理</el-menu-item>
            <el-menu-item index="/system/messageMang">通知管理</el-menu-item>
            <el-menu-item index="/system/previewMang">轮播图管理</el-menu-item>
            <el-menu-item index="/system/accountMang">账号管理</el-menu-item>
            <el-menu-item index="/system/log">系统日志</el-menu-item>
          </el-submenu>
          <!-- <el-submenu :index="index.toString()" v-for="(item, index) in navData" :key="index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{ item.name }}</span>
            </template>
              <el-menu-item :index="even.path" v-for="(even, index) in item.evens" :key="index">{{ even.name }}</el-menu-item>
          </el-submenu> -->
        </el-menu>
        <el-menu
          v-else
          @open="handleOpen2"
          @close="handleClose"
          @select="handleSelect2"
          :default-active="activeIndex"
          mode="horizontal"
          active-text-color="#FFD04B"
          text-color="#fff"
          background-color="#2faf98"
          style="background-color: #2faf98"
          class="doctor-menu"
          :router="true" >
          <div class="logo">
            <el-image :src="require('../../assets/logo2.png')" fit="cover" class="img"></el-image>
            <span class="logo-text">医疗健康云</span>
          </div>
          <el-submenu :index="index.toString()" v-for="(item, index) in navData2" :key="index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item :index="even.path" v-for="(even, index) in item.evens" :key="index">{{ even.name }}</el-menu-item>
          </el-submenu>
        </el-menu>
        <div class="avatar">
          <el-badge is-dot v-if="newsCount > 0 || notifyCount > 0">
            <el-tooltip effect="dark" content="消息" placement="bottom">
              <i class="el-icon-bell notify-icon" @click="toNotifyPage"></i>
            </el-tooltip>
          </el-badge>
          <el-tooltip effect="dark" content="通知" placement="bottom" v-else>
            <i class="el-icon-bell notify-icon" @click="toNotifyPage"></i>
          </el-tooltip>
          <el-dropdown placement="bottom" @command="handleCommand" style="margin-left: 20px;">
            <el-avatar style="cursor: pointer;" :src="getAvatar()"></el-avatar>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="index">个人中心</el-dropdown-item>
              <el-dropdown-item command="myMessage">我的消息</el-dropdown-item>
              <el-dropdown-item command="reserveSetting">预约设置</el-dropdown-item>
              <el-dropdown-item command="changeAccount">切换账号</el-dropdown-item>
              <el-dropdown-item divided command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span class="text" :style="nameStyle" :title="getUserName()">{{getUserName()}}</span>
        </div>
      </el-col>
    </el-row>
    <el-page-header v-if="!main" style="border-bottom: 1px solid #e5e5e5;line-height: 40px;" @back="goBack" :content="title"></el-page-header>
    <div class="body mainBody" :style="{height: height + 'px'}"><router-view></router-view></div>
  </div>
</template>

<script>
import db from '@/utils/localstorage'
 export default {
    name: 'home',
    created() {
      this.user = JSON.parse(this.$store.state.user)
      // 根据登录角色不同，设置layout风格
      if(this.user.userType === 'admin') {
        let sty = {
          "background-color": '#000'
        }
        let sty2 = {
          "color": '#fff'
        }
        this.style = sty
        this.nameStyle = sty2
      } else {
        let sty = {
          "background-color": 'rgb(127 199 220)'
        }
        let sty2 = {
          "color": '#fff'
        }
        this.style = sty
        this.nameStyle = sty2
      }
      this.getNewsCount()
      this.getHeight()
    },
    mounted() {
      this.activeIndex = this.$route.path
      if(!this.activeIndex.includes('profile')) {
        this.title = this.$route.meta.title
        this.main = this.title === '首页' ? true : false
      }
      // 开启轮询，每隔5s查询一次是否有新消息
      window.timer = setInterval(() => {
        setTimeout(() => {
          this.getNewsCount()
          this.getNewNotifyCount()
        }, 600)
      }, 5000)
    },
    watch:{
      $route:{
        handler(val,oldval){
          // console.log(val);//新路由信息
          // console.log(oldval);//老路由信息
          if(this.user.userType === 'doctor') {
            this.handleSelect2(val.path, null)
          } else {
            this.handleSelect(val.path, null)
          }
          // this.activeIndex = val
          // this.title = this.doctorTitle[val]
          // this.main = this.title === '首页' ? true : false
        },
        // 深度观察监听
        deep: true
      }
    },
    data() {
      return {
        style: {},
        nameStyle: {},
        user: {},
        activeIndex: '/adminMain',
        adminTitle: {
          '/adminMain' : '首页',
          '/customer/doctorManagement' : '医生管理',
          '/customer/patientManagement' : '患者管理',
          '/customer/doctorFeedback' : '医生反馈',
          "/customer/permissionFeedback": '患者反馈',
          '/permissionSetting' : '权限设置',
          '/medical/departMang' : '科室管理',
          '/medical/dutyRosterMang' : '值班表管理',
          '/medical/reportFormMang' : '报告单模板管理',
          '/drug/drugMang' : '西药',
          '/drug/ch/drugMang' : '中成药',
          '/drug/ch/herbs' : '中药材',
          '/drug/ch/recipe': '方剂',
          '/drug/drugPrice': '价格管理',
          '/drug/drugStock': '库存管理',
          '/drug/drugProdMang': '生产企业',
          '/system/mainMang' : '首页管理',
          '/system/bulletinMang' : '公告管理',
          '/system/accountMang' : '账号管理',
          '/system/messageMang' : '通知管理',
          '/system/previewMang' : '轮播图管理',
          '/system/approval' : '审批单管理',
          '/medical/regMang': '预约管理',
          '/medical/prescriptionMang' : '就诊单管理',
          '/order/regOrderMang' : '预约订单管理',
          '/order/prescriptionOrderMang' : '处方订单管理'
        },
        doctorTitle: {
          '/doctorMain' : '首页',
          '/beforeWork' : '诊前',
          '/transferWork' : '转诊',
          '/work' : '诊中',
          '/afterWork' : '诊后',
          '/regMang/list' : '我的预约',
          '/regMang/history' : '历史预约',
          // '/appointment/report' : '预约报表',
          '/doctor/prescriptionMang' : '诊断报告',
          '/dutyRoster' : '值班表',
          '/permissionFeedback' : '患者反馈',
        },
        navData2: [
          { num: 1 , name: "首页", icon: 'el-icon-house' , evens: [ { name:'首页', path: '/doctorMain' } ] },
          { num: 2 , name: "医生诊台", icon: 'el-icon-s-custom' , evens: [ { name:'诊前', path: '/beforeWork' },
            { name: '转诊', path: '/transferWork' }, { name: '诊中', path: '/work' },{ name: '诊后', path: '/afterWork' }]
          },
          { num: 3 , name: "预约管理", icon: 'el-icon-s-data' , evens: [ { name:'我的预约', path: '/regMang/list' },
            { name: '历史预约', path: '/regMang/history' }]
          },
          { num: 4 , name: "诊断报告", icon: 'el-icon-folder-checked' , evens: [ { name:'诊断报告', path: '/doctor/prescriptionMang' }]
          },
          // {
          //   num: 5, name: "值班表", icon: '', evens: [{
          //     name: '值班表', path: '9'
          //   }]
          // },
          // {
          //   num: 6, name: '患者反馈', icon: '', evens: [
          //     {name: '患者反馈', path: '10'}
          //   ]
          // }
        ],
        bread : [
          { name: '首页', path: '/' }
        ],
        title: '',
        main: true,
        newsCount: 0,
        height: 600,
        notifyCount: 0
      }
    },
    methods: {
      getHeight() {
        const clientHeight = document.documentElement.clientHeight
        this.height = clientHeight - 100
      },
      getUserName() {
        return JSON.parse(this.$store.state.user).userName
      },
      getAvatar() {
        return JSON.parse(this.$store.state.user).userAvatar
      },
      // 跳转到消息页面
      toNotifyPage() {
        this.$router.push('/profile/myMessage')
      },
      // 是否有新消息
      getNewsCount() {
        this.$get(`/reg/system/message/getNewsCount/${this.user.userNo}`).then(res => {
          let resData = res.data
          if(resData.code === 200) {
            this.newsCount = resData.data
          } else {
            this.$message.error(resData.msg);
          }
        })
      },
      // 是否有新通知
      getNewNotifyCount() {
        this.$get(`/reg/system/notify/count/${this.user.userNo}`).then(res => {
          const resData = res.data
          if(resData.code === 200) {
            this.notifyCount = resData.data
          } else {
            this.$message.error(resData.msg);
          }
        })
      },
      goBack() {
        if(this.user.userType === 'admin') {
          this.$router.push('/adminMain')
          this.activeIndex = "adminMain"
        } else {
          this.$router.push('/doctorMain')
        }
        this.main = true
      },
      handleOpen(key, keyPath) {
        this.bread = [];
        this.bread.push(this.navData[key])
      },
      handleOpen2(key, keyPath) {
        this.bread = [];
        this.bread.push(this.navData2[key])
      },
      handleClose(key, keyPath) {
        this.bread = []
      },
      handleSelect(key, keyPath) {
        // console.log(keyPath)
        // console.log(key)
        this.activeIndex = key
        this.title = this.adminTitle[key]
        this.main = this.title === '首页' ? true : false
      },
      handleSelect2(key, keyPath) {
        // this.bread.length = 1;
        // let date = this.navData2[keyPath[0]].evens
        // for (let key in date) {
        //   if(date[key].path == keyPath[1]){
        //     this.bread.push(date[key])
        //   }
        // }
        // this.title = this.bread[this.bread.length - 1].name
        // this.main = this.title === '首页' ? true : false
        // this.$router.push(this.bread[this.bread.length - 1].path)
        if(this.doctorTitle[key]) {
          this.activeIndex = key
          this.title = this.doctorTitle[key]
          this.main = this.title === '首页' ? true : false
        }
      },
      handleCommand(command) {
        this.main = true
        this.activeIndex = '-1'
        if(command === this.$route.name) {
          return
        }
        if(command === 'index') {
          this.$router.push('/profile/index')
        } else if(command === 'logout') {
          this.logout()
        } else if(command === 'myMessage') {
          this.$router.push('/profile/myMessage')
        } else if(command === 'reserveSetting') {
          this.$router.push('/profile/reserveSetting')
        } else if(command === 'changeAccount') {
          this.changeAccount()
        }
      },
      // 切换账号
      changeAccount() {
        this.$confirm('切换账号，当前未保存的数据将会丢失，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$get(`/reg/system/user/logout/${this.user.loginNo}`).then(res => {
            let resDate = res.data
            if(resDate.code === 200) {
              this.$message({
                type: 'success',
                message: '退出成功!'
              });
              db.remove('TOKEN_NAME')
              db.remove('TOKEN_VALUE')
              db.remove('user')
              this.$router.push('/login')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      // 退出登录
      logout() {
        this.$confirm('退出登录，当前未保存的数据将会丢失，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$get(`/reg/system/user/logout/${this.user.loginNo}`).then(res => {
            let resDate = res.data
            if(resDate.code === 200) {
              this.$message({
                type: 'success',
                message: '退出成功!'
              });
              db.remove('TOKEN_NAME')
              db.remove('TOKEN_VALUE')
              db.remove('user')
              this.$router.push('/login')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
.avatar {
  position: absolute;
  right: 0;
  top: 0;
  height: 60px;
  width: 180px;
  display: flex;
  align-items: center;
}
.text {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100px;
  margin-left: 10px;
  line-height: 2em;
}
.logo {
  float: left;
  height: 60px;
  width: 150px;
  padding-left: 40px;
  display: flex;
  align-items: center;
  .img {
    height: 45px;
    width: 45px;
  }
  .logo-text {
    color: #fff;
    padding-left: 10px;
    font-size: 18px;
  }
}
.notify-icon {
  font-size: 20px;
  color: #fff;
  cursor: pointer;
}
.notify-icon:hover {
  color: #FFD04B;
}
.doctor-menu {
  >>> .el-submenu__title i {
    color: #fff;
  }
  >>> .el-submenu.is-active {
    .el-submenu__title i {
      color: #FFD04B;
    }
  }
}
.admin-menu {
  >>> .el-submenu__title i {
    color: #fff;
  }
  >>> .el-submenu.is-active {
    .el-submenu__title i {
      color: #FFD04B;
    }
  }
}
</style>
