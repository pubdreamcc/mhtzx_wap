<template>
    <div id="credit" class="credit">
        <v-header>
            <div slot="title">学分</div>
        </v-header>
        <div class="user-wrap">
            <div class="back"></div>
            <div class="user">
                <p class="user-ico"><img src="../../../../assets/img/default_photo.png" alt=""></p>
                <p class="user-name">{{userInfo.userAccount}}</p>
            </div>
        </div>
        <div class="list-wrap">
            <div class="list-head">
                <p class="score2">68分</p>
                <p class="score-txt">已获得学分</p>
            </div>
            <div class="score-list">
                <div class="item" v-for="item in scoreList">
                    <ul class="class-grade cl">
                        <li class="course-name">{{item.courseName}}</li>
                        <li class="course-time">{{item.createTime}}</li>
                        <li class="course-credit">{{item.courseScore}}分</li>
                    </ul>
                </div>
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
    .credit {
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
            font-size: 30px;
        }
    }
    .user, .class-grade {
        text-align: center;
    }
    .list-wrap {
        position: relative;
        top: -40px;
        margin: 0 auto;
        width: 95%;
    }
    .list-head {
        padding: 40px 0;
        text-align: center;
        border-radius: 5px 5px 0 0;
        background-color: #fff;
        .score2 {
            padding: 10px 0;
            color: #ff3b3b;
            font-size: 50px;
        }
        .score-txt {
            color: #999;
        }
    }
    .score-list {
        .item {
            margin-top: 5px;
        }
        .class-grade {
            margin-top: 2px;
        }
    }
    .class-grade {
        color: #999;
        li {
            display: inline-block;
            padding: 20px 0;
            width: 33%;
            height: 60px;
            line-height: 60px;
            float: left;
            background-color: #fff;
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
    created () {
      this.getUserInfo();
      this.getCredit();
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
      getCredit () {
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
