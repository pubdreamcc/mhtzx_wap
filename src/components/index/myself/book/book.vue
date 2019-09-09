<template>
  <div id="book">
    <vHeader>
      <div slot="title">考试报名</div>
    </vHeader>
    <vSelect :typeList="typeList" :statusList="statusList" :vName="'book'" @getList="setHomeworkList">
    </vSelect>
    <!--滑动区域-->
    <div class="list-wrap">
      <div id="mescroll" class="mescroll">
        <p v-show="resultList.length == 0" class="no_data">暂无相关数据</p>
        <!--展示上拉加载的数据列表-->
        <ul class="test_content" id="test_content">
          <li class="content_list" v-for="item in resultList" @click="showDia()">
            <img :src="require('../../../../assets/img/test_list.png')" alt="">
            <div>
              <h3>{{item.courseName}}</h3>
              <p class="list_course">
                <span class="type_name">{{item.isOnline | capitalizeType}}</span>&nbsp;
                <!--<span class="know_name">{{item.parentKnowName}} &gt; {{item.knowName}}</span>-->
              </p>
              <p class="list_state">
                <span>得分</span><span class="state_df">{{item | capitalizeScore}}</span>
                <span>剩余补考次数</span><span class="state_time">{{item.surplusExamCount}}</span>
              </p>
              <span class="list_enroll" :class="item.status == '0'||item.status == '2'||item.status == '4'?'active':''">{{item | capitalizeStatus}}</span>
              <span class="span_right"></span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .active{
    color: #d73a31!important;
  }
</style>

<script>
  import header from '../../../common/header';
  import select from '../homeworkExamSelect';
  // import MeScroll from 'mescroll.js';
  import '../homeworkExam.css';
  import '../../../../assets/css/mescroll.min.css';
  export default {
    name: '',
    data () {
      return {
        typeList: [{'name': '全部', 'id': '-1'}, {'name': '线上考试', 'id': '1'}, {'name': '线下考试', 'id': '0'}],
        statusList: [{'name': '全部', 'id': '-1'}, {'name': '待完成', 'id': '0'}, {'name': '已完成', 'id': '1'}, {'name': '待报名', 'id': '2'}, {'name': '已报名', 'id': '3'}, {'name': '待考试', 'id': '4'}, {'name': '线下已完成', 'id': '5'}],
        resultList: [],
        studentInfo: this.common.getUserInfo().studentInfo
      };
    },
    components: {
      vHeader: header,
      vSelect: select
    },
    methods: {
      setHomeworkList (data) {
        this.resultList = data;
      },
      showDia () {
        this.common.showToDown();
      }
    },
    filters: {
      capitalizeType: function (value) {
        let examType = '';
        if (value === 1) {
          examType = '线上考试';
        } else if (value === 0) {
          examType = '线下考试';
        }
        return examType;
      },
      capitalizeStatus: function (value) {
        let examStatus = '';
        // 0:待完成，1:已完成，2:待报名，3:已报名 4：待考试 5：已经完成线下考试
        if (value.status === '0') {
          examStatus = '查看预约';
        } else if (value.status === '1') {
          if (value.score < 60 && value.surplusExamCount > 0) {
            examStatus = '预约补考';
          }
        } else if (value.status === '2') {
          examStatus = '预约考试';
        } else if (value.status === '3') {
          examStatus = '查看预约';
        } else {
          examStatus = '';
        }
        return examStatus;
      },
      capitalizeScore: function (value) {
        let score = '';
        // 0:待完成，1:已完成，2:待报名，3:已报名 4：待考试 5：已经完成线下考试
        if (value.status === '1') {
          score = value.score;
        } else {
          score = '--';
        }
        return score;
      }
    }
  };
</script>
