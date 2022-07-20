<template>
  <div class="warp" id="content">
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="back"><span @click="back">返回</span></el-breadcrumb-item>
          <el-breadcrumb-item>{{ actorName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="msg-main u-scroll1" ref="box" @scroll="scrollBottom($event)">
      <div style="padding: 10px 0;">
        <div class="more">
          <el-button v-if="isHistory" type="text" :loading="loadData" style="font-size: 16px;" @click="getHistoryMessage()">查看更多消息</el-button>
          <div v-else class="no-history">没有更多消息了~</div>
        </div>
        <div v-for="(item, index) in messageList" :key="index">
          <div class="data" v-if="item.sendTime && isShowTime(index, index - 1)">{{ item.sendTime }}</div>
          <div :class="item.actorNo === contact[1] ? 'itemright' : 'itemleft'">
            <div class="avatar">
              <el-avatar v-if="!item.actor || !item.actor.actor.userAvatar" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
              <el-avatar v-else :src="item.actor.actor.userAvatar"></el-avatar>
            </div>
            <div class="textmain" v-if="item.type === 'message'">
              <div class="text">
                <span>{{ item.content }}</span>
              </div>
            </div>
            <div class="imagemain" v-else-if="item.type === 'image'">
              <div class="image">
                <el-image ref="img" title="查看原图" :style="getNewImg(item)" @error="imageLoadError" :src="item.fileUrl" :preview-src-list='[item.fileUrl]'></el-image>
              </div>
            </div>
            <div class="filemain" v-else-if="item.type === 'file'">
              <div class="file">
                <div class="file-card">
                  <div class="file-top">
                    <img style="margin-right: 10px;" v-if="item.fileStatus === '2'" :src="require('@/assets/file-icon-48/disable.png')"/>
                    <img style="margin-right: 10px;" v-else :src="require(`@/assets/file-icon-48/${getFileIcon(item.fileExt)}.png`)"/>
                    <div class="nowrap">
                      <span :title="item.fileName + (item.fileExt ? '.' +  item.fileExt : '')">{{ item.fileName + (item.fileExt ? '.' +  item.fileExt : '') }}</span>
                      <br/>
                      <span style="color: #606266;">{{ item.fileSize }}</span>
                    </div>
                  </div>
                  <div class="solid" v-if="item.fileStatus !== '0' || percentage === 0 || item.messageNo !== nowNo" style="border-bottom: 1px solid #e5e5e5;"></div>
                  <el-progress :percentage="percentage" v-else-if="item.fileStatus === '0' && item.messageNo === nowNo " :show-text="false" :stroke-width="4"></el-progress>
                  <div class="file-bottom">
                    <div class="bottom-left" style="line-height: 18px;">
                      <span v-if="item.fileStatus === '2'" style="color: #F56C6C">上传失败</span>
                      <span v-else-if="item.fileStatus === '0' && item.messageNo === nowNo">{{ `上传中... ${percentage}%` }}</span>
                      <span v-else-if="item.fileStatus === '0' && item.messageNo !== nowNo">等待上传</span>
                      <span v-else >已发送</span>
                    </div>
                    <div class="bottom-right" style="line-height: 18px;" v-if="item.fileStatus !== '2'">
                      <span class="pointer" @click="downloadFile(item)">下载</span>
                      <span class="pointer" @click="openFile(item)">打开</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="haveNew" v-if="showTag && notRead > 0">
      <div class="floatCard">
        <i class="el-icon-arrow-down" style="color: #409EFF;" @click="toEnd()"></i>
        <span style="font-size: 14px;color: #67C23A">&nbsp;&nbsp;{{notRead}}条新消息&nbsp;</span>
        <span style="color: #c9ced6;font-size: 16px;">|</span>&nbsp;
        <i class="el-icon-close" style="color: #909399;" @click="notToEnd()"></i>
      </div>
    </div>
    <div class="end">
      <div>
        <el-input
          type="textarea"
          :rows="4"
          id='textarea'
          style="font-size: 16px"
          v-model="textarea">
        </el-input>
      </div>
      <div style="padding-top: 10px;" class="emoji">
        <div class="left-icon">
          <el-popover
            placement="right"
            width="325px"
            trigger="click">
            <VEmojiPicker @select="selectEmoji" />
            <i title="选择表情" class="iconfont icon-xiaolian pointer" slot="reference" style="font-size: 25px"></i>
          </el-popover>
          <el-upload
            :auto-upload="false"
            action="http://localhost:8082/reg/system/file/upload"
            :show-file-list="false"
            :multiple="true"
            accept=".jpg,.jpeg,.png"
            :on-change="beforeUploadImg">
            <div><i title="发送图片" class="el-icon-picture-outline pointer" slot="reference" style="font-size: 25px;padding-left: 8px;"></i></div>
          </el-upload>
          <div @click="handleClickUploadButton"><i title="上传文件" class="el-icon-folder pointer"  slot="reference" style="font-size: 25px;padding-left: 8px;"></i></div>
          <input @input="onFileInputChanged" multiple style="display: none;" ref="fileSelector" type="file" />
        </div>
        <el-button type="primary" size="small" style="float:right" @click="sendMessage">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import "@/assets/icon/iconfont.css";

function wait(time) {
  return new Promise((resolve)=>setTimeout(resolve, time));
}

export default {
  props: {
    contact: {
      type: Array,
      default: false
    },
    actorName: {
      type: String,
      default: false
    }
  },
  watch: {
    messageList() {
      this.viewBox = this.$refs.box
      if(this.type === 'bottom') {
        this.refresh();
      } else if(this.type === 'now') {
        this.nofresh()
      }
    },
    uploadImageList(newValue, oldValue) {
      if(this.uploadImageList.length === 0) {
        return
      }
      // TODO 上传图片
      for(var i = 0; i < this.uploadImageList.length; i++) {
        this.uploadImage(this.uploadImageList[i])
      }
      // 清空上传图片列表
      this.uploadImageList = []
    },
  },
  mounted() {
    this.getMessageList()
    // 开启轮询查看是否有新消息
    window.timer = setInterval(() => {
      setTimeout(() => {
        let params = {}
        params.fromNo = this.contact[0]
        params.toNo = this.contact[1]
        params.afterTime = this.afterTime
        this.$postJson('/reg/system/message/list', params).then(res => {
          let resData = res.data
          if(resData.code === 200) {
            // 存在新数据
            if(resData.data.length > 0) {
              resData.data.sort((a, b) => {
                return Date.parse(a.sendTime) - Date.parse(b.sendTime)
              })
              this.showTag = true
              this.notRead += resData.data.length
              this.messageList = [...this.messageList, ...resData.data]
              this.afterTime = this.messageList[this.messageList.length - 1].sendTime
            }
          } else {
            this.$message.error(resData.msg)
          }
        })
      }, 600)
    }, 3000)
  },
  data() {
    return {
      uploading: false,
      fileSelector: null,
      textarea: '',
      messageList: [],
      afterTime: '',
      beforeTime: '',
      limit: 10,
      viewBox: '',
      type: 'bottom',
      loadData: false,
      isHistory: true,
      afterScrollHeigh: null,
      beforeScrollHeight: null,
      showTag: false,
      notRead: 0,
      uploadImageList: [],
      imgWidth: null,
      imgHeight: null,
      errorStyle: false,
      percentage: 0,
      activeIndex: 0,
      fileType: '',
      uploadFileList: [],
      uploadFileQueue: [],
      fileTimer: null,
      uploadNo: '',
      isUpload: false,
      nowNo: ''
    }
  },
  methods: {
    handleClickUploadButton() {
      this.$refs.fileSelector.click();
    },
    // 判断两个时间的时间差
    isShowTime(before, after) {
      if(after < 0) {
        return true
      }
      let beforeDate = new Date(this.messageList[before].sendTime)
      let afterDate = new Date(this.messageList[after].sendTime)
      let usedTime = beforeDate - afterDate
      let s = Math.floor(usedTime / 1000)
      if(s <= 120) {
        return false
      } else {
        return true
      }

    },
    // 下载文件
    downloadFile(item) {
      if(item.fileStatus === '0') {
        this.$message.error("文件未上传或正在上传，请等待文件上传完成")
        return
      }
      let params = {}
      params.folderName = item.actorNo
      params.fileName = item.fileName + (item.fileExt ? '.' + item.fileExt : '' )
      this.$download('/reg/system/file/download?fileName='+ params.fileName + '&folderName=' + params.folderName, {}, params.fileName)
    },
    // 打开文件
    openFile(item) {

    },
    // 获取文件图标
    getFileIcon(fileExt) {
      if(!fileExt) {
        return 'white'
      }
      fileExt = fileExt.toLowerCase()
      let codes = ['bin', 'hex', 'asm', 'c', 'obj', 'h', 'hpp', 'hxx', '.cpp', '.cc', '.cxx',
        '.c++', 'a', 'i', 'ii', 'm', 'o', 's', 'cs', 'java', 'class', 'php', 'pm', 'pl', 'py',
        'py3', 'pyc', 'py', 'vue', 'ts', 'md']
      if(codes.includes(fileExt)) {
        return 'code'
      } else if(['doc', 'docx'].includes(fileExt)) {
        return 'doc'
      } else if(['ppt', 'pptx'].includes(fileExt)) {
        return 'ppt'
      } else if(['xls', 'xlsx'].includes(fileExt)) {
        return 'xlsx'
      } else if(['zip', '7z'].includes(fileExt)) {
        return 'zip'
      } else if(fileExt === 'ai'){
        return 'ai'
      } else if(fileExt === 'annex') {
        return 'annex'
      } else if(fileExt === 'avi') {
        return 'avi'
      } else if(fileExt === 'css') {
        return 'css'
      } else if(fileExt === 'csv') {
        return 'csv'
      } else if(fileExt === 'dll') {
        return 'dll'
      } else if(fileExt === 'eps') {
        return 'eps'
      } else if(fileExt === 'gif') {
        return 'gif'
      } else if(fileExt === 'html') {
        return 'html'
      } else if(fileExt === 'jpg') {
        return 'jpg2'
      } else if(fileExt === 'mp4') {
        return 'mp4'
      } else if(fileExt === 'pdf') {
        return 'pdf'
      } else if(fileExt === 'png') {
        return 'png'
      } else if(fileExt === 'psd') {
        return 'psd'
      } else if(fileExt === 'txt') {
        return 'txt'
      } else if(fileExt === 'video') {
        return 'video'
      } else if(fileExt === 'waw') {
        return 'waw'
      } else {
        return 'white'
      }
    },
    // 获取文件名
    getFileName (name) {
      return name.substring(0, name.lastIndexOf("."))
    },
    // 只获取后缀名
    getExtension (name) {
      return name.substring(name.lastIndexOf(".")+1)
    },
    // toUpload
    toUpload(file, messageNo) {
      this.isUpload = true
      // 重置进度
      this.$get(`/reg/system/file/percent/reset/${'upload'}`)
      this.$get(`/reg/system/file/percent/${'upload'}`).then(res => {
          this.percentage = res.data.data
          if(this.percentage >= 100){
            this.percentage = 0
            clearInterval(fileTimer)
          }
        })
      let formData = new FormData()
      formData.append("file", file)
      // 查询进度条
      window.fileTimer = setInterval(() => {

      }, 100)
      // 发送文件
      this.$upload("/reg/system/file/upload",formData,function(progress) {
      }).then(res => {
        let param = {}
        if(res.data.code==200){
          this.percentage = 0
          param.fileUrl = res.data.data[0].filePath
          param.fileStatus = '1'
          param.messageNo = messageNo
          this.messageList.find(array => array.messageNo === messageNo).fileStatus = '1'
        } else {
          this.percentage = 0
          param.fileUrl = ''
          param.fileStatus = '2'
          param.messageNo = messageNo
          this.$message.error('上传失败，请重试')
          this.messageList.find(array => array.messageNo === messageNo).fileStatus = '2'
        }
        this.isUpload = false
        // 把获取到的路径添加到消息中，更新上传状态
        this.$postJson('/reg/system/message/updateFilePath', param)
      })
    },
    // 异步执行，发送文件之前，先发送一条消息，返回消息no
    async notifyFileMessage(file) { // return messageno
      console.log("执行发送消息：",file.name)
      // 创建请求接口的数据
      let params = {}
      // 设置发送人
      params.actorNo = this.contact[1]
      // 设置接收人
      params.receiverNo = this.contact[0]
      // 设置消息类型
      params.type = 'file'
      // 设置文件名称
      params.fileName = this.getFileName(file.name)
      // 设置文件大小
      params.fileSize = this.getFileSize(file.size)
      // 设置文件扩展名
      params.fileExt = this.getExtension(file.name)
      // 调用发送消息接口
      const messageNo = await this.$postJson('/reg/system/message/sendMessage', params).then(res => {
        let resData1 = res.data
        // 发送成功
        if(resData1.code === 200) {
          // 提示用户消息发送成功
          this.$message.success('发送成功')
          // 设置是否有新消息为false
          this.showTag = false
          // 设置未读数量为0
          this.notRead = 0
          // 设置此时类型为置底
          this.type = 'bottom'
          // 调用已读接口
          this.isread()
          // 返回消息no
          return resData1.data
        } else { // 发送失败
          // 告诉用户发送失败
          this.$message.error(resData1.msg)
          // 抛出错误
          throw new Error(resData1.msg);
        }
      })
      // 异步调用获取最新消息方法，实现消息同步
      await this.getNewMessage();
      // 打印消息no与消息队列
      console.log("发送消息执行完成，获取到消息no为",messageNo)
      console.log("此时的消息队列为",this.messageList)
      return messageNo
    },
    // 文件选择后,开始进行上传文件操作
    async onFileInputChanged(event) {
      // 判断是否有文件正在上传
      if(this.uploading) {
        this.$message.error('您有一个文件正在上传，请等待上传任务成功')
        return
      }
      // console.error("文件选择完毕", event.currentTarget.files)
      // 获取到文件
      const files = event.currentTarget.files;
      // 判断文件大小，超过200mb时不能上传
      for(let i=0;i<files.length;i++){
        if(files[i].size > 200 * 1024 * 1024){
          this.$message.error("文件不得超过200MB");
          return;
        }
      }
      // 创建文件上传列表
      const tasks = [];
      // 将选择的文件加入到上传列表中
      for(let i=0;i<files.length;i++){
        tasks.push({file: files[i]})
      }
      // 调用创建文件上传请求方法
      await this.createUploadingRequest(tasks);
    },
    // 异步执行文件上传方法
    async createUploadingRequest(tasks) {
      // console.error("执行任务列表：", tasks);
      // 在控制台打印任务执行情况
      console.log("执行上传任务，任务列表：", tasks)
      // 将上传状态设置为true
      this.uploading = true;
      // 设置文件上传队列
      const queue = tasks;
      // 如果说队列中存在文件，则取出第一个文件，直到该队列为空时停止
      while(queue.length > 0) {
        const {file} = queue.shift();
        try{
          // 尝试执行将文件上传到服务器
          await this.sendFileByNetwork(file);
        }catch(err){
          // 捕捉异常，当文件上传失败时抛出错误
          console.error("上传时发生错误", err);
        }
        // 每次操作完成后等到100毫秒，防止执行速度过快
        await wait(100);
      }
      // 文件上传任务队列为空，此时没有文件的上传任务，将上传状态置为false
      this.uploading = false;
      // 提示用户，文件已经全部上传完毕
      this.$message.info('文件全部上传完毕！');
    },
    // 异步执行上传文件到服务器方法，入参为文件
    async sendFileByNetwork(file) {
      // 调用发送信息方法，先发送信息给对象，此时文件并未上传完毕。返回消息no
      const messageNo = await this.notifyFileMessage(file);
      // 控制台打印文件名称与消息no
      console.log("执行上传文件,文件与消息no分别为",file.name,messageNo)
      // 设置当前发送文件消息的no
      this.nowNo = messageNo
      // 异步执行接口，先将上传进度清零
      await this.$get(`/reg/system/file/percent/reset/${'upload'}`);
      // 开启轮询，循环时间为每隔100ms一次
      const progressUploadingTimer = setInterval(() => {
        // 调用获取文件上传进度接口，返回当前文件的上传进度，初始化为0
        this.$get(`/reg/system/file/percent/${'upload'}`).then(res => {
          // 在当前消息队列中找到当前发送文件的消息
          const messageItem = this.messageList.find(array => array.messageNo === messageNo);
          // console.error("进度", messageNo, res.data.data);
          // 设置进度条中的文件上传进度
          this.percentage = res.data.data;
          // 设置发送文件的消息的文件上传进度
          messageItem.percentage = res.data.data;
        })
      }, 100);
      // 创建FormData数据类型，准备上传文件
      const formData = new FormData()
      // 加入文件
      formData.append("file", file)
      // 加入消息no
      formData.append("messageNo", messageNo);
      // 尝试调用上传文件接口
      try{
        // 异步调用上传文件接口
        const res = await this.$upload("/reg/system/file/upload",formData);
        let param = {}
        // 如果返回的状态为200，则说明文件上传成功
        if(res.data.code==200){
          // 设置进度条归零
          this.percentage = 0
          // 设置将要给消息新增的文件信息，设置文件路径
          param.fileUrl = res.data.data[0].filePath
          // 设置文件上传状态为成功
          param.fileStatus = 1
          // 设置消息no
          param.messageNo = messageNo
          // console.error("消息：", messageNo);
          // 找到当前上传文件的消息，将发送状态手动置为成功
          this.messageList.find(array => array.messageNo === messageNo).fileStatus = '1'
          // console.error(this.messageList.find(array => array.messageNo === messageNo))
          // console.error("上传成功：", res);
        } else { // 上传文件失败
          // 设置进度条归零
          this.percentage = 0
          // 设置文件路径
          param.fileUrl = ''
          // 设置文件上传状态为失败
          param.fileStatus = 2
          // 设置消息no
          param.messageNo = messageNo
          // 提示用户上传失败
          this.$message.error('上传失败，请重试')
          // 找到当前上传文件的消息，将发送状态手动置为失败
          this.messageList.find(array => array.messageNo === messageNo).fileStatus = '2'
        }
        // 调用接口，增加消息中的文件发送信息
        await this.$postJson('/reg/system/message/updateFilePath', param)
      }catch(err){ // 捕捉错误
        console.error("请求文件上传发送错误:", err);
      }
      // 文件上传完毕，清除轮询事件
      // this.percentage = 100;
      clearInterval(progressUploadingTimer);
    },
    // 获取文件大小
    getFileSize(fileSize) {
      if (fileSize < 1024) {
        return fileSize + 'B';
      } else if (fileSize < (1024*1024)) {
        var temp = fileSize / 1024;
        temp = temp.toFixed(2);
        return temp + 'KB';
      } else if (fileSize < (1024*1024*1024)) {
        var temp = fileSize / (1024*1024);
        temp = temp.toFixed(2);
        return temp + 'MB';
      } else {
        var temp = fileSize / (1024*1024*1024);
        temp = temp.toFixed(2);
        return temp + 'GB';
      }
    },
    // 图片加载失败触发
    imageLoadError(e) {
      this.errorStyle = true
    },
    // 压缩图片
    getNewImg(item) {
      let height = parseFloat(item.height)
      let width = parseFloat(item.width)
      if(!item.fileUrl || height <=0 || width <=0) {
          return {
          'height': 150 + 'px',
          'width': 200 + 'px',
          'border': '1px solid #e5e5e5'
        }
      }
      let ratio = height > width ? height / width : width / height
      if(width > 350 && width <= 500) {
        ratio = ratio * 1.2
      } else if(width > 500 && width <= 1000) {
        ratio = ratio * 1.5
      } else if(width > 1000 && width <= 1500) {
        ratio = ratio * 2
      } else {
        ratio = ratio * 2.5
      }
      height = height / ratio
      width = width / ratio
      return {
        'height': height + 'px',
        'width': width + 'px',
        'border': '1px solid #e5e5e5'
      }
    },
    // 发送图片之前
    beforeUploadImg(file) {
      let fileSize = file.size / 1024 / 1024;
      fileSize = Math.floor(fileSize * 1000) / 1000; // 小数取整后三位
      const isLt20M = fileSize < 20;
      if(!isLt20M) {
        this.$message.error('上传图片大小不能超过20MB!');
        return false
      }
      this.uploadImageList.push(file)
    },
    // 发送图片
    uploadImage(file) {
      let img = file.raw
      let types = ['image/jpeg', 'image/jpg', 'image/png'];
      const isImage = types.includes(img.type);
      if(!isImage) {
        this.$message.error('上传图片只能是 JPG、JPEG、PNG 格式!');
        return false
      } else {
        let reader = new FileReader();
        reader.readAsDataURL(file.raw);
        reader.onload = () => {
           // 让页面中的img标签的src指向读取的路径
           let img = new Image();
           img.src = reader.result;
           // 浏览器中存在缓存
           if (img.complete) {
             this.imgWidth = img.width
             this.imgHeight = img.height
           } else {
             img.onload = () => {
                this.imgWidth = img.width
                this.imgHeight = img.height
             }
           }
        }
        this.uploadFiles(file.raw, 'image')
        return true
      }
    },
    // 上传文件
    uploadFiles(file, type) {
      let formData = new FormData()
      formData.append("file", file)
      this.fileType = type
      this.$upload("/reg/system/file/upload",formData,function(progress) {
        // console.log(Number(Math.floor(progress.loaded / progress.total * 100).toFixed(0)))
      }).then(res => {
        let resData = res.data
        if(resData.code === 200) {
          let data = resData.data[0]
          let params = {}
          params.actorNo = this.contact[1]
          params.receiverNo = this.contact[0]
          params.type = type
          params.fileUrl = data.filePath
          params.fileName = data.fileNameNotExt
          params.fileSize = data.fileSize
          params.fileExt = data.fileExt
          if(type === 'image') {
            params.width = this.imgWidth
            params.height = this.imgHeight
          }
          this.$postJson('/reg/system/message/sendMessage', params).then(res => {
            let resData1 = res.data
            if(resData1.code === 200) {
              this.$message.success('发送成功')
              this.showTag = false
              this.notRead = 0
              this.type = 'bottom'
              this.getNewMessage()
              this.isread()
            } else {
              this.$message.error(resData1.msg)
            }
          })
        } else {
          this.$message.error('上传失败，原因为：' + resData.msg)
        }
      })
    },
    // 更新已读状态
    isread() {
      let params = {}
      params.actorNo = this.contact[0]
      params.receiverNo = this.contact[1]
      this.$postJson('/reg/system/message/updateReadStatus', params).then(res => {})
      console.log("发送消息后，更新已读未读")
    },
    // 点击回到底部
    toEnd() {
      this.notRead = 0
      this.showTag = false
      this.refresh()
      this.isread()
    },
    // 点击x号
    notToEnd() {
      this.showTag = false
    },
    // 位置不变
    nofresh() {
      setTimeout(() => {
        this.afterScrollHeight = this.viewBox.scrollHeight - this.beforeScrollHeight;
        this.viewBox.scrollTop = this.afterScrollHeight;
      }, 100)
    },
    // 置底
    refresh() {
      let top = this.viewBox.scrollTop
      let scrollHeight = this.viewBox.scrollHeight
      // 分段
      let dist = Math.floor(scrollHeight / 10) + 1
      window.timer1 = setInterval(() => {
        if(top >= this.viewBox.scrollHeight) {
          clearInterval(timer1)
          this.type = "other"
        }
        top += dist;
        this.viewBox.scrollTop = top
      }, 20)
    },
    // 到底部时触发的事件
    scrollBottom(e) {
      this.type = 'other'
      let self = this
      let Scroll = e.target
      let scrollHeight = Scroll.scrollHeight - Scroll.clientHeight
      self.scrollTop = Scroll.scrollTop
      if(scrollHeight - Scroll.scrollTop < 50 && this.notRead > 0) {
        this.showTag = false
        this.notRead = 0
        this.isread()
      }
    },
    // 发送消息
    sendMessage() {
      let params = {}
      params.actorNo = this.contact[1]
      params.receiverNo = this.contact[0]
      params.content = this.textarea
      params.type = 'message'
      this.$postJson('/reg/system/message/sendMessage', params).then(res => {
        let resData = res.data
        if(resData.code === 200) {
          this.$message.success('发送成功')
          this.textarea = ''
          this.showTag = false
          this.notRead = 0
          this.type = 'bottom'
          this.getNewMessage()
          this.isread()
        } else {
          this.$message.error(resData.msg)
        }
      })
    },
    // 获取最新消息
    getNewMessage() {
      let params = {}
      params.fromNo = this.contact[0]
      params.toNo = this.contact[1]
      params.afterTime = this.afterTime
      return this.$postJson('/reg/system/message/list', params).then(res => {
        let resData = res.data
        if(resData.code === 200) {
          // 存在新数据
          if(resData.data.length > 0) {
            resData.data.sort((a, b) => {
              return Date.parse(a.sendTime) - Date.parse(b.sendTime)
            })
            this.messageList = [...this.messageList, ...resData.data]
            this.afterTime = this.messageList[this.messageList.length - 1].sendTime
            console.log("获取到最新消息后的队列为,", this.messageList)
          }
        } else {
          this.$message.error(resData.msg)
        }
      })
    },
    // 获取历史消息
    getHistoryMessage() {
      let params = {}
      params.fromNo = this.contact[0]
      params.toNo = this.contact[1]
      params.beforeTime = this.beforeTime
      params.limit = this.limit
      this.loadData = true
      this.beforeScrollHeight = this.viewBox.scrollHeight;
      this.$postJson('/reg/system/message/list', params).then(res => {
        let resData = res.data
        if(resData.code === 200) {
          // 存在新数据
          if(resData.data.length > 0) {
            resData.data.sort((a, b) => {
              return Date.parse(a.sendTime) - Date.parse(b.sendTime)
            })
            this.messageList = [...resData.data, ...this.messageList]
            this.beforeTime = this.messageList[0].sendTime
            this.type = 'now'
          } else {
            this.isHistory = false
          }
        } else {
          this.$message.error(resData.msg)
        }
        this.loadData = false
      })
    },
    // 获取消息列表
    getMessageList() {
      let params = {}
      params.fromNo = this.contact[0]
      params.toNo = this.contact[1]
      params.limit = this.limit
      this.$postJson('/reg/system/message/list', params).then(res => {
        let resData = res.data
        if(resData.code === 200) {
          resData.data.sort((a, b) => {
            return Date.parse(a.sendTime) - Date.parse(b.sendTime)
          })
          this.messageList = resData.data
          this.afterTime = this.messageList[this.messageList.length - 1].sendTime
          this.beforeTime = this.messageList[0].sendTime
        } else {
          this.$message.error(resData.msg)
        }
      })
    },
    // 返回
    back() {
      this.messageList = []
      this.afterTime = ''
      this.beforeTime = ''
      this.uploadFileList = []
      clearInterval(timer)
      this.$emit("isBack", false)
    },
    selectEmoji(emoji) {
      let input = document.getElementById("textarea")
      let startPos = input.selectionStart
      let endPos = input.selectionEnd
      let resultText = input.value.substring(0, startPos) + emoji.data + input.value.substring(endPos)
      input.value = resultText
      input.focus()
      input.selectionStart = startPos + emoji.data.length
      input.selectionEnd = startPos + emoji.data.length
      this.textarea = resultText;
    }
  }
}
</script>

<style lang="scss" scoped>
.back {
  font-weight: bold;
  cursor: pointer;
}
.msg-main {
  height: 430px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 40px;
  border-left: 1px solid #ededed;
  border-right: 1px solid #e5e5e5;
  border-top: 1px solid #e5e5e5;
  margin-top: 10px;

}
.end {
  padding: 16px 40px 12px;
  background: #fcfcfc;
  border-top: 1px solid #f2f2f2;
}
.data {
  height: 14px;
  margin: 0 auto;
  padding: 20px 0 0;
  color: #888;
  text-align: center;
  line-height: 14px;
}
.itemleft {
  display: inline-flex;
  width: 100%;
  margin-top: 10px;
  margin-left: 10px;
  .avatar {
    display: flex;
    align-items: center;
    padding-right: 20px;
    >>> .el-avatar {
      width: 50px;
      height: 50px;
      line-height: 50px;
    }
  }
  .textmain {
    background: #f4f4f4;
    border-radius: 8px;
    .text {
      padding: 20px 20px;
    }
  }
  .filemain {
    background-color: #79ace5;
    width: 300px;
    border-radius: 8px;
    .file {
      padding: 10px;
      .file-card {
        background: #fff;
        border-radius: 4px;
        .file-top {
          display: flex;
          line-height: 22px;
          font-size: 14px;
          padding: 12px;
        }
        .file-bottom {
          padding: 8px 12px;
          display: flex;
          justify-content: space-between;
          background: #fcfcfc;
          font-size: 14px;
        }
      }
    }
  }
}
.itemright {
  width: 100%;
  margin-top: 10px;
  display: inline-table;
  .avatar {
    display: flex;
    align-items: center;
    padding-left: 20px;
    float: right;
    >>> .el-avatar {
      width: 50px;
      height: 50px;
      line-height: 50px;
    }
  }
  .textmain {
    background-color: #79ace5;
    color: #fff;
    border-radius: 8px;
    display: inline-block;
    float: right;
    .text {
      padding: 20px 20px;
    }
  }
  .imagemain {
    display: inline-block;
    float: right;
    // border: 1px solid #e5e5e5;
  }
  .filemain {
    background-color: #79ace5;
    width: 300px;
    border-radius: 8px;
    display: inline-block;
    float: right;
    .file {
      padding: 10px;
      .file-card {
        background: #fff;
        border-radius: 4px;
        .file-top {
          display: flex;
          line-height: 22px;
          font-size: 14px;
          padding: 12px;
        }
        .file-bottom {
          padding: 8px 12px;
          display: flex;
          justify-content: space-between;
          background: #fcfcfc;
          font-size: 14px;
        }
      }
    }
  }
}
.more {
  text-align: center;
  margin-top: 10px;
}
.u-scroll1::-webkit-scrollbar {
  width: 8px;
}
.u-scroll1::-webkit-scrollbar-button, .u-scroll1::-webkit-scrollbar-corner {
  display: none;
}
.u-scroll1::-webkit-scrollbar-button, .u-scroll1::-webkit-scrollbar-corner {
  display: none;
}
.u-scroll1::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: #e9e9e9;
}
.u-scroll1::-webkit-scrollbar-track {
  background: rgba(0,0,0,0);
}
.no-history {
  margin: 0 auto;
  width: 130px;
  height: 28px;
  line-height: 28px;
  background-color: #e5e5e5;
  border-radius: 25px;
  font-size: 14px;
}
.haveNew {
  width: 150px;
  height: 40px;
  border: 1px solid #e5e5e5;
  border-radius: 3px;
  text-align: center;
  margin-left: 8px;
  position: absolute;
   bottom: 170px;
  .floatCard {
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    background: #fefefe;
  }
}
.pointer {
  cursor: pointer;
}
.pointer:hover {
  color: #409EFF;
}

.not-allowed {
  cursor: not-allowed;
}

.emoji-picker {
  background-color: #fff !important;
  border: none !important;
}
.left-icon {
  display: inline-flex;
}
.noSelect {
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
}
.nowrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
