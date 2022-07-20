<template>
  <div class="profile">
		<profile-layout class="layout"></profile-layout>
		<div class="main">
			<page-title class="page-title" title="账号信息" style="margin-bottom: 20px;"></page-title>
			<div style="width: 600px">
				<el-form :model="user" label-width="100px">
					<el-form-item label="登录账号">
						<el-input v-model="user.userName"></el-input>
					</el-form-item>
					<el-form-item label="密码">
						<el-input type="password" :disabled="true" auto-complete="new-password" show-password v-model.trim="user.userPassword"></el-input>
					</el-form-item>
					<el-form-item label="邮箱">
						<el-input v-model="user.userEmail"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onSubmit">提交更改</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import ProfileLayout from '@/components/ProfileLayout';
import db from '@/utils/localstorage'
export default {
	created() {
		this.user = JSON.parse(this.$store.state.user)
	},
	components:{
    PageTitle,
		ProfileLayout
  },
	data() {
		return {
			user: null
		}
	},
	methods: {
		onSubmit() {
			if(this.user.userName === '') {
				this.$message.error('登陆账号不能为空！')
				return
			}
			if(this.user.userPassword === '') {
				this.$message.error('密码不能为空！')
				return
			}
			if(this.user.userEmail === '') {
				this.$message.error('邮箱不能为空！')
				return
			}
			if(!this.user.userEmail.match(/^\w+@\w+\.\w+$/i)) {
				this.$message.error('邮箱格式不正确！')
				return
			}
			this.$postJson('/reg/system/user/updateUserInfo',this.user).then(res => {
				let resData = res.data
				if(resData.code === 200) {
					this.$store.commit('handleUser', JSON.stringify(res.data.data))
					this.$message.success('修改成功，请重新登录')
					this.$router.push('/login')
				} else {
					this.$message.error(resData.msg)
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.profile {
	width: 1240px;
	padding: 0 20px;
	margin: 0 auto;
	position: relative;
}
.main {
	width: 87.5%;
  padding-left: 1.5em !important;
	position: relative;
  left: 19.5%;
}
</style>