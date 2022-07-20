<template>
  <div class="main">
    <div>
      <page-title class="page-title" title="查询条件" style="margin-bottom: 10px"></page-title>
      <el-form :model="accountForm" label-width="100px" class="departForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="姓名"><el-input v-model="accountForm.userRealName"></el-input></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="账号"><el-input v-model="accountForm.userName"></el-input></el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="登录状态">
              <el-select v-model="accountForm.loginState">
                <el-option
                  v-for="item in [{label: '成功', value: '1'}, {label: '失败', value: '0'}]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="在线状态">
              <el-select v-model="accountForm.loginOnline">
                <el-option
                  v-for="item in [{label: '在线', value: '1'}, {label: '离线', value: '0'}]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label=""></el-form-item>
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
        <page-title class="page-title" title="账号列表" style="margin-bottom: 10px"></page-title>
        <div>
          <el-form :model="accountForm" label-width="120px">
            <el-form-item label="显示未登录账号">
              <el-switch v-model="accountForm.isShow" @change="changeShowLogin"></el-switch>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-table :data="accountList" v-loading="loading" stripe @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column align="center" property="userRealName" show-overflow-tooltip label="姓名"></el-table-column>
        <el-table-column align="center" property="userName" show-overflow-tooltip label="账号"></el-table-column>
        <el-table-column align="center" property="loginIp" show-overflow-tooltip label="登录ip"></el-table-column>
        <el-table-column align="center" property="loginAddress" show-overflow-tooltip label="登录地址"></el-table-column>
        <el-table-column align="center" property="loginEqui" show-overflow-tooltip label="登录设备"></el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="登录状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.loginState === '1'" type="success">成功</el-tag>
            <el-tag v-else type="danger">失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="在线状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.loginOnline === '1'" type="primary">在线</el-tag>
            <el-tag v-else type="info">离线</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" property="loginTime" show-overflow-tooltip label="登陆时间"></el-table-column>
        <el-table-column align="center" label="操作" width="250">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" plain  @click="changeInnfo(scope.row)">修改账号</el-button>
            <el-button type="warning" :disabled="scope.row.loginOnline === '0'" size="mini" plain @click="removeLogin(scope.row)">下线</el-button>
            <el-button type="danger" size="mini" plain @click="deleteAccount(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination style="text-align: right;" v-show="total > 0" :total="total" :page.sync="pagination.pageNum" :limit.sync="pagination.pageSize" @pagination="handlePageChange" />
    </div>
    <el-dialog :visible.sync="accountDialog" top="20vh" v-drag title="修改账号" :close-on-click-modal="false" :close-on-press-escape="false" width="40%" :before-close="handleClose">
      <el-form :model="accountInfo" label-width="50px" :rules="accountRules" ref="account">
        <el-form-item label="账号" prop="userName">
          <el-input v-model="accountInfo.userName" @input="changeValue"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="userPassword">
          <el-input v-model="accountInfo.userPassword" @input="changeValue"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确认</el-button>
          <el-button  @click="handleClose" >取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import PageTitle from '@/components/PageTitle';
import hex from '@/utils/hex'
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
      accountForm: {},
      accountList: [],
      accountDialog: false,
      accountInfo: {},
      showNotLogin: '0',
      selectData: [],
      isShow: false,
      accountRules: {
        userName: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        userPassword: [{ required: true, message: '请输入密码', trigger: 'blur' },
          { validator: (rule, value, callback) => { if (/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{4,18}$/.test(value) == false) { callback(new Error("密码必须为4-18位的数字+字母组合")); } else { callback(); } }, trigger: "blur" 
        }]
      }
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    changeValue() {
      // this.$forceUpdate()
    },
    onSubmit() {
      this.$refs['account'].validate((valid) => {
        if(valid) {
          // 加密字符串
          this.accountInfo.userPassword = hex.stringtoHex(this.accountInfo.userPassword)
          this.$postJson('/reg/system/user/updateUserInfo', this.accountInfo).then((res) => {
            const resData = res.data
            if(resData.code === 200) {
              this.$message.success("更改成功！")
              // 下线账号
              if(this.accountInfo.loginOnline === '1') {
                this.$get(`/reg/system/user/remove/${this.accountInfo.userNo}/${this.accountInfo.infoNo}`).then(res => {
                  let resDate = res.data
                  if(resDate.code !== 200) {
                    this.$message.error(resDate.msg)
                  }
                })
              }
              this.initPage()
              this.handleClose()
            } else {
              this.$message.error(resDate.msg)
            }
          })
        } else {
          this.$message.error("请将表单填写完整!")
        }
      })
    },
    handleClose() {
      this.accountDialog = false
    },
    handlePageChange() {
      this.initPage()
    },
    changeShowLogin(val) {
      if(val) {
        this.showNotLogin = '1' 
      } else {
        this.showNotLogin = '0'
      }
      this.initPage()
    },
    changeInnfo(row) {
      this.$get(`/reg/system/user/getAccountInfo/${row.userNo}`).then(res => {
        const resDate = res.data
        if(resDate.code === 200) {
          resDate.data.userPassword = hex.hextoString(resDate.data.userPassword)
          this.accountInfo = resDate.data
          this.accountDialog = true
        } else {
          this.$message.error(resDate.msg)
        }
      })
    },
    removeLogin(row) {
      this.$confirm(`是否把账号为【${row.loginAccount}】的用户踢下线?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$get(`/reg/system/user/remove/${row.userNo}/${row.infoNo}`).then(res => {
          let resDate = res.data
          if(resDate.code === 200) {
            this.$message({
              type: 'success',
              message: '成功!'
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
    deleteAccount(row) {
      this.$confirm(`将要删除账号为【${row.loginAccount}】的用户，是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$get(`/reg/system/user/delete/${row.userNo}`).then(res => {
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
    initPage() {
      this.loading = true
      this.accountForm.showNotLogin = this.showNotLogin
      let params = {...this.accountForm}
      params.pageNum = this.pagination.pageNum;
      params.pageSize = this.pagination.pageSize;
      this.$postJson('/reg/system/user/getAccountInfos', params).then(res => {
        if(res.data.code === 200) {
          this.total = res.data.data.totalSize
          let dataList = res.data.data.content
          this.accountList = dataList
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
      this.accountForm = {}
      this.accountForm.showNotLogin = this.showNotLogin
      this.initPage()
    },
    handleSelectionChange(val) {
      this.selectData = val
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  padding: 10px 20px;
  height: 100%;
}
</style>