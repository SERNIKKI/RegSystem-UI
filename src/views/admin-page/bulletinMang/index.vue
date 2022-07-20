<template>
  <div class="main">
    <div>
      <page-title class="page-title" title="查询条件" style="margin-bottom: 10px"></page-title>
      <el-form :model="bulletinForm" label-width="100px" class="departForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="标题">
              <el-input v-model="bulletinForm.bulletinTitle"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="时间范围">
              <el-date-picker
                v-model="bulletinForm.time"
                type="datetimerange"
                :picker-options="pickerOptions"
                @change="timeChange"
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8" style='text-align: right;'>
            <!-- <el-form-item label="创建人">
              <el-input v-model="bulletinForm.bulletinName"></el-input>
            </el-form-item> -->
            <el-form-item>
              <el-button type="primary" size="small" icon="el-icon-search" @click="handleSearch">搜索</el-button>
              <el-button type="" size="small" icon="el-icon-delete" @click="clearForm">清空</el-button>
              <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="addBulltein">新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <page-title class="page-title" title="公告列表" style="margin-bottom: 20px;"></page-title>
      <el-table :data="bulletinList" v-loading="loading" stripe @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column align="center" property="bulletinNo" show-overflow-tooltip label="公告no"></el-table-column>
        <el-table-column align="center" property="bulletinTitle" show-overflow-tooltip label="标题"></el-table-column>
        <el-table-column align="center" property="bulletinDepartment" show-overflow-tooltip label="发布部门"></el-table-column>
        <el-table-column align="center" property="beginTime" show-overflow-tooltip label="开始时间"></el-table-column>
        <el-table-column align="center" property="endTime" show-overflow-tooltip label="结束时间"></el-table-column>
        <el-table-column align="center" property="bulletinName" show-overflow-tooltip label="创建人"></el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="状态">
          <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.isValid === '0'">未开始</el-tag>
            <el-tag type="success" v-else-if="scope.row.isValid === '1'">进行中</el-tag>
            <el-tag type="info" v-else-if="scope.row.isValid === '2'">已结束</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" property="updateTime" show-overflow-tooltip label="更改时间"></el-table-column> -->
        <el-table-column align="center" width="250" label="操作">
          <template slot-scope="scope">
            <el-button type="" size="mini" plain @click="getBulletinInfo(scope.row)">详情</el-button>
            <el-button type="primary" size="mini" plain @click="editBulletinInfo(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" plain @click="deleteBulletin(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination style="text-align: right;" v-show="total > 0" :total="total" :page.sync="pagination.pageNum" :limit.sync="pagination.pageSize" @pagination="handlePageChange" />
    </div>
    <el-dialog v-drag :title="title" top="5vh" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="bulletinDialog" width="60%" :before-close="handleClose">
      <el-form :model="bulletinInfo" ref="drugref" :rules="rules" class="drugInfoForm" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="bulletinTitle" label="标题">
              <el-input v-model="bulletinInfo.bulletinTitle"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="infoDepartment" label="部门">
              <el-cascader :options="department" v-model="bulletinInfo.infoDepartment" @change="handleSearchChange" filterable clearable>
                <template slot-scope="{ node, data }">
                  <span>{{ data.label }}</span>
                  <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
                </template>
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="时间范围" prop="time">
          <el-date-picker
            v-model="bulletinInfo.time"
            type="datetimerange"
            :picker-options="pickerOptions"
            @change="timeChange2"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="公告图片">
          <el-upload
            :auto-upload="false"
            action="http://localhost:8082/reg/system/file/upload" 
            accept=".jpg,.jpeg,.png"
            :on-remove="handleRemove"
            :file-list="fileList"
            list-type="picture"
            :on-change="beforeUploadImg">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="公告内容">
          <Writer :value="value" :disable="disable" @input="inputValue"></Writer>
        </el-form-item>
        <el-form-item style="text-align: center;margin-left: 0;">
          <el-button type="primary" :loading="subLoading" @click="onSubmit">{{ subLoading ? '提交中' : '提交'}}</el-button>
          <el-button  @click="handleClose" >取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="详情" top="5vh" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="bulletinInfoDialog" width="60%" :before-close="handleInfoClose">
      <div class="notify-main">
        <div class="title">
          <span class="text">{{ bulletinInfo.bulletinTitle }}</span>
        </div>
        <div class="time center">
          <span class="text">发布时间：{{ bulletinInfo.beginTime }}</span>
          <span class="text">发布单位：{{ bulletinInfo.bulletinDepartment }}</span>
          <span class="text">发布人：{{ bulletinInfo.bulletinName }}</span>
        </div>
        <div class="contact">
          <div class="image" v-if="bulletinInfo.bulletinImage">
           <img :src="bulletinInfo.bulletinImage" :alt="bulletinInfo.bulletinTitle" />
          </div>
          <div class="main-text">
            <div v-html="bulletinInfo.bulletinContact"></div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import PageTitle from '@/components/PageTitle';
