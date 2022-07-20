<template>
  <div class="preview-main">
    <div class="preview">
      <el-carousel trigger="click" height="450px">
        <el-carousel-item v-for="(item, index) in previewList" :key="index">
          <div style="position: relative;display: block;" @click="toPage(item)">
            <el-image :src="item.previewImage"></el-image>
            <div class="preview-text">{{ item.previewTitle }}</div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    previewList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      list: this.previewList
    }
  },
  methods: {
    toPage(item) {
      if(item.previewLink && item.previewLink !== '') {
        console.log('跳转页面')
      } else {
        console.log('不跳转页面')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-text {
  position: absolute;
  right: 10px;
  bottom: 0;
  font-family: Arial,Tahoma,"Microsoft YaHei","SimSun";
  left: 10px;
  line-height: 100px;
  font-size: 23px;
  height: 100px;
  color: white;
  background: rgba(101, 101, 101, 0.6);
}
.preview-main {
  text-align: -webkit-center;
  display: block;
  margin: 0 auto;
  height: 500px;
  width: 100%;
}
.preview {
  cursor: pointer;
  height: 450px;
  width: 1000px;
}
</style>