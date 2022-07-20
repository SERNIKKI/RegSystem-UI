<template>
   <div class="main">
    <div>
      <Step ref="step" :active="active" :data="patientInfo" ></Step>
      <div class="before-form">
        <!-- <el-form :model="patientInfo" :rules="rules" ref="ref" label-width="100px">
          
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="姓名："><el-input v-model="patientInfo.name"></el-input></el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="性别：" >
                <el-select v-model="patientInfo.sex">
                  <el-option
                    v-for="(item, index) in ['男', '女']"
                    :key="index"
                    :value="item"
                    :label="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="年龄：">
                <el-input v-model="patientInfo.age" type="number"><template slot="append">岁</template></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="籍贯：">
                <el-input v-model="patientInfo.local"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="出生日期：">
                <el-date-picker
                  v-model="patientInfo.birth"
                  type="date"
                  format="yyyy年MM月dd日"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择">
                </el-date-picker>
              </el-form-item>
            </el-col>
            
          </el-row>
        </el-form> -->
        <el-row :gutter="20">
          <el-col :span="12">
            <div style="align-items: center;display: flex;">
              <span style="width:100px">预约号：</span>
              <el-input v-model="patientInfo.reserveNum"></el-input>
            </div>
          </el-col>
          <el-col :span="4">
            <el-button @click="checkNum" type="primary" size="" :loading="btnLoading">检查</el-button>
          </el-col>
        </el-row>
        <div v-if="isHaveReserve">
        <div class="main-title">
          <span class="text">患者信息登记</span>
          <span class="right" @click="print">打印</span>
        </div>
        <div class="header">
          <div>
            <span>科室</span>
            <span class="underline">{{ patientInfo.doctorInfo.secondDepartment }}</span>
          </div>
          <div>
            <span>第</span>
            <span class="underline">&nbsp;1&nbsp;</span>
            <span> 次就诊 </span>
          </div>
          <div>
            <span>健康卡号</span>
            <span class="underline">{{ patientInfo.patPerson.personNo }}</span>
          </div>
          <div>
            <span>档案号</span>
            <span class="underline">MZ200005061</span>
          </div>
        </div>
        <table cellspacing="0px" align="center">
          <tr>
            <td width="120px" class="title">患者姓名</td>
            <td>{{ patientInfo.patPerson.personName }}</td>
            <td width="100px" class="title">性别</td>
            <td>{{ patientInfo.patPerson.personGender }}</td>
            <td width="100px" class="title">年龄(岁)</td>
            <td>{{ patientInfo.patPerson.personAge }}</td>
          </tr>
          <tr>
            <td width="120px" class="title">籍贯</td>
            <td width="300px">{{ patientInfo.patPerson.personPlace }}</td>
            <td width="100px" class="title">民族</td>
            <td width="250px">{{ patientInfo.patPerson.nationality }}</td>
            <td width="100px" class="title">出生日期</td>
            <td>{{ patientInfo.patPerson.personBirth }}</td>
          </tr>
          <tr>
            <td width="120px" class="title">身高(cm)</td>
            <td width="300px" class="p-l-10 p-r-10">
              <el-input type="number" v-model="patientInfo.patPerson.height" placeholder="请输入"></el-input>
            </td>
            <td width="100px" class="title">体重(kg)</td>
            <td width="300px" class="p-l-10 p-r-10">
              <el-input type="number" v-model="patientInfo.patPerson.weight" placeholder="请输入"></el-input>
            </td>
            <td width="100px" class="title">职业</td>
            <td class="p-l-10 p-r-10">
              <el-input v-model="patientInfo.patPerson.occupation" placeholder="请输入"></el-input>
            </td>
          </tr>
          <tr>
            <td class="title">身份证号码</td>
            <td colspan="">
              <!-- <el-input v-if="!patientInfo.no" v-model="patientInfo.no" placeholder="请输入身份证号"></el-input> -->
              <span>{{ patientInfo.patPerson.identifyCard }}</span>
            </td>
            <td class="title">电话号码</td>
            <td colspan="" class="p-l-10 p-r-10">
              <el-input v-if="!patientInfo.patPerson.personPhone" v-model="patientInfo.patPerson.personPhone" placeholder="请输入电话号码号"></el-input>
              <span v-else>{{ patientInfo.patPerson.personPhone }}</span>
            </td>
            <td width="100px" class="title">婚姻状况</td>
            <td class="p-l-10 p-r-10">
              <el-input v-model="patientInfo.patPerson.maritalStatus" placeholder="请输入"></el-input>
            </td>
          </tr>
          <tr>
            <td class="title">户口地址</td>
            <td colspan="5">
              <div class="p-l-10 p-r-10">
                <el-input  v-model="patientInfo.patPerson.originAddrress" @change="changeValue" placeholder="请输入户口地址"></el-input>
              </div>
            </td>
          </tr>
          <tr>
            <td class="title">现居住地</td>
            <td colspan="5">
              <div v-if="!patientInfo.patPerson.personAddress" class="p-l-10 p-r-10">
                <el-input  v-model="patientInfo.patPerson.personAddress" @change="changeValue" placeholder="请输入现居住地"></el-input>
              </div>
              <span v-else>{{ patientInfo.patPerson.personAddress }}</span>
            </td>
          </tr>
          <tr>
            <td class="title">工作单位</td>
            <td colspan="5">
              <div class="p-l-10 p-r-10">
                <el-input  v-model="patientInfo.patPerson.workAddress" @change="changeValue" placeholder="请输入工作单位"></el-input>
              </div>
            </td>
          </tr>
          <tr>
            <td class="title">过敏史</td>
            <td colspan="5">
              <div class="p-l-10 p-r-10">
                <el-input  v-model="patientInfo.patPerson.allergicHistory" @change="changeValue" placeholder="请输入过敏史"></el-input>
              </div>
            </td>
          </tr>
          <tr>
            <td class="title">既往病史</td>
            <td colspan="5">
              <div class="p-l-10 p-r-10">
                <el-input  v-model="patientInfo.patPerson.pastMedicalHistory" @change="changeValue" placeholder="请输入既往病史"></el-input>
              </div>
            </td>
          </tr>
          <tr>
            <td class="title">患者备注</td>
            <td colspan="5">
              <div class="p-l-10 p-r-10">
                <el-input  v-model="patientInfo.patPerson.remark" @change="changeValue" placeholder="请输入"></el-input>
              </div>
            </td>
          </tr>
        </table>
        </div>
        <div class="p-t-10">
          <el-button type="primary" v-if="active !== 0" icon="el-icon-arrow-left" @click="previousStep">上一步</el-button>
          <el-button type="primary" style="float:right" :disabled="!isHaveReserve" @click="nextStep">下一步&nbsp;<i class="el-icon-arrow-right"></i></el-button>
        </div>
        <PrintPatient ref="print" v-if="isShow" :patientInfo="patientInfo"></PrintPatient>
      </div>
    </div>
   </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import Step from '@/components/Step';
