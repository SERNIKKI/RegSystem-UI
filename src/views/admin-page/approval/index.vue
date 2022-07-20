<template>
  <div class="main">
    <div>
      <page-title class="page-title" title="查询条件" style="margin-bottom: 10px"></page-title>
      <el-form :model="approvalForm" label-width="100px" class="departForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="审批类型">
              <el-select v-model="approvalForm.approvalType">
                <el-option
                  v-for="(item, index) in approvalTypeLabel"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16" style='text-align: right;'>
            <el-form-item>
              <el-button type="primary" size="small" icon="el-icon-search" @click="handleSearch">搜索</el-button>
              <el-button type="" size="small" icon="el-icon-delete" @click="clearForm">清空</el-button>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="8">
            <el-form-item label="审批状态">
              <el-select v-model="approvalForm.approvalStatus">
                <el-option
                  v-for="(item, index) in approvalStatusLabel"
                  :key="index"
                  :value="item.value"
                  :label="item.label">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审批状态">
              <el-select v-model="approvalForm.isRevoke">
                <el-option
                  v-for="(item, index) in isRevokeLabel"
                  :key="index"
                  :value="item.value"
                  :label="item.label">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
        </el-row>
        <!-- <el-row>
          <el-col :span="24" style='text-align: right;'>
            <el-form-item>
              <el-button type="primary" size="small" icon="el-icon-search" @click="handleSearch">搜索</el-button>
              <el-button type="" size="small" icon="el-icon-delete" @click="clearForm">清空</el-button>
            </el-form-item>
          </el-col>
        </el-row> -->
      </el-form>
      <page-title class="page-title" title="审批单列表" style="margin-bottom: 10px"></page-title>
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
      <el-table :data="approvalList" v-loading="loading" stripe @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column align="center" property="approvalNo" show-overflow-tooltip label="审批单号"></el-table-column>
        <el-table-column align="center" property="approvalType" show-overflow-tooltip label="审批单类型"></el-table-column>
        <el-table-column align="center" property="userRealName" show-overflow-tooltip label="申请人"></el-table-column>
        <el-table-column align="center" property="approvalUser" show-overflow-tooltip label="工号"></el-table-column>
        <el-table-column align="center" property="approvalTime" show-overflow-tooltip label="申请时间"></el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="审批状态">
          <template slot-scope="scope">
            <div v-if="scope.row.isRevoke === '0'">
              <el-tag type="warning">已撤回</el-tag>
            </div>
            <div v-else-if="scope.row.isRevoke === '1'">
              <el-tag v-if="scope.row.approvalStatus === '0'" type="primary">审批中</el-tag>
              <el-tag v-else-if="scope.row.approvalStatus === '1'" type="success">审批通过</el-tag>
              <el-tag v-else-if="scope.row.approvalStatus === '2'" type="danger">审批驳回</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" property="approvalName" show-overflow-tooltip label="处理人"></el-table-column>
        <el-table-column align="center" property="approvalEndTime" show-overflow-tooltip label="处理时间"></el-table-column>
        <el-table-column align="center" width="250" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" plain :disabled="scope.row.isRevoke === '0' || scope.row.approvalStatus !== '0'" @click="handleApproval(scope.row)">处理</el-button>
            <el-button type="warning" size="mini" plain :disabled="scope.row.isRevoke === '0' || scope.row.approvalStatus !== '0'"  @click="revokeApproval(scope.row)">撤回</el-button>
            <el-button :disabled="scope.row.approvalStatus === '0'" type="danger" size="mini" plain @click="deleteApproval(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination style="text-align: right;" v-show="total > 0" :total="total" :page.sync="pagination.pageNum" :limit.sync="pagination.pageSize" @pagination="handlePageChange" />
    </div>
    <el-dialog v-drag title="审批单处理" top="5vh" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="approvalDialog" width="60%" :before-close="handleClose">
      <el-form :model="approvalInfo" :rules="rules" ref="ref" class="drugInfoForm" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="申请人：">
              <div class="bold underline">{{ approvalInfo.userRealName }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审批单类型：">
              <div class="bold underline">{{ approvalInfo.approvalType }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="工号：">
              <div class="bold underline">{{ approvalInfo.approvalUser }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="申请时间：">
          <div>{{ approvalInfo.approvalTime }}</div>
        </el-form-item>
        <el-form-item label="审批内容：">
          <div>{{ approvalInfo.approvalContact }}</div>
        </el-form-item>
        <el-form-item label="审批状态：" prop="approvalStatus">
          <div style="display: flex;">
            <div>
              <el-radio v-model="approvalInfo.approvalStatus" label="1">通过</el-radio>
            </div>
            <div class="radio-item">
              <el-radio v-model="approvalInfo.approvalStatus" label="2">驳回</el-radio>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="备注：" prop="approvalRemark">
          <el-input v-model="approvalInfo.approvalRemark" placeholder="请输入备注，例如（您的审批已通过，将在4.12 15:30前处理完成）" type="textarea" :rows="3"></el-input>
        </el-form-item>
        <el-form-item label="回执：" prop="approvalReply" v-if="approvalInfo.approvalStatus === '2'">
          <el-input v-model="approvalInfo.approvalReply" placeholder="请输入回执" type="textarea" :rows="3"></el-input>
        </el-form-item>
        <el-form-item style="margin-left: 0;">
          <el-button type="primary" :loading="subLoading" @click="onSubmit">{{ subLoading ? '提交中' : '提交'}}</el-button>
          <el-button  @click="handleClose" >取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import PageTitle from '@/components/PageTitle';
export default {
  components:{
    Pagination,
    PageTitle
  },
  data() {
    return {
      loading: false,
      total: 0,
      pagination: {
        pageSize: 10,
        pageNum: 1
      },
      approvalTypeLabel: [ '请假审批', '修改密码', '职位变动', '物品审批', '设备审批', '其他审批' ],
      approvalStatusLabel: [
        { label: '未处理', value: '0'}, { label: '已处理', value: '1'}, {'label' : '已拒绝', value: '2'}
      ],
      isRevokeLabel: [
        { label: '未撤回', value: '1'}, { label: '已撤回', value: '0' }
      ],
      approvalForm: {},
      status: {},
      approvalList: [],
      selectData: [],
      activeType: '',
      approvalDialog: false,
      approvalInfo: {},
      rules: {
        approvalStatus: [{ required: true, message: '请选择审批状态', trigger: 'change' }],
        approvalRemark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
        approvalReply: [{ required: true, message: '请输入回执', trigger: 'blur' }]
      },
      subLoading: false
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    handlePageChange() {
      this.initPage()
    },
    onSubmit() {
      this.subLoading = true
      this.$refs['ref'].validate((valid) => {
        if(valid) {
          this.$postJson('/reg/system/approval/updateStatus', this.approvalInfo).then((res) => {
            let resData = res.data
            if(resData.code === 200) {
              this.$message.success('成功')
              this.handleClose()
              this.initPage()
            } else {
              this.$message.error(resData.msg)
              this.subLoading = false
            }
          })
        } else {
          this.$message.error("请将表单填写完整")
          this.subLoading = false
        }
      })
    },
    handleClose() {
      this.$refs['ref'].resetFields();
      this.subLoading = false
      this.approvalInfo = {}
      this.approvalDialog = false
    },
    handleApproval(row) {
      this.$get(`/reg/system/approval/info/${row.approvalNo}`).then((res) => {
        const resdata = res.data
        if(resdata.code === 200) {
          this.approvalInfo = resdata.data
          this.approvalDialog = true
        } else {
          this.$message.error("获取审批单详情失败，原因为：" + resdata.msg)
        }
      })
    },
    deleteApproval(row) {
      this.$confirm('删除记录可能会导致重要数据丢失，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$get(`/reg/system/approval/delete/${row.approvalNo}`).then(res => {
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
    },
    // 撤回审批单
    revokeApproval(row) {
      this.$confirm('即将执行撤回操作，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {}
        param.approvalNo = row.approvalNo
        this.$postJson(`/reg/system/approval/revoke`, param).then(res => {
          let resDate = res.data
          if(resDate.code === 200) {
            this.$message({
              type: 'success',
              message: '撤回成功!'
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
    },
    initPage() {
      this.loading = true
      let params = {...this.approvalForm}
      params.pageNum = this.pagination.pageNum;
      params.pageSize = this.pagination.pageSize;
      this.$postJson('/reg/system/approval/list', params).then(res => {
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
    handleSelectionChange(val) {
      this.selectData = val
    },
    handleSearch() {
      this.initPage()
    },
    clearForm() {
      this.approvalForm = {}
      this.initPage()
    },
    getCountStatus() {
      this.$get('/reg/system/approval/status').then((res) => {
        let resData = res.data
        if(resData.code === 200) {
          this.status = resData.data
        } else {
          this.$message.error('获取审批状态角标失败，原因为：' + resData.msg)
        }
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
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  padding: 10px 20px;
  height: 100%;
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
.radio-item {
  padding-left: 16px;
  >>> .el-radio__input.is-checked + .el-radio__label {
    color: #F56C6C !important;
  }
  >>> .el-radio__input.is-checked .el-radio__inner {
    background: #F56C6C !important;
    border-color: #F56C6C !important;
  }
  >>> {
    .el-radio {
      .el-radio__inner  {
        &:hover {
          border-color: #F56C6C !important;
          color: #F56C6C !important;
        }
      }
    }
  }
}
.drugInfoForm {
  >>> .el-form-item__content {
    font-size: 16px !important;
  }
}
</style>