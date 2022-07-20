<template>
  <div class="main">
    <div class="print">
      <div class="header">
        <div class="title">
          <div class="title-text">xx医院门诊部处方笺</div>
        </div>
        <div>
          <el-row :gutter="10">
            <el-col :span="4">
              <span class="st">费别:</span>
              <span class="st">{{ prescriptionInfo.prescriptionOrder.payWay ?  prescriptionInfo.prescriptionOrder.payWay : '柜台缴费'}}</span>
            </el-col>
            <el-col :span="8">
              <span class="st">医疗证/医保卡号:</span>
              <span class="st">{{ prescriptionInfo.insuranceNo }}</span>
            </el-col>
            <el-col :span="8">
              <span class="st">处方编号:</span>
              <span class="st">{{ prescriptionInfo.prescriptionNo }}</span>
            </el-col>
            <el-col :span="4">
              <span class="st">科室:</span>
              <span class="st">{{ prescriptionInfo.secondDepartment }}</span>
            </el-col>
          </el-row>
          <div class="border"></div>
        </div>
        <div>
          <el-row :gutter="10">
            <el-col :span="8">
              <span class="st">患者姓名:</span>
              <span class="st">{{ prescriptionInfo.personName }}</span>
            </el-col>
            <el-col :span="8">
              <span class="st">患者姓别:</span>
              <span class="st">{{ prescriptionInfo.personGender}}</span>
            </el-col>
            <el-col :span="8">
              <span class="st">患者年龄:</span>
              <span class="st">{{ prescriptionInfo.personAge}}岁</span>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <span class="st">门诊/住院病历号:</span>
              <span class="st">{{ prescriptionInfo.regNo }}</span>
            </el-col>
            <el-col :span="12">
              <span class="st">科室(病区/床位号):</span>
              <span class="st">{{ prescriptionInfo.department + '/' + prescriptionInfo.secondDepartment }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <span class="st">药物过敏史:</span>
              <span class="st">{{ prescriptionInfo.personAllergicHistory }}</span>
            </el-col>
            <el-col :span="12">
              <span class="st">开具日期:</span>
              <span class="st">{{ prescriptionInfo.creatTime }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="24">
              <span class="st">住址:</span>
              <span class="st">{{ prescriptionInfo.personAddress }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <span class="st">身份证编号:</span>
              <span class="st">{{ prescriptionInfo.identifyCard }}</span>
            </el-col>
            <el-col :span="12">
              <span class="st">联系电话:</span>
              <span class="st">{{ prescriptionInfo.personPhone }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="24">
              <span class="st">临床诊断:</span>
              <span class="st">{{ prescriptionInfo.diagnosis }}</span>
            </el-col>
          </el-row>
          <div class="border"></div>
        </div>
        <div>
          <el-row>
            <div class="rp">
              Rp.
            </div>
          </el-row>
          <div class="drug">
            <div v-for="(item, index) in drugList" :key="index">
              <el-row>
                <el-col :span="6">
                  <span class="st bold">{{ index+1 }}.</span>
                  <span class="st">{{ item.drugName }}</span>
                </el-col>
                <el-col :span="14">
                  <span class="st">{{ item.drugPackage }}</span>
                </el-col>
                <el-col :span="4">
                  <span class="st">x{{ item.num + '' + item.drugUnit }}</span>
                </el-col>
              </el-row>
              <div class="border2"></div>
              <el-row>
                <el-col :span="24" style="padding-left: 30px">
                  <span class="st">用法:&nbsp;{{ item.usage.length >= 60 ? '略' :  item.usage}}</span>
                </el-col>
              </el-row>
              <div class="border2"></div>
            </div>
            <el-row :gutter="10" v-if="drugHerbs.length > 0">
              <el-col :span="8" v-for="(item, index) in drugHerbs" :key="index">
                <span class="st">{{ item.drugName }}</span>
                <span class="st">&nbsp;{{ item.num + '' + item.drugUnit }}</span>
              </el-col>
            </el-row>
            <div class="end st">
              （以下空白）
            </div>
          </div>
          <div class="p10">
            <table>
              <tr>
                <td class="st">西药药费</td>
                <td class="st">中成药费</td>
                <td class="st">中草药费</td>
                <td class="st">诊疗费</td>
                <td class="st">医材费</td>
                <td class="st">检查治疗费</td>
                <td class="st">其他费</td>
                <td class="st">合计(元)</td>
              </tr>
              <tr>
                <td class="st">{{ price1 }}</td>
                <td class="st">{{ price2 }}</td>
                <td class="st">{{ price3 }}</td>
                <td class="st">{{ prescriptionInfo.reservePrice }}</td>
                <td class="st"></td>
                <td class="st"></td>
                <td class="st"></td>
                <td class="st">{{ prescriptionInfo.totalPrice }}</td>
              </tr>
            </table>
          </div>
          <div class="border"></div>
        </div>
        <div class="slot-end">
          <el-row :gutter="10">
            <el-col :span="8">
              <span class="st">医师:{{ prescriptionInfo.userRealName }}</span>
            </el-col>
            <el-col :span="8">
              <span class="st">审核药师:</span>
            </el-col>
            <el-col :span="8">
              <span class="st">核对、发药药师:</span>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <span class="st">手写签名:</span>
            </el-col>
            <el-col :span="8">
              <span class="st">调配药师/士:</span>
            </el-col>
            <el-col :span="8">
              <span class="st">大写金额:{{ uppercase }}</span>
            </el-col>
          </el-row>
        </div>
        <div class="border"></div>
        <el-row>
          <el-col :span="2">
            <span class="st bold">温馨提示:</span>
          </el-col>
          <el-col :span="21">
            <span class="st bold">请仔细阅读说明书或遵医嘱用药；处方当日有效；请当面点清药品；发出药品不予退换；不适随诊或转入上级医院就诊。以上费用已确认无误。祝您健康！</span>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    prescriptionInfo: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      drugList: [],
      drugHerbs: [],
      price1: 0.00,
      price2: 0.00,
      price3: 0.00,
      uppercase: ''
    }
  },
  mounted() {
    this.$forceUpdate()
    this.drugList = []
    this.drugHerbs = []
    this.price1 = 0.00
    this.price2 = 0.00
    this.price3 = 0.00
    let math = require('mathjs');
    if(this.prescriptionInfo.prescriptionHerbsList) {
      this.prescriptionInfo.prescriptionHerbsList.forEach((item) => {
        if(item.genus === '1') {
          this.drugList.push(item)
          this.price1 = math.format(math.chain(math.bignumber(this.price1)).add(math.bignumber(item.price)).done());
        } else if(item.genus === '2') {
          this.drugList.push(item)
          this.price2 = math.format(math.chain(math.bignumber(this.price2)).add(math.bignumber(item.price)).done());
        } else {
          this.price3 = math.format(math.chain(math.bignumber(this.price3)).add(math.bignumber(item.price)).done());
          this.drugHerbs.push(item)
        }
      })
    }
    this.price1 = parseFloat(this.price1).toFixed(2)
    this.price2 = parseFloat(this.price2).toFixed(2)
    this.price3 = parseFloat(this.price3).toFixed(2)
    this.prescriptionInfo.reservePrice = parseFloat(this.prescriptionInfo.reservePrice).toFixed(2)
    this.prescriptionInfo.totalPrice = parseFloat(this.prescriptionInfo.totalPrice).toFixed(2)
    this.uppercase = this.menoyToUppercase(this.prescriptionInfo.totalPrice)
  },
  created() {
    this.drugList = []
    this.drugHerbs = []
    this.$forceUpdate()
  },
  methods: {
    menoyToUppercase(money) {
      var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');	 //汉字的数字
      var cnIntRadice = new Array('', '拾', '佰', '仟'); //基本单位
      var cnIntUnits = new Array('', '万', '亿', '兆');  //对应整数部分扩展单位
      var cnDecUnits = new Array('角', '分', '毫', '厘'); //对应小数部分单位
      var cnInteger = '整';	//整数金额时后面跟的字符			
      var cnIntLast = '元';	//整数完以后的单位
      //最大处理的数字
      var maxNum = 999999999999999.9999;
      var integerNum;	 //金额整数部分
      var decimalNum;	 //金额小数部分
      //输出的中文金额字符串
      var chineseStr = '';
      var parts;		//分离金额后用的数组，预定义
      if (money == '') { return ''; }
      
      money = parseFloat(money);
      if (money >= maxNum) {
        //超出最大处理数字
        return '超出最大处理数字';
      }
      if (money == 0) {
        chineseStr = cnNums[0] + cnIntLast + cnInteger;
        return chineseStr;
      }
      
    //四舍五入保留两位小数,转换为字符串
    money = Math.round(money * 100).toString();
    integerNum = money.substr(0,money.length-2);
    decimalNum = money.substr(money.length-2);
      
      //获取整型部分转换
      if (parseInt(integerNum, 10) > 0) {
        var zeroCount = 0;
        var IntLen = integerNum.length;
        for (var i = 0; i < IntLen; i++) {
          var n = integerNum.substr(i, 1);
          var p = IntLen - i - 1;
          var q = p / 4;
          var m = p % 4;
          if (n == '0') {
            zeroCount++;
          } else {
            if (zeroCount > 0) {
              chineseStr += cnNums[0];
            }
            //归零
            zeroCount = 0;
            chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
          }
          if (m == 0 && zeroCount < 4) {
            chineseStr += cnIntUnits[q];
          }
        }
        chineseStr += cnIntLast;
      }
      //小数部分
      if (decimalNum != '') {
        var decLen = decimalNum.length; 
        for (var i = 0; i < decLen; i++) {
          var n = decimalNum.substr(i, 1);
          if (n != '0') {
            chineseStr += cnNums[Number(n)] + cnDecUnits[i];
          }
        }
      }
      if (chineseStr == '') {
        chineseStr += cnNums[0] + cnIntLast + cnInteger;
      } else if (decimalNum == '' || /^0*$/.test(decimalNum)) {
        chineseStr += cnInteger;
      }
      return chineseStr;
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  margin: 0 auto;
  font-family: "宋体";
  font-size: 14px;
  color: #000;
}
.print {
  padding: 20px 10px;
  line-height: 2em;
}
.title {
  height: 50px;
}
.title-text {
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 29.3px;
  font-family: "楷体","楷体_GB2312" !important;
}
.st {
  font-family: "宋体";
  line-height: 2em;
}
.border {
  height: 2px;
  border-top: 2px solid #000;
}
.rp {
  font-family: Times new Roman;
  font-size: 29.3px;
  padding-left: 20px;
}
.drug {
  padding: 10px 30px;
  height: 550px;
}
.border2 {
  border-bottom: 1px dashed #909399;
  height: 1px;
}
.end {
  height: 30px;
  line-height: 30px;
  text-align: center;
  padding-top: 20px;
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
  height: 30px;
  line-height: 30px;
  border:1px solid black;
  border-top: none;
  border-left: none;
  // color:#8E2323;
}
.slot-end {
  padding: 0px 10px;
}
</style>