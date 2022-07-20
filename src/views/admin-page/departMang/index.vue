<template>
  <div class="main">
    <div>
      <page-title class="page-title" title="查询条件" style="margin-bottom: 10px"></page-title>
      <el-form label-width="120px" :model="departmentForm" class="departForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="一级科室">
              <el-select v-model="departmentForm.department" placeholder="请选择">
                <el-option
                  v-for="first in firstDepartmentList"
                  :key="first.department"
                  :label="first.department"
                  :value="first.department">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="二级科室">
              <el-input v-model="departmentForm.secondDepartment"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" style='text-align: right;'>
            <el-form-item>
              <el-button type="primary" size="small" icon="el-icon-search" @click="handleDepartmentSearch">搜索</el-button>
              <el-button type="" size="small" icon="el-icon-delete" @click="clearForm">清空</el-button>
              <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="insertDepartment">新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <page-title class="page-title" title="科室列表" style="margin-bottom: 20px;"></page-title>
      <el-table :data="departmentList" v-loading="loading" stripe>
        <el-table-column width="100"  property="secondId" show-overflow-tooltip label="科室id"></el-table-column>
        <el-table-column width="180" property="department" show-overflow-tooltip label="一级科室"></el-table-column>
        <el-table-column width="180" property="secondDepartment" show-overflow-tooltip label="二级科室"></el-table-column>
        <el-table-column width="100" property="secondPerson" show-overflow-tooltip label="负责人"></el-table-column>
        <el-table-column width="130" property="secondTel" show-overflow-tooltip label="电话"></el-table-column>
        <el-table-column width="400" property="secondAddress" show-overflow-tooltip label="地址"></el-table-column>
        <el-table-column width="100" property="updateName" show-overflow-tooltip label="修改人"></el-table-column>
        <el-table-column property="updateTime" show-overflow-tooltip label="修改时间"></el-table-column>
        <el-table-column width="150" label="操作">
          <template slot-scope="scope">
            <el-button type="" size="mini" plain @click="getDepartmentInfo(scope.row)">详情</el-button>
            <el-button type="primary" size="mini" plain @click="editDepartmentInfo(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination style="text-align: right;" v-show="total > 0" :total="total" :page.sync="pagination.pageNum" :limit.sync="pagination.pageSize" @pagination="handlePageChange" />
    </div>
    <el-dialog class="dialog" title="科室详情" :visible.sync="departmentDialog" width="60%" :before-close="handleClose">
      <el-descriptions class="margin-top" title="二级科室" :column="3" border>
        <el-descriptions-item><template slot="label"><i class="el-icon-school"></i>二级科室</template>{{ departmentInfo.secondDepartment }}</el-descriptions-item>
        <el-descriptions-item><template slot="label"><i class="el-icon-user"></i>负责人</template>{{ departmentInfo.secondPerson }}</el-descriptions-item>
        <el-descriptions-item><template slot="label"><i class="el-icon-mobile-phone"></i>负责人电话</template>{{ departmentInfo.secondTel }}</el-descriptions-item>
        <el-descriptions-item><template slot="label"><i class="el-icon-location-outline"></i>科室地址</template>{{ departmentInfo.secondAddress }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="margin-top" title="一级科室" :column="3" border>
        <el-descriptions-item><template slot="label"><i class="el-icon-school"></i>一级科室</template>{{ departmentInfo.department }}</el-descriptions-item>
        <el-descriptions-item><template slot="label"><i class="el-icon-user"></i>负责人</template>{{ departmentInfo.firstPerson }}</el-descriptions-item>
        <el-descriptions-item><template slot="label"><i class="el-icon-mobile-phone"></i>负责人电话</template>{{ departmentInfo.firstTel }}</el-descriptions-item>
        <el-descriptions-item><template slot="label"><i class="el-icon-location-outline"></i>科室地址</template>{{ departmentInfo.firstAddress }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
    <el-dialog class="dialog" title="编辑科室信息" :visible.sync="editDepartmentDialog" width="60%" :before-close="handleClose2">
      <el-form :model="departmentInfo" label-width="120px">
        <page-title class="page-title" title="二级科室" style="margin-bottom: 20px;"></page-title>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="科室">
              <el-input v-model="departmentInfo.secondDepartment"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人">
             <el-input v-model="departmentInfo.secondPerson"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="负责人电话">
              <el-input v-model="departmentInfo.secondTel"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="科室地址">
             <el-input v-model="departmentInfo.secondAddress"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <page-title class="page-title" title="一级科室" style="margin-bottom: 20px;"></page-title>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="科室">
              <el-input v-model="departmentInfo.department"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人">
             <el-input v-model="departmentInfo.firstPerson"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="负责人电话">
              <el-input v-model="departmentInfo.firstTel"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="科室地址">
             <el-input v-model="departmentInfo.firstAddress"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="bottom-button">
          <el-form-item style="text-align: center;margin-left: 0;">
            <el-button type="primary" @click="onSubmit" >提交</el-button>
            <el-button  @click="handleClose2" >取消</el-button>
          </el-form-item>
        </el-row>
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
      departmentForm: {},
      departmentList: [],
      firstDepartmentList: [],
      loading: false,
      departmentDialog: false,
      departmentInfo: {},
      editDepartmentDialog: false
    }
  },
  created() {
    this.initPage()
    this.getFirstList()
  },
  mounted() {

  },
  methods: {
    // 提交更改
    onSubmit() {
      this.$postJson('/reg/system/department/update', this.departmentInfo).then(res => {
        let resData = res.data
        if(resData.code === 200) {
          this.$message.success("更改成功")
          this.editDepartmentDialog = false
          this.initPage()
          this.departmentInfo = {}
        } else {
          this.$message.error(resData.msg)
        }
      })
    },
    // 关闭编辑弹窗
    handleClose2() {
      this.editDepartmentDialog = false
      this.departmentInfo = {}
    },
    // 编辑科室信息
    editDepartmentInfo(item) {
      this.departmentInfo = item
      this.editDepartmentDialog = true
    },
    // 关闭详情弹窗
    handleClose() {
      this.departmentDialog = false
      this.departmentInfo = {}
    },
    // 查看科室详情
    getDepartmentInfo(item) {
      this.departmentInfo = item
      this.departmentDialog = true
    },
    // 初始化页面
    initPage() {
      this.loading = true;
      const params = {...this.departmentForm};
      params.pageNum = this.pagination.pageNum;
      params.pageSize = this.pagination.pageSize;
      this.$postJson('/reg/system/department/list', params).then(res => {
        if(res.data.code === 200) {
          this.total = res.data.data.totalSize
          this.departmentList = res.data.data.content
        } else {
          this.$message.error(res.data.msg)
        }
        this.loading = false;
      })
    },
    // 获取一级科室列表
    getFirstList() {
      this.$get('/reg/system/department/firstList').then((res) => {
        let resData = res.data
        if(resData.code === 200) {
          this.firstDepartmentList = resData.data
        } else {
          this.$message.error(resData.msg)
        }
      })
    },
    // 改变页数
    handlePageChange() {
      this.initPage();
    },
    // 搜索科室列表
    handleDepartmentSearch() {
      this.initPage();
    },
    // 清空搜索
    clearForm() {
      this.departmentForm = {}
      this.initPage()
    },
    // 新增科室
    insertDepartment() {

    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  padding: 20px 50px;
  height: 100%;
}
.departForm {
  .el-row >>> .el-select {
    width: 100% ;
  }
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
.margin-top {
  margin-top: 10px;
}
</style>