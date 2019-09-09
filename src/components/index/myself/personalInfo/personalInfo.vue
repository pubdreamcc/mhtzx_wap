<template>
  <div id="personalInfo">
    <v-header>
      <div slot="title">个人信息</div>
    </v-header>
    <div class="avatar info">
      <span class="avatar-text">头像</span>
      <img src="../../../../assets/img/default_photo.png" alt="">
    </div>
    <div class="info1 info">
      <p>
        <span>姓名</span>
        <span>{{baseInfo.userName}}</span>
      </p>
      <p>
        <span>身份证号</span>
        <span>{{baseInfo.card}}</span>
      </p>
      <p>
        <span>专业</span>
        <span>{{baseInfo.specialtyName}}</span>
      </p>
      <p>
        <span>账号</span>
        <span>{{baseInfo.userAccount}}</span>
      </p>
    </div>
    <div class="info2 info">
      <p>
        <span>所属企业</span>
        <span>{{baseInfo.company}}</span>
      </p>
      <p>
        <span>联系方式</span>
        <span>{{baseInfo.mobile}}</span>
      </p>
    </div>
    <div class="info3 info">
      <p>
        <span>籍贯</span>
        <span>{{baseInfo.nativePlace}}</span>
      </p>
      <p>
        <span>年龄</span>
        <span>{{baseInfo.age}}</span>
      </p>
    </div>
    <div class="info4 info">
      <p>
        <span>社保号</span>
        <span>{{baseInfo.securityNum}}</span>
      </p>
    </div>
    <div class="info5 info">
      <p>
        <span>微信号</span>
        <span>{{baseInfo.wechatNum}}</span>
      </p>
    </div>
  </div>
</template>

<style scoped lang="less">
  #personalInfo{
    height:100%;
    width:100%;
    background:#F4F5F9;
    .avatar{
      height:200px;
      line-height:200px;
      img{
        float:right;
      }
    }
  }
.info{
  font-size:24px;
  color:#999;
  margin-bottom:20px;
  background:#fff;
  padding:0 30px;
  p{
    height:80px;
    line-height:80px;
    border-bottom:1px solid #F4F5F9;
    span:nth-child(2){
      float:right;
      color:#333;
    }
  }
}
</style>

<script>
  import header from '../../../common/header';
  export default {
    name: '',
    data () {
      return {
        id: this.common.getUserInfo().studentInfo.id,
        baseInfo: {}
      };
    },
    components: {
      vHeader: header
    },
    created () {
      this.getBaseInfo();
    },
    methods: {
      getBaseInfo () {
        let self = this;
        this.common.ajax({
          url: '/app-user/rest/v1/student/getStudentById?id=' + this.id,
          method: 'get',
          successCak (res) {
            self.baseInfo = JSON.parse(res.data);
            console.log(self.baseInfo);
          }
        });
      }
    }
  };
</script>
