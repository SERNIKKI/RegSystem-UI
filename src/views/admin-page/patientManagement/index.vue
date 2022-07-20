<template>
  <div class="main">
    <div>
      <page-title class="page-title" title="查询条件" style="margin-bottom: 10px"></page-title>
      <el-form label-width="120px" :model="patForm" class="departForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="患者姓名">
              <el-input v-model="patForm.patRealName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16"  style='text-align: right;'>
            <el-form-item>
              <el-button type="primary" size="small" icon="el-icon-search" @click="handleSearch">搜索</el-button>
              <el-button type="" size="small" icon="el-icon-delete" @click="clearForm">清空</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <page-title class="page-title" title="患者列表" style="margin-bottom: 20px;"></page-title>
      <el-table :data="patList" v-loading="loading" border stripe>
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="p10">
              <div style="font-size: 18px;line-height: 1.5em;color: #333;" class="p-b-10">健康卡列表</div>
              <el-table :data="props.row.patPersonList" border stripe>
                <el-table-column property="personNo" show-overflow-tooltip label="健康卡号"></el-table-column>
                <el-table-column property="personName" show-overflow-tooltip label="患者姓名"></el-table-column>
                <el-table-column property="personPhone" show-overflow-tooltip label="联系方式"></el-table-column>
                <el-table-column property="personGender" show-overflow-tooltip label="性别"></el-table-column>
                <el-table-column property="identifyCard" show-overflow-tooltip label="证件号码"></el-table-column>
                <el-table-column property="personAge" show-overflow-tooltip label="年龄"></el-table-column>
                <el-table-column property="personAddress" show-overflow-tooltip label="居住地址"></el-table-column>
                <el-table-column align="center" width="250" label="操作">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" plain @click="editPerson(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" plain @click="deletePerson(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column property="patNickName" show-overflow-tooltip label="用户名"></el-table-column>
        <el-table-column property="patRealName" show-overflow-tooltip label="姓名"></el-table-column>
        <el-table-column property="patGender" show-overflow-tooltip label="性别"></el-table-column>
        <el-table-column property="patPhone" show-overflow-tooltip label="电话"></el-table-column>
        <el-table-column property="patAddress" show-overflow-tooltip label="地址"></el-table-column>
        <el-table-column property="patMail" show-overflow-tooltip label="邮箱"></el-table-column>
      </el-table>
      <pagination style="text-align: right;" v-show="total > 0" :total="total" :page.sync="pagination.pageNum" :limit.sync="pagination.pageSize" @pagination="handlePageChange" />
    </div>
    <el-dialog title="编辑" top="5vh" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="personDialog" width="50%" :before-close="handleClose">
      <el-form :model="personInfo" ref="ref" :rules="rules" label-width="100px">
        <el-form-item label="健康卡号">
          <el-input disabled v-model="personInfo.personNo"></el-input>
        </el-form-item>
        <el-form-item label="患者姓名">
          <el-input v-model="personInfo.personName"></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="personInfo.personAge"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="personInfo.personGender">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="籍贯">
          <el-input v-model="personInfo.personPlace"></el-input>
        </el-form-item>
        <el-form-item label="民族">
          <el-input v-model="personInfo.nationality"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="personInfo.personPhone"></el-input>
        </el-form-item>
        <el-form-item label="证件号码">
          <el-input v-model="personInfo.identifyCard"></el-input>
        </el-form-item>
        <el-form-item label="居住地址">
          <el-autocomplete
            v-model="personInfo.personAddress"
            value-key="value"
            :fetch-suggestions="querySearchAsync"
            @select="handleSelectAddress"
            placeholder="请输入内容"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item style="text-align: center;margin-left: 0;">
          <el-button type="primary" size="small" :loading="subLoading" @click="onSubmit">{{ subLoading ? '提交中' : '提交'}}</el-button>
          <el-button size="small"  @click="handleClose" >取消</el-button>
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
      total: 0,
      pagination: {
        pageSize: 10,
        pageNum: 1
      },
      patForm: {},
      patList: [],
      loading: false,
      personDialog: false,
      personInfo: {},
      rules: {},
      suggestionList: [],
      addressTotal: 0,
      keyword: '',
      pageSize: 20,
      pageNum: 1,
      subLoading: false
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    onSubmit() {
      this.subLoading = true
      this.$refs['ref'].validate((valid) => {
        if(valid) {
          this.$postJson('/reg/system/patPerson/update', this.personInfo).then((res) => {
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
    querySearchAsync(queryString, cb) {
      if(typeof(queryString) === 'undefined' || queryString === '') {
        return
      }
      console.log(queryString)
      let param = {}
      param.pageNum = this.pageNum
      param.pageSize = this.pageSize
      param.region = ""
      param.keyword = queryString
      this.$postJson('/reg/system/district/suggestion', param).then((res) => {
        const resData = res.data
        if(resData.data.status === 0) {
          resData.data.data.forEach(item => {
            item.value =item.address + item.title
          });
          this.suggestionList = resData.data.data
          this.addressTotal = resData.data.count
          this.keyword = queryString
          cb(this.suggestionList)
        } else {
          return this.$message.error(resData.data.message)
        }
      })
    },
    deletePerson(info) {
      this.$confirm(`将要删除患者卡号为【${info.personNo}】的就诊卡，是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$postJson('/reg/system/patPerson/delete', {personNo: info.personNo}).then(res => {
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
    editPerson(info) {
      this.$get(`/reg/system/patPerson/getPatientPersonDetail?personNo=${info.personNo}`).then((res) => {
        const resData = res.data
        if(resData.code === 200) {
          this.personInfo = resData.data
          this.personDialog = true
        } else {
          this.$message.error(resData.msg)
        }
      })
    },
    handleClose() {
      this.personDialog = false
      this.personInfo = {}
    },
    initPage() {
      this.loading = true;
      const params = {...this.patForm};
      params.pageNum = this.pagination.pageNum;
      params.pageSize = this.pagination.pageSize;
      this.$postJson('/reg/system/patient/list', params).then(res => {
        if(res.data.code === 200) {
          this.total = res.data.data.totalSize
          this.patList = res.data.data.content
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
      this.patForm = {}
      this.initPage()
    },
    handleSelectionChange() {},
    handlePageChange() {
      this.initPage()
    },
    
  }
}
</script>

<style lang="scss" scoped>
.main {
  padding: 10px 20px;
  height: 100%;
}
.departForm {
  .el-row >>> .el-cascader {
    width: 100% ;
  }
  .el-row >>> .el-select {
    width: 100% ;
  }
  .el-row >>> .el-date-editor {
    width: 100% ;
  }
}
</style>