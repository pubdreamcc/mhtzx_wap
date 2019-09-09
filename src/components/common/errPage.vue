<template>
  <div class="errPage">
    <div class="err">
      <div class="img-wrapper">
        <img src="../../assets/img/notFind.png" alt="">
      </div>
      <p class="no-text">
        很抱歉，您要访问的页面不存在！
      </p>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'errPage',
    data () {
      return {};
    }
  };
</script>
<style lang="less" scoped>
  .errPage{
    position:relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  .err{
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
