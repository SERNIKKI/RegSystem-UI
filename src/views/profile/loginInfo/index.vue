<template>
  <div class="profile">
		<profile-layout class="layout"></profile-layout>
		<div class="main">
			<page-title class="page-title" title="登陆历史" style="margin-bottom: 20px;"></page-title>
			<div>
				<el-alert
					title="只显示前50条登录历史"
					type="warning"
					:closable="false"
					style="margin-bottom: 10px;"
					show-icon>
				</el-alert>
				<el-timeline>
					<el-timeline-item v-for="(item, index) in infoList" :key="index"
						placement="top"
						:timestamp="item.loginTime">
						<el-card>
							<p style="font-size: 16px;font-weight: 500;color: #40485b;line-height: 22px;"><span>{{ item.loginAddress }}&nbsp;</span><span>{{ item.loginIp }}</span></p>
							<p style="color: #4baf50;font-size: 14px;line-height: 20px;"><span>{{ item.loginRemark }}</span><span>({{ item.loginEqui }}登录)</span></p>
							<p style="line-height: 20px;"><span>{{ item.loginInformation }}</span></p>
						</el-card>
					</el-timeline-item>
				</el-timeline>
			</div>
		</div>
	</div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import ProfileLayout from '@/components/ProfileLayout';
export default {
	created() {
		this.user = JSON.parse(this.$store.state.user)
		this.initPage()
	},
	components:{
    PageTitle,
		ProfileLayout
  },
	data() {
		return {
			user: null,
			infoList: []
		}
	},
	methods: {
		initPage() {
			this.$get(`/reg/system/loginInfo/getLoginInfoList/${this.user.userNo}`).then(res => {
				let resData = res.data
				if(resData.code === 200) {
					this.infoList = resData.data
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