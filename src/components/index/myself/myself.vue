<template>
  <div id="myself">
    <router-link to="/personalinfo">
      <div class="ms-header">
        <div class="cf-header clearfix">
          <div class="simg"><img src="../../../assets/img/my_photo.png"> </div>
          <div class="text">
            <p class="name">{{studentInfo.userName}}</p>
            <p>账号&nbsp;<span class="account">{{studentInfo.userAccount}}</span>专业&nbsp;<span class="major">{{studentInfo.specialtyName}}</span></p>
          </div>
        </div>
        <div class="cr-header"></div>
      </div>
    </router-link>
    <div class="ms-count clearfix border-b-1px">
      <ul>
        <li class="border-r-1px">
          <div class="title">已获得学分(分)</div>
          <div class="score-count count-vaule">{{ result.credits }}</div>
        </li>
        <li class="border-r-1px">
          <div class="title">已学课程数(门)</div>
          <div class="score-count count-vaule">{{ result.finishedCourseCount }}</div>
        </li>
        <li>
          <div class="title">累计学习时长(小时)</div>
          <div class="score-count count-vaule">{{ result.studyTime }}</div>
        </li>
      </ul>
    </div>
    <div class="ms-classify clearfix">
      <ul>
          <li v-for="(item,index) in itemList">
            <router-link :to="item.routerName">
              <div class="cpic">
                <img v-lazy="item.imgUrl" alt="">
              </div>
              <div class="title">{{ item.itemName }}</div>
            </router-link>
          </li>
      </ul>
    </div>
    <router-link to="myOrder">
      <div class="my-order service-item">
          <div class="text">
            <span class="icon"></span>&nbsp;&nbsp;我的订单
          </div>
         <span class="arrow-right"></span>
      </div>
    </router-link>
    <a href="tel:0755-86561735">
      <div class="my-question service-item">
        <div class="text">
          <span class="icon"></span>&nbsp;&nbsp;问题反馈</div>
        <span class="arrow-right"></span>
        <div class="phone">0755-86561735</div>
      </div>
    </a>
    <div class="exit-login" @click="loginOut">退出登录</div>
  </div>
</template>

