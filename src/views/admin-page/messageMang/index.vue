<template>
  <div class="main">
    <div>
      <page-title class="page-title" title="查询条件" style="margin-bottom: 10px"></page-title>
      <el-form :model="notifyForm" label-width="100px" class="departForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="通知标题">
              <el-input v-model="notifyForm.notifyTitle"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="通知类型">
              <el-select v-model="notifyForm.notifyType">
                <el-option
                  v-for="(item, index) in notifyLabel"
                  :key="index"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" style='text-align: right;'>
            <el-form-item>
              <el-button type="primary" size="small" icon="el-icon-search" @click="handleSearch">搜索</el-button>
              <el-button type="" size="small" icon="el-icon-delete" @click="clearForm">清空</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div>
        <page-title class="page-title" title="通知列表" style="margin-bottom: 10px"></page-title>
        <div style="text-align: right;margin-right: 15px;margin-bottom: 5px;">
          <el-button type="primary" icon="el-icon-position" :loading="notifyLoading" @click="sendNotify" size="small">{{ notifyLoading ? '获取数据中...' : '发布通知'}}</el-button>
        </div>
      </div>
      <el-table :data="notifyList" v-loading="loading" stripe @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column align="center" property="notifyNo" show-overflow-tooltip label="工单号"></el-table-column>
        <el-table-column align="center" property="notifyTitle" show-overflow-tooltip label="通知标题"></el-table-column>
        <el-table-column align="center" property="notifyType" show-overflow-tooltip label="通知类型"></el-table-column>
        <el-table-column align="center" property="sendTime" show-overflow-tooltip label="发布时间"></el-table-column>
        <el-table-column align="center" property="total" show-overflow-tooltip label="发布数"></el-table-column>
        <el-table-column align="center" property="sendNum" show-overflow-tooltip label="发送成功数"></el-table-column>
        <el-table-column align="center" property="readNum" show-overflow-tooltip label="已读数"></el-table-column>
        <el-table-column align="center" width="250" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" plain  @click="handleNotify(scope.row)">详情</el-button>
            <el-button type="danger" size="mini" plain @click="deleteNotify(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination style="text-align: right;" v-show="total > 0" :total="total" :page.sync="pagination.pageNum" :limit.sync="pagination.pageSize" @pagination="handlePageChange" />
    </div>
    <el-dialog v-drag :title="title" top="5vh" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="notifyDialog" width="60%" :before-close="handleClose">
      <el-form :model="notifyInfo" :rules="rules" ref="ref" class="drugInfoForm" label-width="100px">
        <el-form-item label="通知标题：" prop="notifyTitle">
          <el-input v-model="notifyInfo.notifyTitle" :disabled="disable"></el-input>
        </el-form-item>
        <el-form-item label="通知类型：" prop="notifyType">
          <el-select v-model="notifyInfo.notifyType" :disabled="disable">
            <el-option
              v-for="(item, index) in notifyLabel"
              :key="index"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接收人：" v-if="!disable">
          <el-tree
            show-checkbox
            node-key="value"
            :data="userList"
            ref="tree"
            :props="defaultProps"
            highlight-current
            :default-checked-keys="checkedKeys"
            @check="handleCheckChange"
            >
          </el-tree>
        </el-form-item>
        <el-form-item label="接收人：" v-else class="tag">
          <div class="p-r-10" v-for="(item, index) in notifyObjects" :key="index">
            <el-tag type="primary">{{ item }}</el-tag>
          </div>
        </el-form-item>
        <el-form-item label="通知内容：">
          <Writer v-if="!disable" :value="value" :disable="disable" @input="inputValue"></Writer>
          <div v-else v-html="notifyInfo.notifyContent"></div>
        </el-form-item>
        <el-form-item style="margin-left: 0;" class="center">
          <el-button type="primary" :loading="subLoading" @click="onSubmit">{{ subLoading ? '发送中' : '发送'}}</el-button>
          <el-button  @click="handleClose" >取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import PageTitle from '@/components/PageTitle';
