<template>
  <div>
    <el-alert v-if="notStockList.length > 0" class="alert" :title=" `您有${notStockList.length}个药品没有库存记录，请及时`" type="warning" show-icon :closable="false">
      <span class="alertText" @click="batchAdd">处理!</span>
    </el-alert>
    <div class="main">
      <page-title class="page-title" title="查询条件" style="margin-bottom: 10px"></page-title>
      <el-form label-width="120px" :model="stockForm" class="departForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="药品名称">
              <el-input size="medium" v-model="stockForm.drugName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="药物类型">
              <el-select v-model="stockForm.drugType" placeholder="请选择" filterable>
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
              <el-button type="primary" size="small" icon="el-icon-search" @click="handleStockSearch">搜索</el-button>
              <el-button type="" size="small" icon="el-icon-delete" @click="clearForm">清空</el-button>
              <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="insertStock">录入</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <page-title class="page-title" title="库存列表" style="margin-bottom: 10px"></page-title>
      <div style="text-align: right;margin-right: 15px;margin-bottom: 8px;">
        <el-button type="primary" plain icon="el-icon-edit" @click="batchUpdate" size="small">批量新增</el-button>
        <el-button type="primary" plain icon="el-icon-edit" @click="batchReduce" size="small">批量减少</el-button>
        <el-button type="primary" plain icon="el-icon-circle-plus-outline" @click="batchAdd" size="small">批量录入</el-button>
        <el-button type="success" icon="el-icon-document" @click="exportExcelSelect" size="small">导出Excel</el-button>
      </div>
      <el-table :data="stockList" v-loading="loading" stripe @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column align="center" width="150" prop="drugName" show-overflow-tooltip label="药品名称"></el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="药品类型">
          <template slot-scope="scope">
            <span v-if="scope.row.drugType === '1'">西药</span>
            <span v-else-if="scope.row.drugType === '2'">中成药</span>
            <span v-else-if="scope.row.drugType === '3'">中药材</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="售出量">
          <el-table-column sortable :sort-method="sortByJan" align="center" prop="countJan" label="一月"></el-table-column>
          <el-table-column sortable :sort-method="sortByFeb" align="center" prop="countFeb" label="二月"></el-table-column>
          <el-table-column sortable :sort-method="sortByMar" align="center" prop="countMar" label="三月"></el-table-column>
          <el-table-column sortable :sort-method="sortByApr" align="center" prop="countApr" label="四月"></el-table-column>
          <el-table-column sortable :sort-method="sortByMay" align="center" prop="countMay" label="五月"></el-table-column>
          <el-table-column sortable :sort-method="sortByJun" align="center" prop="countJun" label="六月"></el-table-column>
          <el-table-column sortable :sort-method="sortByJul" align="center" prop="countJul" label="七月"></el-table-column>
          <el-table-column sortable :sort-method="sortByAug" align="center" prop="countAug" label="八月"></el-table-column>
          <el-table-column sortable :sort-method="sortBySep" align="center" prop="countSep" label="九月"></el-table-column>
          <el-table-column sortable :sort-method="sortByOct" align="center" prop="countOct" label="十月"></el-table-column>
          <el-table-column sortable :sort-method="sortByNov" align="center" prop="countNov" label="十一月"></el-table-column>
          <el-table-column sortable :sort-method="sortByDec" align="center" prop="countDec" label="十二月"></el-table-column>
        </el-table-column>
        <el-table-column sortable :sort-method="sortBySold" align="center" prop="countSold" show-overflow-tooltip label="总售出数"></el-table-column>
        <el-table-column sortable :sort-method="sortByTotal" align="center" prop="countTotal" show-overflow-tooltip label="库存"></el-table-column>
        <!-- <el-table-column align="center" prop="updateName" show-overflow-tooltip label="核验人"></el-table-column> -->
        <!-- <el-table-column align="center" prop="updateTime" show-overflow-tooltip label="核验时间"></el-table-column> -->
        <el-table-column align="center" width="150" label="操作">
          <template slot-scope="scope">
            <!-- <el-button type="" size="mini" plain @click="getRecipeInfo(scope.row)">详情</el-button> -->
            <el-button type="primary" size="mini" plain @click="editStockInfo(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" plain @click="deleteStock(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination style="text-align: right;" v-show="total > 0" :total="total" :page.sync="pagination.pageNum" :limit.sync="pagination.pageSize" @pagination="handlePageChange" />
      <page-title class="page-title" title="报表分析" style="margin-bottom: 10px"></page-title>
      <StockReport class="stock-report"></StockReport>
      <el-dialog :title="title" :visible.sync="addDialog" width="55%" :before-close="closeAddDialog">
        <el-form :model="stockInfo" label-width="90px" :rules="addRules" ref="addRef">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item  prop="drugNo" label="药品名称">
                    <el-select v-if="title === '新增库存记录'" v-model="stockInfo.drugNo" @change="selectStock">
                      <el-option
                        v-for="item in notStockList"
                        :key="item.drugNo"
                        :label="item.drugName"
                        :value="item.drugNo">
                      </el-option>
                    </el-select>
                    <el-input v-else :disabled="true" v-model="stockInfo.drugName"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div class="text item">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="药物类型">
                    <el-select :disabled="true" v-model="stockInfo.drugType">
                      <el-option
                        v-for="item in drugTypeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="title === '编辑'">
                  <el-form-item prop="isAdd" label="库存状态">
                    <el-select v-model="stockInfo.isAdd">
                      <el-option
                        v-for="item in selectList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-else>
                  <el-form-item prop="countTotal" label="库存量">
                    <el-input v-model="stockInfo.countTotal" @input="inputCountTotal" placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20" v-if="stockInfo.isAdd && title === '编辑'">
                <el-col :span="12">
                  <el-form-item prop="count" :label="(stockInfo.isAdd === '1' ? '增加' : '减少') + '数目'">
                    <el-input v-model="stockInfo.count" @input="inputCount">
                      <template v-if="stockInfo.isAdd === '1'" slot="append">{{ stockInfo.drugUnit }}</template>
                      <template v-else slot="append">{{ '剩余' + (stockInfo.countTotal - (stockInfo.count ? Math.floor(stockInfo.count) : 0))  +  stockInfo.drugUnit }}</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeAddDialog">取 消</el-button>
          <el-button type="primary" @click="addStockInfo">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog top="5vh" :title="batchTitle" :visible.sync="batchDialog" width="60%" :before-close="closeBatchDialog">
        <div class="cardBody">
          <div v-for="(row, index) in selectStockList" :key="index" class="cardItem">
            <el-form :model="row" label-width="90px" :rules="addRules" ref="batchRef">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item  prop="drugNo" label="药品名称">
                        <el-select :disabled="isSelect(row.drugNo)" v-if="batchTitle === '批量录入'" v-model="row.drugNo" @change="selectBatchDrug">
                          <el-option
                            v-for="item in notStockList"
                            :key="item.drugNo"
                            :label="item.drugName"
                            :value="item.drugNo"
                            :disabled="isSelect(item.drugNo)">
                          </el-option>
                        </el-select>
                        <el-input v-else :disabled="true" v-model="row.drugName"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <div v-if="batchTitle === '批量录入'">
                        <i class="el-icon-remove pointer size-20 removeBtn f-right" @click="removeStockItem(row.drugNo, index)" title="删除"></i>
                        <i v-if="selectStockList.length === (index + 1)" @click="addStockItem" title="增加" class="el-icon-circle-plus pointer size-20 addBtn f-right"></i>
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
                    <el-col :span="12" v-if="batchTitle === '批量录入'">
                      <el-form-item prop="countTotal" label="库存量">
                        <el-input v-model="row.countTotal" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"  placeholder="请输入"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" v-else-if="batchTitle === '批量新增'">
                      <el-form-item prop="countTotal" label="新增数目">
                        <el-input v-model="row.count" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"  placeholder="请输入">
                          <template slot="append">{{ row.drugUnit }}</template>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" v-else>
                      <el-form-item prop="countTotal" label="减少数目">
                        <el-input v-model="row.count" @focus="batchFocus(index)" @input="batchInputCount"  placeholder="请输入">
                          <template slot="append">{{ '剩余' + (row.countTotal - (row.count ? Math.floor(row.count) : 0))  +  row.drugUnit }}</template>
                        </el-input>
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
          <el-table-column align="center" width="150" prop="drugName" show-overflow-tooltip label="药品名称"></el-table-column>
          <el-table-column align="center" show-overflow-tooltip label="药品类型">
            <template slot-scope="scope">
              <span v-if="scope.row.drugType === '1'">西药</span>
              <span v-else-if="scope.row.drugType === '2'">中成药</span>
              <span v-else-if="scope.row.drugType === '3'">中药材</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="售出量">
            <el-table-column sortable :sort-method="sortByJan" align="center" prop="countJan" label="一月"></el-table-column>
            <el-table-column sortable :sort-method="sortByFeb" align="center" prop="countFeb" label="二月"></el-table-column>
            <el-table-column sortable :sort-method="sortByMar" align="center" prop="countMar" label="三月"></el-table-column>
            <el-table-column sortable :sort-method="sortByApr" align="center" prop="countApr" label="四月"></el-table-column>
            <el-table-column sortable :sort-method="sortByMay" align="center" prop="countMay" label="五月"></el-table-column>
            <el-table-column sortable :sort-method="sortByJun" align="center" prop="countJun" label="六月"></el-table-column>
            <el-table-column sortable :sort-method="sortByJul" align="center" prop="countJul" label="七月"></el-table-column>
            <el-table-column sortable :sort-method="sortByAug" align="center" prop="countAug" label="八月"></el-table-column>
            <el-table-column sortable :sort-method="sortBySep" align="center" prop="countSep" label="九月"></el-table-column>
            <el-table-column sortable :sort-method="sortByOct" align="center" prop="countOct" label="十月"></el-table-column>
            <el-table-column sortable :sort-method="sortByNov" align="center" prop="countNov" label="十一月"></el-table-column>
            <el-table-column sortable :sort-method="sortByDec" align="center" prop="countDec" label="十二月"></el-table-column>
          </el-table-column>
          <el-table-column sortable :sort-method="sortBySold" align="center" prop="countSold" show-overflow-tooltip label="总售出数"></el-table-column>
          <el-table-column sortable :sort-method="sortByTotal" align="center" prop="countTotal" show-overflow-tooltip label="库存"></el-table-column>
          <el-table-column align="center" prop="updateName" show-overflow-tooltip label="核验人"></el-table-column>
          <el-table-column align="center" prop="updateTime" show-overflow-tooltip label="核验时间"></el-table-column>
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
import StockReport from '@/components/StockReport';
import htmlToExcel from '@/utils/htmlToExcel'
export default {
  components:{
    Pagination,
    PageTitle,
    StockReport
  },
  data() {
    return {
      stockForm: {},
      stockList: [],
      notStockList: [],
      total: 0,
      pagination: {
        pageSize: 10,
        pageNum: 1
      },
      loading: false,
      drugTypeList: [
        { label: '西药', value: '1'}, { label: '中成药', value: '2'}, { label: '中药材', value: '3'}
      ],
      selectList: [{ value: "1", label: "增加"}, { value: "0", label: "减少"}],
      selectData: [],
      exportDialog: false,
      addDialog: false,
      stockInfo: {},
      addRules: {
        drugNo: [{ required: true, message: '请选择药品', trigger: 'change' }],
        isAdd: [{ required: true, message: '请选择增加库存还是减少库存', trigger: 'change' }],
        count: [{ required: true, message: '请输入录入量', trigger: 'blur' }],
        countTotal: [{ required: true, message: '请输入录入量', trigger: 'blur' }],
      },
      title: '新增库存记录',
      batchTitle: '批量新增',
      batchDialog: false,
      selectStockList: [],
      notSelectStockList: [],
      activeIndex: 0
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    // 导出
    exportExcel() {
      htmlToExcel.getExcel('#selectTable','库存')
    },
    // 关闭导出预览弹窗
    handleExportClose() {
      this.exportDialog = false
    },
    batchReduce() {
      if(this.selectData.length === 0) {
        this.$message.warning("请选择表格中的数据")
        return
      }
      this.selectStockList = Object.assign({}, this.selectData)
      this.notSelectPriceList = []
      this.batchTitle = '批量减少'
      this.batchDialog = true
    },
    submitBatch() {
      if(this.isCanSubmit()) {
        if(this.batchTitle === '批量录入') {
          const drugStockList = this.selectStockList
          this.$postJson('/reg/system/drugStock/addList', drugStockList).then((res) => {
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
          const path = this.batchTitle === '批量新增' ? '/reg/system/drugStock/addStock' : '/reg/system/drugStock/reduceStock'
          const forms = this.selectStockList
          this.$postJson(path, forms).then((res) => {
            let resData = res.data
            if(resData.code === 200) {
              this.$message.success("成功")
              this.closeBatchDialog()
              this.initPage()
            } else {
              this.$message.error(resData.msg)
            }
          })
        }
      } else {
        this.$message.error("请将表单填写完整")
      }
    },
    // 判断是否可以提交
    isCanSubmit() {
      const length = this.selectStockList.length
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
    batchFocus(index) {
      this.activeIndex = index
    },
    addStockItem() {
      if(this.selectStockList.length === this.notStockList.length) {
        this.$message.warning("没有可以录入库存的药品了~")
        return
      }
      let info = {
        drugNo: '',
        drugType: '',
        isAdd: '',
        countTotal: '',
        count: ''
      }
      this.selectStockList.push(info)
    },
    removeStockItem(val, index) {
      if(this.selectStockList.length === 1) {
        this.$message.error("请至少选择一项")
        return
      }
      const info = this.selectStockList.find(any => any.drugNo === val)
      this.notSelectStockList.push(info)
      this.selectStockList.splice(index, 1)
    },
    selectBatchDrug(val) {
      const type = this.notStockList.find(any => any.drugNo === val).drugType
      this.selectStockList.find(any => any.drugNo === val).drugType = type
    },
    isSelect(val) {
      if(val === '') {
        return false
      }
      if(this.selectStockList.find(any => any.drugNo === val)) {
        return true
      }
    },
    closeBatchDialog() {
      this.batchDialog = false
      setTimeout(() => {
        this.selectStockList = []
        this.notSelectStockList = []
      }, 500)
    },
    inputCountTotal(value) {
      this.stockInfo.countTotal = Math.floor(value.replace(/[^\d.]/g,''));
    },
    batchInputCount(value) {
      if(value === '') {
        return
      }
      this.selectStockList[this.activeIndex].count = Math.floor(value.replace(/[^\d.]/g,''));
      if(Math.floor(this.selectStockList[this.activeIndex].count) > this.selectStockList[this.activeIndex].countTotal) {
        this.$message.error("减少的库存大与库存现有量！")
        this.selectStockList[this.activeIndex].count = ''
      }
    },
    inputCount(value) {
      if(value === '') {
        return
      }
      this.stockInfo.count = Math.floor(value.replace(/[^\d.]/g,''));
      if(this.stockInfo.isAdd === '0') {
        if(Math.floor(this.stockInfo.count) > this.stockInfo.countTotal) {
          this.$message.error("减少的库存大与库存现有量！")
          this.stockInfo.count = ''
        }
      }
    },
    // 选中列表
    handleSelectionChange(val) {
      this.selectData = val
    },
    addStockInfo() {
      this.$refs['addRef'].validate((valid) => {
        if(valid) {
          if(this.title === '新增库存记录') {
            this.$postJson('/reg/system/drugStock/addInfo', this.stockInfo).then((res) => {
              let resData = res.data
              if(resData.code === 200) {
                this.$message.success("成功")
                this.closeAddDialog()
                this.initPage()
              }
            })
          } else if(this.title === '编辑' && this.stockInfo.isAdd === '1') {
            let forms = []
            forms.push(this.stockInfo)
            this.$postJson('/reg/system/drugStock/addStock', forms).then((res) => {
              let resData = res.data
              if(resData.code === 200) {
                this.$message.success("成功")
                this.closeAddDialog()
                this.initPage()
              }
            }) 
          } else if(this.title === '编辑' && this.stockInfo.isAdd === '0') {
            let forms = []
            forms.push(this.stockInfo)
            this.$postJson('/reg/system/drugStock/reduceStock', forms).then((res) => {
              let resData = res.data
              if(resData.code === 200) {
                this.$message.success("成功")
                this.closeAddDialog()
                this.initPage()
              }
            }) 
          }
        } else {
          this.$message.error('请将表单填写完整')
        }
      })
    },
    selectStock(val) {
      this.stockInfo.drugType = this.notStockList.find(any => any.drugNo === val).drugType
    },
    closeAddDialog() {
      this.addDialog = false
      this.stockInfo = {}
      this.$refs['addRef'].resetFields();
    },
    sortByJan(obj1, obj2) {
      return obj1.countJan - obj2.countJan
    },
    sortByFeb(obj1, obj2) {
      return obj1.countFeb - obj2.countFeb
    },
    sortByMar(obj1, obj2) {
      return obj1.countMar - obj2.countMar
    },
    sortByApr(obj1, obj2) {
      return obj1.countApr - obj2.countApr
    },
    sortByMay(obj1, obj2) {
      return obj1.countMay - obj2.countMay
    },
    sortByJun(obj1, obj2) {
      return obj1.countJun - obj2.countJun
    },
    sortByJul(obj1, obj2) {
      return obj1.countJul - obj2.countJul
    },
    sortByAug(obj1, obj2) {
      return obj1.countAug - obj2.countAug
    },
    sortBySep(obj1, obj2) {
      return obj1.countSep - obj2.countSep
    },
    sortByOct(obj1, obj2) {
      return obj1.countOct - obj2.countOct
    },
    sortByNov(obj1, obj2) {
      return obj1.countNov - obj2.countNov
    },
    sortByDec(obj1, obj2) {
      return obj1.countDec - obj2.countDec
    },
    sortBySold(obj1, obj2) {
      return obj1.countSold - obj2.countSold
    },
    sortByTotal(obj1, obj2) {
      return obj1.countTotal - obj2.countTotal
    },
    deleteStock(row) {

    },
    editStockInfo(row) {
      this.title = "编辑"
      this.$get(`/reg/system/drugStock/info/${row.drugNo}`).then((res) => {
        let resData = res.data
        if(resData.code === 200) {
          this.stockInfo = resData.data
          this.addDialog = true
        } else {
          this.$message.error(resData.msg)
        }
      })
    },
    exportExcelSelect() {
      if(this.selectData.length === 0) {
        this.$message.warning("请选择表格中的数据")
        return
      }
      this.exportDialog = true
    },
    batchUpdate() {
      if(this.selectData.length === 0) {
        this.$message.warning("请选择表格中的数据")
        return
      }
      this.selectStockList = Object.assign({}, this.selectData)
      this.notSelectPriceList = []
      this.batchTitle = '批量新增'
      this.batchDialog = true
    },
    batchAdd() {
      if(this.notStockList.length > 0) {
        this.batchTitle = '批量录入'
        this.batchDialog = true
        Object.assign(this.selectStockList, this.notStockList)
        this.notSelectStockList = []
      } else {
        this.$message.warning("没有需要录入的药物")
      }
    },
    initPage() {
      this.getNotStockList()
      this.loading = true;
      const params = {...this.stockForm};
      params.pageNum = this.pagination.pageNum;
      params.pageSize = this.pagination.pageSize;
      this.$postJson('/reg/system/drugStock/list', params).then(res => {
        if(res.data.code === 200) {
          this.total = res.data.data.totalSize
          this.stockList = res.data.data.content
        } else {
          this.$message.error(res.data.msg)
        }
        this.loading = false;
      })
    },
    getNotStockList() {
      this.$get('/reg/system/drugStock/notStockList').then((res) => {
        let resData = res.data
        if(resData.code === 200) {
          this.notStockList = resData.data
        } else {
          this.$message.error(resData.msg)
        }
      })
    },
    handleStockSearch() {
      this.initPage()
    },
    clearForm() {
      this.stockForm = {}
      this.initPage()
    },
    insertStock() {
      this.stockInfo = {}
      this.title = '新增库存记录'
      this.addDialog = true
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