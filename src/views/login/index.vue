<template>
  <div class="app">
		<div class="login-page">
      <div class="background"></div>
			<div class="login-form">
				<div class="left">
          <div class="text">
            <p><span style="font-size: 30px;">医疗健康云欢迎您</span></p>
            <p style="margin-top: 8px;"><span style="font-size: 15px;">科学严谨 认真负责 态度良好 患者至上</span></p>
          </div>
				</div>
				<div class="right">
          <div class="form">
            <div class="form-text">
              <div class="head-left">
                <el-image
                  :src="require('../../assets/hearts.png')"
                  fit="cover">
                </el-image>
              </div>
              <div class="head-right">
                <p><span style="font-size: 20px;">医疗健康云服务平台</span></p>
                <p style="margin-top: 8px;"><span style="font-size: 12px;">Medical Health Cloud Service Platform</span></p>
              </div>
            </div>
            <el-form label-position="top" label-width="80px" :model="loginForm">
              <el-alert
                :title="warningText"
                :closable="false"
                v-if="showAlert"
                type="warning"
                show-icon>
              </el-alert>
              <el-form-item label="用户名" v-if="!bindEmail">
                <el-input v-model.trim="loginForm.userName" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item label="密码" v-if="!bindEmail">
                <el-input type="password" auto-complete="new-password" show-password v-model.trim="loginForm.userPassword" placeholder="请输入密码"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" v-if="bindEmail" prop="userEmail">
                <el-input v-model.trim="loginForm.userEmail" placeholder="请输入邮箱"></el-input>
              </el-form-item>
              <el-form-item label="验证码" v-if="bindEmail" prop="code">
                <el-input v-model.trim="loginForm.code" placeholder="请输入验证码">
                  <el-button slot="append" :disabled="disable" @click="sendCode(loginForm, 'false', '绑定邮箱')">{{ getCode }}</el-button>
                </el-input>
              </el-form-item>
              <el-row :gutter="20" type='flex' justify="space-between">
                <el-col :span="8">
                  <el-checkbox class="rember-pass" v-model="loginForm.rememberPass">记住密码</el-checkbox>
                </el-col>
                <el-col :span="10" style="font-size: 14px;">
                  <span style="cursor: pointer;" @click="openDialog">忘记密码?</span>&nbsp;|
                  <span style="cursor: pointer;" @click="openRegister">注册</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col style="font-size: 14px;padding-top: 8px;">
                  <span>注册即代表同意</span><span style="cursor: pointer;color: #409EFF">&nbsp;隐私政策&nbsp;</span>和
                  <span style="cursor: pointer;color: #409EFF">&nbsp;服务条款&nbsp;</span>
                </el-col>
              </el-row>
              <el-form-item style="padding-top: 10px;">
                <el-button style="width: 100%;" :loading="loading" @keyup.enter.native="searchEnterFun" type="primary" @click="login">{{ loading ? '登录中' : '登录'}}</el-button>
              </el-form-item>
            </el-form>
          </div>
				</div>
			</div>
		</div>
    <el-dialog :title="actionType" class="open-dialog" :visible.sync="dialogVisible" width="700px" :before-close="handleClose">
      <div class="left">
        <div class="text">
          <p><span style="font-size: 30px;">医疗健康云欢迎您</span></p>
          <p style="margin-top: 8px;"><span style="font-size: 15px;">科学严谨 认真负责 态度良好 患者至上</span></p>
        </div>
      </div>
      <div class="right">
        <div class="form">
          <div class="form-text">
            <div class="head-left">
              <el-image
                :src="require('../../assets/hearts.png')"
                fit="cover">
              </el-image>
            </div>
            <div class="head-right">
              <p><span style="font-size: 20px;">医疗健康云服务平台</span></p>
              <p style="margin-top: 8px;"><span style="font-size: 12px;">Medical Health Cloud Service Platform</span></p>
            </div>
          </div>
          <el-form label-position="top" status-icon label-width="80px" ref="ruleForm" :model="findPassForm" :rules="rules2">
            <el-alert
              :title="warningText2"
              :closable="false"
              v-if="showAlert2"
              type="warning"
              show-icon>
            </el-alert>
            <el-form-item label="邮箱" v-if="!next" prop="userEmail">
              <el-input v-model.trim="findPassForm.userEmail" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item label="验证码" v-if="!next" prop="code">
              <el-input v-model.trim="findPassForm.code" placeholder="请输入验证码">
                <el-button slot="append" :disabled="disable" @click="sendCode(findPassForm,actionType === '找回密码' ? 'true' : 'false', actionType)">{{ getCode }}</el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="用户名" v-if="next && actionType === '注册账号'">
              <el-input v-model.trim="findPassForm.userName" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item :label="actionType === '注册账号' ? '密码' : '新密码'" v-if="next">
              <el-input type="password" placeholder="请输入密码" auto-complete="new-password" show-password v-model.trim="findPassForm.userPassword">
              </el-input>
            </el-form-item>
            <el-form-item label="确认密码" v-if="next">
              <el-input type="password" placeholder="请再次输入密码" auto-complete="new-password" show-password v-model.trim="findPassForm.againPassword">
              </el-input>
            </el-form-item>
            <el-form-item style="padding-top: 10px;">
              <el-button style="width: 100%;" type="primary" @click="nextStep">{{next ? '完成' : '下一步'}}</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import db from '@/utils/localstorage'
