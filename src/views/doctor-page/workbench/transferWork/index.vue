<template>
   <div class="main">
    <div>
      <Step ref="step" :active="active" :data="patientInfo"></Step>
      <div>
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="heard" style="align-items: center;display: flex;">
              <div>请选择是否需要转诊：</div>
              <div>
                <el-radio v-model="patientInfo.isTransferWork" label="1">需要</el-radio>
                <el-radio v-model="patientInfo.isTransferWork" label="0">不需要</el-radio>
              </div>
            </div>
          </el-col>
        </el-row>
        <div v-if="patientInfo.isTransferWork === '0'" class="btn">
          <el-button type="primary" size="small" v-if="active !== 0" icon="el-icon-arrow-left" @click="previousStep">上一步</el-button>
          <el-button type="primary" size="small" @click="nextStep">下一步&nbsp;<i class="el-icon-arrow-right"></i></el-button>
        </div>
        <div v-else class="before-form" :style="isShow ? 'width: 1200px' : 'width: 100%'" ref="print">
          <div class="main-title">
            <span class="text">转诊单</span>
            <span class="right" @click="print" v-if="isShow">打印</span>
          </div>
          <table cellspacing="0px" class="fir-table" align="center">
            <tr>
              <td width="15%" class="title">患者姓名</td>
              <td>{{ patientInfo.patPerson.personName }}</td>
              <td width="15%" class="title">住院/门诊号</td>
              <td>{{ patientInfo.patRegRecord.regNo }}</td>
            </tr>
            <tr>
              <td class="title">原始科室</td>
              <td>{{ patientInfo.doctorInfo.secondDepartment }}</td>
              <td class="title">就诊/入院时间</td>
              <td>{{ patientInfo.consultationTime }}</td>
            </tr>
            <tr>
              <td width="15%" class="title">原医生</td>
              <td>{{ patientInfo.doctorInfo.userRealName }}</td>
              <td width="15%" class="title">操作日期</td>
              <td class="p-l-10 p-r-10">
              <el-input v-model="transferInfo.operationDate"></el-input>
              </td>
              <!-- <td>{{ patientInfo.transferInfo.operationDate }}</td> -->
            </tr>
            <tr>
              <td width="15%" class="title">转诊科室</td>
              <td class="p-l-10 p-r-10"> 
                <el-input v-model="transferInfo.department"></el-input>
                <!-- {{ patientInfo.patientName }} -->
              </td>
              <td width="15%" class="title">转诊医生</td>
              <td class="p-l-10 p-r-10">
                <el-input v-model="transferInfo.doctorName"></el-input>
                <!-- {{ patientInfo.archiveNo }} -->
              </td>
            </tr>
            
            
          </table>
          <table class="sec-table" style="border-top: none;">
            <tr>
              <td width="15%" class="title">疾病诊断</td>
              <td>
                <el-input type="textarea" :rows="4" v-model="transferInfo.diagnosis"></el-input>
                <!-- {{ patientInfo.transferInfo.diagnosis }} -->
              </td>
            </tr>
          </table>
          <table style="border-top: none;" class="thi-table" >
            <tr>
              <td width="15%" class="title">转诊原因</td>
              <td>
                <el-input type="textarea" :rows="12" v-model="transferInfo.reason"></el-input>
                <!-- {{ patientInfo.department }} -->
              </td>
            </tr>
          </table>
          <table style="border-top: none;" class="fir-table">
            <tr align="center">
              <td width="15%" rowspan="2" class="title">患者或家属意见</td>
              <td width="50%" rowspan="2">
                <el-input  v-model="transferInfo.opinion"></el-input>
                <!-- {{ patientInfo.opinion }} -->
              </td>
              <td class="title">关系</td>
              <td class="p-l-10 p-r-10">
                <el-input v-model="transferInfo.con"></el-input>
                <!-- {{  patientInfo.con }} -->
              </td>
            </tr>
            <tr align="center">
              <td width="15%" class="title">签名</td>
              <td class="p-l-10 p-r-10">
                <el-input v-model="transferInfo.sign"></el-input>
                <!-- {{ patientInfo.sign }} -->
              </td>
            </tr>
          </table>
          <div v-if="isShow" class="p-t-10" style="height: 100px">
            <el-button type="primary" v-if="active !== 0" icon="el-icon-arrow-left" @click="previousStep">上一步</el-button>
            <el-button type="primary" style="float:right" @click="nextStep">下一步&nbsp;<i class="el-icon-arrow-right"></i></el-button>
          </div>
        </div>
      </div>
    </div>
   </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import Step from '@/components/Step';
export default {
  components: {
    PageTitle,
    Step
  },
  data() {
    return {
      active: 1,
      patientInfo: {},
      isShow: true,
      transferInfo: {}
    }
  },
  created() {
    if(typeof(this.$route.params.patientInfo) !== 'undefined') {
      this.patientInfo = this.$route.params.patientInfo
    }
  },
  methods: {
    nextStep() {
      this.patientInfo.transferInfo = this.transferInfo
      this.$refs.step.nextStep()
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