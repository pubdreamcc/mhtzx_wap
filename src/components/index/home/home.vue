<template>
  <div id="home">
    <!--<router-link to="catagory" tag="div" class="homeHeaderLeft">分类</router-link>-->
    <!--banner图-->
    <swipe :auto="4000" id="banner">
      <swipeItem><img :src="require('../../../assets/img/home_banner01.png')" alt=""></swipeItem>
      <swipeItem><img :src="require('../../../assets/img/home_banner02.png')" alt=""></swipeItem>
      <swipeItem><img :src="require('../../../assets/img/home_banner03.png')" alt=""></swipeItem>
    </swipe>
    <!--热门推荐-->
    <div id="hotRecommend">
        <p class="title_text"><span class="red_line"></span>热门推荐<span class="red_line"></span></p>
        <ul id="hotRecommendList">
          <!--<router-link v-for="item in hotRecommendList" tag="li" :to="'/courseDetail/'+item.courseId" :key="item">-->
          <li v-for="item in hotRecommendList"  @click="toCourseDetail(item.courseId)" >
            <img v-lazy="item.cover?BASE_FILE_URL+item.cover:require('../../../assets/img/default_course.png')" alt="">
            <p class="courseName">{{item.courseName}}</p>
          </li>
          <div class="clear"></div>
        </ul>
    </div>
    <!--专业推荐-->
    <div id="homeSpecialtyDiv">
        <div class="homeSpecialty" v-for="item in homeSpecialty">
          <p class="title_text"><span class="red_line"></span>{{item.specialtyName}}<span class="red_line"></span></p>
          <ul class="specialtyList">
            <li v-for="item1 in item.courseLists"  @click="toCourseDetail(item1.courseId)" >
              <img v-lazy="item1.cover?BASE_FILE_URL+item1.cover:require('../../../assets/img/default_course.png')" alt="">
              <p class="courseName">{{item1.courseName}}</p>
            </li>
            <div class="clear"></div>
          </ul>
        </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
  #indexBody{
    background-color: #f3f5f7;
  }
  .homeHeaderLeft{
    position: absolute;
    left: 0;
    top: 0;
    color: #fff;
    font-size: 26px;
    width: 60px;
    height: 60px;
    padding:26px 15px 0 30px;
  }
  #banner,#banner img{
    width:100%;
    height: 320px;
  }
  .red_line{
    width: 20px;
    height: 5px;
    background-color: #ff5952;
    display: inline-block;
    vertical-align: middle;
    margin: 0 15px;
    border-radius: 4px;
  }
  .title_text{
    text-align: center;
    font-size: 30px;
    font-weight: bold;
    color: #333;
    padding: 40px 0;
  }
  #hotRecommend,.homeSpecialty{
    padding: 0 29px 20px 11px;
    font-size: 30px;
    color: #333;
    margin-bottom: 10px;
    background-color: #fff;
  }
  #hotRecommendList li,.specialtyList li{
    width: 334px;
    margin: 0 0 20px 18px;
    float: left;
   }
  #hotRecommendList li img,.specialtyList li img{
    width: 334px;
    height: 200px;
    border-radius: 6px;
  }
  .courseName{
    height: 70px;
    line-height: 70px;
    overflow: hidden;
  }
  .clear{clear:both;}
</style>

<script>
  import header from '../../common/header';
  import { Swipe, SwipeItem } from 'mint-ui';
  export default {
    name: '',
    data () {
      return {
        hotRecommendList: [],
        homeSpecialty: [],
        homeSpecialtyList: [],
        BASE_FILE_URL: this.common.BASE_FILE_URL
      };
    },
    created () {
      this.getHotRecommendList();
      this.getHomeSpecialtyList();
    },
    activated () {
      let self = this;
      this.$emit('setHeader', {
        title: '首页',
        left: '分类',
        showBack: false,
        isShowHeader: true,
        leftCallBack () {
          self.$router.push('/catagory');
        }
      });
    },
    methods: {
      getHotRecommendList () {
        let self = this;
        this.common.ajax({
          url: '/app-cms/rest/v1/indexManager/getRecommendCourse',
          method: 'post',
          successCak (res) {
            if (res.code === 0) {
              self.hotRecommendList = JSON.parse(res.data).result;
            }
          }
        });
      },
      getHomeSpecialtyList () {
        let self = this;
        this.common.ajax({
          url: '/app-teach/rest/v1/specialty/getHomePageSpecialtyList',
          method: 'post',
          data: {
            deviceType: 1
          },
          successCak (res) {
            if (res.code === 0) {
              self.homeSpecialty = JSON.parse(res.data);
            }
          }
        });
      },
      toCourseDetail (id) {
        let courseId = id;
        // this.$router.push(`/courseDetail/${courseId}`);
        this.$router.push('/courseDetail/' + courseId);
      }
    },
    components: {
      vHeader: header,
      swipe: Swipe,
      swipeItem: SwipeItem
    }
  };
</script>
