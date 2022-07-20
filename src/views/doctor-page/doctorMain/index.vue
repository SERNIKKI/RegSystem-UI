<template>
  <div class="main">
    <div class="top">
      <div class="left">
        <div class="preview-main">
          <div class="preview">
            <el-carousel trigger="click" height="430px">
              <el-carousel-item v-for="(item, index) in previewList" :key="index">
                <div style="position: relative;display: block;" @click="toPage(item)">
                  <el-image style="height: 430px;" :src="item.previewImage"></el-image>
                  <div class="preview-text">{{ item.previewTitle }}</div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="title">
          <span class="t-link pointer">公告</span>
        </div>
        <div class="body">
          <div class="item" v-for="(item, index) in bulletinList" :key="index">
            <div>
              <span class="t-link pointer" @click="getBulletinInfo(item)">{{item.bulletinTitle}}</span>
            </div>
            <div>
              <span>{{item.updateTime}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="left">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
              <el-button type="primary" icon="el-icon-s-cooperation" circle size="mini"></el-button>
              <span>我的审批单</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="toPendingView2">查看更多</el-button>
          </div>
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
          <el-table :data="approvalList" v-loading="loading2" stripe border>
            <el-table-column align="center" property="approvalNo" show-overflow-tooltip label="审批单号"></el-table-column>
            <el-table-column align="center" property="approvalType" show-overflow-tooltip label="审批单类型"></el-table-column>
            <el-table-column align="center" property="approvalTime" show-overflow-tooltip label="申请时间"></el-table-column>
            <el-table-column align="center" label="审批状态" width="">
              <template slot-scope="scope">
                <el-tag type="getType(scope.row)" size="small">{{ getTitle(scope.row) }}</el-tag>
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
          <pagination style="text-align: right;" v-show="total2 > 0" :total="total2" :page.sync="pagination2.pageNum" :limit.sync="pagination2.pageSize" @pagination="handlePageChange2" />
        </el-card>
      </div>
      <div class="right">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
              <el-button type="success" icon="el-icon-s-order" circle size="mini"></el-button>
              <span>我的预约</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="toPendingView">查看更多</el-button>
          </div>
          <el-table :data="patList" border v-loading="loading" stripe>
            <el-table-column property="regNo" show-overflow-tooltip label="预约号"></el-table-column>
            <el-table-column property="personName" show-overflow-tooltip label="患者姓名"></el-table-column>
            <el-table-column property="illnessDetail" show-overflow-tooltip label="病情描述"></el-table-column>
            <el-table-column property="visitData" show-overflow-tooltip label="预约日期"></el-table-column>
            <el-table-column property="visitTime" show-overflow-tooltip label="预约时间"></el-table-column>
            <el-table-column property="personRemark" show-overflow-tooltip label="患者备注"></el-table-column>
            <el-table-column show-overflow-tooltip label="预约状态">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.isSuccess === '1'">预约成功</el-tag>
                <el-tag type="error" v-else>预约失败</el-tag>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="就诊状态">
              <template slot-scope="scope">
                <el-tag type="primary" v-if="scope.row.regState === '0'">待就诊</el-tag>
                <el-tag type="success" v-else-if="scope.row.regState === '1'">已完成</el-tag>
                <el-tag type="info" v-else-if="scope.row.regState === '2'">已取消</el-tag>
                <el-tag type="info" v-else>未到</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template>
                <el-button type="danger" size="mini" disabled plain>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination style="text-align: right;" v-show="total > 0" :total="total" :page.sync="pagination.pageNum" :limit.sync="pagination.pageSize" @pagination="handlePageChange" />
        </el-card>
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
    <el-dialog :title="bulletinInfo.bulletinTitle" top="5vh" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="bulletinInfoDialog" width="60%" :before-close="handleInfoClose2">
      <div class="notify-main">
        <div class="title">
          <span class="text">{{ bulletinInfo.bulletinTitle }}</span>
        </div>
        <div class="time center">
          <span class="text">发布时间：{{ bulletinInfo.beginTime }}</span>
          <span class="text">发布单位：{{ bulletinInfo.bulletinDepartment }}</span>
          <span class="text">发布人：{{ bulletinInfo.bulletinName }}</span>
        </div>
        <div class="contact">
          <div class="image" v-if="bulletinInfo.bulletinImage">
           <img :src="bulletinInfo.bulletinImage" :alt="bulletinInfo.bulletinTitle" />
          </div>
          <div class="main-text">
            <div v-html="bulletinInfo.bulletinContact"></div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Preview from '@/components/Preview';
import Pagination from '@/components/Pagination';
export default {
  components:{
    Preview,
    Pagination
  },
  data() {
    return {
      previewList: [],
      bulletinList: [],
      patList: [],
      loading: false,
      user: null,
      total: 0,
      pagination: {
        pageSize: 10,
        pageNum: 1
      },
      total2: 2,
      pagination2: {
        pageSize: 10,
        pageNum: 1
      },
      patForm: {},
			loading2: false,
			approvalList: [],
			approvalForm: {},
			approvalTypeLabel: [ '请假审批', '修改密码', '职位变动', '物品审批', '设备审批', '其他审批' ],
			activeType: '',
			status: {},
			infoDialog: false,
			approvalInfo: {},
      bulletinInfo: {},
      bulletinInfoDialog: false,

    }
  },
  created() {
    this.user = JSON.parse(this.$store.state.user)
    this.initPage()
  },
  methods: {
    // 详情
    getBulletinInfo(row) {
      this.$get(`/reg/system/bulletin/info/${row.bulletinNo}`).then((res) => {
        let resData = res.data
        if(resData.code === 200) {
          this.bulletinInfo = resData.data
          this.bulletinInfoDialog = true
          this.title = '新增公告'
        } else {
          this.$message.error('打开失败，原因为：' + resData.msg)
        }
      })
    },
    handleInfoClose2() {
      this.bulletinInfoDialog = false
    },
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
		handlePageChange2() {
      this.getAppList()
    },
		handleSearch(value) {
			if(value === '') {
				delete this.approvalForm.approvalType
			}
			this.getAppList()
		},
		getAppList() {
			this.loading2 = true
      let params = {...this.approvalForm}
			params.approvalUser = this.user.userNo
      params.pageNum = this.pagination.pageNum;
      params.pageSize = this.pagination.pageSize;
      this.$postJson('/reg/system/approval/userList', params).then(res => {
        if(res.data.code === 200) {
          this.total2 = res.data.data.totalSize
          this.approvalList = res.data.data.content
          this.getCountStatus()
        } else {
          this.$message.error(res.data.msg)
        }
        this.loading2 = false;
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
      this.getAppList()
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
            this.getAppList()
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
		},
    toPendingView2() {
      this.$router.push('/profile/myApproval')
    },
    toPendingView() {
      this.$router.push('/regMang/list')
    },
    toPage(item) {
      if(item.previewLink && item.previewLink !== '') {
        console.log('跳转页面')
      } else {
        console.log('不跳转页面')
      }
    },
    getPCCanPreviewList() {
      this.$get('/reg/system/preview/pcList').then((res) => {
        let resData = res.data
        if(resData.code === 200) {
          // this.pcList = [(resData.data)[0]]
          this.previewList = resData.data
        } else {
          this.$message.error("获取PC轮播图失败，原因为：" + resData.msg)
        }
      })
    },
    initPage() {
      this.getPCCanPreviewList()
      this.getBulletinList()
      this.getPayList()
      this.getAppList()
    },
    getBulletinList() {
      this.$get('/reg/system/bulletin/validList').then((res) => {
        const resData = res.data
        if(resData.code === 200) {
          this.bulletinList = resData.data
        } else {
          this.$message.error("获取公告列表失败，原因为：" + resData.msg)
        }
      })
    },
    getPayList() {
      this.loading = true
      this.patForm.doctorNo = this.user.userNo
      this.patForm.beginTime = this.$moment(new Date()).format('YYYY-MM-DD')
      // this.patForm.endTime = this.$moment(new Date() + 1).format('YYYY-MM-DD')
      let params = {...this.patForm}
      params.pageNum = this.pagination.pageNum;
      params.pageSize = this.pagination.pageSize;
      this.$postJson('/reg/system/patRegRecord/getRegInfo', params).then(res => {
        if(res.data.code === 200) {
          this.total = res.data.data.totalSize
          this.patList = res.data.data.content
        } else {
          this.$message.error(res.data.msg)
        }
        this.loading = false;
      })
    },
    handlePageChange() {
      this.getPayList()
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  padding: 10px 20px;
  height: 100%;
  background-color: #f9faff;
}
.top {
  width: 100%;
  // height: 500px;
  display: flex;
  .left {
    width: 50%;
    height: 430px;
    padding-right: 20px;
  }
  .right {
    width: 50%;
    height: 430px;
    border: 1px solid #e3e3e3;
    background-color: #fff;
    border-radius: 5px;
    .title {
      height: 50px;
      line-height: 50px;
      text-align: center;
      border-bottom: 1px solid #e3e3e3;
      font-size: 20px;
    }
    .body {
      padding-left: 10px;
      padding-right: 10px;
      .item {
        font-size: 16px;
        height: 35px;
        line-height: 35px;
        border-bottom: 1px dashed #e3e3e3;
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
.bottom {
  padding-top: 20px;
  width: 100%;
  // height: 400px;
  display: flex;
  .left {
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: center;
    padding-right: 20px;
    .box-card {
      width: 800px;
    }
  }
  .right {
    width: 50%;
    height: 100%;
    // .box-card {
    //   height: 400px;
    // }
  }
}
.preview-text {
  position: absolute;
  right: 0px;
  bottom: 1px;
  font-family: Arial,Tahoma,"Microsoft YaHei","SimSun";
  left: 0px;
  line-height: 75px;
  font-size: 19px;
  height: 75px;
  color: white;
  background: rgba(101, 101, 101, 0.6);
}
.preview-main {
  text-align: -webkit-center;
  display: block;
  margin: 0 auto;
  height: 430px;
  width: 100%;
}
.preview {
  cursor: pointer;
  height: 430px;
  width: 800px;
}
.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}
.clearfix {
    line-height: 36px;
}
.clearfix:after {
    clear: both;
}
::v-deep .el-card {
    .el-card__header {
        padding: 12px 20px;
        .el-button--text,
        span {
            line-height: 28px;
        }
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
.tag-group {
  margin: 20px 0;
  >>> .el-badge {
    margin-right: 10px;
  }
  .oper-btn {
    float: right;
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
.notify-main {
  .title {
    text-align: center;
    .text {
      font-size: 30px;
      color: #000;
      line-height: 40px;
      font-family: Microsoft Yahei;
      height: 80px;
      overflow: hidden;
    }
  }
  .time {
    padding-top: 40px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e5e5e5;
    .text {
      color: #666666;
      font-size: 13px;
      padding: 0 50px 0 0;
    }
  }
  .contact {
    margin: 0 auto;
    .image {
      text-align: center;
      padding-top: 40px;
      img {
        width: 870px;
        height: 285px;
      }
    }
    .main-text {
      margin: 0 auto;
      width: 870px;
      // text-align: center;
    }
  }
}
</style>