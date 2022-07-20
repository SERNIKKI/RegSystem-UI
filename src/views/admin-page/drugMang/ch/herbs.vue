<template>
  <div class="main">
    <div>
      <page-title class="page-title" title="查询条件" style="margin-bottom: 10px"></page-title>
      <el-form label-width="120px" :model="herbForm" class="departForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="药材名称">
              <el-input size="medium" v-model="herbForm.herbName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="汉语拼音">
              <el-input v-model="herbForm.herbPinyin"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="古籍出处">
              <el-input size="medium" v-model="herbForm.herbOrigin"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="作用类别">
              <el-cascader :options="options" v-model="herbForm.herbAction" @change="handleSearchChange" filterable clearable>
                <template slot-scope="{ node, data }">
                  <span>{{ data.label }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
              <!-- <el-input v-model="herbForm.herbAction"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主要产地">
              <el-input v-model="herbForm.herbPlace"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" style='text-align: right;'>
            <el-form-item >
              <el-button type="primary" size="small" icon="el-icon-search" @click="handleProdSearch">搜索</el-button>
              <el-button type="" size="small" icon="el-icon-delete" @click="clearForm">清空</el-button>
              <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="insertProd">新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <page-title class="page-title" title="药材列表" style="margin-bottom: 20px;"></page-title>
      <div style="text-align: right;margin-right: 15px;margin-bottom: 5px;">
        <el-button type="success" icon="el-icon-document" @click="exportExcelSelect" size="small">导出Excel</el-button>
      </div>
      <el-table :data="herbList" v-loading="loading" stripe @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column property="herbName" show-overflow-tooltip label="药材名称"></el-table-column>
        <el-table-column property="herbPinyin" show-overflow-tooltip label="汉语拼音"></el-table-column>
        <!-- <el-table-column property="prodWebsite" show-overflow-tooltip label="网址"></el-table-column> -->
        <el-table-column show-overflow-tooltip label="作用类别">
          <template slot-scope="scope">
            {{scope.row.mainType + '/' + scope.row.subType}}
          </template>
        </el-table-column>
        <el-table-column property="herbOrigin" show-overflow-tooltip label="古籍出处"></el-table-column>
        <el-table-column property="herbPlace" show-overflow-tooltip label="主要产地"></el-table-column>
        <el-table-column property="herbProp" show-overflow-tooltip label="药性"></el-table-column>
        <el-table-column property="herbFundamental" show-overflow-tooltip label="基元"></el-table-column>
        <el-table-column property="herbEfficacy" show-overflow-tooltip label="功效"></el-table-column>
        <el-table-column width="220" label="操作">
          <template slot-scope="scope">
            <el-button type="" size="mini" plain @click="getHerbInfo(scope.row)">详情</el-button>
            <el-button type="primary" size="mini" plain @click="editHerbInfo(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" plain @click="deleteHerb(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination style="text-align: right;" v-show="total > 0" :total="total" :page.sync="pagination.pageNum" :limit.sync="pagination.pageSize" @pagination="handlePageChange" />
    </div>
    <el-dialog top="5vh" class="dialog" :title="title" :visible.sync="herbDialog" width="60%" :before-close="handleClose">
      <el-form label-width="110px" :model="herbInfo" class="drugInfoForm" ref="drugref" :rules="rules">
        <page-title class="page-title" title="基础信息" style="margin-bottom: 20px;"></page-title>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="药材名称:" prop="herbName"><el-input @input="getPinIn" v-model="herbInfo.herbName"></el-input></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="汉语拼音:" prop="herbPinyin"><el-input v-model="herbInfo.herbPinyin"></el-input></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属类别:" prop="herbAction">
              <el-cascader :options="options" v-model="herbInfo.herbAction" @change="handleChange" filterable clearable>
                <template slot-scope="{ node, data }">
                  <span>{{ data.label }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
              <!-- <el-input v-model="herbInfo.herbName"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="古籍出处:" prop="herbOrigin"><el-input v-model="herbInfo.herbOrigin"></el-input></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="药性:" prop="herbProp"><el-input v-model="herbInfo.herbProp"></el-input></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归经:" prop="herbReturn"><el-input v-model="herbInfo.herbReturn"></el-input></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="化学成分:" prop="herbIngredient"><el-input type="textarea" v-model="herbInfo.herbIngredient"></el-input></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="功效:" prop="herbEfficacy"><el-input type="textarea" v-model="herbInfo.herbEfficacy"></el-input></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="用法用量:" prop="herbUsage"><el-input type="textarea" v-model="herbInfo.herbUsage"></el-input></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="基元:" prop="herbFundamental"><el-input type="textarea" v-model="herbInfo.herbFundamental"></el-input></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="主要产地:" prop="herbPlace"><el-input type="textarea" v-model="herbInfo.herbPlace"></el-input></el-form-item>
          </el-col>
        </el-row>
        <page-title class="page-title" title="采集与处理" style="margin-bottom: 20px;"></page-title>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="采集:" prop="herbCollect"><el-input type="textarea" v-model="herbInfo.herbCollect"></el-input></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="炮制:" prop="herbConcoct"><el-input type="textarea" v-model="herbInfo.herbConcoct"></el-input></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="贮藏:" prop="herbStorage"><el-input type="textarea" v-model="herbInfo.herbStorage"></el-input></el-form-item>
          </el-col>
        </el-row>
        <page-title class="page-title" title="应用" style="margin-bottom: 20px;"></page-title>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="应用:" prop="herbApply"><el-input :rows="4" type="textarea" v-model="herbInfo.herbApply"></el-input></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="不良反应:"><el-input :rows="4" type="textarea" v-model="herbInfo.herbAdverse"></el-input></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="古籍摘要:"><el-input :rows="4" type="textarea" v-model="herbInfo.herbAbstract"></el-input></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="鉴别用药:"><el-input :rows="4" type="textarea" v-model="herbInfo.herbIdent"></el-input></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="注释:"><el-input :rows="4" type="textarea" v-model="herbInfo.herbRemark"></el-input></el-form-item>
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
    <el-dialog top="5vh" class="dialog" title="药材详情" :visible.sync="herbInfoDialog" width="70%" :before-close="handleInfoClose">
      <el-descriptions class="margin-top" :title="'药品代码: ' + herbInfo.herbNo" :column="3" border>
        <template slot="extra">
          <span>入库人: </span><span class="bold">{{ herbInfo.createName }}</span>&nbsp;&nbsp;&nbsp;
          <span>核准日期: </span><span class="bold">{{ herbInfo.createTime }}</span>&nbsp;&nbsp;&nbsp;
          <span>修订日期: </span><span class="bold">{{ herbInfo.updateTime }}</span>
        </template>
        <el-descriptions-item :labelStyle="{'width' : '100px'}">
          <template slot="label"><i class=""></i>药材名称</template>{{ herbInfo.herbName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">汉语拼音</template>{{ herbInfo.herbPinyin }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">作用类别</template>{{ herbInfo.mainType + '/' + herbInfo.subType }}
        </el-descriptions-item>
        <el-descriptions-item :labelStyle="{'width' : '100px'}">
          <template slot="label">古籍出处</template>{{ herbInfo.herbOrigin }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">药性</template>{{ herbInfo.herbProp }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">归经</template>{{ herbInfo.herbReturn }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1" border>
        <el-descriptions-item :labelStyle="{'width' : '100px'}">
          <template slot="label">化学成分</template><span v-html="herbInfo.herbIngredient"></span>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1" border>
        <el-descriptions-item :labelStyle="{'width' : '100px'}">
          <template slot="label">功效</template><span v-html="herbInfo.herbEfficacy"></span>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1" border>
        <el-descriptions-item :labelStyle="{'width' : '100px'}">
          <template slot="label">用法用量</template><span v-html="herbInfo.herbUsage"></span>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1" border>
        <el-descriptions-item :labelStyle="{'width' : '100px'}">
          <template slot="label">基元</template><span v-html="herbInfo.herbFundamental"></span>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1" border>
        <el-descriptions-item :labelStyle="{'width' : '100px'}">
          <template slot="label">主要产地</template><span v-html="herbInfo.herbPlace"></span>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1" border>
        <el-descriptions-item :labelStyle="{'width' : '100px'}">
          <template slot="label">采集</template><span v-html="herbInfo.herbCollect"></span>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1" border>
        <el-descriptions-item :labelStyle="{'width' : '100px'}">
          <template slot="label">炮制</template><span v-html="herbInfo.herbConcoct"></span>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1" border>
        <el-descriptions-item :labelStyle="{'width' : '100px'}">
          <template slot="label">贮藏</template><span v-html="herbInfo.herbStorage"></span>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1" border>
        <el-descriptions-item :labelStyle="{'width' : '100px'}">
          <template slot="label">应用</template><span v-html="herbInfo.herbApply"></span>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1" border>
        <el-descriptions-item :labelStyle="{'width' : '100px'}">
          <template slot="label">鉴别用药</template><span v-html="herbInfo.herbIdent"></span>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1" border>
        <el-descriptions-item :labelStyle="{'width' : '100px'}">
          <template slot="label">不良反应</template><span v-html="herbInfo.herbAdverse"></span>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1" border>
        <el-descriptions-item :labelStyle="{'width' : '100px'}">
          <template slot="label">古籍摘要</template><span v-html="herbInfo.herbAbstract"></span>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1" border>
        <el-descriptions-item :labelStyle="{'width' : '100px'}">
          <template slot="label">注释</template><span v-html="herbInfo.herbRemark"></span>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
    <el-dialog class="dialog" top="5vh" title="预览" :visible.sync="exportDialog" width="70%" :before-close="handleExportClose">
      <el-table id="selectTable" :data="selectData" height="400px" border>
        <el-table-column property="id" show-overflow-tooltip label="ID"></el-table-column>
        <el-table-column property="herbNo" show-overflow-tooltip label="药材NO"></el-table-column>
        <el-table-column property="herbName" show-overflow-tooltip label="药材名称"></el-table-column>
        <el-table-column property="herbPinyin" show-overflow-tooltip label="汉语拼音"></el-table-column>
        <!-- <el-table-column property="prodWebsite" show-overflow-tooltip label="网址"></el-table-column> -->
        <el-table-column show-overflow-tooltip label="作用类别">
          <template slot-scope="scope">
            {{scope.row.mainType + '/' + scope.row.subType}}
          </template>
        </el-table-column>
        <el-table-column property="herbOrigin" show-overflow-tooltip label="古籍出处"></el-table-column>
        <el-table-column property="herbPlace" show-overflow-tooltip label="主要产地"></el-table-column>
        <el-table-column property="herbProp" show-overflow-tooltip label="药性"></el-table-column>
        <el-table-column property="herbFundamental" show-overflow-tooltip label="基元"></el-table-column>
        <el-table-column property="herbCollect" show-overflow-tooltip label="采集"></el-table-column>
        <el-table-column property="herbConcoct" show-overflow-tooltip label="炮制"></el-table-column>
        <el-table-column property="herbStorage" show-overflow-tooltip label="贮藏"></el-table-column>
        <el-table-column property="herbReturn" show-overflow-tooltip label="归经"></el-table-column>
        <el-table-column property="herbApply" show-overflow-tooltip label="应用"></el-table-column>
        <el-table-column property="herbEfficacy" show-overflow-tooltip label="功效"></el-table-column>
        <el-table-column property="herbUsage" show-overflow-tooltip label="用法用量"></el-table-column>
        <el-table-column property="herbAbstract" show-overflow-tooltip label="古籍摘要"></el-table-column>
        <el-table-column property="herbIngredient" show-overflow-tooltip label="化学成分"></el-table-column>
        <el-table-column property="herbAdverse" show-overflow-tooltip label="不良反应"></el-table-column>
        <el-table-column property="herbRemark" show-overflow-tooltip label="注释"></el-table-column>
        <el-table-column property="herbIdent" show-overflow-tooltip label="鉴别"></el-table-column>
        <el-table-column property="createName" show-overflow-tooltip label="核验人"></el-table-column>
        <el-table-column property="createTime" show-overflow-tooltip label="核验日期"></el-table-column>
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
const pinyin = require('js-pinyin');
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
      herbForm: {},
      loading: false,
      herbList: [],
      herbDialog: false,
      herbInfo: {},
      rules: {
        herbAbstract: [{ required: true, message: '请输入古籍摘要', trigger: 'blur' }],
        herbAction: [{ required: true, message: '请输入所属类别', trigger: 'change' }],
        herbAdverse: [{ required: true, message: '请输入不良反应', trigger: 'blur' }],
        herbApply: [{ required: true, message: '请输入应用', trigger: 'blur' }],
        herbCollect: [{ required: true, message: '请输入采集', trigger: 'blur' }],
        herbConcoct: [{ required: true, message: '请输入炮制', trigger: 'blur' }],
        herbEfficacy: [{ required: true, message: '请输入功效', trigger: 'blur' }],
        herbFundamental: [{ required: true, message: '请输入基元', trigger: 'blur' }],
        herbIngredient: [{ required: true, message: '请输入化学成分', trigger: 'blur' }],
        herbName: [{ required: true, message: '请输入药材名称', trigger: 'blur' }],
        herbOrigin: [{ required: true, message: '请输入古籍出处', trigger: 'blur' }],
        herbPinyin: [{ required: true, message: '请输入汉语拼音', trigger: 'blur' }],
        herbPlace: [{ required: true, message: '请输入主要产地', trigger: 'blur' }],
        herbProp: [{ required: true, message: '请输入药性', trigger: 'blur' }],
        herbRemark: [{ required: true, message: '请输入注释', trigger: 'blur' }],
        herbReturn: [{ required: true, message: '请输入归经', trigger: 'blur' }],
        herbStorage: [{ required: true, message: '请输入贮藏', trigger: 'blur' }],
        herbUsage: [{ required: true, message: '请输入用法用量', trigger: 'blur' }]
      },
      options: [],
      title: '新增中药材',
      herbInfoDialog: false,
      selectData: [],
      exportDialog: false
    }
  },
  created() {
    this.initPage()
    this.getDrugTypeList()
  },
  methods: {
    // 删除
    deleteHerb() {
      this.$confirm('删除记录可能会导致重要数据丢失，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$postJson('/reg/system/drugHerbs/delete', row).then(res => {
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
    // 导出
    exportExcel() {
      htmlToExcel.getExcel('#selectTable','中药材')
    },
    // 关闭导出预览弹窗
    handleExportClose() {
      this.exportDialog = false
    },
    // 选中数据
    handleSelectionChange(val) {
      this.selectData = val
    },
    // 预览
    exportExcelSelect() {
      if(this.selectData.length === 0) {
        this.$message.warning("请选择表格中的数据")
        return
      }
      this.exportDialog = true
    },
    getPinIn(value) {
      let res = pinyin.getFullChars(value).replace(/[A-Z]/g,' $&')
      this.herbInfo.herbPinyin = res
    },
     // 获取中药材作用类别列表
    getDrugTypeList() {
      this.$get(`/reg/system/drugType/list/${'3'}`).then((res) => {
        let resData = res.data
        if(resData.code === 200) {
          this.options = resData.data
        } else {
          this.$message.error(resData.msg)
        }
      })
    },
    handleChange(value) {
      this.herbInfo.herbAction = value[1]
    },
     // 首页搜索作用类别
    handleSearchChange(value) {
      this.herbForm.herbAction = value[1]
    },
    // 关闭详情弹窗
    handleInfoClose() {
      this.herbInfoDialog = false
      this.initPage()
    },
    // 提交新增
    onSubmit() {
      this.$refs['drugref'].validate((valid) => {
        if(valid) {
          let rquest = this.title === '编辑' ? 'update' : 'save'
          this.$postJson(`/reg/system/drugHerbs/${rquest}`, this.herbInfo).then((res => {
            let resData = res.data
            if(resData.code === 200) {
              this.$message.success('保存成功')
              this.herbDialog = false
              this.herbInfo = {}
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
      this.herbDialog = false
      this.initPage()
    },
    // 初始化页面
    initPage() {
      this.loading = true;
      const params = {...this.herbForm};
      params.pageNum = this.pagination.pageNum;
      params.pageSize = this.pagination.pageSize;
      this.$postJson('/reg/system/drugHerbs/list', params).then(res => {
        if(res.data.code === 200) {
          this.total = res.data.data.totalSize
          this.herbList = res.data.data.content
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
      this.herbForm = {}
      this.initPage()
    },
    insertProd() {
      this.title = '新增中药材'
      this.herbInfo = {}
      this.herbDialog = true
    },
    // 获取药品详情
    getHerbInfo(row) {
      this.herbInfo = row
      this.herbInfoDialog = true
    },
    // 编辑药品信息
    editHerbInfo(row) {
      this.title = '编辑'
      this.herbInfo = row
      this.herbDialog = true
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