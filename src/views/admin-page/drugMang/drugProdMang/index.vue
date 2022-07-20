<template>
  <div class="main">
    <div>
      <page-title class="page-title" title="查询条件" style="margin-bottom: 10px"></page-title>
      <el-form label-width="120px" :model="prodForm" class="departForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="企业名称">
              <el-input size="medium" v-model="prodForm.prodName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="省份/国家">
              <el-input v-model="prodForm.prodProvince"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" style='text-align: right;'>
            <el-form-item>
              <el-button type="primary" size="small" icon="el-icon-search" @click="handleProdSearch">搜索</el-button>
              <el-button type="" size="small" icon="el-icon-delete" @click="clearForm">清空</el-button>
              <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="insertProd">新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <page-title class="page-title" title="企业列表" style="margin-bottom: 20px;"></page-title>
      <el-table :data="prodList" v-loading="loading" stripe>
        <el-table-column property="prodName" show-overflow-tooltip label="制药企业"></el-table-column>
        <el-table-column property="prodProvince" show-overflow-tooltip label="省份/国家"></el-table-column>
        <!-- <el-table-column property="prodWebsite" show-overflow-tooltip label="网址"></el-table-column> -->
        <el-table-column property="prodTel" show-overflow-tooltip label="电话"></el-table-column>
        <el-table-column property="prodEmail" show-overflow-tooltip label="邮箱"></el-table-column>
        <el-table-column property="prodFax" show-overflow-tooltip label="传真"></el-table-column>
        <el-table-column property="prodAddress" show-overflow-tooltip label="地址"></el-table-column>
        <el-table-column width="220" label="操作">
          <template slot-scope="scope">
            <el-button type="" size="mini" plain @click="getProdInfo(scope.row)">详情</el-button>
            <el-button type="primary" size="mini" plain @click="editProdInfo(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" plain @click="deleteProd(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination style="text-align: right;" v-show="total > 0" :total="total" :page.sync="pagination.pageNum" :limit.sync="pagination.pageSize" @pagination="handlePageChange" />
      <el-dialog top="5vh" class="dialog" :title="title" :visible.sync="prodDialog" width="60%" :before-close="handleClose">
        <el-form label-width="110px" :model="prodInfo" class="drugInfoForm" ref="drugref" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="生产企业:" prop="prodName"><el-input v-model="prodInfo.prodName"></el-input></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="省份/国家:" prop="prodProvince"><el-input v-model="prodInfo.prodProvince"></el-input></el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="邮政编码:" prop="prodZip"><el-input v-model="prodInfo.prodZip"></el-input></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="传真号码:" prop="prodFax"><el-input v-model="prodInfo.prodFax"></el-input></el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="服务热线:"><el-input v-model="prodInfo.prodHotline"></el-input></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电话:" prop="prodTel"><el-input v-model="prodInfo.prodTel"></el-input></el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="网址:"><el-input v-model="prodInfo.prodWebsite"></el-input></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱:"><el-input v-model="prodInfo.prodEmail"></el-input></el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="生产地址:" prop="prodAddress"><el-input v-model="prodInfo.prodAddress"></el-input></el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="bottom-button">
            <el-form-item style="text-align: center;margin-left: 0;">
              <el-button type="primary" @click="onSubmit" >提交</el-button>
              <el-button  @click="handleClose" >取消</el-button>
            </el-form-item>
          </el-row>
        </el-form>
      </el-dialog>
      <el-dialog class="dialog" title="企业详情" :visible.sync="prodInfoDialog" width="70%" :before-close="handleInfoClose">
        <el-descriptions class="margin-top" :title="'企业代码: ' + prodInfo.prodNo" :column="3" border>
          <el-descriptions-item>
            <template slot="label"><i class=""></i>企业名称</template>{{ prodInfo.prodName }}
          </el-descriptions-item>
           <el-descriptions-item>
            <template slot="label"><i class=""></i>电话</template>{{ prodInfo.prodTel }}
          </el-descriptions-item>
           <el-descriptions-item>
            <template slot="label"><i class=""></i>省份/国家</template>{{ prodInfo.prodProvince }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label"><i class=""></i>邮政编码</template>{{ prodInfo.prodZip }}
          </el-descriptions-item>
           <el-descriptions-item>
            <template slot="label"><i class=""></i>传真号码</template>{{ prodInfo.prodFax }}
          </el-descriptions-item>
           <el-descriptions-item>
            <template slot="label"><i class=""></i>服务热线</template>{{ prodInfo.prodHotline }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label"><i class=""></i>地址</template>{{ prodInfo.prodAddress }}
          </el-descriptions-item>
           <el-descriptions-item>
            <template slot="label"><i class=""></i>邮箱</template>{{ prodInfo.prodEmail }}
          </el-descriptions-item>
           <el-descriptions-item>
            <template slot="label"><i class=""></i>网址</template>{{ prodInfo.prodWebsite }}
          </el-descriptions-item>
        </el-descriptions>
      </el-dialog>
    </div>
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
      prodForm: {},
      loading: false,
      prodList: [],
      prodDialog: false,
      prodInfo: {},
      rules: {
        prodName: [{ required: true, message: '请输入生产企业', trigger: 'blur' }],
        prodProvince: [{ required: true, message: '请输入省份/国家', trigger: 'blur' }],
        prodAddress: [{ required: true, message: '请输入生产地址', trigger: 'blur' }],
        prodZip: [{ required: true, message: '请输入邮政编码', trigger: 'blur' }],
        prodFax: [{ required: true, message: '请输入传真号码', trigger: 'blur' }],
        prodHotline: [{ required: true, message: '请输入服务热线', trigger: 'blur' }],
        prodTel: [{ required: true, message: '请输入电话', trigger: 'blur' }],
        prodWebsite: [{ required: true, message: '请输入网址', trigger: 'blur' }],
        prodEmail: [{ required: true, message: '请输入邮箱', trigger: 'blur' }]
      },
      options: [],
      title: '新增制药企业',
      prodInfoDialog: false,
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    // 删除
    deleteProd() {
      this.$confirm('删除记录可能会导致重要数据丢失，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$postJson('/reg/system/drugProd/delete', row).then(res => {
          let resDate = res.data
          if(resDate.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.initPage()
            this.getDrugProdList()
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
    // 关闭详情弹窗
    handleInfoClose() {
      this.prodInfoDialog = false
      this.initPage()
    },
    // 提交新增
    onSubmit() {
      this.$refs['drugref'].validate((valid) => {
        if(valid) {
          let rquest = this.title === '编辑' ? 'update' : 'save'
          this.$postJson(`/reg/system/drugProd/${rquest}`, this.prodInfo).then((res => {
            let resData = res.data
            if(resData.code === 200) {
              this.$message.success('保存成功')
              this.prodDialog = false
              this.prodInfo = {}
              this.initPage()
            } else {
              this.$message.error(resData.msg)
            }
          }))
        } else {
          this.$message.error('请将表单填写完整')
        }
      })
    },
    // 关闭新增/详情弹窗
    handleClose() {
      this.$refs['drugref'].resetFields();
      this.prodDialog = false
      this.initPage()
    },
    // 初始化页面
    initPage() {
      this.loading = true;
      const params = {...this.prodForm};
      params.pageNum = this.pagination.pageNum;
      params.pageSize = this.pagination.pageSize;
      params.drugGenus = '1'
      this.$postJson('/reg/system/drugProd/list', params).then(res => {
        if(res.data.code === 200) {
          this.total = res.data.data.totalSize
          this.prodList = res.data.data.content
        } else {
          this.$message.error(res.data.msg)
        }
        this.loading = false;
      })
    },
    // 换页
    handlePageChange() {
      this.initPage()
    },
    // 搜索
    handleProdSearch() {
      this.initPage()
    },
    // 清空搜索
    clearForm() {
      this.prodForm = {}
      this.initPage()
    },
    insertProd() {
      this.title = '新增制药企业'
      this.prodInfo = {}
      this.prodDialog = true
    },
    // 获取药品详情
    getProdInfo(row) {
      this.prodInfo = row
      this.prodInfoDialog = true
    },
    // 编辑药品信息
    editProdInfo(row) {
      this.title = '编辑'
      this.prodInfo = row
      this.prodDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  padding: 10px 20px;
  height: 100%;
}
.dialog {
  >>> .el-dialog__header {
    background-color: #efefef;
    border-bottom: 1px solid #e5e5e5;
  }
  >>> .el-form {
    padding-right: 10px;
  }
  >>> .bottom-button {
    margin-left: -60px;
  }
}
.drugInfoForm , .departForm {
  .el-row >>> .el-cascader {
    width: 100% ;
  }
  .el-row >>> .el-select {
    width: 100% ;
  }
}
.width-100 {
  width: 100px !important;
}
.prog {
  color: #66b1ff;
  cursor: pointer;
}
.prog:hover {
  color: #409eff;
}
.link {
  cursor: pointer;
  color: #66b1ff;
  font-weight: bold;
}
.link:hover {
  color: #409eff;
  text-decoration: underline;
}
.bold {
  font-weight: bold;
}
</style>