import PrintPatient from '@/components/Print/patientInfo.vue'
export default {
  components: {
    PageTitle,
    Step,
    PrintPatient
  },
  data() {
    return {
      active: 0,
      patientInfo: {
        // no: '411303200006025516'
      },
      btnLoading: false,
      address: '',
      phone: '',
      nowAddress: '',
      workAddress: '',
      isShow: false,
      reserveNum: '',
      reserveInfo: {},
      isHaveReserve: false,
      user: null
    }
  },
  created() {
    this.user = JSON.parse(this.$store.state.user)
    if(typeof(this.$route.params.patientInfo) !== 'undefined') {
      this.patientInfo = this.$route.params.patientInfo
      this.isHaveReserve = true
    }
  },
  mounted() {
    window.addEventListener("beforeunload", this.actBeforeUnload,false);  
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload",this.actBeforeUnload,false);
  },
  methods: {
    actBeforeUnload(event){
      const answer = window.confirm('当前页面数据未保存，确定要离开？')
      if (answer) {
          next()
      } else {
          next(false)
      }
    },
    // 检查预约号
    checkNum() {
      this.btnLoading = true
      this.$get(`/reg/system/patRegRecord/getPatRegRecordDetail?regNo=${this.patientInfo.reserveNum}`).then((res) => {
        const resData = res.data
        if(resData.code === 200) {
          // 判断挂号的医生是否为改医生
          if(resData.data.patRegRecord.doctorNo !== this.user.userNo) {
            this.$message.error("不是该患者挂号的医生")
          } else {
            this.patientInfo = resData.data
            this.patientInfo.consultationTime = this.$moment(new Date()).format('YYYY年MM月DD日 hh:mm:ss')
            this.patientInfo.patPerson.personBirth = this.$moment(this.patientInfo.patPerson.personBirth).format('YYYY年MM月DD日')
            this.isHaveReserve = true
          }
        } else {
          this.$message.warning("不存在的预约号，请检查输入是否正确！")
        }
        this.btnLoading = false
      })
    },
    changeValue(value) {
      // console.log(value)
      // this.patientInfo.address = value
    },
    nextStep() {
      const result = this.checkIsInput()
      if(result) {
        this.$refs.step.nextStep()
      } else {
        this.$message.error("请将表单填写完整")
      }
    },
    checkIsInput() {
      if(!this.patientInfo.patPerson.height) {
        return false
      }
      if(!this.patientInfo.patPerson.weight) {
        return false
      }
      if(!this.patientInfo.patPerson.occupation) {
        return false
      }
      if(!this.patientInfo.patPerson.maritalStatus) {
        return false
      }
      if(!this.patientInfo.patPerson.originAddrress) {
        return false
      }
      if(!this.patientInfo.patPerson.workAddress) {
        return false
      }
      if(!this.patientInfo.patPerson.allergicHistory) {
        return false
      }
      if(!this.patientInfo.patPerson.pastMedicalHistory) {
        return false
      }
      if(!this.patientInfo.patPerson.remark) {
        return false
      }
      return true
    },
    previousStep() {
      this.$refs.step.previousStep()
    },
    async print() {
      await this.changeType()
      this.$print(this.$refs.print)
      this.isShow = false
    },
    changeType() {
      this.isShow = true
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
  height: 50px;
  line-height: 50px;
  border:1px solid black;
  border-top: none;
  border-left: none;
  // color:#8E2323;
}
.title {
  background-color: #e3e3e3;
}
.header {
  padding-top: 30px;
  padding-bottom: 10px;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  line-height: 1.5em;
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
  margin-top: 40px;
  
}
</style>