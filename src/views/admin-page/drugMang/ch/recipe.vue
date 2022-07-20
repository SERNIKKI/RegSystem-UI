<template>
  <div class="main">
    <div>
      <page-title class="page-title" title="查询条件" style="margin-bottom: 10px"></page-title>
      <el-form label-width="120px" :model="recipeForm" class="departForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="方剂名称">
              <el-input size="medium" v-model="recipeForm.recipeName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="汉语拼音">
              <el-input v-model="recipeForm.recipePinyin"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主治">
              <el-input size="medium" v-model="recipeForm.recipeIndication"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="作用类别">
              <el-cascader :options="options" v-model="recipeForm.recipeAction" @change="handleSearchChange" filterable clearable>
                <template slot-scope="{ node, data }">
                  <span>{{ data.label }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
              <!-- <el-input v-model="herbForm.herbAction"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出处">
              <el-input size="medium" v-model="recipeForm.recipeOrigin"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" style='text-align: right;'>
            <el-form-item >
              <el-button type="primary" size="small" icon="el-icon-search" @click="handleRecipeSearch">搜索</el-button>
              <el-button type="" size="small" icon="el-icon-delete" @click="clearForm">清空</el-button>
              <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="insertRecipe">新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <page-title class="page-title" title="方剂列表" style="margin-bottom: 20px;"></page-title>
      <div style="text-align: right;margin-right: 15px;margin-bottom: 5px;">
        <el-button type="success" icon="el-icon-document" @click="exportExcelSelect" size="small">导出Excel</el-button>
      </div>
      <el-table :data="recipeList" v-loading="loading" stripe @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column property="recipeName" show-overflow-tooltip label="方名"></el-table-column>
        <el-table-column property="recipePinyin" show-overflow-tooltip label="汉语拼音"></el-table-column>
        <el-table-column property="recipeOrigin" show-overflow-tooltip label="出自"></el-table-column>
        <!-- <el-table-column property="prodWebsite" show-overflow-tooltip label="网址"></el-table-column> -->
        <el-table-column show-overflow-tooltip label="作用类别">
          <template slot-scope="scope">
            {{scope.row.mainType + '/' + scope.row.subType}}
          </template>
        </el-table-column>
        <el-table-column property="recipeEfficacy" show-overflow-tooltip label="功用"></el-table-column>
        <el-table-column property="recipeIngredient" show-overflow-tooltip label="主要成分"></el-table-column>
        <el-table-column property="recipeApply" show-overflow-tooltip label="用法"></el-table-column>
        <el-table-column width="220" label="操作">
          <template slot-scope="scope">
            <el-button type="" size="mini" plain @click="getRecipeInfo(scope.row)">详情</el-button>
            <el-button type="primary" size="mini" plain @click="editRecipeInfo(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" plain @click="deleteRecipe(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination style="text-align: right;" v-show="total > 0" :total="total" :page.sync="pagination.pageNum" :limit.sync="pagination.pageSize" @pagination="handlePageChange" />
    </div>
    <el-dialog top="5vh" class="dialog" :title="title" :visible.sync="recipeDialog" width="60%" :before-close="handleClose">
      <el-form label-width="110px" :model="recipeInfo" class="drugInfoForm" ref="drugref" :rules="rules">
        <page-title class="page-title" title="基础信息" style="margin-bottom: 20px;"></page-title>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="方名:" prop="recipeName"><el-input @input="getPinIn" v-model="recipeInfo.recipeName"></el-input></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="汉语拼音:" prop="recipePinyin"><el-input v-model="recipeInfo.recipePinyin"></el-input></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="出处:" prop="recipeOrigin"><el-input v-model="recipeInfo.recipeOrigin"></el-input></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属类别:" prop="recipeAction">
              <el-cascader :options="options" v-model="recipeInfo.recipeAction" @change="handleChange" filterable clearable>
                <template slot-scope="{ node, data }">
                  <span>{{ data.label }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
              <!-- <el-input v-model="herbInfo.herbName"></el-input> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="主要成分:" prop="recipeIngredient"><el-input type="textarea" v-model="recipeInfo.recipeIngredient"></el-input></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="组成:" prop="recipeComposed"><el-input type="textarea" v-model="recipeInfo.recipeComposed"></el-input></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="用法:" prop="recipeApply"><el-input type="textarea" v-model="recipeInfo.recipeApply"></el-input></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="功用:" prop="recipeEfficacy"><el-input type="textarea" v-model="recipeInfo.recipeEfficacy"></el-input></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="主治:" prop="recipeIndication"><el-input type="textarea" v-model="recipeInfo.recipeIndication"></el-input></el-form-item>
          </el-col>
        </el-row>
        <page-title class="page-title" title="现代特点" style="margin-bottom: 20px;"></page-title>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="配伍特点:"><el-input type="textarea" v-model="recipeInfo.recipeFeature"></el-input></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="鉴别:"><el-input :rows="4" type="textarea" v-model="recipeInfo.recipeIdent"></el-input></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="辨证要点:"><el-input type="textarea" v-model="recipeInfo.recipePa"></el-input></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="加减变化:"><el-input :rows="4" type="textarea" v-model="recipeInfo.recipeAosc"></el-input></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="现代运用:"><el-input :rows="4" type="textarea" v-model="recipeInfo.recipeMu"></el-input></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="使用注意:"><el-input :rows="4" type="textarea" v-model="recipeInfo.recipeNote"></el-input></el-form-item>
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
    <el-dialog top="5vh" class="dialog" title="药材详情" :visible.sync="recipeInfoDialog" width="70%" :before-close="handleInfoClose">
      <el-descriptions class="margin-top" :title="'方剂代码: ' + recipeInfo.recipeNo" :column="3" border>
        <template slot="extra">
          <span>入库人: </span><span class="bold">{{ recipeInfo.createName }}</span>&nbsp;&nbsp;&nbsp;
          <span>核准日期: </span><span class="bold">{{ recipeInfo.createTime }}</span>&nbsp;&nbsp;&nbsp;
          <span>修订日期: </span><span class="bold">{{ recipeInfo.updateTime }}</span>
        </template>
        <el-descriptions-item :labelStyle="{'width' : '100px'}">
          <template slot="label"><i class=""></i>方名</template>{{ recipeInfo.recipeName }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">汉语拼音</template>{{ recipeInfo.recipePinyin }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">作用类别</template>{{ recipeInfo.mainType + '/' + recipeInfo.subType }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">出处</template>{{ recipeInfo.recipeOrigin }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1" border>
        <el-descriptions-item :labelStyle="{'width' : '100px'}">
          <template slot="label">主要成分</template><span v-html="recipeInfo.recipeIngredient"></span>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1" border>
        <el-descriptions-item :labelStyle="{'width' : '100px'}">
          <template slot="label">组成</template><span v-html="recipeInfo.recipeComposed"></span>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1" border>
        <el-descriptions-item :labelStyle="{'width' : '100px'}">
          <template slot="label">用法</template><span v-html="recipeInfo.recipeApply"></span>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1" border>
        <el-descriptions-item :labelStyle="{'width' : '100px'}">
          <template slot="label">功用</template><span v-html="recipeInfo.recipeEfficacy"></span>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1" border>
        <el-descriptions-item :labelStyle="{'width' : '100px'}">
          <template slot="label">主治</template><span v-html="recipeInfo.recipeIndication"></span>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1" border>
        <el-descriptions-item :labelStyle="{'width' : '100px'}">
          <template slot="label">配伍特点</template><span v-html="recipeInfo.recipeFeature"></span>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1" border>
        <el-descriptions-item :labelStyle="{'width' : '100px'}">
          <template slot="label">鉴别</template><span v-html="recipeInfo.recipeIdent"></span>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1" border>
        <el-descriptions-item :labelStyle="{'width' : '100px'}">
          <template slot="label">辩证要点</template><span v-html="recipeInfo.recipePa"></span>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1" border>
        <el-descriptions-item :labelStyle="{'width' : '100px'}">
          <template slot="label">加减变化</template><span v-html="recipeInfo.recipeAosc"></span>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1" border>
        <el-descriptions-item :labelStyle="{'width' : '100px'}">
          <template slot="label">现代运用</template><span v-html="recipeInfo.recipeMu"></span>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="1" border>
        <el-descriptions-item :labelStyle="{'width' : '100px'}">
          <template slot="label">使用注意</template><span v-html="recipeInfo.recipeNote"></span>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
    <el-dialog class="dialog" top="5vh" title="预览" :visible.sync="exportDialog" width="70%" :before-close="handleExportClose">
      <el-table id="selectTable" :data="selectData" height="400px" border>
        <el-table-column property="id" show-overflow-tooltip label="ID"></el-table-column>
        <el-table-column property="recipeNo" show-overflow-tooltip label="方剂NO"></el-table-column>
        <el-table-column property="recipeName" show-overflow-tooltip label="方名"></el-table-column>
        <el-table-column property="recipePinyin" show-overflow-tooltip label="汉语拼音"></el-table-column>
        <el-table-column property="recipeOrigin" show-overflow-tooltip label="出自"></el-table-column>
        <!-- <el-table-column property="prodWebsite" show-overflow-tooltip label="网址"></el-table-column> -->
        <el-table-column show-overflow-tooltip label="作用类别">
          <template slot-scope="scope">
            {{scope.row.mainType + '/' + scope.row.subType}}
          </template>
        </el-table-column>
        <el-table-column property="recipeComposed" show-overflow-tooltip label="组成"></el-table-column>
        <el-table-column property="recipeEfficacy" show-overflow-tooltip label="功用"></el-table-column>
        <el-table-column property="recipeIngredient" show-overflow-tooltip label="主要成分"></el-table-column>
        <el-table-column property="recipeApply" show-overflow-tooltip label="用法"></el-table-column>
        <el-table-column property="recipeIndication" show-overflow-tooltip label="主治"></el-table-column>
        <el-table-column property="recipeFeature" show-overflow-tooltip label="配伍特点"></el-table-column>
        <el-table-column property="recipeIdent" show-overflow-tooltip label="鉴别"></el-table-column>
        <el-table-column property="recipePa" show-overflow-tooltip label="辨证要点"></el-table-column>
        <el-table-column property="recipeAosc" show-overflow-tooltip label="加减变化"></el-table-column>
        <el-table-column property="recipeMu" show-overflow-tooltip label="现代运用"></el-table-column>
        <el-table-column property="recipeNote" show-overflow-tooltip label="使用注意"></el-table-column>
        <el-table-column property="createName" show-overflow-tooltip label="核验人"></el-table-column>
        <el-table-column property="createTime" show-overflow-tooltip label="核验时间"></el-table-column>
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
      recipeForm: {},
      loading: false,
      recipeList: [],
      recipeDialog: false,
      recipeInfo: {},
      rules: {
        recipeName: [{ required: true, message: '请输入方名', trigger: 'blur' }],
        recipePinyin: [{ required: true, message: '请输入汉语拼音', trigger: 'blur' }],
        recipeAction: [{ required: true, message: '请选择所属类别', trigger: 'change' }],
        recipeIngredient: [{ required: true, message: '请输入主要成分', trigger: 'blur' }],
        recipeComposed: [{ required: true, message: '请输入组成', trigger: 'blur' }],
        recipeApply: [{ required: true, message: '请输入用法', trigger: 'blur' }],
        recipeEfficacy: [{ required: true, message: '请输入功用', trigger: 'blur' }],
        recipeIndication: [{ required: true, message: '请输入主治', trigger: 'blur' }],
        recipeOrigin: [{ required: true, message: '请输入出处', trigger: 'blur' }]
      },
      options: [],
      title: '新增中药材',
      recipeInfoDialog: false,
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
    deleteRecipe() {
      this.$confirm('删除记录可能会导致重要数据丢失，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$postJson('/reg/system/drugRecipe/delete', row).then(res => {
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
    // 导出
    exportExcel() {
      htmlToExcel.getExcel('#selectTable','方剂')
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
      this.recipeInfo.recipePinyin = res
    },
     // 获取方剂作用类别列表
    getDrugTypeList() {
      this.$get(`/reg/system/drugType/list/${'4'}`).then((res) => {
        let resData = res.data
        if(resData.code === 200) {
          this.options = resData.data
        } else {
          this.$message.error(resData.msg)
        }
      })
    },
    handleChange(value) {
      this.recipeInfo.recipeAction = value[1]
    },
     // 首页搜索作用类别
    handleSearchChange(value) {
      this.recipeForm.recipeAction = value[1]
    },
    // 关闭详情弹窗
    handleInfoClose() {
      this.recipeInfoDialog = false
      this.initPage()
    },
    // 提交新增
    onSubmit() {
      this.$refs['drugref'].validate((valid) => {
        if(valid) {
          let rquest = this.title === '编辑' ? 'update' : 'save'
          this.$postJson(`/reg/system/drugRecipe/${rquest}`, this.recipeInfo).then((res => {
            let resData = res.data
            if(resData.code === 200) {
              this.$message.success('保存成功')
              this.recipeDialog = false
              this.recipeInfo = {}
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
      this.recipeDialog = false
      this.initPage()
    },
    // 初始化页面
    initPage() {
      this.loading = true;
      const params = {...this.herbForm};
      params.pageNum = this.pagination.pageNum;
      params.pageSize = this.pagination.pageSize;
      this.$postJson('/reg/system/drugRecipe/list', params).then(res => {
        if(res.data.code === 200) {
          this.total = res.data.data.totalSize
          this.recipeList = res.data.data.content
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
    handleRecipeSearch() {
      this.initPage()
    },
    // 清空搜索
    clearForm() {
      this.recipeForm = {}
      this.initPage()
    },
    insertRecipe() {
      this.title = '新增方剂'
      this.recipeInfo = {}
      this.recipeDialog = true
    },
    // 获取药品详情
    getRecipeInfo(row) {
      this.recipeInfo = row
      this.recipeInfoDialog = true
    },
    // 编辑药品信息
    editRecipeInfo(row) {
      this.title = '编辑'
      this.recipeInfo = row
      this.recipeDialog = true
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