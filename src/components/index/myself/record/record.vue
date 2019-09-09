<template>
  <div id="record">
    <v-header>
      <div slot="title">
        学习记录
      </div>
    </v-header>
    <div class="userInfo">
      <p class="avatar">
        <img src="../../../../assets/img/default_photo.png" alt="">
      </p>
      <p class="name">{{userInfo.userAccount}}</p>
      <p class="study">累计学习时间长：{{studyInfo.studyTime}}小时</p>
    </div>
    <div class="study-content">
      <ul>
        <li v-for="item in courseList" class="clearfix" @click="goDetail(item.courseId)">
          <div class="avatar">
            <img v-lazy="item.imgUrl?BASE_FILE_URL+item.imgUrl:require('../../../../assets/img/default_course.png')" alt="">
          </div>
          <div class="course-info">
            <h2>{{item.courseName}}</h2>
            <p class="intro">{{item.studyChapterName}}</p>
          </div>
          <i class="icon iconfont icon-youyou go-detail"></i>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="less">
  .userInfo{
    height:240px;
    background:#d73a31;
    font-size:24px;
    color:#fff;
    .avatar{
      height:100px;
      img{
        height:100%;
      }
    }
  p{
    text-align:center;
    margin-bottom:20px;
  }
  }
  .study-content{
    li{
      padding:30px;
      border-bottom:1px solid #ccc;
      position:relative;
      .go-detail{
          right:30px;
          top:50%;
          transform:translateY(-50%);
          position: absolute;
          font-size:34px;
      }
    }
    .avatar{
      height:160px;
      width:210px;
      float:left;
      margin-right:20px;
      img{
        height:100%;
        width:100%;
      }
    }
    .course-info{
      h2{
        font-size:26px;
        font-weight:700;
        padding:10px 0;
        margin-bottom:20px;
      }
      .intro{
        font-size:20px;
        color:#999;
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
        ticket: this.common.getUserInfo().ticket,
        userInfo: {},
        courseList: [],
        BASE_FILE_URL: this.common.BASE_FILE_URL,
        studyInfo: {}
      };
    },
    created () {
      this.getPersonalHead();
      this.getCourseList();
      this.getStudyTime();
    },
    methods: {
      getPersonalHead () {
        let self = this;
        this.common.ajax({
          url: '/app-user/rest/v1/student/getStudentById?id=' + this.id,
          method: 'get',
          successCak (res) {
            self.userInfo = JSON.parse(res.data);
            console.log(self.userInfo);
          }
        });
      },
      getCourseList () {
        let self = this;
        this.common.ajax({
          url: '/app-user/rest/v1/student/studyProgressRecord',
          method: 'post',
          data: {ticket: this.ticket},
          successCak (res) {
            self.courseList = res.data;
          }
        });
      },
      getStudyTime () {
        let self = this;
        this.common.ajax({
          url: '/app-teach/rest/v1/coursestuscore/getUserCommonInfo',
          method: 'post',
          data: {
            userId: this.id
          },
          successCak (res) {
            self.studyInfo = res.data;
          }
        });
      },
      goDetail (id) {
        this.$router.push(`/courseDetail/${id}`);
      }
    },
    components: {
      vHeader: header
    }
  };
</script>
