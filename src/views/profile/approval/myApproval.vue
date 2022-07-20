<template>
  <div class="profile">
		<profile-layout class="layout"></profile-layout>
		<div class="main">
			<page-title class="page-title" title="我的审批单" style="margin-bottom: 10px"></page-title>
			<el-form :model="approvalForm" label-width="80px" class="departForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="审批类型">
              <el-select v-model="approvalForm.approvalType" clearable @change="handleSearch">
                <el-option
                  v-for="(item, index) in approvalTypeLabel"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
			<div style="padding-left: 12px;">
				<div class="tag-group">
					<el-badge :max="99" :value="status.total" class="badge_btn">
						<el-button style="margin-right: 0px;" :type="activeType == '' ? 'primary' : ' '" size="small" @click="switchTab('', 'all')">全部</el-button>
					</el-badge>
					<el-badge :max="99" :value="status.unprocessed" class="badge_btn">
						<el-button style="margin-right: 0px;" :type="activeType == '0' ? 'primary' : ' '" size="small" @click="switchTab('0', 'sta')">审批中</el-button>
					</el-badge>
					<el-badge :max="99" :value="status.processed" class="badge_btn">
						<el-button style="margin-right: 0px;" :type="activeType == '1' ? 'primary' : ' '" size="small" @click="switchTab('1', 'sta')">审批通过</el-button>
					</el-badge>
					<el-badge :max="99" :value="status.reject" class="badge_btn">
						<el-button style="margin-right: 0px;" :type="activeType == '2' ? 'primary' : ' '" size="small"  @click="switchTab('2', 'sta')">审批驳回</el-button>
					</el-badge>
					<el-badge :max="99" :value="status.revoke" class="badge_btn">
						<el-button style="margin-right: 0px;" :type="activeType == '3' ? 'primary' : ' '" size="small" @click="switchTab('0', 'rev')">已撤回</el-button>
					</el-badge>
					<!-- <div class="oper-btn">
						<el-button type="primary" class="el-icon-connection" @click="makeContract">&nbsp;拟定合同</el-button>
					</div> -->
				</div>
				<el-table :data="approvalList" v-loading="loading" stripe border>
					<el-table-column align="center" property="approvalNo" show-overflow-tooltip label="审批单号"></el-table-column>
					<el-table-column align="center" property="approvalType" show-overflow-tooltip label="审批单类型"></el-table-column>
					<el-table-column align="center" property="approvalTime" show-overflow-tooltip label="申请时间"></el-table-column>
					<el-table-column align="center" label="审批状态" width="">
						<template slot-scope="scope">
							<el-steps :active="getActive(scope.row)" :process-status="getType(scope.row)" finish-status="success" :align-center="true" >
								<el-step title="已发起"></el-step>
								<el-step title="处理中"></el-step>
								<el-step v-if="getActive(scope.row) === 2" :title="getTitle(scope.row)"></el-step>
							</el-steps>
						</template>
					</el-table-column>
					<el-table-column align="center" width="250" label="操作">
						<template slot-scope="scope">
							<el-button  type="primary" size="mini" plain @click="getInfo(scope.row)">详情</el-button>
							<el-button :disabled="scope.row.isRevoke !== '0'" size="mini" plain @click="sendApproval(scope.row)">重新发起</el-button>
							<el-button :disabled="scope.row.approvalStatus === '0'" type="danger" size="mini" plain @click="deleteApproval(scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<pagination style="text-align: right;" v-show="total > 0" :total="total" :page.sync="pagination.pageNum" :limit.sync="pagination.pageSize" @pagination="handlePageChange" />
			</div>
		</div>
		<el-dialog v-drag class="dialog" :visible.sync="infoDialog" top="15vh" width="60%" :before-close="handleInfoClose">
      <div slot="title" class="header">审批详情</div>
      <div class="notifyMain">
        <div class="item">
					<span class="bold">申请类型：</span>
					<span>{{ approvalInfo.approvalType }}</span>
				</div>
				<div class="item">
					<span class="bold">申请内容：</span>
					<span>{{ approvalInfo.approvalContact }}</span>
				</div>
				<div class="step">
					<div class="item bold">申请进度：</div>
					<el-steps style="width: 400px;" :active="getActive(approvalInfo)" :process-status="getType(approvalInfo)" finish-status="success" :align-center="true" >
						<el-step title="已发起"></el-step>
						<el-step title="处理中"></el-step>
						<el-step v-if="getActive(approvalInfo) === 2" :title="getTitle(approvalInfo)"></el-step>
					</el-steps>
				</div>
				<div class="item">
					<span class="bold">审批备注：</span>
					<span>{{ approvalInfo.approvalRemark }}</span>
				</div>
				<div class="item">
					<span class="bold">申请回执：</span>
					<span>{{ approvalInfo.approvalReply }}</span>
				</div>
      </div>
    </el-dialog>
	</div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import ProfileLayout from '@/components/ProfileLayout';
