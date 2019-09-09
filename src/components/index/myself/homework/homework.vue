<template>
  <div id="homework">
    <vHeader>
      <div slot="title">我的作业</div>
    </vHeader>
    <vSelect :typeList="typeList" :statusList="statusList" :vName="'homework'" @getList="setHomeworkList">
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
                <span class="know_name">{{item.parentKnowName}} &gt; {{item.knowName}}</span>
              </p>
              <p class="list_state"><span>————</span></p>
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
        typeList: [{'name': '全部', 'id': '-1'}, {'name': '练习', 'id': '1'}, {'name': '实操作业', 'id': '3'}],
        statusList: [{'name': '全部', 'id': '-1'}, {'name': '待完成', 'id': '0'}, {'name': '已完成', 'id': '1'}],
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
        if (value === '1') {
          examType = '练习';
        } else if (value === '3') {
          examType = '实操作业';
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
        }
        return examStatus;
      }
    }
  };
</script>
