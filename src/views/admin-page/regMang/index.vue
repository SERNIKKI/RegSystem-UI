<template>
  <div class="main">
    <div>
      <page-title class="page-title" title="查询条件" style="margin-bottom: 10px"></page-title>
      <el-form label-width="120px" :model="patForm" class="departForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="医生姓名">
              <el-input v-model="patForm.userRealName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="科室">
              <el-input v-model="patForm.secondDepartment"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="患者姓名">
              <el-input v-model="patForm.personName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="用户姓名">
              <el-input v-model="patForm.patNickName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="就诊时间">
              <el-date-picker
                v-model="patForm.time"
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
      <page-title class="page-title" title="预约列表" style="margin-bottom: 20px;"></page-title>
      <el-table :data="patList" border v-loading="loading" stripe>
        <el-table-column property="regNo" show-overflow-tooltip label="预约号"></el-table-column>
        <el-table-column property="personName" show-overflow-tooltip label="患者姓名"></el-table-column>
        <el-table-column property="illnessDetail" show-overflow-tooltip label="病情描述"></el-table-column>
        <el-table-column property="secondDepartment" show-overflow-tooltip label="挂号科室"></el-table-column>
        <el-table-column property="userRealName" show-overflow-tooltip label="医师姓名"></el-table-column>
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
      patForm: {},
      patList: [],
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
        this.$postJson(`/reg/system/patRegRecord/deletePatRegRecord`, {regNo: info.regNo}).then(res => {
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
    timeChange(val) {
      if(val === null) {
        delete this.patForm.beginTime
        delete this.patForm.endTime
      } else {
        this.patForm.beginTime = val[0]
        this.patForm.endTime = val[1]
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