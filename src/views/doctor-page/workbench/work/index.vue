<template>
   <div class="main">
    <div>
      <Step ref="step" :active="active" :data="patientInfo"></Step>
      <div>
        <div class="before-form" :style="isShow ? 'width: 1200px' : 'width: 100%'" ref="print">
          <div class="main-title">
            <span class="text">处方笺</span>
            <span class="right" @click="print" v-if="isShow">打印</span>
          </div>
          <el-form :model="patientInfo" label-width="120px">
            <el-form-item label="患者姓名">
              <el-input disabled v-model="patientInfo.patPerson.personName"></el-input>
            </el-form-item>
            <el-form-item label="住院/门诊号">
              <el-input disabled v-model="patientInfo.patRegRecord.regNo"></el-input>
            </el-form-item>
            <el-form-item label="就诊科室">
              <el-input disabled v-model="patientInfo.doctorInfo.secondDepartment"></el-input>
            </el-form-item>
            <el-form-item label="就诊/入院时间">
              <el-input disabled v-model="patientInfo.consultationTime"></el-input>
            </el-form-item>
            <el-form-item label="是否有医保">
              <el-radio v-model="prescription.isHaveInsurance" label="1">有</el-radio>
              <el-radio v-model="prescription.isHaveInsurance" label="0">没有</el-radio>
            </el-form-item>
            <el-form-item label="医保号" v-if="prescription.isHaveInsurance === '1'">
              <el-input v-model="prescription.insuranceNo"></el-input>
            </el-form-item>
            <el-form-item label="临床诊断">
              <el-input type="textarea" :rows="4" v-model="prescription.diagnosis"></el-input>
            </el-form-item>
            <el-form-item label="西医诊断">
              <!-- <el-input type="textarea" :rows="4" v-model="patientInfo.zhenduan"></el-input> -->
              <el-button type="primary" size="mini" @click="openDrug">选择</el-button>
              <el-table :data="selectData1" border stripe>
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column align="center" show-overflow-tooltip property="drugGeneralName" label="药物名称"></el-table-column>
                <el-table-column align="center" show-overflow-tooltip property="num" label="数量"></el-table-column>
                <el-table-column align="center" show-overflow-tooltip property="drugSpec" label="规格"></el-table-column>
                <el-table-column align="center" show-overflow-tooltip property="drugUnit" label="单位"></el-table-column>
                <el-table-column align="center" show-overflow-tooltip property="drugPrice" label="单价（元）">
                  <template slot-scope="scope">
                    {{ prescription.isHaveInsurance === '1'&&scope.row.isInsurance === '1'  ?  scope.row.drugPriceInsurance : scope.row.drugPrice}}
                  </template>
                </el-table-column>
                <!-- <el-table-column align="center" width="250" label="操作">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" plain>删除</el-button>
                  </template>
                </el-table-column> -->
              </el-table>
            </el-form-item>
            <el-form-item label="中医诊断">
              <!-- <el-input type="textarea" :rows="4" v-model="patientInfo.zhenduan"></el-input> -->
              <el-button type="primary" size="mini" @click="openDrug2">选择</el-button>
              <el-table :data="selectData2" border stripe>
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column align="center" show-overflow-tooltip property="herbName" label="药材名称"></el-table-column>
                <el-table-column align="center" show-overflow-tooltip property="num" label="数量"></el-table-column>
                <el-table-column align="center" show-overflow-tooltip property="herbUsage" label="规格"></el-table-column>
                <el-table-column align="center" show-overflow-tooltip property="drugUnit" label="单位"></el-table-column>
                <el-table-column align="center" show-overflow-tooltip property="drugPrice" label="单价（元）">
                  <template slot-scope="scope">
                    {{ prescription.isHaveInsurance === '1'&&scope.row.isInsurance === '1'  ?  scope.row.drugPriceInsurance : scope.row.drugPrice}}
                  </template>
                </el-table-column>
                <!-- <el-table-column align="center" width="250" label="操作">
                  <template slot-scope="scope">
                    <el-button type="danger" size="mini" plain>删除</el-button>
                  </template>
                </el-table-column> -->
              </el-table>
            </el-form-item>
          </el-form>
          <div v-if="isShow" class="p-t-10" style="height: 100px">
            <el-button type="primary" v-if="active !== 0" icon="el-icon-arrow-left" @click="previousStep">上一步</el-button>
            <el-button type="primary" style="float:right" @click="nextStep">下一步&nbsp;<i class="el-icon-arrow-right"></i></el-button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-drag title="药物选择" :visible.sync="dialog" top="10vh" width="80%" :before-close="handleClose">
      <div>
        <el-form :model="drugForm" label-width="100px">
          <el-row>
            <el-col :span="7">
              <el-form-item label="药物名称">
                <el-input v-model="drugForm.drugGeneralName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="功能主治">
                <el-input v-model="drugForm.drugIndication"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="作用类别">
                <el-input v-model="drugForm.subType"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3" style='text-align: right;'>
              <el-button type="primary" size="small" icon="el-icon-search" @click="searchDrug">检索</el-button>
              <el-button class="p-l-10" type="primary" size="small" icon="el-icon-check" @click="handleClick">确认</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table :data="drugList" stripe @selection-change="handleSelectionChange" @select="clickRow">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column property="drugGeneralName" show-overflow-tooltip label="药品名称"></el-table-column>
        <el-table-column property="drugNature" show-overflow-tooltip label="性状"></el-table-column>
        <el-table-column show-overflow-tooltip property="drugIndication" label="功能主治"></el-table-column>
        <el-table-column show-overflow-tooltip property="subType" label="作用类别"></el-table-column>
        <el-table-column property="drugPrice" show-overflow-tooltip label="单价(元)"></el-table-column>
        <el-table-column property="drugPriceInsurance" show-overflow-tooltip label="医保价(元)"></el-table-column>
        <el-table-column property="drugUnit" show-overflow-tooltip label="单位"></el-table-column>
        <el-table-column show-overflow-tooltip label="库存余量">
          <template slot-scope="scope">
            {{ scope.row.countTotal + '' + scope.row.drugUnit }}
          </template>
        </el-table-column>
        <el-table-column width="200" label="数量">
          <template slot-scope="scope">
            <el-input v-model="scope.row.num" type="number">
              <el-button slot="prepend" icon="el-icon-minus" @click="reduceNum(scope.row)"></el-button>
              <el-button slot="append" icon="el-icon-plus" @click="addNum(scope.row)"></el-button>
            </el-input>
          </template>
        </el-table-column>
      </el-table>
      <pagination style="text-align: right;" v-show="total > 0" :total="total" :page.sync="pagination.pageNum" :limit.sync="pagination.pageSize" @pagination="handlePageChange" />
    </el-dialog>
    <el-dialog v-drag title="药物选择" :visible.sync="dialog2" top="10vh" width="80%" :before-close="handleClose2">
      <div>
        <el-form :model="drugForm2" label-width="100px">
          <el-row>
            <el-col :span="7">
              <el-form-item label="药材名称">
                <el-input v-model="drugForm2.herbName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="功能主治">
                <el-input v-model="drugForm2.herbEfficacy"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="作用类别">
                <el-input v-model="drugForm2.subType"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3" style='text-align: right;'>
              <el-button type="primary" size="small" icon="el-icon-search" @click="searchDrug2">检索</el-button>
              <el-button class="p-l-10" type="primary" size="small" icon="el-icon-check" @click="handleClick2">确认</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table :data="drugList2" stripe @selection-change="handleSelectionChange2">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column property="herbName" show-overflow-tooltip label="药材名称"></el-table-column>
        <el-table-column property="herbPinyin" show-overflow-tooltip label="拼音"></el-table-column>
        <el-table-column show-overflow-tooltip property="subType" label="作用类别"></el-table-column>
        <el-table-column show-overflow-tooltip property="herbEfficacy" label="功能主治"></el-table-column>
        <el-table-column property="herbUsage" show-overflow-tooltip label="规格"></el-table-column>
        <el-table-column property="drugPrice" show-overflow-tooltip label="单价(元)"></el-table-column>
        <el-table-column property="drugPriceInsurance" show-overflow-tooltip label="医保价(元)"></el-table-column>
        <el-table-column property="drugUnit" show-overflow-tooltip label="单位"></el-table-column>
        <el-table-column show-overflow-tooltip label="库存余量">
          <template slot-scope="scope">
            {{ scope.row.countTotal + '' + scope.row.drugUnit }}
          </template>
        </el-table-column>
        <el-table-column width="200" label="数量">
          <template slot-scope="scope">
            <el-input v-model="scope.row.num" type="number">
              <el-button slot="prepend" icon="el-icon-minus" @click="reduceNum(scope.row)"></el-button>
              <el-button slot="append" icon="el-icon-plus" @click="addNum(scope.row)"></el-button>
            </el-input>
          </template>
        </el-table-column>
      </el-table>
      <pagination style="text-align: right;" v-show="total2 > 0" :total="total2" :page.sync="pagination2.pageNum" :limit.sync="pagination2.pageSize" @pagination="handlePageChange2" />
    </el-dialog>
   </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import Pagination from '@/components/Pagination';
