<template>
  <div id="catagory">
    <v-header>
      <div slot="title">分类</div>
    </v-header>
    <div class="content">
      <div class="c-left">
        <ul>
          <li v-for="(item,index) in leftNavList" :class="{active:index==navActiveIndex}" @click="tabNav(index,item.specialtyId)">
            <span class="left-active" v-if="index==navActiveIndex"></span>
            <span class="nav-name">{{item.specialtyName}}</span>
          </li>
        </ul>
      </div>
      <div class="c-right" id="container">
        <ul>
          <li v-for="(item,index) in courseList" @click="goDetail(item.courseId)">
            <div class="course-img">
              <img v-lazy="item.cover?BASE_FILE_URL+item.cover:require('../../../assets/img/default_course.png')" alt="">
            </div>
            <p class="course-name">{{item.courseName}}</p>
            <p class="course-time">{{item.knowPointCount}}微课时</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.content{
  position:fixed;
  left:0;
  top:88px;
  bottom:0;
  width:100%;
  .c-left{
    float:left;
    width:254px;
    height:100%;
    overflow:auto;
    font-size:28px;
    background:#f3f5f7;
    li{
      padding:38px 26px;
      border-bottom:1px solid #d9dde1;
      position:relative;
      word-wrap:break-word;
      .left-active{
        display: inline-block;
        height:28px;
        width:14px;
        background:#d73a31;
        position:absolute;
        left:0;
        top:50%;
        transform:translateY(-50%);
      }
    }
    .active{
      background: #fff;
      color:#333;
      font-weight:700;
    }
  }
  .c-right{
    float:right;
    overflow-y:auto;
    height:100%;
    ul{
      padding-bottom:30px;
      li{
      padding-top:40px;
      .course-img{
        height:260px;
        width:434px;
        border-radius:4px;
        overflow:hidden;
        padding-right:35px;
      img{
        height:100%;
        width:100%;
      }
      }
      .course-name{
        font-size:30px;
        padding:10px 0;
      }
      .course-time{
        font-size:24px;
        color:#999;
      }
      }
    }
  }
}
</style>

<script>
  import header from '../../common/header';
  export default {
    name: '',
    data () {
      return {
        navActiveIndex: 0,
        leftNavList: [],
        courseList: [],
        specialtyId: '',
        BASE_FILE_URL: ''
      };
    },
    created () {
      this.getNabList();
      this.getCourseList(this.specialtyId);
      this.BASE_FILE_URL = this.common.BASE_FILE_URL;
    },
    methods: {
      tabNav (index, id) {
        this.navActiveIndex = index;
        id = !id ? '' : id;
        this.getCourseList(id);
      },
      getNabList () {
        let self = this;
        this.common.ajax({
          url: '/app-teach/rest/v1/specialty/getHomePageSpecialtyList',
          method: 'get',
          successCak (res) {
            self.leftNavList = JSON.parse(res.data);
            self.specialtyId = self.leftNavList[0].specialtyId || '';
          }
        });
      },
      getCourseList (id) {
        let self = this;
        this.common.ajax({
          url: '/app-teach/rest/v1/course/getRecommendSpecialtyCourse?specialtyId=' + id,
          method: 'get',
          successCak (res) {
            self.courseList = JSON.parse(res.data);
          }
        });
      },
      goDetail (id) {
        let courseId = id;
        this.$router.push(`/courseDetail/${courseId}`);
      }
    },
    components: {
      vHeader: header
    }
  };
</script>
