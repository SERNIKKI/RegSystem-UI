<template>
<div>
  <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :before-close="handleClose" >
    <el-row>
      <el-col :xs="24" :md="12" :style="{height: '350px'}">
        <vue-cropper
          ref="cropper"
          :img="img"
          :info="true"
          :full="true"
          :canMove="true"
          :centerBox="true"
          :enlarge="1"
          :outputSize="1"
          :autoCrop="autoCrop"
          :autoCropWidth="autoCropWidth"
          :autoCropHeight="autoCropHeight"
          :fixedBox="fixedBox"
          @realTime="realTime"
        />
      </el-col>
      <el-col :xs="24" :md="12" :style="{height: '350px'}" style="display: grid;text-align: center;">
        <div style="font-size: 18px;"> 
          预览
        </div>
        <div style="margin: 0 auto;">
          <div class="show-preview" style="border-radius: 50%;" :style="{'width':'150px', 'height':'150px', 'overflow': 'hidden', 'margin': '5px'}">
            <div :style="previews.div" v-if="haveAvatar()">
              <img :src="previews.url" class="previewImg" :style="previews.img" object-fit="cover">
            </div>
            <div v-else>
              <el-avatar :src="userAvatar" class="previewImg" fit="cover"></el-avatar>
            </div>
          </div>
        </div>
        <!-- <div class="small-size">
          <el-avatar :size="100" :src="previews.url" :style="previews.img" ></el-avatar>
        </div> -->
        <span>150 x 150</span>
        <div style="margin: 0 auto;">
          <div class="show-preview" style="border-radius: 50%;" :style="{'width':'100px', 'height':'100px', 'overflow': 'hidden', 'margin': '5px'}">
            <div style="zoom: 0.7;" v-if="haveAvatar()">
              <img :src="previews.url" class="previewImg2" :style="previews.img"  object-fit="cover">
            </div>
            <div v-else>
              <el-avatar :src="userAvatar" class="previewImg2" fit="cover"></el-avatar>
            </div>
          </div>
        </div>
        <span>100 x 100</span>
      </el-col>
    </el-row>
    <br />
    <el-row>
      <el-col :lg="2" :md="2">
        <el-upload :auto-upload="false" action="/reg/system/file/upload" :show-file-list="false" :on-change="beforeUpload">
          <el-button size="small">选择图片<i class="el-icon-upload el-icon--right"></i></el-button>
        </el-upload>
      </el-col>
      <el-col :lg="{span: 1, offset: 2}" :md="2">
        <el-button icon="el-icon-plus" size="small" @click="changeScale(1)"></el-button>
      </el-col>
      <el-col :lg="{span: 1, offset: 1}" :md="2">
        <el-button icon="el-icon-minus" size="small" @click="changeScale(-1)"></el-button>
      </el-col>
      <el-col :lg="{span: 1, offset: 1}" :md="2">
        <el-button icon="el-icon-refresh-left" size="small" @click="rotateLeft()"></el-button>
      </el-col>
      <el-col :lg="{span: 1, offset: 1}" :md="2">
        <el-button icon="el-icon-refresh-right" size="small" @click="rotateRight()"></el-button>
      </el-col>
      <el-col :lg="{span: 2, offset: 6}" :md="2">
        <el-button type="primary" size="small" @click="uploadImg">提 交</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</div>
</template>

<script>
import { VueCropper }  from 'vue-cropper'
import axios from 'axios'
export default {
  props: {
    title: {
      type: String
    },
    open: {
      type: Boolean
    }
  },
  created() {
    this.user = JSON.parse(this.$store.state.user)
    this.userAvatar = this.user.userAvatar
  },
  components: {
    VueCropper,
  },
  data() {
    return {
      user: {},
      visible: true,
      previews: {},
      img: '', //裁剪图片的地址
      autoCrop: true, // 是否默认生成截图框
      autoCropWidth: 150, // 默认生成截图框宽度
      autoCropHeight: 150, // 默认生成截图框高度
      fixedBox: true, // 固定截图框大小 不允许改变
      fileUpload: null,
      userAvatar: '',
    }
  },
  methods: {
    // 判断是否有新图象
    haveAvatar() {
      if(this.previews.url === '') {
        return false
      } else {
        return true
      }
    },
    // 关闭弹窗
    handleClose() {
      // this.previews = {}
      // this.img = ''
      this.$emit('update:cropperDialog', false);
    },
    // 实时预览
    realTime(data) {
      this.previews = data
    },
    // 向左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    // 向右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    // 图片缩放
    changeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    // 上传预处理
    beforeUpload(file) {
      file = file.raw
      this.fileUpload = file
      if (file.type.indexOf("image/") == -1) {
        this.msgError("文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。");
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.img = reader.result;
        };
      }
    },
    // 上传图片
    uploadImg() {
      this.$refs.cropper.getCropBlob(data => {
        let data1 = window.URL.createObjectURL(data);
        var _obj = { name: this.fileUpload.name }
        var X = this.fileUpload.name.substring(this.fileUpload.name.lastIndexOf('.'), this.fileUpload.name.length)
        _obj.name = this.fileUpload.name.substring(0, this.fileUpload.name.lastIndexOf('.'))
        var reg = /^[\u4e00-\u9fa5\(\)_a-zA-Z0-9]+$/
        if(!reg.test(_obj.name)) {
          _obj.name = _obj.name.replace(/[^\u4e00-\u9fa5\(\)_a-zA-Z0-9]+/g, '')
        }
        _obj.name = _obj.name + X;
        let formData = new FormData();
        formData.append("file", data, _obj.name);
        this.$upload("/reg/system/file/upload",formData).then(res => {
          let resData = res.data
          if (resData.code === 200) {
            console.log(resData)
            this.user.userAvatar = resData.data[0].filePath
            // 更新user
            this.$postJson('/reg/system/user/updateUserInfo',this.user).then(res => {
              let resData2 = res.data
              if(resData2.code === 200) {
                this.$store.commit('handleUser', JSON.stringify(res.data.data))
                this.visible = false;
                this.$message.success('修改成功');
                this.handleClose()
              } else {
                this.$message.error(resData.msg)
              }
            })
          } else {
            this.$message.error(resData.msg)
          }
        });
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.previewImg {
  width: 150px;
  height: 150px;
}
.previewImg2 {
  width: 100px;
  height: 100px;
}
>>> .el-dialog {
  .el-dialog__header {
    background: #FCFCFC;
    border-bottom: 1px solid #e5e5e5;
  }
}
</style>