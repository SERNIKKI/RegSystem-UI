<template>
  <div>
    <div class="report">
      <div class="total" style="width:45%;height:400px;">
        <div class="head">
          <el-form :model="stockReportForm" label-width="40px">
            <el-row :gutter="10">
              <el-col :span="5">
                <el-form-item label="类别">
                  <el-select size="mini" v-model="stockReportForm.drugType" @change="getStockReport">
                    <el-option
                      v-for="item in typeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="月份">
                  <el-select size="mini" v-model="stockReportForm.month" @change="getStockReport">
                    <el-option
                      v-for="item in monthList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="排序">
                  <el-select size="mini" v-model="stockReportForm.sort" @change="getStockReport">
                    <el-option
                      v-for="item in sortList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item  label="条目">
                  <el-select size="mini" v-model="stockReportForm.limit" @change="getStockReport">
                    <el-option
                      v-for="item in limitList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="item" id="drugTotalChart" style="width:100%;height:278px;float:left;"></div>
      </div>
      <div class="total" style="width:55%;height:400px; margin-left: 15px;">
        <div class="head"></div>
        <div class="item" id="drugAllMonthChart" style="width:100%;height:278px;float:left;"></div>
      </div>
    </div>
    <div style="margin-top: 15px;">
      <div class="total" style="height:400px;">
        <div class="head">
          <el-form :model="everyMonthForm" label-width="40px">
            <el-row :gutter="10">
              <el-col :span="2">
                <el-form-item label="类别">
                  <el-select size="mini" v-model="everyMonthForm.drugType" @change="getEveryMonthReport">
                    <el-option
                      v-for="item in typeList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item label="排序">
                  <el-select size="mini" v-model="everyMonthForm.sort" @change="getEveryMonthReport">
                    <el-option
                      v-for="item in sortList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item  label="条目">
                  <el-select size="mini" v-model="everyMonthForm.limit" @change="getEveryMonthReport">
                    <el-option
                      v-for="item in limitList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="item" id="drugEveryMonthChart" style="width:100%;height:278px;float:left;"></div>
      </div>
    </div>
  </div>
  
</template>

