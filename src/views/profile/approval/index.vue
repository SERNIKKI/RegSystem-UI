<template>
  <div class="profile">
		<profile-layout class="layout"></profile-layout>
		<div class="main">
			<page-title class="page-title" title="发起审批" style="margin-bottom: 10px"></page-title>
			<div>
				<el-form :model="approvalInfo" :rules="rules" ref="form" label-width="100px">
					<el-form-item label="审批单类型" prop="approvalType">
						<el-select v-model="approvalInfo.approvalType">
							<el-option
								v-for="(item, index) in approvalTypeLabel"
								:key="index"
								:label="item"
								:value="item">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="审批内容" prop="approvalContact">
						<el-input type="textarea" :rows="8" v-model="approvalInfo.approvalContact"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" icon="el-icon-position" :loading="loading" @click="onSubmit">确定</el-button>
						<el-button icon="el-icon-delete" @click="clearForm">清空</el-button>	
					</el-form-item>
				</el-form>
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
		if(typeof(this.$route.params.approvalInfo) !== 'undefined') {
      this.approvalInfo = this.$route.params.approvalInfo
    }
	},
	components:{
    PageTitle,
		ProfileLayout
  },
	data() {
		return {
			user: null,
			approvalTypeLabel: [ '请假审批', '修改密码', '职位变动', '物品审批', '设备审批', '其他审批' ],
			approvalInfo: {},
			rules: {
				approvalType: [{ required: true, message: '请选择审批类型', trigger: 'change' }],
        approvalContact: [{ required: true, message: '请输入审请内容', trigger: 'blur' }]
			},
			loading: false
		}
	},
	methods: {
		clearForm() {
			this.approvalInfo = {}
			this.$refs['form'].resetFields();
		},
		onSubmit() {
			this.$refs['form'].validate((valid) => {
				if(valid) {
					this.loading = true
					let params = { ...this.approvalInfo }
					params.approvalUser = this.user.userNo
					this.$postJson('/reg/system/approval/send', params).then((res) => {
						if(res.data.code === 200) {
							this.approvalInfo = {}
							this.$message.success("审批单发起成功，请前往审批单管理中查看进度")
							this.$router.push('/profile/myApproval')
						} else {
							this.$message.error("发送失败，原因是：" + res.data.msg)
						}
						this.loading = false
					})
				} else {
					this.$message.error("请将表单填写完整")
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