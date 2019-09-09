<template>
  <div id="header">
    <span class="header-left" v-if="backShow" tapmode="" @click="goBack">
      <span class="iconfont icon-iconfonticonfont10shanchu"></span>
    </span>
    <span class="header-left" @click="leftClick" v-else>
      <slot name="left"></slot>
    </span>
    <div id="header-title">
      <slot class="header-title" name="title">标题</slot>
    </div>
    <div id="span-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: '',
    props: {
      backShow: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {};
    },
    methods: {
      goBack () {
        if (this.$route.query.goindex === 'true') {
          this.$router.push('/');
        } else {
          this.$router.back(-1);
        }
      },
      leftClick () {
        this.$emit('leftCallBack');
      }
    }
  };
</script>

<style lang="less">
  #header {
    position: relative;
    width: 100%;
    height: 88px;
    line-height: 88px;
    background: #d73a31;
    #header-title *{
      font-size: 30px;
      text-align: center;
      color: #ffffff;
      font-weight: 700;
    }
    .header-left {
      position: absolute;
      left: 0;
      padding: 0 12px;
      color: #ffffff;
      font-size: 24px;
      * {
        font-size: 26px;
        padding: 0 30px 0 20px;
      }
      .iconfont {
        font-size: 36px;
        padding:0 25px 0 0;
      }
    }
    #span-right{
      position: absolute;
      padding: 0 20px 0 30px;
      color: #ffffff;
      font-size: 24px;
      top: 0;
      right: 0;
    }
  }
</style>


