<template>
  <div class="main">
    <div>
      <page-title class="page-title" title="查询条件" style="margin-bottom: 10px"></page-title>
      <el-form :model="previewForm" label-width="100px" class="departForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="标题">
              <el-input v-model="previewForm.previewTitle"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="时间范围">
              <el-date-picker
                v-model="previewForm.time"
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
          <el-col :span="8">
            <el-form-item label="平台">
              <el-select v-model="previewForm.showModel">
                <el-option
                  v-for="item in modelList"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style='text-align: right;'>
            <!-- <el-form-item label="创建人">
              <el-input v-model="bulletinForm.bulletinName"></el-input>
            </el-form-item> -->
            <el-form-item>
              <el-button type="primary" size="small" icon="el-icon-search" @click="handleSearch">搜索</el-button>
              <el-button type="" size="small" icon="el-icon-delete" @click="clearForm">清空</el-button>
              <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="addPreview">新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <page-title class="page-title" title="轮播图列表" style="margin-bottom: 20px;"></page-title>
      <el-table :data="previewList" v-loading="loading" stripe @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column align="center" width="200" property="previewNo" show-overflow-tooltip label="预览图no"></el-table-column>
        <el-table-column align="center" property="previewTitle" show-overflow-tooltip label="说明"></el-table-column>
        <el-table-column align="center" property="previewLink" show-overflow-tooltip label="链接地址"></el-table-column>
        <el-table-column align="center" property="beginTime" show-overflow-tooltip label="开始时间"></el-table-column>
        <el-table-column align="center" property="endTime" show-overflow-tooltip label="结束时间"></el-table-column>
        <el-table-column align="center" property="showModel" show-overflow-tooltip label="显示设备"></el-table-column>
        <el-table-column align="center" property="createName" show-overflow-tooltip label="创建人"></el-table-column>
        <el-table-column align="center" show-overflow-tooltip label="状态">
          <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.isValid === '0'">未开始</el-tag>
            <el-tag type="success" v-else-if="scope.row.isValid === '1'">进行中</el-tag>
            <el-tag type="info" v-else-if="scope.row.isValid === '2'">已结束</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" property="updateTime" show-overflow-tooltip label="更改时间"></el-table-column> -->
        <el-table-column align="center" width="200" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" plain @click="editPreviewInfo(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" plain @click="deletePreview(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination style="text-align: right;" v-show="total > 0" :total="total" :page.sync="pagination.pageNum" :limit.sync="pagination.pageSize" @pagination="handlePageChange" />
      <page-title class="page-title" title="轮播图预览(PC端)" style="margin-bottom: 20px;"></page-title>
      <Preview :previewList="pcList"></Preview>
      <page-title class="page-title" title="轮播图预览(APP端)" style="margin-bottom: 20px;"></page-title>
      <Preview :previewList="appList"></Preview>
    </div>
    <el-dialog :title="title" top="5vh" :close-on-click-modal="false" :close-on-press-escape="false" :visible.sync="previewDialog" width="50%" :before-close="handleClose">
      <el-form :model="previewInfo" ref="drugref" :rules="rules" class="drugInfoForm" label-width="100px">
        <el-row>
          <el-col :span="15">
            <el-form-item prop="previewTitle" label="说明">
              <el-input type="textarea" :rows="2" v-model="previewInfo.previewTitle"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item label="链接地址">
              <el-input v-model="previewInfo.previewLink"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="showModel" label="显示设备">
              <el-select v-model="previewInfo.showModel">
                <el-option
                  v-for="item in modelList"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="时间范围" prop="time">
          <el-date-picker
            v-model="previewInfo.time"
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
        <el-form-item label="显示图片">
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
        <el-form-item style="text-align: center;margin-left: 0;">
          <el-button type="primary" :loading="subLoading" @click="onSubmit">{{ subLoading ? '提交中' : '提交'}}</el-button>
          <el-button  @click="handleClose" >取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import PageTitle from '@/components/PageTitle';
import Preview from '@/components/Preview';
export default {
  components:{
    Pagination,
    PageTitle,
    Preview
  },
  data() {
    return {
      modelList: ["PC", "APP"],
      previewForm: {},
      previewList: [],
      loading: false,
      total: 0,
      pagination: {
        pageSize: 10,
        pageNum: 1
      },
      selectData: [],
      title: "新增轮播图",
      previewDialog: false,
      previewInfo: {},
      fileList: [],
      subLoading: false,
      pcList: [],
      appList: [],
      rules: {
        previewTitle: [{ required: true, message: '请输入', trigger: 'blur' }],
        showModel: [{ required: true, message: '请选择显示平台', trigger: 'change' }],
        time: [{ required: true, message: '请选择生效时间', trigger: 'change' }]
      },
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
    }
  },
  created() {
    this.initPage()
  },
  methods: {
    getPCCanPreviewList() {
      this.$get('/reg/system/preview/pcList').then((res) => {
        let resData = res.data
        if(resData.code === 200) {
          // this.pcList = [(resData.data)[0]]
          this.pcList = resData.data
        } else {
          this.$message.error("获取PC轮播图失败，原因为：" + resData.msg)
        }
      })
    },
    getAPPCanPreviewList() {
      this.$get('/reg/system/preview/appList').then((res) => {
        let resData = res.data
        if(resData.code === 200) {
          this.appList = resData.data
        } else {
          this.$message.error("获取APP轮播图失败，原因为：" + resData.msg)
        }
      })
    },
    handlePageChange() {
      this.initPage()
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
              this.previewInfo.previewImage = data.filePath
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
      this.previewInfo.previewImage = ''
      this.fileList = []
    },
    timeChange(val) {
      if(val === null) {
        delete this.previewForm.beginTime
        delete this.previewForm.endTime
      } else {
        this.previewForm.beginTime = val[0]
        this.previewForm.endTime = val[1]
      }
    },
    timeChange2(val) {
      if(val === null) {
        delete this.previewInfo.beginTime
        delete this.previewInfo.endTime
      } else {
        this.previewInfo.beginTime = val[0]
        this.previewInfo.endTime = val[1]
      }
    },
    onSubmit() {
      this.subLoading = true
      // 判断是否填入了内容
      if(!this.previewInfo.previewImage || this.previewInfo.previewImage === '') {
        this.$message.error("请上传图片")
        this.subLoading = false
        return
      }
      this.$refs['drugref'].validate((valid) => {
        if(valid) {
          let path = this.title === '新增轮播图' ? '/reg/system/preview/save' : '/reg/system/preview/update'
          this.$postJson(path, this.previewInfo).then((res) => {
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
      this.previewInfo = {}
      this.fileList = []
      this.subLoading = false
      this.previewDialog = false
    },
    handleSelectionChange(val) {
      this.selectData = val
    },
    editPreviewInfo(row) {
      this.$get(`/reg/system/preview/info/${row.previewNo}`).then((res) => {
        let resData = res.data
        if(resData.code === 200) {
          // 处理时间
          resData.data.time = [resData.data.beginTime, resData.data.endTime]
          // 处理文件
          this.fileList = [{name: resData.data.previewNo + '.jpg', url: resData.data.previewImage}]
          this.previewInfo = resData.data
          this.previewDialog = true
          this.title = '编辑'
        } else {
          this.$message.error('打开失败，原因为：' + resData.msg)
        }
      })
    },
    deletePreview(row) {
      this.$confirm('删除记录可能会导致重要数据丢失，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        this.$get(`/reg/system/preview/delete/${row.previewNo}`).then(res => {
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
      let params = {...this.previewForm}
      params.pageNum = this.pagination.pageNum;
      params.pageSize = this.pagination.pageSize;
      this.$postJson('/reg/system/preview/list', params).then(res => {
        if(res.data.code === 200) {
          this.total = res.data.data.totalSize
          this.previewList = res.data.data.content
          this.getPCCanPreviewList()
          this.getAPPCanPreviewList()
        } else {
          this.$message.error(res.data.msg)
        }
        this.loading = false;
      })
    },
    handleSearch() {
      this.initPage()
    },
    clearForm() {
      this.previewForm = {}
      this.initPage()
    },
    addPreview() {
      this.previewDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  padding: 10px 20px;
  height: 100%;
}
</style>