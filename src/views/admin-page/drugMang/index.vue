<template>
  <div class="main">
    <div>
      <page-title class="page-title" title="查询条件" style="margin-bottom: 10px"></page-title>
      <el-form label-width="120px" :model="drugForm" class="departForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="药品名称">
              <el-input size="medium" v-model="drugForm.drugName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="通用名称">
              <el-input v-model="drugForm.drugGeneralName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="适应症">
              <el-input v-model="drugForm.drugIndication"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="作用类别:" prop="drugAction">
              <el-cascader :options="options" v-model="drugForm.drugAction" @change="handleSearchChange" filterable clearable>
                <template slot-scope="{ node, data }">
                  <span>{{ data.label }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
              <!-- <el-input v-model="drugInfo.drugAction"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生产企业">
              <el-select v-model="drugForm.drugCompany" placeholder="请选择" filterable>
                <el-option
                  v-for="item in drugProdList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入库人">
              <el-input v-model="drugForm.createName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24" style='text-align: right;'>
            <el-form-item>
              <el-button type="primary" size="small" icon="el-icon-search" @click="handleDrugSearch">搜索</el-button>
              <el-button type="" size="small" icon="el-icon-delete" @click="clearForm">清空</el-button>
              <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="insertDrug">新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div>
        <page-title class="page-title" title="药品列表" style="margin-bottom: 20px;"></page-title>
        <div style="text-align: right;margin-right: 15px;margin-bottom: 5px;">
          <el-button type="success" icon="el-icon-document" @click="exportExcelSelect" size="small">导出Excel</el-button>
        </div>
      </div>
      <el-table :data="drugList" v-loading="loading" stripe @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column property="drugName" show-overflow-tooltip label="药品名称"></el-table-column>
        <el-table-column property="drugGeneralName" show-overflow-tooltip label="通用名称"></el-table-column>
        <el-table-column show-overflow-tooltip label="作用类别">
          <template slot-scope="scope">{{scope.row.mainType + '/' + scope.row.subType}}
          </template>
        </el-table-column>
        <el-table-column width="300" property="drugIndication" show-overflow-tooltip label="适应症"></el-table-column>
        <el-table-column property="drugApprovalNum" show-overflow-tooltip label="批准文号"></el-table-column>
        <el-table-column property="prodName" show-overflow-tooltip label="生产企业"></el-table-column>
        <el-table-column width="80" property="createName" show-overflow-tooltip label="入库人"></el-table-column>
        <el-table-column width="150" property="createTime" show-overflow-tooltip label="入库时间"></el-table-column>
        <el-table-column width="220" label="操作">
          <template slot-scope="scope">
            <el-button type="" size="mini" plain @click="getDrugInfo(scope.row)">详情</el-button>
            <el-button type="primary" size="mini" plain @click="editDrugInfo(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" plain @click="deleteDrug(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination style="text-align: right;" v-show="total > 0" :total="total" :page.sync="pagination.pageNum" :limit.sync="pagination.pageSize" @pagination="handlePageChange" />
      <el-dialog top="5vh" class="dialog" :title="title" :visible.sync="drugDialog" width="60%" :before-close="handleClose">
        <el-form label-width="110px" :model="drugInfo" class="drugInfoForm" ref="drugref" :rules="rules">
          <page-title class="page-title" title="基础信息" style="margin-bottom: 20px;"></page-title>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="药品名称:" prop="drugName"><el-input v-model="drugInfo.drugName"></el-input></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="通用名称:" prop="drugGeneralName"><el-input v-model="drugInfo.drugGeneralName"></el-input></el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="性状:" prop="drugNature"><el-input v-model="drugInfo.drugNature"></el-input></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="规格:" prop="drugSpec"><el-input v-model="drugInfo.drugSpec"></el-input></el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="作用类别:" prop="drugAction">
                <el-cascader :options="options" v-model="drugInfo.drugAction" @change="handleChange" filterable clearable>
                  <template slot-scope="{ node, data }">
                    <span>{{ data.label }}</span>
                    <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                  </template>
                </el-cascader>
                <!-- <el-input v-model="drugInfo.drugAction"></el-input> -->
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item label="价格:" prop="drugPrice">
                <el-input v-model="drugInfo.drugPrice">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="成分:" prop="drugIngredient"><el-input type="textarea" v-model="drugInfo.drugIngredient"></el-input></el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="适应症:" prop="drugIndication"><el-input :rows="4" type="textarea" v-model="drugInfo.drugIndication"></el-input></el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="用法用量:" prop="drugUsage"><el-input type="textarea" :rows="4" v-model="drugInfo.drugUsage"></el-input></el-form-item>
            </el-col>
          </el-row>
          <page-title class="page-title" title="不良反应与禁忌" style="margin-bottom: 20px;"></page-title>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="不良反应:" prop="drugAdverse"><el-input :rows="4" type="textarea" v-model="drugInfo.drugAdverse"></el-input></el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="禁忌:" prop="drugTaboo"><el-input :rows="2" type="textarea" v-model="drugInfo.drugTaboo"></el-input></el-form-item>
            </el-col>
          </el-row>
          <page-title class="page-title" title="注意事项" style="margin-bottom: 20px;"></page-title>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="注意事项:" prop="drugCautions"><el-input type="textarea" :rows="4" v-model="drugInfo.drugCautions"></el-input></el-form-item>
            </el-col>
          </el-row>
          <page-title class="page-title" title="药理相关" style="margin-bottom: 20px;"></page-title>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="药物相互作用:" prop="drugInteraction"><el-input type="textarea" :rows="4" v-model="drugInfo.drugInteraction"></el-input></el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="药理作用:" prop="drugPharEffects"><el-input type="textarea" :rows="2" v-model="drugInfo.drugPharEffects"></el-input></el-form-item>
            </el-col>
          </el-row>
          <page-title class="page-title" title="附加信息" style="margin-bottom: 20px;"></page-title>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="贮藏:" prop="drugStorage"><el-input v-model="drugInfo.drugStorage"></el-input></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="有效期:" prop="drugPeriodDate"><el-input v-model="drugInfo.drugPeriodDate"></el-input></el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="批准文号:" prop="drugApprovalNum"><el-input v-model="drugInfo.drugApprovalNum"></el-input></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生产企业:" prop="drugCompany">
                <el-select v-model="drugInfo.drugCompany" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in drugProdList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="包装:" prop="drugPackage"><el-input type="textarea" :rows="2" v-model="drugInfo.drugPackage"></el-input></el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="执行标准:" prop="drugStandards"><el-input type="textarea" :rows="2" v-model="drugInfo.drugStandards"></el-input></el-form-item>
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
      <el-dialog class="dialog" top="5vh" title="药品详情" :visible.sync="drugInfoDialog" width="70%" :before-close="handleInfoClose">
        <el-descriptions class="margin-top" :title="'药品代码: ' + drugInfo.drugNo" :column="3" border>
          <template slot="extra">
            <span>入库人: </span><span class="bold">{{ drugInfo.createName }}</span>&nbsp;&nbsp;&nbsp;
            <span>核准日期: </span><span class="bold">{{ drugInfo.createTime }}</span>&nbsp;&nbsp;&nbsp;
            <span>修订日期: </span><span class="bold">{{ drugInfo.updateTime }}</span>
          </template>
          <el-descriptions-item :labelStyle="{'width' : '100px'}">
            <template slot="label"><i class=""></i>药品名称</template>{{ drugInfo.drugName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">通用名称</template>{{ drugInfo.drugGeneralName }}
          </el-descriptions-item>
          <!-- <el-descriptions-item>
            <template slot="label">单价</template>{{ drugInfo.drugPrice }}
          </el-descriptions-item> -->
          <el-descriptions-item :labelStyle="{'width' : '100px'}">
            <template slot="label">性状</template>{{ drugInfo.drugNature }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">规格</template>{{ drugInfo.drugSpec }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">作用类别</template>{{ drugInfo.mainType + '/' + drugInfo.subType }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="1" border>
          <el-descriptions-item :labelStyle="{'width' : '100px'}">
            <template slot="label">成分</template>{{ drugInfo.drugIngredient }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="1" border>
          <el-descriptions-item :labelStyle="{'width' : '100px'}">
            <template slot="label">适应症</template><span v-html="drugInfo.drugIndication"></span>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="1" border>
          <el-descriptions-item :labelStyle="{'width' : '100px'}">
            <template slot="label">用法用量</template><span v-html="drugInfo.drugUsage"></span>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="1" border>
          <el-descriptions-item :labelStyle="{'width' : '100px'}">
            <template slot="label">不良反应</template><span v-html="drugInfo.drugAdverse"></span>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="1" border>
          <el-descriptions-item :labelStyle="{'width' : '100px'}">
            <template slot="label">禁忌</template><span v-html="drugInfo.drugTaboo"></span>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="1" border>
          <el-descriptions-item :labelStyle="{'width' : '100px'}">
            <template slot="label">注意事项</template><span v-html="drugInfo.drugCautions"></span>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="1" border>
          <el-descriptions-item :labelStyle="{'width' : '100px'}">
            <template slot="label">药物相互作用</template><span v-html="drugInfo.drugInteraction"></span>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="1" border>
          <el-descriptions-item :labelStyle="{'width' : '100px'}">
            <template slot="label">不良反应</template><span v-html="drugInfo.drugPharEffects"></span>
          </el-descriptions-item>
        </el-descriptions>
         <el-descriptions class="margin-top" :column="3" border>
          <el-descriptions-item :labelStyle="{'width' : '100px'}">
            <template slot="label">贮藏</template>{{ drugInfo.drugStorage }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">有效期</template>{{ drugInfo.drugPeriodDate }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">批准文号</template>{{ drugInfo.drugApprovalNum }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="1" border>
          <el-descriptions-item :labelStyle="{'width' : '100px'}">
            <template slot="label">包装</template><span v-html="drugInfo.drugPackage"></span>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="1" border>
          <el-descriptions-item :labelStyle="{'width' : '100px'}">
            <template slot="label">执行标准</template><span v-html="drugInfo.drugStandards"></span>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="1" border>
          <el-descriptions-item :labelStyle="{'width' : '100px'}">
            <template slot="label">生产企业</template>
            <el-popover
              placement="top"
              width="400"
              trigger="hover">
              <el-descriptions :column="1" border v-if="companyInfo">
                <el-descriptions-item>
                  <template slot="label">企业名称</template>{{ companyInfo.prodName }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">地址</template>{{ companyInfo.prodAddress }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">邮编</template>{{ companyInfo.prodZip }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">省份/国家</template>{{ companyInfo.prodProvince }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">电话</template>{{ companyInfo.prodTel }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">传真</template>{{ companyInfo.prodFax }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">服务热线</template>{{ companyInfo.prodHotline }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">邮箱</template>{{ companyInfo.prodEmail }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">网址</template><span @click="toOtherPage(companyInfo.prodWebsite)" class="link">{{ companyInfo.prodWebsite }}</span>
                </el-descriptions-item>
              </el-descriptions>
              <span slot="reference" v-html="drugInfo.prodName" class="prog"></span>
            </el-popover>
          </el-descriptions-item>
        </el-descriptions>
      </el-dialog>
      <el-dialog class="dialog" top="5vh" title="预览" :visible.sync="exportDialog" width="70%" :before-close="handleExportClose">
        <el-table id="selectTable" :data="selectData" stripe height="400px" border>
          <el-table-column property="id" show-overflow-tooltip label="ID"></el-table-column>
          <el-table-column property="drugNo" show-overflow-tooltip label="NO"></el-table-column>
          <el-table-column property="drugName" show-overflow-tooltip label="药品名称"></el-table-column>
          <el-table-column property="drugGeneralName" show-overflow-tooltip label="通用名称"></el-table-column>
          <el-table-column show-overflow-tooltip label="作用类别">
            <template slot-scope="scope">{{scope.row.mainType + '/' + scope.row.subType}}
            </template>
          </el-table-column>
          <el-table-column property="drugIngredient" show-overflow-tooltip label="成分"></el-table-column>
          <el-table-column property="drugNature" show-overflow-tooltip label="性状"></el-table-column>
          <el-table-column property="drugSpec" show-overflow-tooltip label="规格"></el-table-column>
          <el-table-column property="drugUsage" show-overflow-tooltip label="用法用量"></el-table-column>
          <el-table-column property="drugTaboo" show-overflow-tooltip label="禁忌"></el-table-column>
          <el-table-column property="drugCautions" show-overflow-tooltip label="注意事项"></el-table-column>
          <el-table-column property="drugInteraction" show-overflow-tooltip label="相互作用"></el-table-column>
          <el-table-column property="drugPharEffects" show-overflow-tooltip label="药理作用"></el-table-column>
          <el-table-column property="drugStorage" show-overflow-tooltip label="贮藏"></el-table-column>
          <el-table-column property="drugPackage" show-overflow-tooltip label="包装"></el-table-column>
          <el-table-column property="drugPeriodDate" show-overflow-tooltip label="有效期"></el-table-column>
          <el-table-column property="drugStandards" show-overflow-tooltip label="执行标准"></el-table-column>
          <el-table-column width="300" property="drugIndication" show-overflow-tooltip label="适应症"></el-table-column>
          <el-table-column property="drugApprovalNum" show-overflow-tooltip label="批准文号"></el-table-column>
          <el-table-column property="prodName" show-overflow-tooltip label="生产企业"></el-table-column>
          <el-table-column width="80" property="createName" show-overflow-tooltip label="入库人"></el-table-column>
          <el-table-column width="150" property="createTime" show-overflow-tooltip label="入库时间"></el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="exportExcel">确定保存</el-button>
        </div>
      </el-dialog>
    </div>
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
      drugForm: {},
      loading: false,
      drugList: [],
      drugDialog: false,
      drugInfo: {},
      rules: {
        drugName: [{ required: true, message: '请输入药品名称', trigger: 'blur' }],
        drugGeneralName: [{ required: true, message: '请输入通用名称', trigger: 'blur' }],
        drugIngredient: [{ required: true, message: '请输入成分', trigger: 'blur' }],
        drugNature: [{ required: true, message: '请输入性状', trigger: 'blur' }],
        drugAction: [{ required: true, message: '请输入作用类别', trigger: 'change' }],
        drugIndication: [{ required: true, message: '请输入适应症', trigger: 'blur' }],
        drugSpec: [{ required: true, message: '请输入规格', trigger: 'blur' }],
        drugUsage: [{ required: true, message: '请输入用法用量', trigger: 'blur' }],
        drugAdverse: [{ required: true, message: '请输入不良反应', trigger: 'blur' }],
        drugTaboo: [{ required: true, message: '请输入禁忌', trigger: 'blur' }],
        drugCautions: [{ required: true, message: '请输入注意事项', trigger: 'blur' }],
        drugInteraction: [{ required: true, message: '请输入药物相互作用', trigger: 'blur' }],
        drugStorage: [{ required: true, message: '请输入贮藏', trigger: 'blur' }],
        drugPackage: [{ required: true, message: '请输入包装', trigger: 'blur' }],
        drugPeriodDate: [{ required: true, message: '请输入有效期', trigger: 'blur' }],
        drugStandards: [{ required: true, message: '请输入执行标准', trigger: 'blur' }],
        drugApprovalNum: [{ required: true, message: '请输入批准文号', trigger: 'blur' }],
        drugCompany: [{ required: true, message: '请输入生产企业', trigger: 'blur' }],
        drugPrice: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        drugPharEffects: [{ required: true, message: '请输入药理作用', trigger: 'blur' }],
        drugAction: [{ required: true, message: '请输入作用类别', trigger: 'blur' }],
      },
      options: [],
      drugProdList: [],
      title: '新增药品',
      drugInfoDialog: false,
      companyInfo: {},
      selectData: [],
      exportDialog: false
    }
  },
  created() {
    this.initPage()
    this.getDrugTypeList()
    this.getDrugProdList()
  },
  methods: {
    deleteDrug(row) {
      this.$confirm('删除记录可能会导致重要数据丢失，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$postJson('/reg/system/drug/delete', row).then(res => {
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
      htmlToExcel.getExcel('#selectTable','西药')
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
    // 跳转到其他页面
    toOtherPage(url) {
      window.location.href = url
      window.open(url)
    },
    // 关闭详情弹窗
    handleInfoClose() {
      this.drugInfoDialog = false
      this.initPage()
    },
    // 首页搜索作用类别
    handleSearchChange(value) {
      this.drugForm.drugAction = value[1]
    },
    // 获取生产企业
    getDrugProdList() {
      this.$get('/reg/system/drugProd/label').then((res) => {
        let resData = res.data
        if(resData.code === 200) {
          this.drugProdList = resData.data
        } else {
          this.$message.error(resData.msg)
        }
      })
    },
    // 获取西药作用类别列表
    getDrugTypeList() {
      this.$get(`/reg/system/drugType/list/${'1'}`).then((res) => {
        let resData = res.data
        if(resData.code === 200) {
          this.options = resData.data
        } else {
          this.$message.error(resData.msg)
        }
      })
    },
    // 作用类别选择改变
    handleChange(value) {
      this.drugInfo.drugAction = value[1]
    },
    // 提交新增
    onSubmit() {
      this.$refs['drugref'].validate((valid) => {
        if(valid) {
          this.drugInfo.drugGenus = '1'
          let rquest = this.title === '编辑' ? 'update' : 'save'
          this.$postJson(`/reg/system/drug/${rquest}`, this.drugInfo).then((res => {
            let resData = res.data
            if(resData.code === 200) {
              this.$message.success('保存成功')
              this.drugDialog = false
              this.drugInfo = {}
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
      this.drugDialog = false
      this.initPage()
    },
    // 初始化页面
    initPage() {
      this.loading = true;
      const params = {...this.drugForm};
      params.pageNum = this.pagination.pageNum;
      params.pageSize = this.pagination.pageSize;
      params.drugGenus = '1'
      this.$postJson('/reg/system/drug/list', params).then(res => {
        if(res.data.code === 200) {
          this.total = res.data.data.totalSize
          this.drugList = res.data.data.content
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
    // 搜索药品
    handleDrugSearch() {
      this.initPage()
    },
    // 清空搜索
    clearForm() {
      this.drugForm = {}
      this.initPage()
    },
    insertDrug() {
      this.title = '新增药品'
      this.drugInfo = {}
      this.drugDialog = true
    },
    // 获取药品详情
    getDrugInfo(row) {
      this.drugInfo = row
      this.drugInfo.drugIndication = this.drugInfo.drugIndication.replace(/\n/g,"<br/>")
      this.drugInfo.drugUsage = this.drugInfo.drugUsage.replace(/\n/g,"<br/>")
      this.drugInfo.drugAdverse = this.drugInfo.drugAdverse.replace(/\n/g,"<br/>")
      this.drugInfo.drugTaboo = this.drugInfo.drugTaboo.replace(/\n/g,"<br/>")
      this.drugInfo.drugCautions = this.drugInfo.drugCautions.replace(/\n/g,"<br/>")
      this.drugInfo.drugInteraction = this.drugInfo.drugInteraction.replace(/\n/g,"<br/>")
      this.drugInfo.drugPackage = this.drugInfo.drugPackage.replace(/\n/g,"<br/>")
      this.$get(`/reg/system/drugProd/info/${this.drugInfo.drugCompany}`).then((res => {
        let resData = res.data
        if(resData.code === 200) {
          this.companyInfo = resData.data
        } else {
          this.$message.error(resData.msg)
        }
      }))
      this.drugInfoDialog = true
    },
    // 编辑药品信息
    editDrugInfo(row) {
      this.title = '编辑'
      this.drugInfo = row
      this.drugDialog = true
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