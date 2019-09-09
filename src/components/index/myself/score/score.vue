<template>
    <div id="score" class="score">
        <v-header>
            <div slot="title">成绩</div>
        </v-header>
        <div class="user-wrap">
            <div class="user">
                <p class="user-ico"><img src="../../../../assets/img/default_photo.png" alt=""></p>
                <p class="user-name">{{userInfo.userAccount}}</p>
            </div>
        </div>
        <div class="score-list">
            <div class="item" v-for="item in scoreList">
                <div class="class-name"><span class=""><img src="" alt=""></span>{{item.courseName}}</div>
                <ul class="class-grade cl">
                    <li class="chapter"><span class="score-head">章节测试</span><br><span>{{item.examScore}}分</span></li>
                    <li class="synthesize"><span class="score-head">综合成绩</span><br><span>{{item.timeScore}}分</span></li>
                    <li class="total"><span class="score-head">总成绩</span><br><span class="tot-lv2">{{item.timeScore * 0.2 + item.examScore * 0.6 +item.studyScore | scoreFil}}分</span></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
    .cl:after {
        content: ".";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden
    }
    .cl {
        zoom: 1
    }
    .score {
        height: 100%;
        background-color: #fafafa;
        font-size: 14px;
    }
    .user-wrap {
        height: 300px;
        background-color: #d73a31;
        .user {
            padding: 50px 0 0 0;
        }
        .user-ico {
            height: 150px;
            img {
                width: 120px;
                height: 120px;
            }
        }
        .user-name {
            padding: 5px 0;
            color: #fff;
        }
    }
    .user, .class-grade {
        text-align: center;
    }
    .score-list {
        position: relative;
        top: -40px;
        margin: 0 auto;
        width: 95%;
        border-radius: 5px;
        .item {
            margin-top: 5px;
        }
        .class-name {
            padding: 20px 20px;
            background-color: #fff;
            font-size: 24px;
            color: #666;
        }
        .class-grade {
            margin-top: 2px;
        }
        .tot-lv2 {
            color: #ff3b3b;
        }
    }
    .class-grade {
        li {
            display: inline-block;
            margin-left: 2px;
            padding: 20px 0;
            width: 33%;
            float: left;
            background-color: #fff;
            line-height: 2;
            font-size: 20px;
        }
    }
    .chapter, .synthesize, .total {
        .score-head {
            color: #999;
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
        scoreList: [],
        BASE_FILE_URL: this.common.BASE_FILE_URL
      };
    },
    filters: {
      scoreFil: function (value) {
        return value.toFixed(1);
      }
    },
    created () {
      this.getUserInfo();
      this.getScore();
    },
    methods: {
      getUserInfo () {
        let self = this;
        this.common.ajax({
          url: '/app-user/rest/v1/student/getStudentById?id=' + this.id,
          method: 'get',
          successCak (res) {
            // console.log(res.data);
            if (res.code === 0) {
              self.userInfo = JSON.parse(res.data);
            }
          }
        });
      },
      getScore () {
        let self = this;
        this.common.ajax({
          url: '/app-teach/credit/creditList',
          method: 'post',
          data: {
            page: JSON.stringify({'pageSize': 15, 'pageNo': 1}),
            sort: JSON.stringify({}),
            courseStuScore: JSON.stringify({'userId': this.id}),
            examType: 2,
            isCountExam: 1
          },
          successCak (res) {
            // console.log(res.data);
            if (res.code === 0) {
              let data = JSON.parse(res.data);
              self.scoreList = data.result;
              console.log(data.result);
            }
          }
        });
      }
    },
    components: {
      vHeader: header
    }
  };
</script>
