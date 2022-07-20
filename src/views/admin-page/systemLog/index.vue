<template>
  <div class="main">
    <div>
      <page-title class="page-title" title="查询条件" style="margin-bottom: 10px"></page-title>
      <el-form label-width="120px" :model="logForm" class="departForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="操作人">
              <el-input size="medium" v-model="logForm.createName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态">
              <el-select v-model="logForm.status" placeholder="请选择" filterable>
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <!-- <el-input v-model="recipeForm.recipePinyin"></el-input> -->
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
      <page-title class="page-title" title="日志列表" style="margin-bottom: 20px;"></page-title>
      <div style="text-align: right;margin-right: 15px;margin-bottom: 5px;">
        <el-button type="danger" icon="el-icon-delete" @click="batchDelete" size="small">批量删除</el-button>
        <el-button type="success" icon="el-icon-document" @click="exportExcelSelect" size="small">导出Excel</el-button>
      </div>
      <el-table :data="logData" border v-loading="loading" stripe @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column width="120" resizable align="center" property="createName" show-overflow-tooltip label="操作人"></el-table-column>
        <el-table-column width="120" resizable align="center" property="userType" show-overflow-tooltip label="角色"></el-table-column>
        <el-table-column width="120" resizable align="center" property="action" show-overflow-tooltip label="动作"></el-table-column>
        <el-table-column width="120" resizable align="center" property="status" show-overflow-tooltip label="状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status === '1'">成功</el-tag>
            <el-tag type="danger" v-else>失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="120" resizable align="center" property="effectTable" show-overflow-tooltip label="影响表"></el-table-column>
        <el-table-column resizable align="center" property="effectNos" show-overflow-tooltip label="影响No"></el-table-column>
        <el-table-column width="220" resizable align="center" property="createTime" show-overflow-tooltip label="操作时间"></el-table-column>
        <el-table-column width="120" resizable align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" plain @click="deleteLog(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination style="text-align: right;" v-show="total > 0" :total="total" :page.sync="pagination.pageNum" :limit.sync="pagination.pageSize" @pagination="handlePageChange" />
    </div>
     <el-dialog class="dialog" top="5vh" title="预览" :visible.sync="exportDialog" width="70%" :before-close="handleExportClose">
        <el-table id="selectTable" :data="selectData" stripe height="400px" border>
          <el-table-column width="120" resizable align="center" property="createName" show-overflow-tooltip label="操作人"></el-table-column>
            <el-table-column width="120" resizable align="center" property="userType" show-overflow-tooltip label="角色"></el-table-column>
            <el-table-column width="120" resizable align="center" property="action" show-overflow-tooltip label="动作"></el-table-column>
            <el-table-column width="120" resizable align="center" property="status" show-overflow-tooltip label="状态">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.status === '1'">成功</el-tag>
                <el-tag type="danger" v-else>失败</el-tag>
              </template>
            </el-table-column>
            <el-table-column width="120" resizable align="center" property="effectTable" show-overflow-tooltip label="影响表"></el-table-column>
            <el-table-column resizable align="center" property="effectNos" show-overflow-tooltip label="影响No"></el-table-column>
            <el-table-column width="220" resizable align="center" property="createTime" show-overflow-tooltip label="操作时间"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" @click="exportExcel">确定保存</el-button>
        </div>
     </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import PageTitle from '@/components/PageTitle';
import htmlToExcel from '@/utils/htmlToExcel'
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
      logForm: {},
      loading: false,
      logData: [],
      statusList: [{ label: '成功', value: '1'}, { label: '失败', value: '0'}],
      selectData: [],
      exportDialog: false
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    // 导出
    exportExcel() {
      htmlToExcel.getExcel('#selectTable','系统日志')
    },
    // 关闭导出预览弹窗
    handleExportClose() {
      this.exportDialog = false
    },
    initPage() {
      this.loading = true;
      const params = {...this.logForm};
      params.pageNum = this.pagination.pageNum;
      params.pageSize = this.pagination.pageSize;
      this.$postJson('/reg/system/log/list', params).then(res => {
        if(res.data.code === 200) {
          this.total = res.data.data.totalSize
          this.logData = res.data.data.content
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
      this.logForm = {}
      this.initPage()
    },
    handleSelectionChange(val) {
      this.selectData = val
    },
    deleteLog(row) {
      this.$confirm('删除记录可能会导致重要数据丢失，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$postJson('/reg/system/log/delete', row).then(res => {
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
    handlePageChange() {
      this.initPage()
    },
    exportExcelSelect() {
      if(this.selectData.length === 0) {
        this.$message.warning("请选择表格中的数据")
        return
      }
      this.exportDialog = true
    },
    batchDelete() {
      if(this.selectData.length === 0) {
        this.$message.warning("请选择表格中的数据")
        return
      }
      this.$confirm('删除记录可能会导致重要数据丢失，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$postJson('/reg/system/log/batchDelete', this.selectData).then(res => {
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
.main {
  padding: 10px 20px;
  height: 100%;
}
</style>