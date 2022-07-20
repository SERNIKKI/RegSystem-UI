<template>
  <div class="main">
    <div>
      <page-title class="page-title" title="查询条件" style="margin-bottom: 10px"></page-title>
      <el-form label-width="120px" :model="doctorForm" class="departForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="医生姓名">
              <el-input size="medium" v-model="doctorForm.userRealName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="科室">
              <el-cascader :options="options" v-model="doctorForm.userDepartment" @change="handleSearchChange" filterable clearable>
                <template slot-scope="{ node, data }">
                  <span>{{ data.label }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="职位">
              <el-select v-model="doctorForm.userPosition" placeholder="请选择" filterable>
                <el-option
                  v-for="item in positionList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <!-- <el-input v-model="recipeForm.recipePinyin"></el-input> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24"  style='text-align: right;'>
            <el-form-item>
              <el-button type="primary" size="small" icon="el-icon-search" @click="handleSearch">搜索</el-button>
              <el-button type="" size="small" icon="el-icon-delete" @click="clearForm">清空</el-button>
              <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="addDoctor">新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <page-title class="page-title" title="医生列表" style="margin-bottom: 20px;"></page-title>
      <div style="text-align: right;margin-right: 15px;margin-bottom: 5px;">
        <el-button type="success" icon="el-icon-document" @click="exportExcelSelect" size="small">导出Excel</el-button>
      </div>
      <el-table :data="doctorList" v-loading="loading" stripe @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column align="center" width="200" property="userNo" show-overflow-tooltip label="编号"></el-table-column>
        <el-table-column align="center" property="userRealName" show-overflow-tooltip label="姓名"></el-table-column>
        <el-table-column align="center" property="userSex" show-overflow-tooltip label="性别"></el-table-column>
        <el-table-column align="center" property="userPosition" show-overflow-tooltip label="职位"></el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="科室">
          <template slot-scope="scope">
            {{ scope.row.department + '/' + scope.row.secondDepartment }}
          </template>
        </el-table-column>
        <el-table-column align="center" property="userTel" show-overflow-tooltip label="电话"></el-table-column>
        <el-table-column align="center" property="userEmail" show-overflow-tooltip label="邮箱"></el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.loginOnline === 1">在线</el-tag>
            <el-tag type="info" v-else>离线</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" width="250" label="操作">
          <template slot-scope="scope">
            <el-button type="" size="mini" plain @click="getDoctorInfo(scope.row)">详细信息</el-button>
            <el-button type="primary" size="mini" plain @click="editDoctorInfo(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" plain @click="deleteDoctor(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination style="text-align: right;" v-show="total > 0" :total="total" :page.sync="pagination.pageNum" :limit.sync="pagination.pageSize" @pagination="handlePageChange" />
    </div>
    <el-dialog :title="title" top="5vh" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="doctorDialog" width="50%" :before-close="handleClose">
      <el-form label-width="110px" :model="doctorInfo" class="drugInfoForm" ref="drugref" :rules="rules">
        <page-title class="page-title" title="基础信息" style="margin-bottom: 20px;"></page-title>
        <el-form-item label="姓名" prop="userRealName">
          <el-input v-model="doctorInfo.userRealName"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="userSex">
          <el-radio-group v-model="doctorInfo.userSex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="证件照">
          <el-upload
            :auto-upload="false"
            action="http://localhost:8082/reg/system/file/upload" 
            accept=".jpg,.jpeg,.png"
            :on-remove="handleRemove"
            :file-list="fileList"
            list-type="picture"
            :on-change="beforeUploadImg">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1MB</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="联系电话" prop="userTel">
          <el-input v-model="doctorInfo.userTel"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="userEmail">
          <el-input v-model="doctorInfo.userEmail"></el-input>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="省" prop="province">
              <!-- <el-input v-model="doctorInfo.userProvince"></el-input> -->
              <el-select v-model="doctorInfo.province" @change="handleProvinceChange" placeholder="请选择" filterable>
                <el-option
                  v-for="item in provinceList"
                  :key="item.id"
                  :label="item.fullname"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="市" label-width="40px" prop="city">
              <el-select :disabled="!doctorInfo.province" v-model="doctorInfo.city" @change="handleCityChange" placeholder="请选择" filterable>
                <el-option
                  v-for="item in cityList"
                  :key="item.id"
                  :label="item.fullname"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="区" label-width="40px" prop="district">
              <el-select :disabled="!doctorInfo.city || doctorInfo.city == ''" v-model="doctorInfo.district" placeholder="请选择" filterable>
                <el-option
                  v-for="item in districtList"
                  :key="item.id"
                  :label="item.fullname"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="详细地址" prop="userAddress">
          <el-autocomplete
            v-model="doctorInfo.userAddress"
            value-key="value"
            :fetch-suggestions="querySearchAsync"
            @select="handleSelectAddress"
            placeholder="请输入内容"
          ></el-autocomplete>
          <!-- <el-input v-model="doctorInfo.userAddress">

          </el-input> -->
        </el-form-item>
        <page-title class="page-title" title="科室安排" style="margin-bottom: 20px;"></page-title>
        <el-form-item label="科室" prop="userDepartment">
          <el-cascader :options="options" v-model="doctorInfo.userDepartment" @change="handleSelectChange" filterable clearable>
            <template slot-scope="{ node, data }">
              <span>{{ data.label }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
        <el-form-item label="职位" prop="userPosition">
          <el-select v-model="doctorInfo.userPosition" placeholder="请选择" filterable>
            <el-option
              v-for="item in positionList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位地址" prop="userLocation">
          <el-input v-model="doctorInfo.userLocation" type="textarea" :rows="2"></el-input>
        </el-form-item>
        <el-form-item label="擅长" prop="userSpecialties">
          <el-input v-model="doctorInfo.userSpecialties" type="textarea" :rows="5"></el-input>
        </el-form-item>
        <el-form-item style="text-align: center;margin-left: 0;">
          <el-button type="primary" :loading="subLoading" @click="onSubmit">{{ subLoading ? '提交中' : '提交'}}</el-button>
          <el-button  @click="handleClose" >取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="医生详情" top="5vh" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="doctorInfoDialog" width="60%" :before-close="handleInfoClose">
      <page-title class="page-title" title="基础信息" style="margin-bottom: 20px;"></page-title>
      <div class="head">
        <div class="image">
          <img style="object-fit: cover;" width="160px" height="200px" :src="doctorInfo.userWorkAvatar" alt="工作执照" />
        </div>
        <div class="base-info">
          <div style="display: table-cell;vertical-align: middle;">
            <div class="name">
              <span style="font-size: 28px;color: #333333;">{{ doctorInfo.userRealName }}</span>
              <span style="padding-left: 15px;color: #909399;font-size: 16px;">{{ doctorInfo.userPosition}}</span>
            </div>
            <div style="padding-top: 5px;">
              <el-row class="row-item">
                <el-col :span="4" class="sec-color">
                  <i class="el-icon-user-solid"></i>
                  <span>所属科室:</span>
                </el-col>
                <el-col :span="20" class="fir-color">
                  <span>{{ doctorInfo.department + '-' + doctorInfo.secondDepartment }}</span>
                </el-col>
              </el-row>
              <el-row class="row-item">
                <el-col :span="4" class="sec-color">
                  <i class="el-icon-phone"></i>
                  <span>联系电话:</span>
                </el-col>
                <el-col :span="20" class="fir-color">
                  <span>{{ doctorInfo.userTel }}</span>
                </el-col>
              </el-row>
              <el-row class="row-item">
                <el-col :span="4" class="sec-color">
                  <i class="el-icon-s-promotion"></i>
                  <span>联系邮箱:</span>
                </el-col>
                <el-col :span="20" class="fir-color">
                  <span>{{ doctorInfo.userEmail }}</span>
                </el-col>
              </el-row>
              <el-row class="row-item">
                <el-col :span="4" class="sec-color">
                  <i class="el-icon-location"></i>
                  <span>出诊地点:</span>
                </el-col>
                <el-col :span="20" class="fir-color">
                  <span>{{ doctorInfo.userLocation }}</span>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
      <page-title class="page-title" title="详细信息" style="margin-bottom: 20px;"></page-title>
      <div style="width: 100%;padding-left:20px">
        <el-row class="row-item">
          <el-col :span="3" class="sec-color">
            <i class="el-icon-map-location"></i>
            <span>详细住址:</span>
          </el-col>
          <el-col :span="20" class="fir-color">
            <span>{{ doctorInfo.userAddress }}</span>
          </el-col>
        </el-row>
        <el-row class="row-item">
          <el-col :span="3" class="sec-color">
            <i class="el-icon-trophy"></i>
            <span>擅长领域:</span>
          </el-col>
          <el-col :span="20" class="fir-color">
            <span>{{ doctorInfo.userSpecialties }}</span>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog class="dialog" top="5vh" title="预览" :visible.sync="exportDialog" width="70%" :before-close="handleExportClose">
      <el-table id="selectTable" :data="selectData" stripe height="400px" border>
        <el-table-column property="userNo" show-overflow-tooltip label="NO"></el-table-column>
        <el-table-column property="userRealName" show-overflow-tooltip label="姓名"></el-table-column>
        <el-table-column property="userSex" show-overflow-tooltip label="性别"></el-table-column>
        <el-table-column property="userPosition" show-overflow-tooltip label="职位"></el-table-column>
        <el-table-column property="department" show-overflow-tooltip label="科室"></el-table-column>
        <el-table-column property="secondDepartment" show-overflow-tooltip label="二级科室"></el-table-column>
        <el-table-column property="userProvince" show-overflow-tooltip label="省份"></el-table-column>
        <el-table-column property="userAddress" show-overflow-tooltip label="详细地址"></el-table-column>
        <el-table-column property="userTel" show-overflow-tooltip label="联系电话"></el-table-column>
        <el-table-column property="userEmail" show-overflow-tooltip label="联系邮箱"></el-table-column>
        <el-table-column property="userLocation" show-overflow-tooltip label="工作地点"></el-table-column>
        <el-table-column property="userSpecialties" show-overflow-tooltip label="擅长"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="exportExcel">确定保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import PageTitle from '@/components/PageTitle';
import htmlToExcel from '@/utils/htmlToExcel';
export default {
  components:{
    Pagination,
    PageTitle
  },
  data() {
    return {
      total: 0,
      pagination: {
        pageSize: 10,
        pageNum: 1
      },
      selectData: [],
      exportDialog: false,
      doctorForm: {},
      doctorInfo: {},
      doctorList: [],
      loading: false,
      options: [],
      positionList: [
        { label: '主任医师', value: '主任医师' }, { label: '副主任医师', value: '副主任医师' },
        { label: '主治医师', value: '主治医师' }, { label: '住院医师', value: '住院医师' }
      ],
      title: '新增',
      doctorDialog: false,
      cityDistrictList: ['110000', '120000', '500000', '310000'],
      rules: {
        userRealName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        userSex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        userTel: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
        userEmail: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        province: [{ required: true, message: '请选择省', trigger: 'change' }],
        city: [{ required: true, message: '请选择市', trigger: 'change' }],
        district: [{ required: true, message: '请选择区', trigger: 'change' }],
        userAddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        userDepartment: [{ required: true, message: '请选择科室', trigger: 'change' }],
        userPosition: [{ required: true, message: '请选择职位', trigger: 'change' }],
        userLocation: [{ required: true, message: '请输入单位地址', trigger: 'blur' }],
        userSpecialties: [{ required: true, message: '请输入擅长', trigger: 'blur' }]
      },
      fileList: [],
      provinceList: [],
      cityList: [],
      districtList: [],
      suggestionList: [],
      suggestionData: {},
      loadingAddress: false,
      addressTotal: 0,
      pageSize: 20,
      pageNum: 1,
      keyword: '',
      canInputAddress: false,
      subLoading: false,
      doctorInfoDialog: false
    }
  },
  created() {
    this.initPage()
    this.getProvinceList()
  },
  methods: {
    exportExcel() {
      htmlToExcel.getExcel('#selectTable','医生列表')
    },
    handleExportClose() {
      this.exportDialog = false
    },
    handleInfoClose() {
      this.doctorInfoDialog = false
      setTimeout(() => {
        this.doctorInfo = {}
        this.fileList = []
      }, 500)
    },
    handleSelectAddress(item) {
      // this.doctorInfo.userAddress = item.address + item.title
    },
    querySearchAsync(queryString, cb) {
      if(typeof(queryString) === 'undefined' || queryString === '') {
        return
      }
      console.log(queryString)
      let param = {}
      param.pageNum = this.pageNum
      param.pageSize = this.pageSize
      if(!this.doctorInfo.district) {
        param.region = ""
      } else {
        param.region = this.districtList.find(any => any.id = this.doctorInfo.district).fullname
      }
      param.keyword = queryString
      this.$postJson('/reg/system/district/suggestion', param).then((res) => {
        const resData = res.data
        if(resData.data.status === 0) {
          resData.data.data.forEach(item => {
            item.value =item.address + item.title
          });
          this.suggestionList = resData.data.data
          this.addressTotal = resData.data.count
          this.keyword = queryString
          cb(this.suggestionList)
        } else {
          return this.$message.error(resData.data.message)
        }
      })
    },
    handleCityChange(val) {
      delete this.doctorInfo.district
      this.$get(`/reg/system/district/children?id=${val}`).then((res) => {
        const resData = res.data
        if(resData.data.status === 0) {
          this.districtList = resData.data.result[0]
        } else {
          return this.$message.error(resData.data.message)
        }
      })
    },

    handleProvinceChange(val) {
      delete this.doctorInfo.city
      delete this.doctorInfo.district
      if(this.cityDistrictList.indexOf(val) !== -1) {
        this.cityList = [{id: val, fullname: '市辖区'}]
        this.doctorInfo.city = val
        this.handleCityChange(val)
        return
      }
      this.$get(`/reg/system/district/children?id=${val}`).then((res) => {
        const resData = res.data
        if(resData.data.status === 0) {
          this.cityList = resData.data.result[0]
        } else {
          return this.$message.error(resData.data.message)
        }
      })
    },
    getProvinceList() {
      this.$get('/reg/system/district/children').then((res) => {
        const resData = res.data
        if(resData.data.status === 0) {
          // 剔除港澳台
          let list = resData.data.result[0]
          list.splice(list.findIndex(item => item.id === '710000'), 1)
          list.splice(list.findIndex(item => item.id === '810000'), 1)
          list.splice(list.findIndex(item => item.id === '810000'), 1)
          this.provinceList = list
        } else {
          return this.$message.error(resData.data.message)
        }
      })
    },
    handleSelectChange(val) {
      this.doctorInfo.userDepartment = val[1]
    },
    // 发送图片之前
    isLt2M(file) {
      let fileSize = file.size / 1024 / 1024;
      fileSize = Math.floor(fileSize * 1000) / 1000; // 小数取整后三位
      const isLt2M = fileSize < 2;
      if(!isLt2M) {
        this.$message.error('上传图片大小不能超过2MB!');
        return false
      }
      return true
    },
    handleRemove(file, fileList) {
      this.doctorInfo.userWorkAvatar = ''
      this.fileList = []
    },
    beforeUploadImg(file, fileList) {
      if(this.isLt2M(file)) {
        let img = file.raw
        let types = ['image/jpeg', 'image/jpg', 'image/png'];
        const isImage = types.includes(img.type);
        if(!isImage) {
          this.$message.error('上传图片只能是 JPG、JPEG、PNG 格式!');
        } else {
          let formData = new FormData()
          formData.append("file", file.raw)
          this.$upload("/reg/system/file/upload",formData).then(res => {
            let resData = res.data
            if(resData.code === 200) {
              const data = resData.data[0]
              this.doctorInfo.userWorkAvatar = data.filePath
              this.fileList.push({name: data.fileNameNotExt + '.' + data.fileExt, url:data.filePath })
              this.$message.success('上传成功')
            } else {
              this.$message.error('上传失败，原因为：' + resData.msg)
            }
          })
        }
      }
    },
    onSubmit() {
      this.subLoading = true
      // 判断是否上传了证件照
      if(!this.doctorInfo.userWorkAvatar || this.doctorInfo.userWorkAvatar === '') {
        this.$message.error("必须上传一张证件照")
        this.subLoading = false
        return
      }
      this.$refs['drugref'].validate((valid) => {
        if(valid) {
          // 处理省市区数据
          this.doctorInfo.userProvince = this.provinceList.find(any => any.id === this.doctorInfo.province).fullname
          // 判断当前是新增还是编辑
          let path = this.title === '编辑' ? '/reg/system/doctor/update' : '/reg/system/doctor/save'
          this.$postJson(path, this.doctorInfo).then((res) => {
            let resData = res.data
            if(resData.code === 200) {
              this.$message.success('成功')
              this.handleClose()
              this.initPage()
            } else {
              this.$message.error(resData.msg)
              this.subLoading = false
            }
          })
        } else {
          this.$message.error("请将表单填写完整")
          this.subLoading = false
        }
      })
    },
    handleClose() {
      this.$refs['drugref'].resetFields();
      this.subLoading = false
      this.doctorInfo = {}
      this.fileList = []
      this.doctorDialog = false
    },
    handlePageChange() {
      this.initPage()
    },
    editDoctorInfo(row) {
      this.title = '编辑'
      this.$get(`/reg/system/doctor/info/${row.userNo}`).then((res) => {
        let resData = res.data
        if(resData.code === 200) {
          this.doctorInfo = resData.data
          // 填入文件信息与地址信息
          this.fileList = [{name: this.doctorInfo.userNo + '.jpg', url: this.doctorInfo.userWorkAvatar}]
          let provinceId = this.provinceList.find(any => any.fullname === this.doctorInfo.userProvince).id
          this.doctorInfo.province = provinceId
          this.doctorDialog = true
        } else {
          this.$message.error("获取医生信息失败！")
        }
      })
    },
    getDoctorInfo(row) {
      this.$get(`/reg/system/doctor/info/${row.userNo}`).then((res) => {
        let resData = res.data
        if(resData.code === 200) {
          this.doctorInfo = resData.data
          // 填入文件信息与地址信息
          this.fileList = [{name: this.doctorInfo.userNo + '.jpg', url: this.doctorInfo.userWorkAvatar}]
          let provinceId = this.provinceList.find(any => any.fullname === this.doctorInfo.userProvince).id
          this.doctorInfo.province = provinceId
          this.doctorInfoDialog = true
        } else {
          this.$message.error("获取医生信息失败！")
        }
      })
    },
    deleteDoctor(row) {
      this.$confirm('删除记录可能会导致重要数据丢失，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$postJson('/reg/system/doctor/delete', row).then(res => {
          let resDate = res.data
          if(resDate.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.initPage()
            this.getProvinceList()
          } else {
            this.$message.error(resDate.msg)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
    },
    handleSelectionChange(val) {
      this.selectData = val
    },
    exportExcelSelect() {
      if(this.selectData.length === 0) {
        this.$message.warning("请选择表格中的数据")
        return
      }
      this.exportDialog = true
    },
    addDoctor() {
      this.title = '新增'
      this.doctorDialog = true
    },
    clearForm() {
      this.doctorForm = {}
      this.initPage()
    },
    handleSearch() {
      this.initPage()
    },
    handleSearchChange(value) {
      this.doctorForm.userDepartment = value[1]
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
    initPage() {
      this.loading = true;
      const params = {...this.doctorForm};
      params.pageNum = this.pagination.pageNum;
      params.pageSize = this.pagination.pageSize;
      this.$postJson('/reg/system/doctor/list', params).then(res => {
        if(res.data.code === 200) {
          this.total = res.data.data.totalSize
          this.doctorList = res.data.data.content
          this.getDepartmentType()
        } else {
          this.$message.error(res.data.msg)
        }
        this.loading = false;
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.main {
  padding: 10px 20px;
  height: 100%;
}
.departForm {
  .el-row >>> .el-cascader {
    width: 100% ;
  }
  .el-row >>> .el-select {
    width: 100% ;
  }
}
.drugInfoForm {
  .el-row >>> .el-cascader {
    width: 100% ;
  }
  .el-row >>> .el-select {
    width: 100% ;
  }
}
.head {
  width: 100%;
  height: 100%;
  display: flex;
  padding-left: 20px;
  .base-info {
    width: 100%;
    height: 200px;
    padding-left: 20px;
    padding-right: 40px;
    display: table;
  }
}
.row-item {
  font-size: 18px;
  line-height: 2.2;
  .sec-color {
    color: #909399;
  }
  .fir-color {
    color: #333333;
    padding-left: 25px;
  }
}
</style>