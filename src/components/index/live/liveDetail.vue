<template>
  <div id="liveDetail">
    <vHeader>
      <div slot="title">视频播放</div>
    </vHeader>
    <video  :src="liveUrl" :poster="require('../../../assets/img/no_live_img.png')" controls autoplay  preload="auto"></video>
  </div>
</template>

<style lang="less" scoped>
  video{width: 100%;margin-top: 3rem;}
</style>

<script>
  import header from '../../common/header';
  export default {
    name: '',
    data () {
      return {
        // liveUrl: 'http://10.1.129.50/file/upload/video/4a41480368774c55ab823bf8ec8018ca.mp4'
        liveUrl: this.$route.params.liveUrl
      };
    },
    components: {
      vHeader: header
    }
  };
</script>
