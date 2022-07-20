<template>
  <div class="profile">
		<profile-layout class="layout"></profile-layout>
		<div class="main">
			<page-title class="page-title" title="我的消息" style="margin-bottom: 20px;"></page-title>
			<div>
				<el-tabs v-model="activeName" @tab-click="handleTabClick">
					<el-tab-pane label="我的消息" name="1">
						<notifi class="first" :userNo="user.userNo"></notifi>
					</el-tab-pane>
					<el-tab-pane name="2">
						<span slot="label">
							通知<el-badge class="badge" is-dot v-if="notifyCount > 0"></el-badge>
						</span>
						<infos class="second" :userNo="user.userNo"></infos>
					</el-tab-pane>
					<!-- <el-tab-pane label="@我" name="3">
						<referer class="third"></referer>
					</el-tab-pane> -->
				</el-tabs>
			</div>
		</div>
	</div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import ProfileLayout from '@/components/ProfileLayout';
import Notifi from './components/notifications';
import Infos from './components/infos';
import Referer from './components/referer';
export default {
	created() {
		this.user = JSON.parse(this.$store.state.user)
		this.getNewNotifyCount()
	},
	components:{
    PageTitle,
		ProfileLayout,
		Notifi,
		Infos,
		Referer
  },
	data() {
		return {
			user: {},
			activeName: '1',
			notifyCount: 0
		}
	},
	methods: {
		handleTabClick(tab, event) {
			
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
.badge {
	top: -12px;
  left: 5px;
}
</style>