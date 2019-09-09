<template>
  <div id="courseDetail" :class="{ purchase : isPurchase }">
    <!--返回图标-->
    <div class="back" @click="goBack">
      <span class="iconfont icon-iconfonticonfont10shanchu"></span>
    </div>
    <div id="coursePrompt" v-if="!isPurchase || !userInfo.ticket" @click="goLogin(userInfo.ticket)">
      <div class="courseName">
        {{course.courseName}}
      </div>
      <div class="prompt" >
        <span v-if="!userInfo.ticket">
          本课程为付费课程，请先进行登录！
        </span>
        <span v-else>
          本课程为付费课程，请先进行购买！
        </span>
      </div>
    </div>
    <!--视屏播放器-->
    <div id="vueVideo" v-if="isPurchase && userInfo.ticket" class="needsclick">
      <video-player  class="video-player-box video no-fastclick"
                     ref="videoPlayer"
                     webkit-playsinline="true"
                     :options="playerOptions"
                     :playsinline="true"
                     customEventName="customstatechangedeventname"

                     @play="onPlayerPlay($event)"
                     @pause="onPlayerPause($event)"
                     @ended="onPlayerEnded($event)"
                     @playing="onPlayerPlaying($event)"

                     @statechanged="playerStateChanged($event)"
                     @ready="playerReadied">
      </video-player>
    </div>
    <!--课程详情-->
    <div id="courseDetail_wrap">
      <ul id="courseDetail_nav">
        <li :class="{active: navActive == '0'}" @click="navSelect(0)">
          <span>大纲</span>
        </li>
        <li :class="{active: navActive == '1'}" @click="navSelect(1)">
          <span>介绍</span>
        </li>
      </ul>
      <div id="courseDetail_content" class="mescroll">
        <ul v-show="navActive == 0" id="know_list">
          <li class="konw_item" v-for="(item,index) in showKnowList" :key="'courseDetails_'+item.id">
            <span class="konw_item_title" @click="togglePoint(index)">
              {{item.knowName}}
            </span>
            <ul class="sub_know_points" v-show="!knowListShowArr[index]">
              <li  v-for="subItem in item.subKnowPoints" :key="'courseDetails_'+subItem.id" class="sub_know_item "  :class="{can_play : isPurchase && isLearned(subItem.id) , currentPlay: isPurchase && subItem.id == knowId}" @click="videoSelect(subItem.id,  $event)">
                {{subItem.knowName}}
              </li>
            </ul>
          </li>
        </ul>
        <div v-show="navActive == 1" id="cd_info">
          <div id="info_header">
            <span id="info_title">{{course.courseName}}</span>
          </div>
          <ul id="info_sub">
            <li class="sub_item">
              <span class="sub_item_title">课程类别</span>
              <span class="sub_item_cont">{{course.courseType}}</span>
            </li>
            <li class="sub_item">
              <span class="sub_item_title">主讲老师</span>
              <span class="sub_item_cont">{{course.teacherName}}</span>
            </li>
            <li class="sub_item">
              <span class="sub_item_title">微课总数</span>
              <span class="sub_item_cont">{{course.totalMic}}</span>
            </li>
          </ul>
          <div id="info_details">
            <div id="course_info_title">
              课程介绍
            </div>
            <div id="course_info" v-html="course.intro">
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--底部购买-->
    <div id="purchaseDom" v-if="!isPurchase">
      <div id="purchase_price">
        总价:<span>￥{{course.price}}</span>
      </div>
      <div id="purchaseBtm" @click="buyCourse">
        立即购买
      </div>
    </div>
    <!--加载中-->
    <transition name="fade">
      <loading-page v-if="isLoadingShow" id="courseDetail_loading"></loading-page>
    </transition>
  </div>
</template>

