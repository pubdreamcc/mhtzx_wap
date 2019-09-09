<template>
  <div class="loadingPage">
    <div class="loading">
      <div class="img-wrapper">
        <img src="../../assets/img/notFind.png" alt="">
      </div>
      <p class="no-text">
        正在加载中，请稍后...
      </p>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .loadingPage{
    position:relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: #fff;
  }
  .loading{
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%, -80%);
  }
  .img-wrapper{
    text-align:center;
    img{
      height:300px;
    }
  }
  .no-text{
    font-size:30px;
    text-align:center;
  }
  #header{
    background:#fff;
  }
  #header #header-left{
    color:#000;
  }
</style>

<script>
  export default {
    name: 'loading',
    data () {
      return {
      };
    }
  };
</script>