import Writer from '@/components/Writer'
export default {
  components:{
    Pagination,
    PageTitle,
    Writer
  },
  data() {
    return {
      notifyForm: {},
      notifyLabel: ['审批单回执', '发布性通知', '任免性通知', '指示性通知', '批转性通知', '转发性通知', '事务性通知', '通报'],
      loading: false,
      total: 0,
      pagination: {
        pageSize: 10,
        pageNum: 1
      },
      notifyList: [],
      selectData: [],
      userList: [],
      notifyInfo: {},
      notifyDialog: false,
      rules: {
        notifyTitle: [{ required: true, message: '请输入通知标题', trigger: 'blur' }],
        notifyType: [{ required: true, message: '请选择审批类型', trigger: 'change' }],
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      notifyLoading: false,
      disable: false,
      value: '',
      selectList: [],
      isChecked: true,
      subLoading: false,
      title: '发送通知',
      notifyObjects: [],
      checkedKeys: []
    }
  },
  created() {
    this.initPage()
    this.getUserList()
  },
  methods: {
    handlePageChange() {
      this.initPage()
    },
    onSubmit() {
      if(this.selectList.length === 0) {
        this.$message.error("请选择通知接收人！");
        return
      }
      if(!this.notifyInfo.notifyContent || this.notifyInfo.notifyContent === '') {
        this.$message.error("请输入通知内容！");
        return
      }
      this.subLoading = true
      this.$refs['ref'].validate((valid) => {
        if(valid) {
          const params = {}
          params.notifyObjects = this.selectList
          params.notify = this.notifyInfo
          this.$postJson('/reg/system/notify/send', params).then((res) => {
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
    inputValue(value) {
      this.notifyInfo.notifyContent = value
    },
    handleClose() {
      this.notifyDialog = false
      setTimeout(() => {
        this.notifyInfo = {}
        this.selectList = []
        this.subLoading = false
      }, 500)
    },
    // 对选择的数据进行处理
    handleCheckChange(data, select) {
      // console.log(select)
      // console.log(select.checkedKeys)
      this.selectList = []
      const childList = select.checkedNodes
      for(var i = 0; i < childList.length; i++) {
        if(childList[i].children === null) {
          this.selectList.push(childList[i].value)
        }
      }
    },
    isChild(list) {
      // console.log(list)
      if(list.children === null) {
        this.selectList.push(list.value)
        return
      } else if(list.children.length === 0){
        return
      }
      for(var i = 0; i < list.children.length; i++) {
        this.isChild(list.children[i])
      }
    },
    getUserList() {
      this.notifyLoading = true
      this.$get('/reg/system/user/totalUser').then((res) => {
        const resData = res.data
        if(resData.code === 200) {
          this.notifyLoading = false
          let array = resData.data[1].children
          // 处理数据，判断是否有用户
          for(var i = 0; i < array.length; i++) {
            let array2 = array[i].children
            for(var k = 0; k < array2.length; k++) {
              let array3 = array2[k].children
              if(!(array3 && array3.length > 0)) {
                resData.data[1].children[i].children[k].disabled = true
              }
            }
          }
          this.userList = resData.data
        } else {
          this.$message.error("获取用户信息失败，原因为：" + resData.msg)
        }
      })
    },
    sendNotify() {
      this.disable = false
      this.notifyDialog = true
    },
    deleteNotify(row) {
      this.$confirm('删除记录可能会导致重要数据丢失，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$get(`/reg/system/notify/delete/${row.notifyNo}`).then(res => {
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
    handleNotify(row) {
      this.$get(`/reg/system/notify/info/admin/${row.notifyNo}`).then((res) => {
        const resData = res.data
        if(resData.code === 200) {
          this.notifyInfo = resData.data.notify
          this.notifyObjects = resData.data.notifyObjects
          this.notifyDialog = true
          this.disable = true
          this.value = this.notifyInfo.notifyContent
        } else {
          this.$message.error("获取详细信息失败，原因为：" + resData.msg)
        }
      })
    },
    handleSelectionChange(val) {
      this.selectData = val
    },
    initPage() {
      this.loading = true
      let params = {...this.notifyForm}
      params.pageNum = this.pagination.pageNum;
      params.pageSize = this.pagination.pageSize;
      this.$postJson('/reg/system/notify/list', params).then(res => {
        if(res.data.code === 200) {
          this.total = res.data.data.totalSize
          this.notifyList = res.data.data.content
        } else {
          this.$message.error(res.data.msg)
        }
        this.loading = false;
      })
    },
    handleSearch() {
      this.initPage()
    },
    clearForm() {
      this.notifyForm = {}
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
.tag {
  >>> .el-form-item__content {
    margin-left: 0px !important; 
    display: flex;
    align-items: center;
    height: 40px;
  }
}
</style>