<script>
  import loadingPage from '../common/loading';
  import { videoPlayer } from 'vue-video-player';
  import '@/assets/css/video-js.css';
  export default {
    name: '',
    components: {
      loadingPage,
      videoPlayer
    },
    data () {
      return {
        // 课程ID
        courseId: this.$route.params.courseId,
        // 当前知识点ID
        knowId: '',
        // 播放器初始化
        playerOptions: {
          // videojs options
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          poster: require('../../assets/img/courseDetailPromise.jpg'),
          language: 'zh-CN',
          sources: [
            {
              type: 'video/mp4',
              src: ''
            }
          ],
          // 用CSS方法让静音按钮隐藏，官方找不到文档隐藏静音按钮 自定义CSS在video-js.css文件中
          controlBar: {
            playbackRateMenuButton: false
          }
        },
        // tab显示下标
        navActive: 0,
        // 是否购买
        isPurchase: false,
        // 大纲列表
        showKnowList: [],
        // 学习进度
        studyProgress: {
          knowId: ''
        },
        // 课程详情
        course: {
          courseName: '',
          teacherName: '',
          totalMic: '',
          courseType: '',
          intro: '',
          price: ''
        },
        // 用户令牌
        userInfo: {
          ticket: '',
          userAccount: '',
          userId: ''
        },
        // 搜索列表是否展开
        knowListShowArr: [],
        isLoadingShow: true
      };
    },
    mounted () {
      this.recordLearned = false;
    },
    updated () {
      this.recordLearned = false;
    },
    created () {
      let userInfo = this.common.getUserInfo();
      if (userInfo) {
        this.userInfo.ticket = userInfo.ticket;
        if (userInfo.studentInfo) {
          this.userInfo.userAccount = userInfo.studentInfo.userAccount;
          this.userInfo.userId = userInfo.studentInfo.id;
        }
      }
      this.checkCourseIsBuy();
      this.getCouseStudyInfo();
    },
    watch: {
      knowId (newVal) {
        let _this = this;
        // 刷新视屏后都要将第一次播放初始化
        this.isFristPlay = false;
        // 获取播放视屏地址
        this.getVideoUrl(newVal, function (videoUrl) {
          videoUrl = _this.common.BASE_FILE_URL + videoUrl;
          if (_this.isLoadingShow) {
            setTimeout(function () {
              _this.isLoadingShow = false;
            }, 500);
          }
          _this.playerOptions.sources[0].src = videoUrl;
        });
      }
    },
    methods: {
      // 购买课程
      buyCourse () {
        if (this.userInfo.ticket) {
          this.common.showToDown();
        } else {
          this.goLogin();
        }
      },
      // 返回上一级
      goBack () {
        if (this.$route.query.goindex === 'true') {
          this.$router.push('/home');
        } else {
          this.$router.back(-1);
        }
      },
      // 展开/收起 节点
      togglePoint (index) {
        this.knowListShowArr.splice(index, 1, !this.knowListShowArr[index]);
      },
      // 后台请求拉取大纲数据
      getCouseStudyInfo () {
        let _this = this;
        let data = {
          courseId: this.courseId,
          ticket: this.userInfo.ticket,
          userAccount: this.userInfo.userAccount,
          equipmentType: 3
        };
        this.common.ajax({
          url: '/app-teach/rest/v1/knowpoint/getCouseStudyInfo',
          method: 'post',
          data,
          successCak (rec) {
            // 数据初始化
            if (rec.code === 0) {
              let course = rec.data.course;
              let studyProgress = rec.data.studyProgress;
              let knowList = rec.data.knowList;
              let courseData = {
                intro: course.intro,
                courseName: course.courseName,
                totalMic: course.totalMic,
                courseType: course.courseType === '0' ? '基础课程' : '专业课程',
                teacherName: course.teacherName,
                price: course.price
              };
              let arrLength = knowList.length;
              let newknowListArr = new Array(arrLength);
              _this.$set(_this, 'knowListShowArr', newknowListArr);
              _this.$set(_this, 'showKnowList', knowList);
              _this.course = courseData;
              if (studyProgress) {
                _this.studyProgress.knowId = studyProgress.knowId;
                _this.knowId = studyProgress.knowId; // 默认首次进来当前knowID 为当前学习进度
              } else {
                if (_this.isLoadingShow) {
                  setTimeout(function () {
                    _this.isLoadingShow = false;
                  }, 500);
                }
              }
            }
          }
        });
      },
      // 校验是否购买该课程
      checkCourseIsBuy () {
        let _this = this;
        let data = JSON.stringify({
          courseId: this.courseId,
          userId: this.userInfo.userId
        });
        this.common.ajax({
          url: '/app-user/rest/v1/order/checkCourseIsBuy',
          method: 'post',
          data: {
            params: data
          },
          successCak (rec) {
            if (rec.code === 0) {
              let data = JSON.parse(rec.data);
              if (data.isBuy === 2) {
                _this.isPurchase = false;
              } else {
                _this.isPurchase = true;
              }
            }
          }
        });
      },
      // 获取视频地址 返回 /upload/video/xxxx.mp4
      getVideoUrl (knowId, callback, errCallback) {
        let params = {
          knowId
        };
        this.common.ajax({
          url: '/app-user/study/getVideo',
          method: 'get',
          params,
          successCak (rec) {
            // 数据初始化
            if (rec.code === 0) {
              let data = JSON.parse(rec.data);
              for (let i = 0; i < data.length; i++) {
                let item = data[i];
                if (item.saveName.indexOf('mp4') !== -1) {
                  let videoUrl = item.filePath + '/' + item.saveName;
                  callback(videoUrl);
                  break;
                }
              }
              errCallback();
            }
          }
        });
      },
      // 导航切换
      navSelect (index) {
        this.navActive = index;
      },
      // 切换播放列表
      videoSelect (knowId, ev) {
        if (!this.isPurchase) {
          this.common.toast('购买该课程后，即可播放。');
          return false;
        }
        // 判断当前章节是否可以选中
        if (ev.target.className.indexOf('can_play') !== -1) {
            // 是否为当前播放项
          if (ev.target.className.indexOf('currentPlay') === -1) {
            this.knowId = knowId;
          }
        } else {
          this.common.toast('需将前置章节看完，才可观看该节视频。');
        }
      },
      // 判断是否已学习
      isLearned (kid) {
        // 是否学习记录为空
        if (!this.studyProgress.knowId) {
          return false;
        }
        // 是否已经过了学习记录标识
        if (this.recordLearned !== true) {
          // 如果没有过 则需要判断 当前是否为 学习记录的标识
          if (kid === this.studyProgress.knowId) {
            // 如果当前为学习记录标示则告知后面不必再判断 全部为FALSE
            this.recordLearned = true;
          }
          // 还未超过学习记录标识，且当前节点不是学习记录的标识
          return true;
        }
        // 过了学习记录的全部为FALSE
        return false;
      },
      // 前往登录页面 如果参数有值 转换为true 则不跳转
      goLogin (bool = false) {
        if (!bool) {
          this.$router.push('/login');
        }
      },
      // listen event
      onPlayerPlay (player) {
        let _this = this;
        if (_this.studyProgress.knowId !== _this.knowId) {
          return false;
        }
        if (!this.isFristPlay) {
          this.isFristPlay = true;
          let data = {
            knowId: this.knowId,
            courseId: this.courseId
          };
          this.common.ajax({
            url: '/app-user/study/beginStudyStu',
            method: 'post',
            data,
            headers: {
              ticket: this.userInfo.ticket
            },
            successCak (rec) {
              if (rec.code !== 0) {
                _this.isFristPlay = false;
                _this.onPlayerPlay();
              }
            },
            errorCak () {
              _this.isFristPlay = false;
              _this.onPlayerPlay();
            }
          });
        }
      },
      onPlayerPause (player) {
        // console.log('player pause!', player)
      },
      // ...player event

      // or listen state event
      playerStateChanged (playerCurrentState) {
        // console.log('player current update state', playerCurrentState)1
      },
      // player is ready
      playerReadied (player) {
//        console.log('the player is readied', player)
        // you can use it to do something...
        // player.[methods]
      },
      onPlayerPlaying (player) {
        player.requestFullscreen();
      },
      onPlayerEnded () {
        let _this = this;
        if (_this.studyProgress.knowId !== _this.knowId) {
          return false;
        }
        let data = {
          knowId: this.knowId,
          courseId: this.courseId
        };
        this.common.ajax({
          url: '/app-user/study/endStudy',
          method: 'post',
          data,
          headers: {
            ticket: this.userInfo.ticket
          },
          successCak (rec) {
            if (rec.code !== 0) {
              _this.onPlayerEnded();
            } else {
              _this.common.showToDown();
            }
          },
          errorCak () {
            _this.onPlayerEnded();
          }
        });
      }
    }
  };
