<template>
  <div class="main">
    <div>
      <page-title class="page-title" title="查询条件" style="margin-bottom: 10px"></page-title>
      <el-form label-width="120px" :model="orderForm" class="departForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="医生姓名">
              <el-input v-model="orderForm.userRealName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="科室">
              <el-input v-model="orderForm.secondDepartment"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="患者姓名">
              <el-input v-model="orderForm.personName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="订单号">
              <el-input v-model="orderForm.orderNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="就诊时间">
              <el-date-picker
                v-model="orderForm.time"
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
          <el-col :span="8"  style='text-align: right;'>
            <el-form-item>
              <el-button type="primary" size="small" icon="el-icon-search" @click="handleSearch">搜索</el-button>
              <el-button type="" size="small" icon="el-icon-delete" @click="clearForm">清空</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <page-title class="page-title" title="预约订单列表" style="margin-bottom: 20px;"></page-title>
      <el-table :data="orderList" border v-loading="loading" stripe>
        <el-table-column width="180" property="orderNo" label="订单号"></el-table-column>
        <el-table-column width="180" property="regNo" label="预约号"></el-table-column>
        <el-table-column property="personName" label="患者姓名"></el-table-column>
        <el-table-column width="110" property="personPhone" label="联系电话"></el-table-column>
        <el-table-column property="illnessDetail" label="挂号原因"></el-table-column>
        <el-table-column width="110" property="secondDepartment" label="挂号科室"></el-table-column>
        <el-table-column property="userRealName" label="医师姓名"></el-table-column>
        <el-table-column width="100" property="visitData" label="预约日期"></el-table-column>
        <el-table-column property="userCost" label="预约金额(元)"></el-table-column>
        <el-table-column property="payMode" label="支付方式"></el-table-column>
        <el-table-column label="支付状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.orderState === '1'">已支付</el-tag>
            <el-tag type="primary" v-if="scope.row.orderState === '0'">待付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="150" property="creatTime" label="创建时间"></el-table-column>
        <el-table-column width="150" property="finishTime" label="支付时间"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" plain @click="deleteReg(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination style="text-align: right;" v-show="total > 0" :total="total" :page.sync="pagination.pageNum" :limit.sync="pagination.pageSize" @pagination="handlePageChange" />
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
      orderForm: {},
      orderList: [],
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
      payWayList: ['微信支付', '支付宝支付', '银联支付', '云闪付', '苹果支付', 'PayPal', '柜台缴费'],
      orderStatusList: [{label : '已创建', value: '0'}, {label: '已支付', value: '1'}, {label: '已过期', value: '2'}]
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
        this.$postJson(`/reg/system/patPayRecord/delete`, {orderNo: info.orderNo}).then(res => {
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
    printReg(info) {

    },
    initPage() {
      this.loading = true
      let params = {...this.orderForm}
      params.pageNum = this.pagination.pageNum;
      params.pageSize = this.pagination.pageSize;
      this.$postJson('/reg/system/patPayRecord/orderList', params).then(res => {
        if(res.data.code === 200) {
          this.total = res.data.data.totalSize
          this.orderList = res.data.data.content
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
      this.orderForm = {}
      this.initPage()
    },
    handleSelectionChange() {},
    handlePageChange() {
      this.initPage()
    },
    timeChange(val) {
      if(val === null) {
        delete this.orderForm.beginTime
        delete this.orderForm.endTime
      } else {
        this.orderForm.beginTime = val[0]
        this.orderForm.endTime = val[1]
      }
    }
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