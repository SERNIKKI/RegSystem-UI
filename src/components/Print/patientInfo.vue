<template>
  <div class="main">
    <div class="main-title">
      <span class="text">患者信息</span>
    </div>
    <div class="header">
      <div>
        <span>科室</span>
        <span class="underline"> {{ patientInfo.doctorInfo.secondDepartment }}</span>
      </div>
      <div>
        <span>第</span>
        <span class="underline">&nbsp;1&nbsp;</span>
        <span> 次就诊 </span>
      </div>
      <div>
        <span>健康卡号</span>
        <span class="underline"> {{ patientInfo.patPerson.personNo }}</span>
      </div>
      <div>
        <span>档案号</span>
        <span class="underline"> 11111111111111111111 </span>
      </div>
    </div>
    <table cellspacing="0px" align="center">
      <tr>
        <td class="title">患者姓名</td>
        <td width="24%">{{ patientInfo.patPerson.personName }}</td>
        <td class="title">性别</td>
        <td width="24%">{{ patientInfo.patPerson.personGender }}</td>
        <td class="title">年龄(岁)</td>
        <td>{{ patientInfo.patPerson.personAge }}</td>
      </tr>
      <tr>
        <td class="title">籍贯</td>
        <td>{{ patientInfo.patPerson.personPlace }}</td>
        <td class="title">民族</td>
        <td>{{ patientInfo.patPerson.nationality }}</td>
        <td class="title">出生日期</td>
        <td>{{ patientInfo.patPerson.personBirth }}</td>
      </tr>
      <tr>
        <td class="title">身高(cm)</td>
        <td >{{ patientInfo.patPerson.height }}</td>
        <td  class="title">体重(kg)</td>
        <td >{{ patientInfo.patPerson.weight }}</td>
        <td  class="title">职业</td>
        <td>{{ patientInfo.patPerson.occupation }}</td>
      </tr>
      <tr>
        <td class="title">身份证号码</td>
        <td colspan="">
          <span>{{patientInfo.patPerson.identifyCard}}</span>
        </td>
        <td class="title">电话号码</td>
        <td colspan="" class="p-l-10 p-r-10">
          <span>{{patientInfo.patPerson.personPhone}}</span>
        </td>
        <td  class="title">婚姻状况</td>
        <td>{{ patientInfo.patPerson.maritalStatus }}</td>
      </tr>
      <tr>
        <td class="title">户口地址</td>
        <td colspan="5">
          <span>{{patientInfo.patPerson.originAddrress}}</span>
        </td>
      </tr>
      <tr>
        <td class="title">现居住地</td>
        <td colspan="5">
          <span>{{patientInfo.patPerson.personAddress}}</span>
        </td>
      </tr>
      <tr>
        <td class="title">工作单位</td>
        <td colspan="5">
          <span>{{patientInfo.patPerson.workAddress}}</span>
        </td>
      </tr>
      <tr>
        <td class="title">过敏史</td>
        <td colspan="5">
          <span>{{patientInfo.patPerson.allergicHistory}}</span>
        </td>
      </tr>
      <tr>
        <td class="title">既往病史</td>
        <td colspan="5">
          <span>{{patientInfo.patPerson.pastMedicalHistory}}</span>
        </td>
      </tr>
      <tr>
        <td class="title">患者备注</td>
        <td colspan="5">
          <span>{{patientInfo.patPerson.remark}}</span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    patientInfo: {
      typeof: Object,
      default: {}
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  border:1px solid white
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
@media print {
  @page {
    margin-top: 0mm;//解决打印多出一页空白页的问题
  }
  html {
    background-color: #ffffff;
    margin: 0px;
  }

  body {
    border: solid 1px #ffffff;
    margin: 10mm 15mm 10mm 15mm; 
  }
}
</style>