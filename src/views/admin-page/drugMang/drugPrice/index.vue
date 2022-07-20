<template>
  <div>
    <el-alert v-if="notPriceList.length > 0" class="alert" :title=" `您有${notPriceList.length}个药品没有价格记录，请及时`" type="warning" show-icon :closable="false">
      <span class="alertText" @click="batchAdd">处理!</span>
    </el-alert>
    <div class="main">
      <page-title class="page-title" title="查询条件" style="margin-bottom: 10px"></page-title>
      <el-form label-width="120px" :model="priceForm" class="departForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="药品名称">
              <el-input size="medium" v-model="priceForm.drugName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="药物类型">
              <el-select v-model="priceForm.drugType" placeholder="请选择" filterable>
                <el-option
                  v-for="item in drugTypeList"
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
              <el-button type="primary" size="small" icon="el-icon-search" @click="handleDrugSearch">搜索</el-button>
              <el-button type="" size="small" icon="el-icon-delete" @click="clearForm">清空</el-button>
              <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="insertPrice">新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <page-title class="page-title" title="价格列表" style="margin-bottom: 10px"></page-title>
      <div style="text-align: right;margin-right: 15px;margin-bottom: 8px;">
        <el-button type="primary" plain icon="el-icon-edit" @click="batchUpdate" size="small">批量编辑</el-button>
        <el-button type="primary" plain icon="el-icon-circle-plus-outline" @click="batchAdd" size="small">批量新增</el-button>
        <el-button type="success" icon="el-icon-document" @click="exportExcelSelect" size="small">导出Excel</el-button>
      </div>
      <el-table :data="priceList" v-loading="loading" stripe @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column align="center" prop="drugName" show-overflow-tooltip label="药品名称"></el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="药品类型">
          <template slot-scope="scope">
            <span v-if="scope.row.drugType === '1'">西药</span>
            <span v-else-if="scope.row.drugType === '2'">中成药</span>
            <span v-else-if="scope.row.drugType === '3'">中药材</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="参与医保">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.isInsurance === '0'">否</el-tag>
            <el-tag type="success" v-else-if="scope.row.isInsurance === '1'">是</el-tag>
            <!-- <span v-if="scope.row.isInsurance === '0'">否</span>
            <span v-else-if="scope.row.isInsurance === '1'">是</span> -->
          </template>
        </el-table-column>
        <el-table-column sortable width="130" :sort-method="sortByPrice" align="center" prop="drugPrice" show-overflow-tooltip label="价格(非医保)"></el-table-column>
        <el-table-column sortable :sort-method="sortByInsurance" align="center" prop="drugPriceInsurance" show-overflow-tooltip label="价格(医保)"></el-table-column>
        <el-table-column align="center" prop="drugUnit" show-overflow-tooltip label="单位"></el-table-column>
        <el-table-column sortable :sort-method="sortByMax" align="center" width="120" prop="drugMax" show-overflow-tooltip label="历史最高价格(非医保)"></el-table-column>
        <el-table-column sortable :sort-method="sortByMaxInsurance" align="center" width="120" prop="drugMaxInsurance" show-overflow-tooltip label="历史最高价格(医保)"></el-table-column>
        <el-table-column sortable :sort-method="sortByMin" align="center" width="120" prop="drugMin" show-overflow-tooltip label="历史最低价格(非医保)"></el-table-column>
        <el-table-column sortable :sort-method="sortByMinInsurance" align="center" width="120" prop="drugMinInsurance" show-overflow-tooltip label="历史最低价格(医保)"></el-table-column>
        <el-table-column align="center" width="100" prop="createName" show-overflow-tooltip label="入库人"></el-table-column>
        <el-table-column align="center" width="180" prop="createTime" show-overflow-tooltip label="入库时间"></el-table-column>
        <el-table-column align="center" width="150" label="操作">
          <template slot-scope="scope">
            <!-- <el-button type="" size="mini" plain @click="getRecipeInfo(scope.row)">详情</el-button> -->
            <el-button type="primary" size="mini" plain @click="editPriceInfo(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" plain @click="deletePrice(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination style="text-align: right;" v-show="total > 0" :total="total" :page.sync="pagination.pageNum" :limit.sync="pagination.pageSize" @pagination="handlePageChange" />
    </div>
    <el-dialog :title="title" :visible.sync="addDialog" width="55%" :before-close="closeAddDialog">
      <el-form :model="priceInfo" label-width="90px" :rules="addRules" ref="addRef">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item  prop="drugNo" label="药品名称">
                  <el-select v-if="title === '新增价格记录'" v-model="priceInfo.drugNo" @change="selectDrug">
                    <el-option
                      v-for="item in notPriceList"
                      :key="item.drugNo"
                      :label="item.drugName"
                      :value="item.drugNo">
                    </el-option>
                  </el-select>
                  <el-input v-else :disabled="true" v-model="priceInfo.drugName"></el-input>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="12">
                <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
              </el-col> -->
            </el-row>
          </div>
          <div class="text item">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="药物类型">
                  <el-select :disabled="true" v-model="priceInfo.drugType">
                    <el-option
                      v-for="item in drugTypeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="isInsurance" label="参与医保">
                  <el-select v-model="priceInfo.isInsurance">
                    <el-option
                      v-for="item in selectList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item prop="drugUnit" label="单位">
                  <el-input v-model="priceInfo.drugUnit" placeholder="例如盒、支、剂、袋等等"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="drugPrice" label="价格">
                  <el-input v-model="priceInfo.drugPrice" @input="changeStart1"><template slot="append">元</template></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" v-if="priceInfo.isInsurance && priceInfo.isInsurance === '1'">
              <el-col :span="12">
                <el-form-item prop="drugPriceInsurance" label="医保价格">
                  <el-input v-model="priceInfo.drugPriceInsurance" @input="changeStart2"><template slot="append">元</template></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddDialog">取 消</el-button>
        <el-button type="primary" @click="addPriceInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog top="5vh" :title="batchTitle" :visible.sync="batchDialog" width="60%" :before-close="closeBatchDialog">
      <div class="cardBody">
        <div v-for="(row, index) in selectPriceList" :key="index" class="cardItem">
          <el-form :model="row" label-width="90px" :rules="addRules" ref="batchRef">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item  prop="drugNo" label="药品名称">
                      <el-select :disabled="isSelect(row.drugNo)" v-model="row.drugNo" @change="selectBatchDrug" v-if="batchTitle === '批量新增'">
                        <el-option
                          v-for="item in notPriceList"
                          :key="item.drugNo"
                          :label="item.drugName"
                          :value="item.drugNo"
                          :disabled="isSelect(item.drugNo)">
                        </el-option>
                      </el-select>
                      <el-input v-model="row.drugName" :disabled="true" v-else></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <div v-if="batchTitle === '批量新增'">
                      <i class="el-icon-remove pointer size-20 removeBtn f-right" @click="removePriceItem(row.drugNo, index)" title="删除"></i>
                      <i v-if="selectPriceList.length === (index + 1)" @click="addPriceItem" title="增加" class="el-icon-circle-plus pointer size-20 addBtn f-right"></i>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <div class="text item">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="药物类型">
                      <el-select :disabled="true" v-model="row.drugType">
                        <el-option
                          v-for="item in drugTypeList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item prop="isInsurance" label="参与医保">
                      <el-select v-model="row.isInsurance">
                        <el-option
                          v-for="item in selectList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item prop="drugUnit" label="单位">
                      <el-input v-model="row.drugUnit" placeholder="例如盒、支、剂、袋等等"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item prop="drugPrice" label="价格">
                      <el-input v-model="row.drugPrice" @focus="batchFocus(index)" @input="BatchChangeStart1"><template slot="append">元</template></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="20" v-if="row.isInsurance && row.isInsurance === '1'">
                  <el-col :span="12">
                    <el-form-item prop="drugPriceInsurance" label="医保价格">
                      <el-input v-model="row.drugPriceInsurance" @focus="batchFocus(index)" @input="BatchChangeStart2"><template slot="append">元</template></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeBatchDialog">取 消</el-button>
        <el-button type="primary" @click="submitBatch">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog class="dialog" top="5vh" title="预览" :visible.sync="exportDialog" width="70%" :before-close="handleExportClose">
      <el-table id="selectTable" :data="selectData" height="400px" border>
        <el-table-column width="200" align="center" prop="drugName" show-overflow-tooltip label="药品名称"></el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="药品类型">
          <template slot-scope="scope">
            <span v-if="scope.row.drugType === '1'">西药</span>
            <span v-else-if="scope.row.drugType === '2'">中成药</span>
            <span v-else-if="scope.row.drugType === '3'">中药材</span>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="参与医保">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.isInsurance === '0'">否</el-tag>
            <el-tag type="success" v-else-if="scope.row.isInsurance === '1'">是</el-tag>
            <!-- <span v-if="scope.row.isInsurance === '0'">否</span>
            <span v-else-if="scope.row.isInsurance === '1'">是</span> -->
          </template>
        </el-table-column>
        <el-table-column sortable width="130" :sort-method="sortByPrice" align="center" prop="drugPrice" show-overflow-tooltip label="价格(非医保)"></el-table-column>
        <el-table-column sortable width="120" :sort-method="sortByInsurance" align="center" prop="drugPriceInsurance" show-overflow-tooltip label="价格(医保)"></el-table-column>
        <el-table-column align="center" prop="drugUnit" show-overflow-tooltip label="单位"></el-table-column>
        <el-table-column sortable :sort-method="sortByMax" align="center" width="120" prop="drugMax" show-overflow-tooltip label="历史最高价格(非医保)"></el-table-column>
        <el-table-column sortable :sort-method="sortByMaxInsurance" align="center" width="120" prop="drugMaxInsurance" show-overflow-tooltip label="历史最高价格(医保)"></el-table-column>
        <el-table-column sortable :sort-method="sortByMin" align="center" width="120" prop="drugMin" show-overflow-tooltip label="历史最低价格(非医保)"></el-table-column>
        <el-table-column sortable :sort-method="sortByMinInsurance" align="center" width="120" prop="drugMinInsurance" show-overflow-tooltip label="历史最低价格(医保)"></el-table-column>
        <el-table-column align="center" width="100" prop="createName" show-overflow-tooltip label="入库人"></el-table-column>
        <el-table-column align="center" width="180" prop="createTime" show-overflow-tooltip label="入库时间"></el-table-column>
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
      priceForm: {},
      priceList: [],
      notPriceList: [],
      total: 0,
      pagination: {
        pageSize: 10,
        pageNum: 1
      },
      loading: false,
      drugTypeList: [
        { label: '西药', value: '1'}, { label: '中成药', value: '2'}, { label: '中药材', value: '3'}
      ],
      selectList: [{ value: "1", label: "是"}, { value: "0", label: "否"}],
      selectData: [],
      exportDialog: false,
      addDialog: false,
      priceInfo: {},
      addRules: {
        drugNo: [{ required: true, message: '请选择药品', trigger: 'change' }],
        drugUnit: [{ required: true, message: '请输入价格单位', trigger: 'blur' }],
        isInsurance: [{ required: true, message: '请选择是否参与医保', trigger: 'change' }],
        drugPrice: [{ required: true, message: '请输入非医保价格', trigger: 'blur' }],
        drugPriceInsurance: [{ required: true, message: '请输入医保价格', trigger: 'blur' }]
      },
      title: '新增价格记录',
      batchTitle: '批量新增',
      batchDialog: false,
      selectPriceList: [],
      notSelectPriceList: [],
      acticeIndex: 0
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    batchFocus(index) {
      this.acticeIndex = index
    },
    // 导出
    exportExcel() {
      htmlToExcel.getExcel('#selectTable','价格')
    },
    // 关闭导出预览弹窗
    handleExportClose() {
      this.exportDialog = false
    },
    selectBatchDrug(val) {
      const type = this.notPriceList.find(any => any.drugNo === val).drugType
      this.selectPriceList.find(any => any.drugNo === val).drugType = type
    },
    removePriceItem(val, index) {
      if(this.selectPriceList.length === 1) {
        this.$message.error("请至少选择一项")
        return
      }
      const info = this.selectPriceList.find(any => any.drugNo === val)
      this.notSelectPriceList.push(info)
      this.selectPriceList.splice(index, 1)
    },
    addPriceItem() {
      if(this.selectPriceList.length === this.notPriceList.length) {
        this.$message.warning("没有可以增加的药品了~")
        return
      }
      let info = {
        drugNo: '',
        drugType: '',
        isInsurance: '',
        drugUnit: '',
        drugPrice: '',
        drugPriceInsurance: ''
      }
      this.selectPriceList.push(info)
    },
    isSelect(val) {
      if(val === '') {
        return false
      }
      if(this.selectPriceList.find(any => any.drugNo === val)) {
        return true
      }
    },
    submitBatch() {
      if(this.isCanSubmit()) {
        let url = this.batchTitle === '批量新增' ? '/reg/system/drugPrice/saveByList' : '/reg/system/drugPrice/updateByList'
        const priceList = this.selectPriceList
        this.$postJson(url, priceList).then((res) => {
          let resData = res.data
          if(resData.code === 200) {
            this.$message.success("成功")
            this.closeBatchDialog()
            this.initPage()
          } else {
            this.$message.error(resData.msg)
          }
        })
      } else {
        this.$message.error("请将表单填写完整")
      }
    },
    // 判断是否可以提交
    isCanSubmit() {
      const length = this.selectPriceList.length
      let result
      for(var i = 0; i < length; i++) {
        this.$refs['batchRef'][i].validate((valid) => {
          result = valid
          if(!valid) {
            return false
          }
        })
        if(!result) {
          return false
        }
      }
      return true
    },
    // 关闭批量新增/编辑弹窗
    closeBatchDialog() {
      this.batchDialog = false
      setTimeout(() => {
        this.selectPriceList = []
        this.notSelectPriceList = []
      }, 500)
    },
    sortByMinInsurance(obj1, obj2) {
      return obj1.drugMinInsurance - obj2.drugMinInsurance
    },
    sortByMin(obj1, obj2) {
      return obj1.drugMin - obj2.drugMin
    },
    sortByMaxInsurance(obj1, obj2) {
      return obj1.drugMaxInsurance - obj2.drugMaxInsurance
    },
    sortByMax(obj1, obj2) {
      return obj1.drugMax - obj2.drugMax
    },
    // 根据非医保价格排序
    sortByPrice(obj1, obj2) {
      return obj1.drugPrice - obj2.drugPrice
    },
    // 根据医保价格排序
    sortByInsurance(obj1, obj2) {
      return obj1.drugPriceInsurance - obj2.drugPriceInsurance
    },
    deletePrice(row) {
      this.$confirm('删除记录可能会导致重要数据丢失，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$postJson('/reg/system/drugPrice/delete', row).then(res => {
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
    strFormatNum(val) {
      //清除“数字”和“.”以外的字符
      val = val.replace(/[^\d.]/g, '') 
      //只保留第一个. 清除多余的
      val = val.replace(/\.{2,}/g, '.') 
      val = val.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      //只能输入两个小数
      val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') 
      if (val.indexOf('.') < 0 && val != '') {
          //如果没有小数点，首位不能为类似于 01、02的金额
          val = parseFloat(val)
      }
      return val
    },
    BatchChangeStart1(value) {
      setTimeout(() => {
        this.selectPriceList[this.acticeIndex].drugPrice = this.strFormatNum(value)
      }, 30)
    },
    // 监听价格输入框
    changeStart1(value) {
      setTimeout(() => {
        this.priceInfo.drugPrice = this.strFormatNum(value)
      }, 30)
    },
    BatchChangeStart2(value) {
      setTimeout(() => {
        this.selectPriceList[this.acticeIndex].drugPriceInsurance = this.strFormatNum(value)
      }, 30)
    },
    // 监听价格输入框
    changeStart2(value) {
      setTimeout(() => {
        this.priceInfo.drugPriceInsurance = this.strFormatNum(value)
      }, 30)
    },
    // 关闭新增价格弹窗
    closeAddDialog() {
      this.addDialog = false
      this.priceInfo = {}
      this.$refs['addRef'].resetFields();
    },
    // 提交新增价格按钮
    addPriceInfo() {
      this.$refs['addRef'].validate((valid) => {
        if(valid) {
          const result = this.title === '编辑' ? 'update' : 'save'
          this.$postJson(`/reg/system/drugPrice/${result}`, this.priceInfo).then((res) => {
            let resData = res.data
            if(resData.code === 200) {
              this.$message.success("成功")
              this.closeAddDialog()
              this.initPage()
            }
          })
        } else {
          this.$message.error('请将表单填写完整')
        }
      })
    },
    // 选择药品名称
    selectDrug(val) {
      this.priceInfo.drugType = this.notPriceList.find(any => any.drugNo === val).drugType
    },
    // 导出excel
    exportExcelSelect() {
      if(this.selectData.length === 0) {
        this.$message.warning("请选择表格中的数据")
        return
      }
      this.exportDialog = true
    },
    editPriceInfo(row) {
      this.title = '编辑'
      this.$get(`/reg/system/drugPrice/info/${row.drugNo}`).then((res) => {
        let resData = res.data
        if(resData.code === 200) {
          this.priceInfo = resData.data
          this.addDialog = true
        } else {
          this.$message.error(resData.msg)
        }
      })
    },
    // 新增药物价格
    insertPrice() {
      this.title = '新增价格记录'
      this.addDialog = true
    },
    // 选中列表
    handleSelectionChange(val) {
      this.selectData = val
    },
    // 批量编辑
    batchUpdate() {
      if(this.selectData.length === 0) {
        this.$message.warning("请选择表格中的数据")
        return
      }
      let noList = []
      for(var i = 0; i < this.selectData.length; i++) {
        noList.push(this.selectData[i].drugNo)
      }
      this.$post('/reg/system/drugPrice/listByNos', {'noList': noList}).then((res) => {
        let resData = res.data
        if(resData.code === 200) {
          this.batchTitle = '批量编辑'
          this.batchDialog = true
          this.selectPriceList = resData.data
          this.notSelectPriceList = []
        } else {
          this.$message.error(resData.msg)
        }
      })
    },
    // 批量新增
    batchAdd() {
      if(this.notPriceList.length > 0) {
        this.batchTitle = '批量新增'
        this.batchDialog = true
        Object.assign(this.selectPriceList, this.notPriceList)
        this.notSelectPriceList = []
      } else {
        this.$message.warning("没有需要新增的药物价格记录")
      }
    },
    getNotPriceList() {
      this.$get('/reg/system/drugPrice/notPriceList').then(res => {
        let resData = res.data
        if(resData.code === 200) {
          this.notPriceList = resData.data
        } else {
          this.$message.error(resData.msg)
        }
      })
    },
    initPage() {
      this.getNotPriceList()
      this.loading = true;
      const params = {...this.priceForm};
      params.pageNum = this.pagination.pageNum;
      params.pageSize = this.pagination.pageSize;
      this.$postJson('/reg/system/drugPrice/list', params).then(res => {
        if(res.data.code === 200) {
          this.total = res.data.data.totalSize
          this.priceList = res.data.data.content
        } else {
          this.$message.error(res.data.msg)
        }
        this.loading = false;
      })
    },
    handleDrugSearch() {
      this.initPage()
    },
    clearForm() {
      this.priceForm = {}
      this.initPage()
    },
    handlePageChange() {
      this.initPage()
    }
  }
}
</script>

<style lang="scss" scoped>
.alert {
  >>> .el-alert__description {
    display: initial;
  }
}
.alertText {
  font-size: 13px;
  font-weight: 700;
  line-height: 18px;
  cursor: pointer;
  text-decoration: underline;
}
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
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  width: 100%
  }
.clearfix {
  >>> .el-form-item {
    margin-bottom: 0px;
  }
  >>> .el-select {
    width: 100%;
  }
}
.cardItem {
  margin-bottom: 10px;
}
.cardBody {
  height: 500px;
  overflow: auto;
  padding: 10px;
  border: 1px solid #EBEEF5;
}
</style>