export default {
  created() {
    this.checkLogin()
    this.searchEnterFun()
  },
  data() {
		return {
      dialogVisible: false,
			loginForm: {
        rememberPass: false
      },
      loading: false,
      rules: {
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        userPassword: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      rules2: {
        userEmail: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      warningText: '',
      warningText2: '',
      showAlert: false,
      showAlert2: false,
      userTel: '',
      userEmail: '',
      findPassForm: {},
      getCode: '获取验证码',
      disable: false,
      count: 60,
      next: false,
      bindEmail: false,
      isHaveEmail: '',
      actionType: '找回密码',
		}
	},
  methods: {
    searchEnterFun() {
      document.onkeyup = e =>{
        // 为了更加严谨所以添加了路由路径的判断
        if (e.keyCode === 13 && this.$route.path === '/login') {
        //回车后执行搜索方法
            this.login();
        }
      }
    },
    // 检查账号是否已登录
    checkLogin() {
      this.$get('/reg/system/user/isLogin').then(res => {
        let resData = res.data
        if(resData.code === 200) {
          let isLogin = resData.data
          if(isLogin) {
            let user = JSON.parse(this.$store.state.user)
            if(user) {
              if(user.userType === 'admin') {
                this.$router.push('/medical/regMang')
              } else {
                this.$router.push('/main')
              }
            }
          }
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    login() {
      this.loading = true
      if(!this.bindEmail) {
        // db.save("TOKEN_NAME", 'satoken')
        // db.save("TOKEN_VALUE", '')
        if(!this.loginForm.userName) {
          this.changeAlert('请输入用户名', true)
          this.loading = false
        } else if(!this.loginForm.userPassword) {
          this.changeAlert('请输入密码', true)
          this.loading = false
        }else {
          this.loginForm.userName = this.loginForm.userName.trim()
          this.loginForm.userPassword = this.loginForm.userPassword.trim()
          this.showAlert = false
          this.$login(`/reg/system/user/${this.loginForm.rememberPass ? 'loginByRemember' : 'login'}`, this.loginForm).then(res => {
            let result = res.data
            if(result.code === 200) {
              db.save("TOKEN_NAME", result.data.tokenName)
              db.save("TOKEN_VALUE", result.data.tokenValue)
              this.$get(`/reg/system/user/sessionInfo/${'user'}`).then(res => {
                if(res.data.code === 200) {
                  this.$store.commit('handleUser', JSON.stringify(res.data.data))
                  if(!res.data.data.userEmail) {
                    this.bindEmail = true
                    this.changeAlert('请绑定一个邮箱', true)
                    this.loading = false
                  } else {
                    this.loading = false
                    if(res.data.data.userType === 'admin') {
                      this.$router.push('/medical/regMang')
                    } else {
                      this.$router.push('/doctorMain')
                    }
                  }
                } 
              })
            } else {
              this.$message.error(res.data.msg ? res.data.msg : '账号或密码错误！请重新输入')
              this.loading = false
            }
          })
        }
      } else {
        if(!this.loginForm.userEmail) {
          this.changeAlert('请输入邮箱', true)
          this.loading = false
          return
        }
        if(!this.loginForm.code) {
          this.changeAlert('请输入验证码', true)
          this.loading = false
          return
        }
        if(this.disable === false || !this.isHaveEmail) {
          this.changeAlert('请发送验证码', true)
          this.loading = false
          return
        }
        if(this.isHaveEmail === 'true') {
          this.changeAlert('请输入一个没有绑定账号的邮箱', true)
          this.loading = false
          return
        }
        if(this.isHaveEmail === 'false') {
          this.$get(`/reg/system/user/checkCode/${this.loginForm.code}/${this.loginForm.userEmail}`).then(res => {
            if(res.data.code === 200) {
              this.changeAlert('', false)
              const user = JSON.parse(this.$store.state.user)
              user.userEmail = this.loginForm.userEmail
              this.$postJson('/reg/system/user/updateUserInfo', user).then(res => {
                if(res.data.code === 200) {
                  this.$store.commit('handleUser', JSON.stringify(res.data.data))
                  this.loading = false
                  if(res.data.data.userType === 'admin') {
                    this.$router.push('/medical/regMang')
                  } else {
                    this.$router.push('/main')
                  }
                } 
              })
            } else {
              this.changeAlert(res.data.msg, true)
              this.loading = false
            }
          })
        }
      }
    },
    handleClose() {
      this.findPassForm = {}
      this.changeAlert2('', false)
      this.dialogVisible = false
    },
    // 打开忘记密码弹窗
    openDialog() {
      this.actionType = '找回密码'
      this.changeAlert2('', false)
      this.changeAlert('', false)
      this.dialogVisible = true
    },
    // 打开注册账号弹窗
    openRegister() {
      this.actionType = '注册账号'
      this.changeAlert2('', false)
      this.changeAlert('', false)
      this.dialogVisible = true
    },
    // 发送验证码
    sendCode(form, type, subject) {
      if(!form.userEmail) {
        if(this.dialogVisible === true) {
          this.changeAlert2('请输入邮箱', true)
          this.showAlert2 = true
        } else {
          this.changeAlert('请输入邮箱', true)
        }
        return;
      }
      if(type === 'false') {
        this.$get(`/reg/system/user/isHaveEmail/${form.userEmail}`).then(res => {
          if(res.data.code === 200) {
            this.isHaveEmail = res.data.data
            if(res.data.data === 'true') {
              if(this.actionType === '注册账号') {
                this.changeAlert2('该邮箱已存在，请重新输入', true)
              } else {
                this.changeAlert('该邮箱已存在，请重新输入', true)
              }
              return;
            }
          } else {
            if(this.actionType === '注册账号') {
              this.changeAlert2(res.data.msg, true)
            } else {
              this.changeAlert(res.data.msg, true)
            }
            return;
          }
        })
      }
      this.$get(`/reg/system/user/sendCode/${form.userEmail}/${type}/${subject}`).then(res => {
        if(res.data.code === 200) {
          this.$message.success('发送成功')
          this.showAlert = false
          this.showAlert2 = false
          var countDown = setInterval(() => {
            if (this.count < 1) {
              this.disable = false
              this.getCode = '获取验证码'
              this.count = 60
              clearInterval(countDown)
            } else {
              this.disable = true
              this.getCode = this.count-- + 's后重发'
            }
          }, 1000)
        } else {
          this.message.error(res.data.msg)
        }
      })
    },
    nextStep() {
      if(!this.next) {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            // 检查验证码是否正确
            this.$get(`/reg/system/user/checkCode/${this.findPassForm.code}/${this.findPassForm.userEmail}`).then(res => {
              if(res.data.code === 200) {
                this.next = true;
                this.changeAlert2('', false)
              } else {
                this.changeAlert2(res.data.msg, true)
              }
            })
          } else {
            this.changeAlert2('请将表单填写完整', true)
            return false;
          }
        });
      } else {
        if(!this.findPassForm.userName) {
          this.changeAlert2('请填写用户名', true)
        }
        if(!this.findPassForm.userPassword) {
          this.changeAlert2(this.actionType === '找回密码' ? '请填写新密码' : '请填写密码', true)
        } else if(!this.findPassForm.againPassword) {
          this.changeAlert2('请填写旧密码', true)
        } else if(this.findPassForm.userPassword !== this.findPassForm.againPassword) {
          this.changeAlert2('两次密码的填写不一致', true)
        } else {
          this.$postJson(`${this.actionType === '找回密码' ? '/reg/system/user/findPassword' : '/reg/system/user/register'}`,this.findPassForm).then(res => {
            let resData = res.data
            if(resData.code === 200) {
              this.$message.success(this.actionType === '找回密码' ? '密码修改成功，请重新登录' : '注册成功，请返回登陆')
              this.handleClose()
            } else {
              this.$message.error(resData.msg)
            }
          })
        }
      }
    },
    changeAlert(text, type) {
      this.warningText = text
      this.showAlert = type
    },
    changeAlert2(text, type) {
      this.warningText2 = text
      this.showAlert2 = type
    }
  }
};
</script>

<style lang="scss" scoped>
.login-page {
  .background{
    background: url(../../assets/bg2.png) 100% no-repeat;
    background-size: cover;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: -1;
    overflow: hidden;
  }
	.login-form {
		width: 700px;
		height: 400px;
		border-radius: 12px;
		background-color: #30c7ac;
		position: absolute;
		display: flex;
		z-index:1;
		right: 6%;
		top: 18%;
		.left {
			width: 50%;
			height: 100%;
      display: table;
      text-align: center;
      .text {
        // font-size: 30px;
        color: white;
        display: table-cell;
        vertical-align: middle;
      }
		}
		.right {
			width: 50%;
			height: 100%;
      display: table;
      .form {
        display: table-cell;
        vertical-align: middle;
        padding: 15px;
        color: white;
        .form-text {
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
        }
      }
		}
	}
}
.open-dialog >>> .el-dialog__body {
  width: 700px;
  height: 400px;
  background-color: #2FAF98;
  position: absolute;
  display: flex;
  padding: 0;
  .left {
    width: 50%;
    height: 100%;
    display: table;
    text-align: center;
    .text {
      // font-size: 30px;
      color: white;
      display: table-cell;
      vertical-align: middle;
    }
  }
  .right {
    width: 50%;
    height: 100%;
    display: table;
    .form {
      display: table-cell;
      vertical-align: middle;
      padding: 15px;
      color: white;
      .form-text {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
      }
    }
  }
}
.el-form-item {
  margin-bottom: 4px !important;
  >>> .el-form-item__label {
    padding: 0;
    color: white !important;
  }
}
.el-checkbox {
  color: white;
}
.el-link.el-link--default {
  color: white;
}
.rember-pass{
  .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #116bc5 !important;
  }
}
</style>
