<template>
   <div class="main">
    <div>
      <Step ref="step" :active="active" :data="patientInfo"></Step>
      <div class="before-form">
        <div style="padding-left: 100px" class="header">
          <span>就诊单生成成功！</span>
          <!-- <span class="right primary pointer" @click="openDialog" v-if="isShow">打印</span> -->
        </div>
        <div>
          <div class="center zhifu">支付</div>
          <el-form :model="orderForm" ref="ref" :rules="rules" label-width="100px">
            <el-form-item label="订单号：">
              <el-input disabled v-model="orderForm.orderNo"></el-input>
            </el-form-item>
            <el-form-item label="支付方式：">
              <div class="pay">
                <div class="item pointer" :class="activeIndex === index ? 'item-click' : ''" @click="clickPay(item, index)" v-for="(item, index) in payList" :key="index">
                  <div style="text-align: center;">
                    <el-image class="image" :src="require(`@/assets/pay-icon/${item.icon}`)" :alt="item.text"/>
                    <div style="top: -20px;position: relative;">{{ item.text }}</div>
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="总计：">
              <div class="price">{{ orderForm.orderPrice }}元</div>
            </el-form-item>
            <el-form-item v-if="orderForm.payWay !== '柜台缴费' && activeIndex!= null" label="支付状态：">
              <div class="payStatus" :class="orderForm.orderStatus === '0' ? 'begin' : 'over'">{{ orderForm.orderStatus === '0' ? '支付中...' : '支付完成' }}</div>
            </el-form-item>
          </el-form>
          <div class="center">
            <el-button type="success" :disabled="!over || canParent" @click="save">保存</el-button>
            <el-button type="success" :disabled="!canParent" @click="openDialog">打印</el-button>
            <el-button type="success" :disabled="!canParent" @click="endWork">完成</el-button>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-drag title="处方笺预览" v-if="dialogClose" top="5vh" width="60%" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="printDialog" :before-close="handleClose">
      <PrintPrescription ref="print" :prescriptionInfo="info"></PrintPrescription>
      <div class="end">
        <el-button type="primary" size="small" @click="print">确认</el-button>
        <el-button class="p-l-10" type="" size="small" @click="handleClose">取消</el-button>
      </div>
    </el-dialog>
   </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import Step from '@/components/Step';
import PrintPrescription from '@/components/Print/prescriptionInfo.vue';
export default {
  components: {
    PageTitle,
    Step,
    PrintPrescription
  },
  data() {
    return {
      active: 3,
      patientInfo: {},
      orderForm: {
        orderPrice: '13.30',
        orderStatus: '',
        payWay: '微信支付',
      },
      isShow: true,
      rules: {},
      payList: [
        {icon: 'weixin.png', text: '微信支付'}, {icon: 'zhifubao.png', text: '支付宝支付'}, {icon: 'yinlian.png', text: '银联支付'}, {icon: 'yunshanfu.png', text: '云闪付'},
        {icon: 'apple_pay.png', text: '苹果支付'}, {icon: 'paypal.png', text: 'PayPal'}, {icon: 'guitai.png', text: '柜台缴费'}
      ],
      activeIndex: null,
      over: false,
      canParent: false,
      info: {},
      printDialog: false,
      dialogClose: false
    }
  },
  created() {
    if(typeof(this.$route.params.patientInfo) !== 'undefined') {
      this.patientInfo = this.$route.params.patientInfo
      this.orderForm.orderNo = this.patientInfo.prescription.orderNo
      this.orderForm.orderPrice = this.patientInfo.prescription.totalPrice
    }
  },
  methods: {
    print() {
      this.$print(this.$refs.print)
    },
    clickPay(item, index) {
      this.orderForm.payWay = item.text
      this.activeIndex = index
      this.orderForm.orderStatus = '0' // 表示已发起
      setTimeout(() => {
        if(item.text !== '柜台缴费') {
          this.orderForm.orderStatus = '1'
        }
        this.over = true
      }, 5000)
    },
    handleClose() {
      this.printDialog = false
      setTimeout(() => {
        this.dialogClose = false
      }, 500)
    },
    openDialog() {
      this.$get(`/reg/system/prescription/info?prescriptionNo=${this.patientInfo.prescription.prescriptionNo}`).then((res => {
        if(res.data.code === 200) {
          this.info = res.data.data
          this.dialogClose = true
          this.printDialog = true
        }
      }))
    },
    // 保存
    save() {
      this.$postJson('/reg/system/prescription/overOrder', this.orderForm).then((res) => {
        const resData = res.data
        if(resData.code === 200) {
          this.$message.success("保存成功")
          this.canParent = true
        } else {
          this.$message.error("提交订单失败！，原因为：" + resData.msg)
        }
      })
    },
    // 结束
    endWork() {
      this.patientInfo = {}
      this.$refs.step.nextStep();
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  padding: 10px 20px;
  // height: 100%;
}
.pay {
  display: flex;
  .item {
    width: 80px;
    height: 100px;
    margin-right: 5px;
    .image {
      width: 70px;
      height: 70px;
    }
  }
}
.item:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.item-click {
  box-shadow: 0 2px 12px 0 #409EFF !important;
}
.before-form {
  padding-top: 20px;
  width: 1200px;
  margin: 0 auto;
  >>> .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 100%;
  }
}
.header {
  font-size: 18px;
  line-height: 1.5em;
}
.zhifu {
  height: 30px;
  line-height: 30px;
  font-size: 20px;
  font-weight: bold;
  padding-bottom: 10px;
}
.price {
  font-size: 22px;
  font-weight: bold;
}
.payStatus {
  font-size: 22px;
  font-weight: bold;
}
.begin {
  color: #409EFF;
}
.over {
  color: #67C23A;
}
.end {
  height: 30px;
  text-align: center;
}
@media print {
  @page {
    size: auto;
    margin-top: 0mm;//解决打印多出一页空白页的问题  
  }
  html {
    background-color: #ffffff;
    height: auto;
    margin: 0px;
  }

  body {
    border: solid 1px #ffffff;
    margin: 10mm 15mm 10mm 15mm; 
  }
}
</style>