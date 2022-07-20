<template>
  <div class="title">
    <div class="page-title">
      <span class="span">{{ title }}</span>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "PageTitle",
  props: {
    title: {
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  padding: 10px 0;
  border-bottom: 1px solid #f1f1f1;
  .page-title {
    font-size: 16px;
    line-height: 16px;
    color: #101010;
    font-weight: bold;
    // border-left: 5px #101010  solid;
    // text-indent: 10px;
    &::before {
      content: "";
      background-color: #101010;
      width: 4px;
      height: 18px;
      position: relative;
      top: 3px;
      border-radius: 6px;
      display: inline-block;
      margin-right: 8px;
    }
    .span{
      margin-right: 10px;
    }
  }
}
</style>
