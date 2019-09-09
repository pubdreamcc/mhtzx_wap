<template>
  <div id="exam">
    <vHeader>
      <div slot="title">我的考试</div>
    </vHeader>
    <vSelect :typeList="typeList" :statusList="statusList" :vName="'exam'" @getList="setHomeworkList">
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
                <span class="type_name">{{item.examType | capitalizeType}}</span>&nbsp;
                <span class="know_name">{{item.knowName}}</span>
              </p>
              <p class="list_state">
                <span>得分</span><span class="state_df">{{item | capitalizeScore}}</span>
              </p>
              <span class="list_enroll" :class="item.status == '0'||item.status == '2'||item.status == '4'?'active':''">{{item.status | capitalizeStatus}}</span>
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
        typeList: [{'name': '全部', 'id': '-1'}, {'name': '章节测验', 'id': '0'}, {'name': '综合考试', 'id': '2'}],
        statusList: [{'name': '全部', 'id': '-1'}, {'name': '待完成', 'id': '0'}, {'name': '已完成', 'id': '1'}, {'name': '待报名', 'id': '2'}, {'name': '已报名', 'id': '3'}, {'name': '待考试', 'id': '4'}],
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
        if (value === '0') {
          examType = '章节测验';
        } else if (value === '2') {
          examType = '综合考试';
        }
        return examType;
      },
      capitalizeStatus: function (value) {
        let examStatus = '';
        // 0:待完成，1:已完成，2:待报名，3:已报名 4：待考试 5：已经完成线下考试
        if (value === '0') {
          examStatus = '待完成';
        } else if (value === '1') {
          examStatus = '已完成';
        } else if (value === '2') {
          examStatus = '待报名';
        } else if (value === '3') {
          examStatus = '已报名';
        } else if (value === '4') {
          examStatus = '待考试';
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
