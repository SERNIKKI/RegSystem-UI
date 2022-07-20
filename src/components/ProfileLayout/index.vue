<template>
	<div class="left-nav">
		<div class="avatar-container">
			<div style="display: contents;" @click="openDialog">
				<el-avatar @click="openDialog"  @mouseover.native="mouseover" @mouseleave.native="mouseleave" class="avatar" style="cursor: pointer;" 
				:src="getAvatar()"></el-avatar>
				<div class="over-avatar" :style="active">更换头像</div>
			</div>
			<div class="div-username">
				<a :title="getUserName()" v-if="user.userType === 'admin'" class="username" href="/adminMain">{{ getUserName() }}</a>
				<a :title="getUserName()" v-else class="username" href="/doctorMain">{{ getUserName() }}</a>
			</div>
		</div>
		<nav>
			<div class="profile-setting">
				<div class="item" style="border-top: 1px solid #e3e9ed">
					<div class="header">消息中心</div>
					<div style="margin-top: 5px">
						<div class="text-item">
							<el-link icon="el-icon-bell" :style="isActive === 0 ? 'font-weight: bold;' : ''" href="/profile/myMessage" :underline="false">我的消息</el-link>
						</div>
						<div class="text-item">
							<el-link icon="el-icon-position" :style="isActive === 1 ? 'font-weight: bold;' : ''" href="/profile/messageSetting" :underline="false">通知设置</el-link>
						</div>
					</div>
				</div>
				<div class="item">
					<div class="header">基本设置</div>
					<div style="margin-top: 5px">
						<div class="text-item">
							<el-link icon="el-icon-postcard" :style="isActive === 2 ? 'font-weight: bold;' : ''" href="/profile/accountInfo" :underline="false">账号信息</el-link>
						</div>
						<div class="text-item">
							<el-link icon="el-icon-user" :style="isActive === 3 ? 'font-weight: bold;' : ''" href="/profile/index" :underline="false">个人资料</el-link>
						</div>
					</div>
				</div>
				<div class="item">
					<div class="header">安全设置</div>
					<div style="margin-top: 5px">
						<div class="text-item">
							<el-link icon="el-icon-time" :style="isActive === 4 ? 'font-weight: bold;' : ''" href="/profile/loginInfo" :underline="false">登陆历史</el-link>
						</div>
					</div>
				</div>
				<div class="item">
					<div class="header">预约设置</div>
					<div style="margin-top: 5px">
						<div class="text-item">
							<el-link icon="el-icon-date" :style="isActive === 5 ? 'font-weight: bold;' : ''" href="/profile/reserveSetting" :underline="false">预约时间</el-link>
						</div>
					</div>
				</div>
				<div class="item" style="border: none">
					<div class="header">审批设置</div>
					<div style="margin-top: 5px">
						<div class="text-item">
							<el-link icon="el-icon-document-add" :style="isActive === 6 ? 'font-weight: bold;' : ''" href="/profile/approval" :underline="false">发起审批</el-link>
						</div>
						<div class="text-item">
							<el-link icon="el-icon-document" :style="isActive === 7 ? 'font-weight: bold;' : ''" href="/profile/myApproval" :underline="false">我的审批</el-link>
						</div>
					</div>
				</div>
			</div>
		</nav>
		<cropper :title="'更换头像'" :open="open" @update:cropperDialog="closeDialog"></cropper>
	</div>
</template>

<script>
import Cropper from '@/components/Cropper';
export default {
	name: "ProfileLayout",
	components: {
		Cropper
	},
	created() {
		this.user = JSON.parse(this.$store.state.user)
		this.changeActice(this.$route.path)
	},
	props: {

	},
	data() {
		return {
			user: null,
			active: '',
			isActive: 0,
			open: false
		}
	},
	methods: {
		getUserName() {
			return JSON.parse(this.$store.state.user).userName
		},
		getAvatar() {
			return JSON.parse(this.$store.state.user).userAvatar
		},
		mouseover() {
			this.active = 'display: block;'
		},
		mouseleave() {
			this.active = 'display: none;'
		},
		changeActice(index) {
			if(index === '/profile/myMessage') {
				this.isActive = 0
			} else if(index === '/profile/messageSetting') {
				this.isActive = 1
			} else if(index === '/profile/accountInfo') {
				this.isActive = 2
			} else if(index === '/profile/index') {
				this.isActive = 3
			} else if(index === '/profile/loginInfo') {
				this.isActive = 4
			} else if(index === '/profile/reserveSetting') {
				this.isActive = 5
			} else if(index === '/profile/approval') {
				this.isActive = 6
			} else if(index === '/profile/myApproval') {
				this.isActive = 7
			}
		},
		closeDialog(value) {
			this.open = value
		},
		openDialog() {
			this.open = true
		}
	}
}
</script>

<style lang="scss" scoped>
.left-nav {
	width: 13.75%;
	height: 720px;
	position: fixed;
	float: left;
	border: 1px solid #e3e9ed;
	margin-top: 10px;
	border-radius: 4px;
	z-index: 1001;
}
.avatar-container {
	margin: 0;
	padding: 12px 15px;
	background: #f8f8f8;
	border-radius: 4px 4px 0 0;
	border: none;
	display: flex;
	.avatar {
		width: 60px;
		height: 60px;
	}
	.username {
		display: block;
    font-size: 1.2em;
    margin-top: 5px;
    margin-bottom: 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
		line-height: 2em;
	}
}
a {
	text-decoration: none;
	cursor: pointer;
	color: #0b71e1;
}
.div-username {
	padding-left: 8px;
	padding-right: 8px;
	overflow: hidden;
	align-items: center;
	display: flex;
	clear: both;
}
.over-avatar {
	width: 60px;
	height: 60px;
	line-height: 60px;
	font-size: 12px;
	border-radius: 50%;
	position: absolute;
	display: none;
	text-align: center;
	background: rgba(0,0,0,0.5);
	cursor: pointer;
	z-index: 10;
	color: #fff;
	pointer-events: none
}
.item {
	padding: 0.78571em 0.95em;
	position: relative;
	line-height: 1.78;
	border-bottom: 1px solid #e3e9ed;
}
.text-item {
	padding: 0.5rem 1.5rem;
  font-size: 0.875rem;
}
</style>