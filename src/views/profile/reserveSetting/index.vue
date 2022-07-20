<template>
  <div class="profile">
		<profile-layout class="layout"></profile-layout>
		<div class="main">
			<page-title class="page-title" title="排班安排" style="margin-bottom: 20px;"></page-title>
			<div class="doctor-table">
				 <el-table :data="dutyLists" border stripe>
          <el-table-column label="日期" align="center" width="70">
            <el-table-column label="时间" align="center" width="70">
              <template slot-scope="scope">
								{{ scope.row.time }}
							</template>
            </el-table-column>
          </el-table-column>
					<el-table-column align="center" label="星期一">
						<template slot-scope="scope">
							{{ getStstus(scope.row.mon) }}
						</template>
					</el-table-column>
					<el-table-column align="center" label="星期二">
						<template slot-scope="scope">
							{{ getStstus(scope.row.tue) }}
						</template>
					</el-table-column>
					<el-table-column align="center" label="星期三">
						<template slot-scope="scope">
							{{ getStstus(scope.row.wed) }}
						</template>
					</el-table-column>
					<el-table-column align="center" label="星期四">
						<template slot-scope="scope">
							{{ getStstus(scope.row.thur) }}
						</template>
					</el-table-column>
					<el-table-column align="center" label="星期五">
						<template slot-scope="scope">
							{{ getStstus(scope.row.fir) }}
						</template>
					</el-table-column>
					<el-table-column align="center" label="星期六">
						<template slot-scope="scope">
							{{ getStstus(scope.row.sat) }}
						</template>
					</el-table-column>
					<el-table-column align="center" label="星期天">
						<template slot-scope="scope">
							{{ getStstus(scope.row.sun) }}
						</template>
					</el-table-column>
				</el-table>
			</div>
			<page-title class="page-title" title="时间安排" style="margin-top: 20px;"></page-title>
			<el-form :model="reserve" :rules="rules" ref="ref" label-width="60px" style="margin-top: 20px;">
				<el-form-item label="上午">
					<el-time-select
						placeholder="开始时间"
						disabled
						v-model="reserve.morningBegin"
						:picker-options="{
							start: '08:00:00',
							step: '00:15:00',
							end: '12:00:00'
						}">
					</el-time-select>
					&nbsp;至&nbsp;
					<el-time-select
						placeholder="结束时间"
						disabled
						v-model="reserve.morningEnd"
						:picker-options="{
							start: '08:00:00',
							step: '00:15:00',
							end: '12:30:00',
							minTime: reserve.morningBegin
						}">
  				</el-time-select>
				</el-form-item>
				<el-form-item label="下午">
					<el-time-select
						placeholder="开始时间"
						disabled
						v-model="reserve.afternoonBegin"
						:picker-options="{
							start: '14:00:00',
							step: '00:15:00',
							end: '18:00:00'
						}">
					</el-time-select>
					&nbsp;至&nbsp;
					<el-time-select
						placeholder="结束时间"
						v-model="reserve.afternoonEnd"
						disabled
						:picker-options="{
							start: '14:00:00',
							step: '00:15:00',
							end: '18:30:00',
							minTime: reserve.afternoonBegin
						}">
  				</el-time-select>
				</el-form-item>
				<el-form-item label="晚上">
					<el-time-select
						placeholder="开始时间"
						v-model="reserve.nightBegin"
						disabled
						:picker-options="{
							start: '19:00',
							step: '00:15',
							end: '24:00'
						}">
					</el-time-select>
					&nbsp;至&nbsp;
					<el-time-select
						placeholder="结束时间"
						v-model="reserve.nightEnd"
						disabled
						:picker-options="{
							start: '19:00',
							step: '00:15',
							end: '24:00',
							minTime: reserve.nightBegin
						}">
  				</el-time-select>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import ProfileLayout from '@/components/ProfileLayout';
export default {
	created() {
		this.user = JSON.parse(this.$store.state.user)
		this.initPage()
	},
	components:{
    PageTitle,
		ProfileLayout
  },
	data() {
		return {
			user: null,
			reserve: {},
			dutyLists: [],
			rules: {}
		}
	},
	methods: {
		getStstus(index) {
      if(index === '1') {
        return '出诊'
      } else if(index === '0') {
        return '休息'
      } else if(index === '2') {
        return '调休'
      }
    },
		initPage() {
			this.$get(`/reg/system/duty/info/${this.user.userNo}`).then((res) => {
				const resData = res.data
				if(resData.code === 200) {
					this.reserve = resData.data
					this.dutyLists = resData.data.dutyLists
				} else {
					this.$message.error("获取排班表失败，原因为：" + resData.msg)
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.profile {
	width: 1240px;
	padding: 0 20px;
	margin: 0 auto;
	position: relative;
}
.main {
	width: 87.5%;
  padding-left: 1.5em !important;
	position: relative;
  left: 19.5%;
}
.doctor-table {
	>>> .el-table thead.is-group th {
		background: none;
		padding: 0px;
	}
	>>> .el-table thead.is-group tr:first-of-type th:first-of-type,
	>>>.el-table thead.is-group tr:last-of-type th:first-of-type {
		background: #ffffff !important;
	}
	>>> .el-table thead.is-group tr:first-of-type th:first-of-type {
		border-bottom: none;
	}
	>>> .el-table thead.is-group tr:first-of-type th:first-of-type div.cell {
		text-align: right;
	}
	>>> .el-table thead.is-group tr:last-of-type th:first-of-type div.cell {
		text-align: left;
	}
	>>> .el-table thead.is-group tr:first-of-type th:first-of-type:before {
		content: "";
		position: absolute;
		width: 1px;
		// height: 55px;
		height: 42px;  //自行调整
		top: 0;
		left: 0;
		background-color: grey;
		opacity: 0.2;
		display: block;
		// transform: rotate(-43deg);
		transform: rotate(-56deg);  //自行调整
		-webkit-transform-origin: top;
		transform-origin: top;
	}
	>>> .el-table thead.is-group tr:last-of-type th:first-of-type:before {
		content: "";
		position: absolute;
		width: 1px;
		// height: 60px;
		height: 46px;  //自行调整
		bottom: 0;
		right: 0;
		background-color: grey;
		opacity: 0.2;
		display: block;
		// transform: rotate(-45deg);  //自行调整
		transform: rotate(-56deg);
		-webkit-transform-origin: bottom;
		transform-origin: bottom;
	}
}
</style>