<style scoped>
  #indexBody{
    background: #f3f5f7 !important;
  }
  .ms-header{
    height: 250px;
    background:#d73a31;
    padding: 0 30px;
  }
  .cf-header{
    float: left;
    margin-top: 65px;
  }
  .cf-header .simg{
    float: left;
    width: 130px;
    height:130px;
    margin-right: 15px;

  }
  .cf-header .simg img{
    width: 100%;
    height: 100%;
  }
  .cf-header .text{
    float: left;
    width: 400px;
    font-size: 24px;
    color: #fff;
    margin-top: 30px;
    overflow: hidden;
  }
  .cf-header .text .name{
    font-size: 36px;
    height: 60px;
  }
  .cf-header .text .account{
    margin-right: 15px;
  }
  .cr-header{
    float: right;
    margin-top: 95px;
    width: 16px;
    height: 26px;
    background: url("../../../assets/img/arrow_right.png");
    background-size: 100%;
  }
  .ms-count{
    height: 133px;
    padding-top: 35px;
    background: #fff;
    overflow: hidden;
  }
  .ms-count li{
    float: left;
    width: 33.3%;
    text-align: center;
    box-sizing: border-box;
  }
 .border-r-1px{
    border-right: 1px solid #d9dde1;

  }
  .border-b-1px{
    border-bottom: 1px solid #d9dde1;
  }
  .ms-count .title{
    font-size: 24px;
    color: #666;
    height:50px;
  }
  .ms-count .count-vaule{
    font-size: 48px;
    color: #333;
  }
  .ms-classify{
    padding-bottom: 50px;
    background: #fff;
  }
  .ms-classify li{
    float: left;
    width: 25%;
    text-align: center;
    margin-top: 37px;
  }
  .ms-classify .cpic{
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: #d73a31;
    margin: 0 auto;
    text-align: center;
  }
  .ms-classify .cpic img{
    width: 35px;
    height: 38px;
    vertical-align: top;
    margin-top: 25px;
  }
  .ms-classify .title{
    margin-top: 20px;
    height: 30px;
    line-height: 30px;
  }
  .ms-classify a{
    text-decoration: none;
    font-size: 28px;
    color: #333;
  }
  .ms-classify a:hover{
    font-size: 28px;
    color: #333;
  }
  .service-item{
    height: 110px;
    padding: 0 30px;
    line-height: 110px;
    background:#fff;
    margin-top: 10px;
    overflow: hidden;
  }
  .my-order .icon{
    width: 24px;
    height: 30px;
    display: inline-block;
    background: url("../../../assets/img/order.png") no-repeat;
    background-size: 100%;
    margin-left: 10px;

  }
  .my-question .icon{
    width: 36px;
    height: 33px;
    background: url("../../../assets/img/my_problem.png") no-repeat;
    background-size: 100%;
    display: inline-block;
    margin-left: 10px;
    vertical-align: middle;

  }
  .my-question .phone{
    float: right;
    font-size: 30px;
    color: #999;
    margin-right: 45px;
  }
  .service-item .text{
    float: left;
    font-size: 30px;
    color: #333;
  }
  .service-item .arrow-right{
    float: right;
    background: url("../../../assets/img/arrow-right2.png") no-repeat;
    background-size: 100%;
    width: 16px;
    height: 110px;
    background-position: 0 center;
  }
  .exit-login{
    width: 100%;
    height: 110px;
    line-height: 110px;
    background: #fff;
    text-align: center;
    color: #da473f;
    font-size: 32px;
    margin-top: 100px;
    margin-bottom: 7px;
    cursor: pointer;
  }
  a{
    text-decoration: none;
  }
</style>

<script>
  export default {
    data () {
      return {
        userId: '',
        result: {},
        studentInfo: this.common.getUserInfo().studentInfo,
        ticket: this.common.getUserInfo().ticket,
        itemList: [
          {imgUrl: require('../../../assets/img/my_classe.png'), itemName: '我的课程', routerName: 'myCourse'},
          {imgUrl: require('../../../assets/img/my_worke.png'), itemName: '作业', routerName: 'homework'},
          {imgUrl: require('../../../assets/img/my_exam.png'), itemName: '考试', routerName: 'exam'},
          {imgUrl: require('../../../assets/img/my_sign.png'), itemName: '考试报名', routerName: 'book'},
          {imgUrl: require('../../../assets/img/my_credit.png'), itemName: '考试成绩', routerName: 'score'},
          {imgUrl: require('../../../assets/img/my_score.png'), itemName: '学分', routerName: 'credit'},
          {imgUrl: require('../../../assets/img/my_record.png'), itemName: '记录', routerName: 'record'}
        ],
        nowIndex: 0
      };
    },
    methods: {
      getCount (Id) {
        let self = this;
        this.common.ajax({
          url: '/app-teach/rest/v1/coursestuscore/getUserCommonInfo?userId=' + Id,
          method: 'get',
          successCak (res) {
            self.result = res.data;
            console.log(self.result);
          }
        });
      },
      loginOut () {
        let self = this;
        let params = {
          userAccount: this.studentInfo.userAccount,
          equipmentType: 3,
          ticket: this.ticket
        };
        this.common.ajax({
          url: '/app-user/rest/v1/login/loginOut',
          method: 'post',
          data: params,
          successCak (res) {
            if (res.code === 0) {
              self.common.removeUserInfo();
              self.$emit('push', 'home');
            }
          }
        });
      },
      showDia () {
        this.common.showToDown();
      }
    },
    created () {
      this.userId = this.studentInfo.id;
      this.getCount(this.userId);
    },
    activated () {
      this.$emit('setHeader', {
        isShowHeader: false
      });
    }
  };
</script>
