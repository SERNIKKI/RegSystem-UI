<template>
  <div class="notifi" v-if="!openMessage">
    <el-row style="margin-bottom: 10px;">
      <el-col :span="8">
        <el-input placeholder="私信搜索..." v-model="searchName">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="8" class="p-l-10">
        <el-button @click="selectUser" type="primary" plain :loading="loading">选择联系人</el-button>
      </el-col>
    </el-row>
    <div class="message-main">
    <div class="message-item" @click="openMsgPage(item.actorNo, item.actor.actor.userName)" v-for="(item, index) in notifyList" :key="index">
      <el-row :gutter="20">
        <el-col :span="1.5" class="avatar">
          <el-badge :value="item.notRead" class="item" v-if="item.notRead > 0 && item.isRead === 0">
            <el-avatar class="user-avatar" :src="item.actor.actor.userAvatar ? item.actor.actor.userAvatar : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"></el-avatar>
          </el-badge>
          <el-avatar v-else class="user-avatar" :src="item.actor.actor.userAvatar ? item.actor.actor.userAvatar : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"></el-avatar>
        </el-col>
        <el-col :span="19">
          <div class="title">
            <span class="line-text">{{ item.actor.actor.userName + 
              (item.actor.actor.userRealName ? "(" + item.actor.actor.userRealName + ")" : '')}}
            </span>
            <span v-if="item.actor.actor.userType === 'admin'" style="color: #909399;">
              [管理员]
            </span>
            <span v-else-if="item.actor.actor.userType === 'doctor'" style="color: #909399;">
              [医生]
            </span>
            <span v-else style="color: rgb(63 127 255);" class="bold">
              [患者]
            </span>
          </div>
          <div class="content">
            <span class="line-text text-color" v-if="item.type === 'message'">{{ item.content }}</span>
            <span class="line-text text-color" v-else-if="item.type === 'image'">[图片]</span>
            <span class="line-text text-color" v-else-if="item.type === 'file'">[文件] {{ item.fileName + '.' + item.fileExt }}</span>
          </div>
        </el-col>
        <el-col :span="3" class="time">
          <div><span class="line-text text-color">{{ setDate(item.sendTime) }}</span></div>
        </el-col>
      </el-row>
    </div>
    </div>
    <el-dialog :visible.sync="showDialog" title="选择联系人" top="5vh">
      <el-cascader
        v-model="selecter"
        :options="userList"
        @change="handleChange"></el-cascader>
      <!-- <el-tree
        show-checkbox
        node-key="value"
        :data="userList"
        ref="tree"
        :props="defaultProps"
        highlight-current
        :default-checked-keys="checkedKeys"
        @check="handleCheckChange"
        >
      </el-tree> -->
      <div style="text-align: right;margin-top: 10px">
        <el-button type="primary" @click="onSubmit">确认</el-button>
        <el-button  @click="handleClose" >取消</el-button>
      </div>
    </el-dialog>
  </div>
  <div v-else class="messages">
    <message @isBack="closeMsgPage" :contact="contact" :actorName="actorName"></message>
  </div>
</template>

<script>
import Message from '@/views/profile/myMessage/components/message'
import timeago from '@/utils/date'
export default {
  props: {
    userNo: {
      type: String,
      default: false
    }
  },
  created() {
    this.initPage();
    this.getUserList();
    // 开启轮询，每隔5s查询一次讯息列表
    window.timer = setInterval(() => {
      setTimeout(() => {
        this.initPage();
      }, 600)
    }, 5000)
  },
  components: {
    Message
  },
  watch: {
    searchName: function(newValue, oldValue) {
      if(newValue === '') {
        this.notifyList = this.mainNotifyList
      } else {
        let list = []
        this.mainNotifyList.forEach((item) => {
          if(item.actor.actor.userName.indexOf(newValue) !== -1 || (item.actor.actor.userRealName && item.actor.actor.userRealName.indexOf(newValue) !== -1)) {
            list.push(item)
          }
        })
        this.notifyList = list
      }
    }
  },
  data() {
    return {
      searchName: '',
      messages: null,
      openMessage: false,
      contact: [],
      notifyList: [],
      actorName: '',
      userList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      checkedKeys: [],
      loading: false,
      showDialog: false,
      selectList: [],
      selecter: '',
      mainNotifyList: []
    }
  },
  methods: {
    handleChange(value) {
      this.selecter = value[value.length - 1]
    },
    onSubmit() {
      // 判断选择的联系人是否已存在
      try {
        this.notifyList.forEach((item) => {
        if(item.actorNo === this.selecter) {
          return new Error("Repeat users")
        }
      })
      } catch(e) {
        if(e.message === 'Repeat users') {
          this.$message.error("重复的用户！")
          return
        }
      }
      this.handleClose()
      this.openMsgPage(this.selecter, this.selecter)
    },
    handleClose() {
      this.showDialog = false
    },
    // 对选择的数据进行处理
    handleCheckChange(data, select) {
      // console.log(select)
      // console.log(select.checkedKeys)
      this.selectList = []
      const childList = select.checkedNodes
      for(var i = 0; i < childList.length; i++) {
        if(childList[i].children === null) {
          this.selectList.push(childList[i].value)
        }
      }
    },
    selectUser() {
      this.showDialog = true
    },
    getUserList() {
      this.loading = true
      this.$get('/reg/system/user/totalUser').then((res) => {
        const resData = res.data
        if(resData.code === 200) {
          this.loading = false
          let array = resData.data[1].children
          // 处理数据，判断是否有用户
          for(var i = 0; i < array.length; i++) {
            let array2 = array[i].children
            for(var k = 0; k < array2.length; k++) {
              let array3 = array2[k].children
              if(!(array3 && array3.length > 0)) {
                resData.data[1].children[i].children[k].disabled = true
              }
            }
          }
          this.userList = resData.data
        } else {
          this.$message.error("获取用户信息失败，原因为：" + resData.msg)
        }
      })
    },
    initPage() {
      this.$get(`/reg/system/message/notifyList/${this.userNo}`).then(res => {
        let resData = res.data
        if(resData.code === 200) {
          this.notifyList = resData.data
          this.mainNotifyList = resData.data
        } else {
          this.$message.error(resData.msg)
        }
      })
    },
    setDate(value) {
      return timeago(value)
    },
    search() {

    },
    openMsgPage(value, name) {
      let params = {}
      params.actorNo = value
      params.receiverNo = this.userNo
      this.$postJson('/reg/system/message/updateReadStatus', params).then(res => {
        let resData = res.data
        if(resData.code === 200) {
          this.contact = [value, this.userNo]
          this.openMessage = true
          this.actorName = name
        } else {
          this.$message.error(resData.msg)
        }
      })
    },
    closeMsgPage(value) {
      this.openMessage = value
      this.initPage()
    }
  }
}
</script>

<style lang="scss" scoped>
.message-item {
  padding: 15px 10px;
  border-bottom: 1px solid #e5e5e5;
  cursor: pointer;
}
.message-item:hover {
  background: rgba(0,0,0,.03);
}
.time {
  text-align: right;
}
.text-color {
  color: #8c92a4;
}
.user-avatar {
  width: 50px;
  height: 50px;;
}
.message-main {
  height: 700px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>