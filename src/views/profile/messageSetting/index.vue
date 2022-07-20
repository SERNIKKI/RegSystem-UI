<template>
  <div class="profile">
		<profile-layout class="layout"></profile-layout>
		<div class="main">
			<page-title class="page-title" title="通知设置" style="margin-bottom: 20px;"></page-title>
			<el-form :model="settingForm" label-width="120px">
				<el-form-item label="接收站内信通知">
					<el-switch v-model="settingForm.isMessage" active-value="1" nactive-value="0"></el-switch>
				</el-form-item>
				<el-form-item label="接收邮件通知">
					<el-switch v-model="settingForm.isEmail" active-value="1" nactive-value="0"></el-switch>
				</el-form-item>
			</el-form>
      <div class="box">
        <div class="child">
          remilia
        </div>
      </div>
		</div>
	</div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import ProfileLayout from '@/components/ProfileLayout';
export default {
	created() {
		this.userStr = window.localStorage.getItem('user')
	},
	components:{
    PageTitle,
		ProfileLayout
  },
	data() {
		return {
			userStr: '',
			settingForm: {}
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

.box {
  background: #EFC3E6;
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  .child {
    width: 150px;
    height: 150px;
    background: #F0A6CA;
  }
  // .one, .three {
  //   background: #9C89B8;
  // }
}
</style>