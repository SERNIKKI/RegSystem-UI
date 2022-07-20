<template>
  <div>
    <el-steps :active="active" :data="data" align-center finish-status="success">
      <el-step title="诊前" description="确认患者的预约号是否正确，录入患者的基本信息"></el-step>
      <el-step title="转诊" description="如果患者的情况不在自己的能力范围内或其他情况需要转诊的，则在此发起转诊"></el-step>
      <el-step title="诊中" description="对患者的情况进行诊断，在此给出合理的建议或者开具药方"></el-step>
      <el-step title="诊后" description="处理处方笺订单"></el-step>
    </el-steps>
    <!-- <el-button @click="nextStep">下一步</el-button> -->
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: Number,
      default: 0
    },
    data: {}
  },
  components: {

  },
  mounted() {
    this.dataInfo = this.data
  },
  data() {
    return {
      dataInfo: this.data
    }
  },
  created() {

  },
  methods: {
    // 跳转至下一步
    nextStep() {
      if(this.active === 0) {
        this.$router.push({
          name: 'transferWork',
          params: {
            active: 1,
            patientInfo: this.data
          }
        })
      } else if(this.active === 1) {
        this.$router.push({
          name: 'work',
          params: {
            active: 2,
            patientInfo: this.data
          }
        })
      } else if(this.active === 2) {
        this.$router.push({
          name: 'afterWork',
          params: {
            active: 3,
            patientInfo: this.data
          }
        })
      } else {
        this.$router.push({
          name: 'beforeWork',
          params: {
            active: 0,
            patientInfo: this.data
          }
        })
      }
    },
    // 跳转至上一步
    previousStep() {
      if(this.active === 3) {
        this.$router.push({
          name: 'work',
          params: {
            active: 2,
            patientInfo: this.data
          }
        })
      } else if(this.active === 2) {
        this.$router.push({
          name: 'transferWork',
          params: {
            active: 1,
            patientInfo: this.data
          }
        })
      } else if(this.active === 1) {
        this.$router.push({
          name: 'beforeWork',
          params: {
            active: 0,
            patientInfo: this.data
          }
        })
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.main {
  padding: 10px 20px;
  height: 100%;
}
</style>