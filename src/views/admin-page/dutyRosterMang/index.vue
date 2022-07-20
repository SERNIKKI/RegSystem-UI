<template>
  <div class="main">
    <div>
      <div>
        <el-form :model="dutyForm" label-width="80px">
          <el-row>
            <el-col :span="5">
              <el-form-item label="选择科室" >
                <el-cascader :options="options" v-model="dutyForm.userDepartment" @change="handleSelectChange" filterable>
                  <template slot-scope="{ node, data }">
                    <span>{{ data.label }}</span>
                    <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                  </template>
                </el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item>
                <el-button type="primary" size="small" @click="isShow">{{ show ? '不显示星期天' : '显示星期天' }}</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-table stripe :data="dutyList" border v-loading="loading">
        <el-table-column align="center" prop="userRealName" label="姓名" fixed></el-table-column>
        <el-table-column align="center" label="周一">
          <el-table-column align="center" label="上午" >
            <template slot-scope="scope">
              <el-button class="tag" size="mini" :type="getType(scope.row.monMorning)" @click="tabClick(scope.row.dutyNo, 'mon', 'morning')">{{ getStstus(scope.row.monMorning) }}</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="下午" >
            <template slot-scope="scope">
              <el-button class="tag" size="mini" :type="getType(scope.row.monAfternoon)" @click="tabClick(scope.row.dutyNo, 'mon', 'afternoon')">{{ getStstus(scope.row.monAfternoon) }}</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="夜班" >
            <template slot-scope="scope">
              <el-button class="tag" size="mini" :type="getType(scope.row.monNight)" @click="tabClick(scope.row.dutyNo, 'mon', 'night')">{{ getStstus(scope.row.monNight) }}</el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="周二">
          <el-table-column align="center" label="上午" >
            <template slot-scope="scope">
              <el-button class="tag" size="mini" :type="getType(scope.row.tueMorning)" @click="tabClick(scope.row.dutyNo, 'tue', 'morning')">{{ getStstus(scope.row.tueMorning) }}</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="下午" >
            <template slot-scope="scope">
              <el-button class="tag" size="mini" :type="getType(scope.row.tueAfternoon)" @click="tabClick(scope.row.dutyNo, 'tue', 'afternoon')">{{ getStstus(scope.row.tueAfternoon) }}</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="夜班" >
            <template slot-scope="scope">
              <el-button class="tag" size="mini" :type="getType(scope.row.tueNight)" @click="tabClick(scope.row.dutyNo, 'tue', 'night')">{{ getStstus(scope.row.tueNight) }}</el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="周三">
          <el-table-column align="center" label="上午" >
            <template slot-scope="scope">
              <el-button class="tag" size="mini" :type="getType(scope.row.wedMorning)" @click="tabClick(scope.row.dutyNo, 'wed', 'morning')">{{ getStstus(scope.row.wedMorning) }}</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="下午" >
            <template slot-scope="scope">
              <el-button class="tag" size="mini" :type="getType(scope.row.wedAfternoon)" @click="tabClick(scope.row.dutyNo, 'wed', 'afternoon')">{{ getStstus(scope.row.wedAfternoon) }}</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="夜班" >
            <template slot-scope="scope">
              <el-button class="tag" size="mini" :type="getType(scope.row.wedNight)" @click="tabClick(scope.row.dutyNo, 'wed', 'night')">{{ getStstus(scope.row.wedNight) }}</el-button>
            </template>
          </el-table-column>
        </el-table-column>
       <el-table-column align="center" label="周四">
          <el-table-column align="center" label="上午" >
            <template slot-scope="scope">
              <el-button class="tag" size="mini" :type="getType(scope.row.thurMorning)" @click="tabClick(scope.row.dutyNo, 'thur', 'morning')">{{ getStstus(scope.row.thurMorning) }}</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="下午" >
            <template slot-scope="scope">
              <el-button class="tag" size="mini" :type="getType(scope.row.thurAfternoon)" @click="tabClick(scope.row.dutyNo, 'thur', 'afternoon')">{{ getStstus(scope.row.thurAfternoon) }}</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="夜班" >
            <template slot-scope="scope">
              <el-button class="tag" size="mini" :type="getType(scope.row.thurNight)" @click="tabClick(scope.row.dutyNo, 'thur', 'night')">{{ getStstus(scope.row.thurNight) }}</el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="周五">
          <el-table-column align="center" label="上午" >
            <template slot-scope="scope">
              <el-button class="tag" size="mini" :type="getType(scope.row.friMorning)" @click="tabClick(scope.row.dutyNo, 'fir', 'morning')">{{ getStstus(scope.row.friMorning) }}</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="下午" >
            <template slot-scope="scope">
              <el-button class="tag" size="mini" :type="getType(scope.row.firAfternoon)" @click="tabClick(scope.row.dutyNo, 'fir', 'afternoon')">{{ getStstus(scope.row.firAfternoon) }}</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="夜班" >
            <template slot-scope="scope">
              <el-button class="tag" size="mini" :type="getType(scope.row.firNight)" @click="tabClick(scope.row.dutyNo, 'fir', 'night')">{{ getStstus(scope.row.firNight) }}</el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="周六" v-if="show">
          <el-table-column align="center" label="上午" >
            <template slot-scope="scope">
              <el-button class="tag" size="mini" :type="getType(scope.row.satMorning)" @click="tabClick(scope.row.dutyNo, 'sat', 'morning')">{{ getStstus(scope.row.satMorning) }}</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="下午" >
            <template slot-scope="scope">
              <el-button class="tag" size="mini" :type="getType(scope.row.satAfternoon)" @click="tabClick(scope.row.dutyNo, 'sat', 'afternoon')">{{ getStstus(scope.row.satAfternoon) }}</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="夜班" >
            <template slot-scope="scope">
              <el-button class="tag" size="mini" :type="getType(scope.row.satNight)" @click="tabClick(scope.row.dutyNo, 'sat', 'night')">{{ getStstus(scope.row.satNight) }}</el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="周日" v-if="show">
          <el-table-column align="center" label="上午" >
            <template slot-scope="scope">
              <el-button class="tag" size="mini" :type="getType(scope.row.sunMorning)" @click="tabClick(scope.row.dutyNo, 'sun', 'morning')">{{ getStstus(scope.row.sunMorning) }}</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="下午" >
            <template slot-scope="scope">
              <el-button class="tag" size="mini" :type="getType(scope.row.sunAfternoon)" @click="tabClick(scope.row.dutyNo, 'sun', 'afternoon')">{{ getStstus(scope.row.sunAfternoon) }}</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="夜班" >
            <template slot-scope="scope">
              <el-button class="tag" size="mini" :type="getType(scope.row.sunNight)" @click="tabClick(scope.row.dutyNo, 'sun', 'night')">{{ getStstus(scope.row.sunNight) }}</el-button>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dutyList: [],
      loading: false,
      dutyForm: [],
      options: [],
      dutyForm: {
        userDepartment: '10010'
      },
      show: false
    }
  },
  created() {
    this.getDepartmentType()
  },
  methods: {
    isShow() {
      this.show = !this.show
    },
    getStstus(index) {
      if(index === '1') {
        return '出诊'
      } else if(index === '0') {
        return '休息'
      } else if(index === '2') {
        return '调休'
      }
    },
    getType(index) {
      if(index === '1') {
        return 'primary'
      } else if(index === '2') {
        return 'warning'
      } else if(index === '0') {
        return 'success'
      }
    },
    tabClick(dutyNo, day, time) {
      const index = this.dutyList.findIndex(item => item.dutyNo === dutyNo)
      if(day === 'mon') {
        if(time === 'morning') {
          this.dutyList[index].monMorning = (this.dutyList[index].monMorning + 1) % 3 + ''
        } else if(time === 'afternoon') {
          this.dutyList[index].monAfternoon = (this.dutyList[index].monAfternoon + 1) % 3 + ''
        } else {
          this.dutyList[index].monNight = (this.dutyList[index].monNight + 1) % 3 + ''
        }
      } else if(day === 'tue') {
        if(time === 'morning') {
          this.dutyList[index].tueMorning = (this.dutyList[index].tueMorning + 1) % 3 + ''
        } else if(time === 'afternoon') {
          this.dutyList[index].tueAfternoon = (this.dutyList[index].tueAfternoon + 1) % 3 + ''
        } else {
          this.dutyList[index].tueNight = (this.dutyList[index].tueNight + 1) % 3 + ''
        }
      } else if(day === 'wed') {
        if(time === 'morning') {
          this.dutyList[index].wedMorning = (this.dutyList[index].wedMorning + 1) % 3 + ''
        } else if(time === 'afternoon') {
          this.dutyList[index].wedAfternoon = (this.dutyList[index].wedAfternoon + 1) % 3 + ''
        } else {
          this.dutyList[index].wedNight = (this.dutyList[index].wedNight + 1) % 3 + ''
        }
      } else if(day === 'thur') {
        if(time === 'morning') {
          this.dutyList[index].thurMorning = (this.dutyList[index].thurMorning + 1) % 3 + ''
        } else if(time === 'afternoon') {
          this.dutyList[index].thurAfternoon = (this.dutyList[index].thurAfternoon + 1) % 3 + ''
        } else {
          this.dutyList[index].thurNight = (this.dutyList[index].thurNight + 1) % 3 + ''
        }
      } else if(day === 'fir') {
        if(time === 'morning') {
          this.dutyList[index].friMorning = (this.dutyList[index].friMorning + 1) % 3 + ''
        } else if(time === 'afternoon') {
          this.dutyList[index].firAfternoon = (this.dutyList[index].firAfternoon + 1) % 3 + ''
        } else {
          this.dutyList[index].firNight = (this.dutyList[index].firNight + 1) % 3 + ''
        }
      } else if(day === 'sat') {
        if(time === 'morning') {
          this.dutyList[index].satMorning = (this.dutyList[index].satMorning + 1) % 3 + ''
        } else if(time === 'afternoon') {
          this.dutyList[index].satAfternoon = (this.dutyList[index].satAfternoon + 1) % 3 + ''
        } else {
          this.dutyList[index].satNight = (this.dutyList[index].satNight + 1) % 3 + ''
        }
      } else {
        if(time === 'morning') {
          this.dutyList[index].sunMorning = (this.dutyList[index].sunMorning + 1) % 3 + ''
        } else if(time === 'afternoon') {
          this.dutyList[index].sunAfternoon = (this.dutyList[index].sunAfternoon + 1) % 3 + ''
        } else {
          this.dutyList[index].sunNight = (this.dutyList[index].sunNight + 1) % 3 + ''
        }
      }
      this.$postJson('/reg/system/duty/update', this.dutyList[index]).then((res) => {
        let resData = res.data
        if(resData.code !== 200) {
          this.$message.error(resData.msg)
        }
      })
    },
    initPage() {
      this.loading = true
      this.$get(`/reg/system/duty/listByDep/${this.dutyForm.userDepartment}`).then((res) => {
        let resData = res.data
        if(resData.code === 200) {
          this.dutyList = resData.data
          this.loading = false
        } else {
          this.$message.error(resData.msg)
          this.loading = false
        }
      })
    },
    handleSelectChange(val) {
      this.dutyForm.userDepartment = val[1]
      this.initPage()
    },
    getDepartmentType() {
      this.$get(`/reg/system/department/label`).then((res) => {
        let resData = res.data
        if(resData.code === 200) {
          this.options = resData.data
        } else {
          this.$message.error(resData.msg)
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.main {
  padding: 10px 20px;
  height: 100%;
}
.tag {
  cursor: pointer;
  padding: 7px 12px;
}
</style>