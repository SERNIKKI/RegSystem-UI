<template>
  <div class="profile">
		<profile-layout class="layout"></profile-layout>
		<div class="main">
			<el-form :model="user" label-width="100px">
				<page-title class="page-title" title="基础信息" style="margin-bottom: 20px;"></page-title>
				<div style="width: 600px">
					<el-form-item label	="姓名">
						<el-input v-model="user.userRealName" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="电话号码">
						<el-input v-model.number="user.userTel"></el-input>
					</el-form-item>
					<el-form-item label="住址">
						<el-input v-model="user.userAddress"></el-input>
					</el-form-item>
					<el-form-item label="性别">
						<el-radio-group v-model="user	.userSex">
							<el-radio label="男"></el-radio>
							<el-radio label="女"></el-radio>
						</el-radio-group>
					</el-form-item>
				</div>
				<page-title  class="page-title" title="医生信息" style="margin-bottom: 20px;"></page-title>
				<div style="width: 600px" >
					<el-form-item label="职位">
						<el-input v-model="user.userPosition" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="所属科室">
						<el-input v-model="user.department" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="出诊地点">
						<el-input v-model="user.userLocation" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="擅长">
						<el-input v-model="user.userSpecialties" type="textarea" maxlength="500" :autosize="{ minRows: 4, maxRows: 8}" show-word-limit></el-input>
					</el-form-item>
				</div>
				<el-form-item>
					<el-button type="primary" @click="onSubmit" size="small">提交更改</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import ProfileLayout from '@/components/ProfileLayout';
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
			this.$postJson('/reg/system/user/updateUserInfo',this.user).then(res => {
				let resData = res.data
				if(resData.code === 200) {
					this.$store.commit('handleUser', JSON.stringify(res.data.data))
					this.$message.success('修改成功')
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