<script>
export default {
  data() {
    return {
      drugTotalChart: '',
      drugAllMonthChart: '',
      drugEveryMonthChart: '',
      typeList: [{ label: '西药', value: '1'}, { label: '中成药', value: '2'}, { label: '中药材', value: '3'}],
      limitList: [{ label: '5', value: 5}, { label: 10, value: 10}],
      sortList: [{ label: '升序', value: 'asc'}, { label: '降序', value: 'desc'}],
      monthList: [
        { label: '一月', value: 1},{ label: '二月', value: 2},{ label: '三月', value: 3},{ label: '四月', value: 4},
        { label: '五月', value: 5},{ label: '六月', value: 6},{ label: '七月', value: 7},{ label: '八月', value: 8},
        { label: '九月', value: 9},{ label: '十月', value: 10},{ label: '十一月', value: 11},{ label: '十二月', value: 12},
        { label: '全年', value: 13}
      ],
      stockReportData: [],
      stockReportTitle: '销售量(前5)',
      stockReportNameData: [],
      stockReportForm: {
        drugType: "1",
        limit: 5,
        month: 0,
        sort: "desc"
      },
      allMonthReportData: [],
      everyMonthForm: {
        drugType: "1",
        limit: 5,
        sort: "desc"
      },
      everyMonthData: [],
      everyMonthNameData: [],
    }
  },
  mounted() {
    const date = new Date()
    this.stockReportForm.month = date.getMonth() + 1;
    this.initPage()
  },
  methods: {
    initPage() {
      this.getStockReport()
      this.getAllMonthReport()
      this.getEveryMonthReport()
    },
    getEveryMonthReport() {
      this.everyMonthNameData = []
      this.everyMonthData = []
      this.$postJson('/reg/system/drugStock/report/everyMonth', this.everyMonthForm).then((res) => {
        let resData = res.data
        if(resData.code === 200) {
          this.everyMonthData = resData.data
          for(var i = 0; i < this.everyMonthData.length; i++) {
            this.everyMonthData[i].type = 'line'
            this.everyMonthNameData.push(this.everyMonthData[i].name)
          }
          this.showDrugEveryMonthChart()
        } else {
          this.$message.error(resData.msg)
        }
      })
    },
    showDrugEveryMonthTitle() {
      let title = ''
      title += '药品月销售量'
      if(this.everyMonthForm.sort === 'desc') {
        title += '(前'
      } else {
        title += '(后'
      }
      title += this.everyMonthForm.limit + ')'
      return title
    },
    showDrugEveryMonthChart() {
      this.drugEveryMonthChart = this.$echarts.init(document.getElementById('drugEveryMonthChart'))
      this.drugEveryMonthChart.setOption({
        title: {
          text: this.showDrugEveryMonthTitle(),
          subtext: this.typeList.find(any => any.value === this.everyMonthForm.drugType).label, // 副标题
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.everyMonthNameData
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            // saveAsImage: {}
          }
        },
        emphasis: {
          focus: 'series'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        },
        yAxis: {
          type: 'value'
        },
        series: this.everyMonthData
      },{notMerge: true})
    },
    getAllMonthReport() {
      this.$get('/reg/system/drugStock/report/allMonth').then((res) => {
        let resData = res.data
        if(resData.code === 200) {
          this.allMonthReportData = resData.data
          this.showDrugAllMonthChart()
        } else {
          this.$message.error(resData.msg)
        }
      })
    },
    showDrugAllMonthChart() {
      this.drugAllMonthChart = this.$echarts.init(document.getElementById('drugAllMonthChart'))
      this.drugAllMonthChart.setOption({
        title: {
          text: '全年售出量'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}'
        },
         grid:{
            y:45,
            y2:20,
        },
        legend: {
          orient: 'vertical',
          x: 'right',
          y: 'top',
          data: ['售出量']
        },
        xAxis: {
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        },
        yAxis: {},
        series: [{
          name: '全年售出量',
          type: 'bar',
          data: this.allMonthReportData,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            },
            color: function (params) {
              // 自定义颜色
              return "#546fc5"
            }
          }
        }]
      }, {notMerge: true})
    },
    getStockReport() {
      this.$postJson('/reg/system/drugStock/report', this.stockReportForm).then((res) => {
        let resData = res.data
        if(resData.code === 200) {
          this.stockReportData = resData.data
          this.stockReportNameData = []
          for(var i = 0; i < this.stockReportData.length; i++) {
            this.stockReportNameData.push(this.stockReportData[i].name)
          }
          this.showDrugTotalChart()
        } else {
          this.$message.error(resData.msg)
        }
      })
    },
    showStockReportTitle() {
      let title = ''
      title += this.monthList.find(any => any.value === this.stockReportForm.month).label
      title += '销售量'
      if(this.stockReportForm.sort === 'desc') {
        title += '(前'
      } else {
        title += '(后'
      }
      title += this.stockReportForm.limit + ')'
      return title
    },
    showDrugTotalChart() {
      this.drugTotalChart = this.$echarts.init(document.getElementById('drugTotalChart'))
      this.drugTotalChart.setOption({
        title: {
          text: this.showStockReportTitle(), // 主标题
          subtext: this.typeList.find(any => any.value === this.stockReportForm.drugType).label, // 副标题
          x: 'left' // x轴方向对齐方式
        },
        grid: { containLabel: true },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {d}%'
        },
        // color: ['#1FC48D', '#F5A60A', '#6DC8EC', '#3F8FFF'],
        color: ['red', '#1FC48D', '#6DC8EC', '#3F8FFF'],
        // backgroundColor: '#ffffff',
        legend: {
          orient: 'vertical',
          icon: 'circle',
          align: 'left',
          x: 'right',
          y: 'bottom',
          data: this.stockReportNameData
        },
        series: [
          {
            name: '销售量占比',
            type: 'pie',
            radius: ['40%', '70%'], 
            avoidLabelOverlap: false,
            center: ['45%', '55%'],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              color: function (params) {
                // 自定义颜色
                let color = ["#546fc5", "#90cb74", "#fac758", "#ee6566", "#72bfdd", "#3aa171", "#fc8352", "#995fb4", "#e97bcb", "#409EFF"]
                return color[params.dataIndex]
              }
            },
            data: this.stockReportData
          }
        ]
      },{notMerge: true})
    }
  }
}
</script>

<style lang="scss" scoped>
.head {
  height: 45px;
  // >>> .el-select {
  //   width: 100%;
  // }
  >>> .el-col {
    height: 45px;
  }
}
.report {
  display: flex;
}
.total {
  padding: 10px;
  box-shadow: 0 2px 4px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 4%);
}
</style>