import Step from '@/components/Step';
export default {
  components: {
    PageTitle,
    Step,
    Pagination
  },
  data() {
    return {
      active: 2,
      patientInfo: {},
      isShow: true,
      drugList: [],
      drugList2: [],
      selectData1: [],
      selectData2: [],
      total: 0,
      pagination: {
        pageSize: 10,
        pageNum: 1
      },
      total2: 0,
      pagination2: {
        pageSize: 10,
        pageNum: 1
      },
      drugForm: {},
      drugForm2: {},
      loading: false,
      loading2: false,
      dialog: false,
      dialog2: false,
      drugType: '1',
      prescription: {}
    }
  },
  created() {
    if(typeof(this.$route.params.patientInfo) !== 'undefined') {
      this.patientInfo = this.$route.params.patientInfo
    }
    this.selectData1 = [],
    this.selectData2 = [],
    this.initPage()
  },
  mounted() {
    window.onbeforeunload = function (e) {
      if(this.$route.fullPath =="/work"){
          e = e || window.event;
          // 兼容IE8和Firefox 4之前的版本
          if (e) {
            e.returnValue = '关闭提示';
          }
          // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
          return '关闭提示';
      }else{
        window.onbeforeunload =null
      }
    };
  },
  methods: {
    clickRow(selection, row) {
      console.log(selection, row)
    },
    handleClose2() {
      let close = true
      this.selectData2.forEach((item) => {
        if(item.num === 0) {
          close = false
        }
      })
      if(!close) {
        this.selectData2 = []
      }
      this.dialog2 = false
    },
    handleClose() {
      let close = true
      this.selectData1.forEach((item) => {
        if(item.num === 0) {
          close = false
        }
      })
      if(!close) {
        this.selectData1 = []
      }
      this.dialog = false
    },
    handleClick2() {
      let close = true
      this.selectData2.forEach((item) => {
        if(item.num === 0) {
          this.$message.error(`请选择药材：【${item.herbName}】的数量`)
          close = false
        }
      })
      if(close) {
        this.dialog2 = false
      } else {
        this.selectData2 = []
      }
    },
    handleClick() {
      let close = true
      this.selectData1.forEach((item) => {
        if(item.num === 0) {
          this.$message.error(`请选择药物：【${item.drugGeneralName}】的数量`)
          close = false
        }
      })
      if(close) {
        this.dialog = false
      } else {
        this.selectData1 = []
      }
    },
    handleSelectionChange(val) {
      this.selectData1 = val
    },
    handleSelectionChange2(val) {
      this.selectData2 = val
    },
    searchDrug2() {
      this.getDrugList2()
    },
    searchDrug() {
      this.getDrugList()
    },
    reduceNum(row) {
      if(row.num === 0) {
        this.$message.error("数量不能为0以下")
        return
      }
      row.num--
    },
    addNum(row) {
      if(row.num === row.countTotal) {
        this.$message.error("已达到最大库存量")
        return
      }
      row.num++
    },
    handlePageChange2() {
      this.getDrugList2()
    },
    handlePageChange() {
      this.getDrugList()
    },
    openDrug2() {
      this.drugType = '2'
      this.dialog2 = true
    },
    openDrug() {
      this.drugType = '1'
      this.dialog = true
    },
    initPage() {
      this.getDrugList()
      this.getDrugList2()
    },
    nextStep() {
      let math = require('mathjs');
      // 提交就诊单
      let params = {}
      params.doctorNo = this.patientInfo.doctorInfo.userNo
      params.personNo = this.patientInfo.patPerson.personNo
      params.patNo = this.patientInfo.patPerson.patNo
      params.regNo = this.patientInfo.patPayRecord.regNo
      params.personHeight = this.patientInfo.patPerson.height
      params.personWeight = this.patientInfo.patPerson.weight
      params.personOccupation = this.patientInfo.patPerson.occupation
      params.personMaritalStatus = this.patientInfo.patPerson.maritalStatus
      params.personOriginAddrress = this.patientInfo.patPerson.originAddrress
      params.personWorkAddress = this.patientInfo.patPerson.workAddress
      params.personAllergicHistory = this.patientInfo.patPerson.allergicHistory
      params.personPastMedicalHistory = this.patientInfo.patPerson.pastMedicalHistory
      params.personRemark = this.patientInfo.patPerson.remark
      params.consultationTime = this.patientInfo.consultationTime
      params.isHaveInsurance = this.prescription.isHaveInsurance
      params.insuranceNo = this.prescription.insuranceNo
      params.diagnosis = this.prescription.diagnosis
      // 处理总价
      let total = 0.00
      let prescriptionHerbs = []
      this.selectData1.forEach((item) => {
        let drug = {}
        drug.drugNo = item.drugNo
        drug.drugType = '1'
        drug.num = item.num
        if(item.isInsurance === '1' && this.prescription.isHaveInsurance === '1') {
          drug.price = math.format(math.chain(math.bignumber(item.num)).multiply(math.bignumber(item.drugPriceInsurance)).done());
          drug.unitPrice = item.drugPriceInsurance
          total = math.format(math.chain(math.bignumber(total)).add(math.bignumber(drug.price)).done());
        } else {
          drug.price = math.format(math.chain(math.bignumber(item.num)).multiply(math.bignumber(item.drugPrice)).done());
          drug.unitPrice = item.drugPrice
          total = math.format(math.chain(math.bignumber(total)).add(math.bignumber(drug.price)).done());
        }
        prescriptionHerbs.push(drug)
      })
      this.selectData2.forEach((item) => {
        let drug = {}
        drug.drugNo = item.herbNo
        drug.drugType = '2'
        drug.num = item.num
        if(item.isInsurance === '1' && this.prescription.isHaveInsurance === '1') {
          drug.price = math.format(math.chain(math.bignumber(item.num)).multiply(math.bignumber(item.drugPriceInsurance)).done());
          drug.unitPrice = item.drugPriceInsurance
          total = math.format(math.chain(math.bignumber(total)).add(math.bignumber(drug.price)).done());
        } else {
          drug.price = math.format(math.chain(math.bignumber(item.num)).multiply(math.bignumber(item.drugPrice)).done());
          drug.unitPrice = item.drugPrice
          total = math.format(math.chain(math.bignumber(total)).add(math.bignumber(drug.price)).done());
        }
        prescriptionHerbs.push(drug)
      })
      // 判断预约订单是否已支付，未支付则在此加上
      if(this.patientInfo.patPayRecord.orderState === '0') {
        total = math.format(math.chain(math.bignumber(total)).add(math.bignumber(this.patientInfo.patPayRecord.userCost)).done());
      }
      params.totalPrice = total
      params.prescriptionHerbs = prescriptionHerbs
      this.$postJson('/reg/system/prescription/save', params).then((res) => {
        const resData = res.data
        if(resData.code === 200) {
          const result = resData.data
          params.orderNo = result.orderNo
          params.prescriptionNo = result.prescriptionNo
          this.patientInfo.prescription = params
          this.$refs.step.nextStep()
        } else {
          this.$message.error("保存就诊单时发生错误，原因为：" + resData.msg)
        }
      })
    },
    previousStep() {
      this.$refs.step.previousStep()
    },
    async print() {
      await this.changeType()
      this.$print(this.$refs.print)
      this.isShow = true
    },
    changeType() {
      this.isShow = false
    },
    getDrugList() {
      this.loading = true
      let params = {...this.drugForm}
      // params.drugGenus = '1'
      params.pageNum = this.pagination.pageNum;
      params.pageSize = this.pagination.pageSize;
      this.$postJson('/reg/system/drug/v2/list', params).then(res => {
        if(res.data.code === 200) {
          this.total = res.data.data.totalSize
          this.drugList = res.data.data.content
        } else {
          this.$message.error(res.data.msg)
        }
        this.loading = false;
      })
    },
    getDrugList2() {
      this.loading2 = true
      let params = {...this.drugForm2}
      params.pageNum = this.pagination2.pageNum;
      params.pageSize = this.pagination2.pageSize;
      this.$postJson('/reg/system/drugHerbs/v2/list', params).then(res => {
        if(res.data.code === 200) {
          this.total2 = res.data.data.totalSize
          this.drugList2 = res.data.data.content
        } else {
          this.$message.error(res.data.msg)
        }
        this.loading2 = false;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  padding: 10px 20px;
  height: 100%;
}
.before-form {
  padding-top: 20px;
  width: 1200px;
  margin: 0 auto;
  >>> .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 100%;
  }
}
table{
  width:100%;
  // border:1px solid black;/*设置边框粗细，实线，颜色*/
  text-align:center;/*文本居中*/
  // background-color:#70DB93;
  border-collapse: separate;
  border-spacing: 0;
  border-top: 1px solid black;
  border-left: 1px solid black;
}

th{
  border:1px solid black;
  color:black;
  font-weight:bold;/*因为是标题栏，加粗显示*/
}

td{
  border:1px solid black;
  border-top: none;
  border-left: none;
  // color:#8E2323;
}
.heard {
  height: 40px;
  line-height: 1.5em;
  font-size: 16px;
  justify-content: center;
}
.btn {
  margin-top: 20px;
  text-align: center;
}
.title {
  background-color: #e3e3e3;
}
.fir-table {
  height: 50px;
  line-height: 50px;
}
.sec-table {
  height: 100px;
  line-height: 100px;
}
.thi-table {
  height: 250px;
  line-height: 250px;
}
.main-title {
  width: 100%;
  text-align: center;
  line-height: 1.5em;
  .text {
    font-size: 24px;
    font-weight: bold;
  }
  .right {
    padding-left: 5px;
  }
  .right:hover {
    color: #409EFF;
    text-decoration: underline;
    cursor: pointer;
  }
  // padding-top: 40px;
  padding-bottom: 20px;
}
</style>