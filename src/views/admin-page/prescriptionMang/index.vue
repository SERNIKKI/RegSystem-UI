<template>
  <div class="main">
    <div>
      <page-title class="page-title" title="查询条件" style="margin-bottom: 10px"></page-title>
      <el-form label-width="120px" :model="prescriptionForm" class="departForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="医生姓名">
              <el-input v-model="prescriptionForm.userRealName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="科室">
              <el-input v-model="prescriptionForm.secondDepartment"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="患者姓名">
              <el-input v-model="prescriptionForm.personName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="患者地址">
              <el-input v-model="prescriptionForm.personAddress"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="就诊时间">
              <el-date-picker
                v-model="prescriptionForm.time"
                type="datetimerange"
                :picker-options="pickerOptions"
                @change="timeChange"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="疾病诊断">
              <el-input v-model="prescriptionForm.diagnosis"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24"  style='text-align: right;'>
            <el-form-item>
              <el-button type="primary" size="small" icon="el-icon-search" @click="handleSearch">搜索</el-button>
              <el-button type="" size="small" icon="el-icon-delete" @click="clearForm">清空</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <page-title class="page-title" title="就诊单列表" style="margin-bottom: 20px;"></page-title>
      <el-table :data="prescriptionList" border v-loading="loading" stripe>
        <el-table-column width="180" property="prescriptionNo" show-overflow-tooltip label="就诊单号"></el-table-column>
        <el-table-column property="personName" show-overflow-tooltip label="患者姓名"></el-table-column>
        <el-table-column property="personAge" show-overflow-tooltip label="患者年龄"></el-table-column>
        <el-table-column width="200" property="personAddress" show-overflow-tooltip label="患者居住地"></el-table-column>
        <el-table-column width="300" property="diagnosis" show-overflow-tooltip label="临床诊断"></el-table-column>
        <el-table-column width="180" property="regNo" show-overflow-tooltip label="预约号"></el-table-column>
        <el-table-column property="secondDepartment" show-overflow-tooltip label="挂号科室"></el-table-column>
        <el-table-column property="userRealName" show-overflow-tooltip label="医师姓名"></el-table-column>
        <el-table-column width="180" property="consultationTime" show-overflow-tooltip label="入院日期"></el-table-column>
        <el-table-column property="totalPrice" show-overflow-tooltip label="价格（元）"></el-table-column>
        <el-table-column property="personRemark" show-overflow-tooltip label="患者备注"></el-table-column>
        <el-table-column align="center" width="180" fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" plain @click="deleteReg(scope.row)">删除</el-button>
            <el-button type="primary" size="mini" plain @click="printReg(scope.row)">打印</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination style="text-align: right;" v-show="total > 0" :total="total" :page.sync="pagination.pageNum" :limit.sync="pagination.pageSize" @pagination="handlePageChange" />
    </div>
    <el-dialog v-drag title="处方笺预览" top="5vh" v-if="dialogClose" width="60%" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="printDialog" :before-close="handleClose">
      <PrintPrescription ref="print" :prescriptionInfo="prescriptionInfo"></PrintPrescription>
      <div class="end">
        <el-button type="primary" size="small" @click="print">确认</el-button>
        <el-button class="p-l-10" type="" size="small" @click="handleClose">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import PageTitle from '@/components/PageTitle';
import PrintPrescription from '@/components/Print/prescriptionInfo.vue';
export default {
  components:{
    Pagination,
    PageTitle,
    PrintPrescription
  },
  data() {
    return {
      total: 0,
      pagination: {
        pageSize: 10,
        pageNum: 1
      },
      prescriptionForm: {},
      prescriptionList: [],
      loading: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      printDialog: false,
      prescriptionInfo: {},
      dialogClose: false
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    deleteReg(info) {
      this.$confirm('删除记录可能会导致重要数据丢失，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$$postJson(`/reg/system/prescription/delete`, {prescriptionNo: info.prescriptionNo}).then(res => {
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
    handleClose() {
      this.printDialog = false
      setTimeout(() => {
        this.dialogClose = false
      }, 500)
    },
    printReg(info) {
      this.$get(`/reg/system/prescription/info?prescriptionNo=${info.prescriptionNo}`).then((res => {
        if(res.data.code === 200) {
          this.prescriptionInfo = res.data.data
          this.dialogClose = true
          this.printDialog = true
        }
      }))
    },
    print() {
      this.$print(this.$refs.print)
    },
    initPage() {
      this.loading = true
      let params = {...this.prescriptionForm}
      params.pageNum = this.pagination.pageNum;
      params.pageSize = this.pagination.pageSize;
      this.$postJson('/reg/system/prescription/list', params).then(res => {
        if(res.data.code === 200) {
          this.total = res.data.data.totalSize
          this.prescriptionList = res.data.data.content
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
      this.prescriptionForm = {}
      this.initPage()
    },
    handleSelectionChange() {},
    handlePageChange() {
      this.initPage()
    },
    timeChange(val) {
      if(val === null) {
        delete this.prescriptionForm.beginTime
        delete this.prescriptionForm.endTime
      } else {
        this.prescriptionForm.beginTime = val[0]
        this.prescriptionForm.endTime = val[1]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  padding: 10px 20px;
  // height: 100%;
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
.end {
  height: 30px;
  text-align: center;
}
@media print {
  @page {
    size: auto;
    margin-top: 0mm;//解决打印多出一页空白页的问题  
  }
  html {
    background-color: #ffffff;
    height: auto;
    margin: 0px;
  }

  body {
    border: solid 1px #ffffff;
    margin: 10mm 15mm 10mm 15mm; 
  }
}
</style>