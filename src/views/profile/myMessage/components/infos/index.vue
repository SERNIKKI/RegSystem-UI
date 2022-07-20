<template>
  <div class="notifi">
    <el-row style="margin-bottom: 10px;">
      <el-col :span="8">
        <el-input placeholder="通知搜索..." v-model="searchName">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="16" class="right" style="text-align: right;padding-top:5px">
        <el-button :disabled="notifyCount === 0" size="small" icon="el-icon-reading" type="primary" @click="toRead" plain>一键已读</el-button>
      </el-col>
    </el-row>
    <div class="notify-main">
      <div class="message-item" v-for="(item, index) in notifyList" :key="index" @mouseover="hoverIndex = index" @mouseout="hoverIndex = -1">
        <el-row :gutter="20">
          <el-col :span="1.5" class="avatar">
            <el-avatar class="user-avatar" :src="'http://reg-system-oss.oss-cn-beijing.aliyuncs.com/file/202203324438851384400/notifyAvatar.png'"></el-avatar>
          </el-col>
          <el-col :span="19">
            <div class="title">
              <span class="line-text" style="font-weight: 600;">{{ item.notifyTitle }}
              </span>
              <span style="color: #909399;">
                {{ '[' + item.notifyType + ']' }}
              </span>
              <el-badge style="top: -3px;left: 3px;" is-dot v-if="item.isRead === '0'"></el-badge>
            </div>
            <div v-if="item.notifyType === '审批单回执'" v-html="item.notifyContent"></div>
            <div class="content">
              <span class="line-text text-color">{{ item.sendTime }}</span>
            </div>
          </el-col>
          <el-col :span="3" class="time" :style="hoverIndex === index ? '' : 'display: none'">
            <div>
              <span class="line-text primary p-r-10 pointer" @click="openNotify(item, item.systemNo)">查看详情</span>
              <span class="line-text danger pointer" @click="deleteNotify(item.systemNo)">删除</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="loading" v-if="total > mainNotifyList.length">
        <div class="text" @click="loadingMore">
          <i class="el-icon-loading" v-if="loading"></i>
          加载更多</div>
      </div>
    </div>
    <el-dialog class="dialog" :visible.sync="notifyDialog" top="5vh" width="60%" :before-close="handleInfoClose">
      <div slot="title" class="header">通&nbsp;&nbsp;知</div>
      <div class="notifyMain">
        <div class="title">{{ notifyInfo.notifyTitle }}</div>
        <div class="contact">
          <div v-html="notifyInfo.notifyContent"></div>
        </div>
      </div>
    </el-dialog>
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
    // // 开启轮询，每隔5s查询一次讯息列表
    // window.timer = setInterval(() => {
    //   setTimeout(() => {
    //     this.initPage();
    //   }, 600)
    // }, 5000)
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
          if(item.notifyTitle.indexOf(newValue) !== -1) {
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
      openMessage: false,
      contact: [],
      notifyList: [],
      total: 0,
      pagination: {
        pageSize: 10,
        pageNum: 1
      },
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
      notifyInfo: {},
      notifyDialog: false,
      hoverIndex: -1,
      mainNotifyList: [],
      notifyCount: 0
    }
  },
  methods: {
    toRead() {
      this.$get(`/reg/system/notify/batchRead/${this.userNo}`).then((res => {
        if(res.data.code === 200) {
          this.initPage()
          this.$message.success("成功")
        }
      }))
    },
    // 是否有新通知
		getNewNotifyCount() {
			this.$get(`/reg/system/notify/count/${this.userNo}`).then(res => {
				const resData = res.data
				if(resData.code === 200) {
					this.notifyCount = resData.data
				} else {
					this.$message.error(resData.msg);
				}
			})
		},
    loadingMore() {
      this.pagination.pageNum++
      this.initPage()
    },
    handleInfoClose() {
      this.notifyDialog = false
      setTimeout(() => {
        this.notifyInfo = {}
      }, 300)
    },
    deleteNotify(systemNo) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$get(`/reg/system/notify/deleteByUser/${systemNo}`).then(res => {
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
      let params = {}
      params.notifyObject = this.userNo
      params.pageNum = this.pagination.pageNum;
      params.pageSize = this.pagination.pageSize;
      this.$postJson('/reg/system/notify/listByUser', params).then(res => {
        if(res.data.code === 200) {
          this.total = res.data.data.totalSize
          this.notifyList = res.data.data.content
          this.mainNotifyList = res.data.data.content
          this.getNewNotifyCount()
        } else {
          this.$message.error(res.data.msg)
        }
        this.loading = false
      })
    },
    setDate(value) {
      return timeago(value)
    },
    search() {

    },
    openNotify(item, systemNo) {
      item.isRead === '1'
      if(item.notifyType === '审批单回执') {
        this.$router.push('/profile/myApproval')
      } else {
        this.$get(`/reg/system/notify/info/${systemNo}`).then(res => {
          let resData = res.data
          if(resData.code === 200) {
            this.notifyInfo = resData.data
            this.notifyDialog = true
          } else {
            this.$message.error(resData.msg)
          }
        })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.notify-main {
  height: 700px;
  overflow-y: auto;
  overflow-x: hidden;
}
.message-item {
  padding: 15px 10px;
  border-bottom: 1px solid #e5e5e5;
}
.message-item:hover {
  background: rgba(0,0,0,.03);
}
.time {
  text-align: right;
  display: flex;
  align-items: center;
  height: 50px;
  justify-content: flex-end;
}
.text-color {
  color: #8c92a4;
}
.user-avatar {
  width: 50px;
  height: 50px;
  background: #fff
}
.notifyMain {
  width: 85%;
  margin: 0 auto;
  .title {
    width: 100%;
    text-align: center;
    font-size: 20px;
  }
}
.dialog {
  .header {
    font-size: 20px;
    text-align: center;
  }
  >>> .el-dialog__header {
    background-color: #2faf98;
    color: #fff;
  }
  >>> .el-icon-close:before {
    color: #fff;
  }
}
.loading {
  width: 100%;
  height: 40px;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  .text {
    width: 105px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    background-color: #DCDFE6;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
  }
  .text:hover {
    color: #66b1ff;
    text-decoration: underline;
  }
  .text:focus {
    color: #66b1ff;
    text-decoration: underline;
  }
  .text:active {
    color: #3a8ee6;
    text-decoration: underline;
  }
}
</style>