import Pagination from '@/components/Pagination';
export default {
	created() {
		this.user = JSON.parse(this.$store.state.user)
		this.initPage()
	},
	components:{
    PageTitle,
		ProfileLayout,
		Pagination
  },
	data() {
		return {
			user: null,
			loading: false,
			approvalList: [],
			total: 0,
      pagination: {
        pageSize: 10,
        pageNum: 1
      },
			approvalForm: {},
			approvalTypeLabel: [ '请假审批', '修改密码', '职位变动', '物品审批', '设备审批', '其他审批' ],
			activeType: '',
			status: {},
			infoDialog: false,
			approvalInfo: {}
		}
	},
	methods: {
		handleInfoClose() {
			this.infoDialog = false
		},
		sendApproval(row) {
			this.$router.push({
				name: 'approval',
				params: {
					approvalInfo: {
						approvalType: row.approvalType,
						approvalContact: row.approvalContact
					}
				}
			})
		},
		getInfo(row) {
			this.approvalInfo = row
			this.infoDialog = true
		},
		getActive(row) {
			if(row.isRevoke === '1') {
				if(row.approvalStatus === '0') {
					return 1
				}
			}
			return 2
		},
		getType(row) {
			if(row.isRevoke === '1') {
				if(row.approvalStatus === '0') {
					return "process"
				} else if(row.approvalStatus === '1') {
					return "success"
				} else if(row.approvalStatus === '2') {
					return "error"
				}
			} else {
				return "wait"
			}
		},
		getTitle(row) {
			if(row.isRevoke === '1') {
				if(row.approvalStatus === '0') {
					return "审批中"
				} else if(row.approvalStatus === '1') {
					return "审批通过"
				} else if(row.approvalStatus === '2') {
					return "审批驳回"
				}
			} else {
				return "已撤回"
			}
		},
		handlePageChange() {
      this.initPage()
    },
		handleSearch(value) {
			if(value === '') {
				delete this.approvalForm.approvalType
			}
			this.initPage()
		},
		initPage() {
			this.loading = true
      let params = {...this.approvalForm}
			params.approvalUser = this.user.userNo
      params.pageNum = this.pagination.pageNum;
      params.pageSize = this.pagination.pageSize;
      this.$postJson('/reg/system/approval/userList', params).then(res => {
        if(res.data.code === 200) {
          this.total = res.data.data.totalSize
          this.approvalList = res.data.data.content
          this.getCountStatus()
        } else {
          this.$message.error(res.data.msg)
        }
        this.loading = false;
      })
		},
		switchTab(value, type) {
      if(type === 'all') {
        this.approvalForm = {}
        this.activeType = value
      } else if(type === 'sta') {
        delete this.approvalForm.isRevoke
        this.approvalForm.approvalStatus = value
        this.activeType = value
      } else {
        delete this.approvalForm.approvalStatus
        this.approvalForm.isRevoke = value
        this.activeType = '3'
      }
      this.initPage()
    },
		getCountStatus() {
      this.$get(`/reg/system/approval/status/${this.user.userNo}`).then((res) => {
        let resData = res.data
        if(resData.code === 200) {
					if(resData.data.revoke === null) {
						resData.data.revoke = 0
					}
					if(resData.data.unprocessed === null) {
						resData.data.unprocessed = 0
					}
					if(resData.data.processed === null) {
						resData.data.processed = 0
					}
					if(resData.data.reject === null) {
						resData.data.reject = 0
					}
          this.status = resData.data
        } else {
          this.$message.error('获取审批状态角标失败，原因为：' + resData.msg)
        }
      })
    },
		deleteApproval(row) {
			this.$confirm('是否将审批记录从列表中删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
				let params = {}
				params.approvalNo = row.approvalNo
				params.approvalUser = this.user.userNo
        this.$postJson(`/reg/system/approval/delete`, params).then(res => {
          let resDate = res.data
          if(resDate.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.initPage()
          } else {
            this.$message.error(resDate.msg)
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
.tag-group {
  margin: 20px 0;
  >>> .el-badge {
    margin-right: 10px;
  }
  .oper-btn {
    float: right;
  }
}
.dialog {
  .header {
    font-size: 20px;
    text-align: center;
  }
  >>> .el-dialog__header {
    background-color: #2faf98;
    color: #fff;
  }
  >>> .el-icon-close:before {
    color: #fff;
  }
}
.item {
	height: 40px;
    font-size: 16px;
    line-height: 40px;
}
.step {
	display: flex;
	height: 60px;
}
</style>