import Writer from '@/components/Writer'
import Department from '@/data/department.js'
export default {
  components:{
    Pagination,
    PageTitle,
    Writer
  },
  data() {
    return {
      bulletinForm: {},
      loading: false,
      total: 0,
      pagination: {
        pageSize: 10,
        pageNum: 1
      },
      bulletinList: [],
      bulletinDialog: false,
      subLoading: false,
      title: '新增公告',
      bulletinInfo: {},
      rules: {
        bulletinTitle: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        time: [{ required: true, message: '请选择生效时间', trigger: 'change' }],
        infoDepartment: [{ required: true, message: '请选择发布部门', trigger: 'change' }],
      },
      fileList: [],
      value: "",
      disable: false,
      selectData: [],
      bulletinInfoDialog: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      department: null
    }
  },
  created() {
    this.department = Department
    this.initPage()
  },
  methods: {
    handlePageChange() {
      this.initPage()
    },
    handleSearchChange(value) {
      this.bulletinInfo.infoDepartment = value
      const first = this.department.find(any => any.value === value[0])
      const second = first.children.find(any => any.value === value[1])
      this.bulletinInfo.bulletinDepartment = first.label + '-' + second.label
    },
    handleInfoClose() {
      this.bulletinInfoDialog = false
      setTimeout(() => {
        this.bulletinInfo = {}
      }, 500)
    },
    handleSelectionChange(val) {
      this.selectData = val
    },
    inputValue(value) {
      this.bulletinInfo.bulletinContact = value
    },
    onSubmit() {
      this.subLoading = true
      // 判断是否填入了内容
      if(!this.bulletinInfo.bulletinContact || this.bulletinInfo.bulletinContact === '') {
        this.$message.error("请输入公告内容")
        this.subLoading = false
        return
      }
      this.$refs['drugref'].validate((valid) => {
        if(valid) {
          let path = this.title === '新增公告' ? '/reg/system/bulletin/save' : '/reg/system/bulletin/update'
          this.$postJson(path, this.bulletinInfo).then((res) => {
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
    // 发送图片之前
    isLt10M(file) {
      let fileSize = file.size / 1024 / 1024;
      fileSize = Math.floor(fileSize * 1000) / 1000; // 小数取整后三位
      const isLt10M = fileSize < 10;
      if(!isLt10M) {
        this.$message.error('上传图片大小不能超过10MB!');
        return false
      }
      return true
    },
    beforeUploadImg(file, fileList) {
      if(this.isLt10M(file)) {
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
              this.bulletinInfo.bulletinImage = data.filePath
              this.fileList.push({name: data.fileNameNotExt + '.' + data.fileExt, url:data.filePath })
              this.$message.success('上传成功')
            } else {
              this.$message.error('上传失败，原因为：' + resData.msg)
            }
          })
        }
      }
    },
    handleRemove(file, fileList) {
      this.bulletinInfo.bulletinImage = ''
      this.fileList = []
    },
    timeChange2(val) {
      if(val === null) {
        delete this.bulletinInfo.beginTime
        delete this.bulletinInfo.endTime
      } else {
        this.bulletinInfo.beginTime = val[0]
        this.bulletinInfo.endTime = val[1]
      }
    },
    // 关闭弹窗
    handleClose() {
      this.$refs['drugref'].resetFields();
      this.bulletinInfo = {}
      this.fileList = []
      this.value = ''
      this.subLoading = false
      this.bulletinDialog = false
    },
    // 详情
    getBulletinInfo(row) {
      this.$get(`/reg/system/bulletin/info/${row.bulletinNo}`).then((res) => {
        let resData = res.data
        if(resData.code === 200) {
          this.bulletinInfo = resData.data
          this.bulletinInfoDialog = true
          this.title = '新增公告'
        } else {
          this.$message.error('打开失败，原因为：' + resData.msg)
        }
      })
    },
    // 编辑
    editBulletinInfo(row) {
      this.$get(`/reg/system/bulletin/info/${row.bulletinNo}`).then((res) => {
        let resData = res.data
        if(resData.code === 200) {
          // 处理部门
          resData.data.infoDepartment = []
          if(resData.data.bulletinDepartment) {
            let arr = resData.data.bulletinDepartment.split('-')
            let first = this.department.find(any => any.label === arr[0])
            let second = first.children.find(any => any.label === arr[1])
            resData.data.infoDepartment = [first.value, second.value]
          }
          // 处理时间
          resData.data.time = [resData.data.beginTime, resData.data.endTime]
          // 处理文件
          this.fileList = [{name: resData.data.bulletinNo + '.jpg', url: resData.data.bulletinImage}]
          // 处理内容
          this.value = resData.data.bulletinContact
          this.bulletinInfo = resData.data
          this.bulletinDialog = true
          this.title = '编辑'
        } else {
          this.$message.error('打开失败，原因为：' + resData.msg)
        }
      })
    },
    // 删除
    deleteBulletin(row) {
      this.$confirm('删除记录可能会导致重要数据丢失，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$get(`/reg/system/bulletin/delete/${row.bulletinNo}`).then(res => {
          let resDate = res.data
          if(resDate.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.initPage()
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
    initPage() {
      this.loading = true
      let params = {...this.bulletinForm}
      params.pageNum = this.pagination.pageNum;
      params.pageSize = this.pagination.pageSize;
      this.$postJson('/reg/system/bulletin/list', params).then(res => {
        if(res.data.code === 200) {
          this.total = res.data.data.totalSize
          this.bulletinList = res.data.data.content
        } else {
          this.$message.error(res.data.msg)
        }
        this.loading = false;
      })
    },
    addBulltein() {
      this.bulletinInfo = {}
      this.bulletinDialog = true
    },
    clearForm() {
      this.bulletinForm = {}
      this.initPage()
    },
    handleSearch() {
      this.initPage()
    },
    timeChange(val) {
      if(val === null) {
        delete this.bulletinForm.beginTime
        delete this.bulletinForm.endTime
      } else {
        this.bulletinForm.beginTime = val[0]
        this.bulletinForm.endTime = val[1]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  padding: 10px 20px;
  height: 100%;
}
.notify-main {
  .title {
    text-align: center;
    .text {
      font-size: 30px;
      color: #000;
      line-height: 40px;
      font-family: Microsoft Yahei;
      height: 80px;
      overflow: hidden;
    }
  }
  .time {
    padding-top: 40px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e5e5e5;
    .text {
      color: #666666;
      font-size: 13px;
      padding: 0 50px 0 0;
    }
  }
  .contact {
    margin: 0 auto;
    .image {
      text-align: center;
      padding-top: 40px;
      img {
        width: 870px;
        height: 285px;
      }
    }
    .main-text {
      margin: 0 auto;
      width: 870px;
      // text-align: center;
    }
  }
}
</style>