</script>


<style lang="less" scoped>
  @bgColor: #ff3b19;

  #courseDetail {
    height: 100%;
    overflow: hidden;
    font-size: 0;
    line-height: 1.6;
    display: flex;
    flex-direction: column;
    div.back {
      position: absolute;
      display: inline-block;
      top: 22px;
      left: 32px;
      width: 66px;
      height: 66px;
      line-height: 66px;
      font-size: 0;
      text-align: center;
      background: rgba(0 ,0 ,0 ,0.3);
      border-radius: 6px;
      z-index: 999999999;
      .iconfont {
        font-size: 32px;
        color: #fff;
      }
    }
    #coursePrompt{
      width: 100%;
      height: 411px;
      background: url('../../assets/img/courseDetailPromise.jpg') no-repeat;
      background-size: cover;
      .courseName{
        text-align: center;
        width: 560px;
        font-size: 36px;
        color: #fff;
        margin:181px auto 0;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        letter-spacing: 2px;
      }
      .prompt {
        width: 560px;
        margin: 16px auto 0;
        font-size: 22px;
        color: #e2dddd;
        text-align: center;
      }
    }
    #courseDetail_wrap {
      position: relative;
      flex: 1;
      font-size: 0px;
      color: #333333;
      border-top:2px solid #949494;
      #courseDetail_nav{
        height: 80px;
        line-height: 80px;
        box-shadow: 0 13px 26px #eef1f3;
        li {
          box-sizing: border-box;
          display: inline-block;
          width: 50%;
          height:100%;
          text-align: center;
          span {
            height:100%;
            box-sizing: border-box;
            display: inline-block;
            padding: 0 16px;
            font-size: 26px;
            font-weight: 700;
          }
          &.active {
            color: @bgColor;
            span {
              border-bottom: 8px solid @bgColor;
            }
          }
        }
      }
      #courseDetail_content {
        position: absolute;
        top: 80px;
        bottom: 0;
        left: 0;
        right: 0;
        overflow: hidden;
        height: inherit!important;
        box-sizing: border-box;
        overflow-y: auto;
        overflow-scrolling: touch;
        #cd_info {
          #info_header {
            margin-top: 44px;
            margin-left: 44px;
            font-size: 28px;
            font-weight: 700;
          }
          #info_sub {
            display: flex;
            margin: 30px 14px 0 14px;
            border-style: solid;
            border-color: #d9dde1;
            border-width: 1px 0;
            .sub_item {
              flex: 1;
              padding: 26px 0;
              text-align: center;
              border-right: 1px solid #d9dde1;
              span {
                display: block;
                font-size: 20px;
                color: #b0b0b0;
                &.sub_item_cont {
                  font-size: 28px;
                  color: #333;
                }
              }
              &:last-child {
                border-right: none;
              }
            }
          }
          #info_details {
            margin: 60px 33px;
            font-size: 24px;
            color: #666;
            letter-spacing: 1px;
            #course_info_title {
              margin-bottom: 20px;
              font-size: 26px;
              font-weight: 700;
              color: #333;
            }
          }
        }
        #know_list {
          .konw_item {
            border-bottom: 1px solid #dddddd;
            .konw_item_title {
              position: relative;
              display: block;
              padding: 40px 85px 45px 30px;
              padding-bottom: 40px;
              font-size: 28px;
              color: #333;
              &:after {
                font-family: iconfont;
                content: "\e608";
                position: absolute;
                top: 50%;
                right: 40px;
                transform: translateY(-50%);
              }
            }
            .sub_know_points{
              display: block;
              .sub_know_item{
                position: relative;
                margin:0 60px 50px 80px;
                padding-left: 40px;
                color: #999;
                font-size: 28px;
                &.can_play {
                  color: #333;
                }
                &.currentPlay {
                   color: @bgColor;
                }
                &:before {
                  font-family: iconfont;
                  content: '\e62f';
                  font-size: 21px;
                  line-height: 42px;
                  position: absolute;
                  vertical-align: top;
                  left: 0;
                  font-weight: 700;
                }
                &:last-child {
                   margin-bottom:40px;
                }
              }
            }
          }
        }
      }
    }
    #purchaseDom {
      position: relative;
      border-top: 1px solid #dddddd;
      height: 100px;
      line-height: 100px;
      background: #fff;
      #purchase_price {
        margin-left: 30px;
        font-size: 24px;
        color: #666666;
        span {
          font-weight: 700;
          margin-left: 24px;
          color: @bgColor;
          font-size: 28px;
        }
      }
      #purchaseBtm {
        position: absolute;
        width: 257px;
        height: 100%;
        right:0;
        top:0;
        font-size: 32px;
        color: #fff;
        text-align: center;
        background: @bgColor;
      }
    }
    #courseDetail_loading {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
    }
  }
</style>

