<template>
  <div id="myCourse">
    <!--标题-->
    <div class="myCourse_header">
      <vHeader>
        <div slot="title">我的课程</div>
      </vHeader>
      <div class="myCourse_nav">
        <p :class="{active:key == tabActive}" i="0" v-for="(item,key) in tabList" @click="clickNav(key)">
          {{item.tabName}}
        </p>
      </div>
      <div id="myCourse_content">
        <!--首页-->
        <div :id="'mescroll'+key" class="mescroll" :class="{hide: tabActive != key}" v-for="(item,key) in tabList" :key="'myCourse_Item'+key">
          <ul :id="'dataList'+key" class="data-list">
            <router-link :to="'/courseDetail/'+subItem.courseId" tag="li" v-for="(subItem,subKey) in tabData[key]" :key="'myCourse_subItem'+subItem.courseId">
              <div class="list_image">
                <img v-lazy="addPrefix(subItem.imgUrl)" alt="">
                <span>学习到：iso9000现象</span>
              </div>
              <p class="list_title">{{subItem.courseName}}</p>
              <p class="list_num">{{subItem.knowPointCount}}微课时</p>
            </router-link>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import vHeader from '../../../common/header';
  import MeScroll from 'mescroll.js';
  export default {
    name: '',
    components: {
      vHeader
    },
    data () {
      return {
        tabList: [
          {
            tabName: '公共基础课',
            tabAjaxUrl: 'app-user/rest/v1/student/stuCourseInfo'
          },
          {
            tabName: '专业技能课',
            tabAjaxUrl: 'app-user/rest/v1/student/stuCourseInfo'
          },
          {
            tabName: '付费课程',
            tabAjaxUrl: 'app-teach/rest/v1/course/stuCourseInfoByCategoryId'
          }
        ],
        tabActive: 0,
        // 存放mescroll实例
        mescrollArr: [],
        userInfo: {},
        tabData: []
      };
    },
    created () {
      this.userInfo = this.common.getUserInfo();
      for (let i = 0; i < this.tabList.length; i++) {
        this.tabData.push([]);
      }
    },
    mounted () {
      this.mescrollArr[0] = this.initMescroll('mescroll' + 0, 'dataList' + 0);
    },
    watch: {
      tabActive (i, oldIndex) {
        // 隐藏返回顶部按钮
        this.mescrollArr[oldIndex].hideTopBtn();
        // 是否已经实例化
        if (this.mescrollArr[i] === undefined) {
          this.mescrollArr[i] = this.initMescroll('mescroll' + i, 'dataList' + i);
        } else {
          // 检查是否需要显示回到到顶按钮
          let curMescroll = this.mescrollArr[i];
          let curScrollTop = curMescroll.getScrollTop();
          if (curScrollTop >= curMescroll.optUp.toTop.offset) {
            curMescroll.showTopBtn();
          } else {
            curMescroll.hideTopBtn();
          }
        }
      }
    },
    methods: {
      addPrefix (path) {
        let url = '';
        if (this.tabActive !== 2) {
          url = this.common.BASE_URL + path;
        } else {
          url = this.common.BASE_FILE_URL + path;
        }
        return url;
      },
      clickNav (index) {
        this.tabActive = index;
      },
      initMescroll (mescrollId, clearEmptyId) {
        // 创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,刷新列表数据;
        let mescroll = new MeScroll(mescrollId, {
          // 上拉加载的配置项
          up: {
            callback: this.getListData, // 上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
            isBounce: false, // 此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
            noMoreSize: 4, // 如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
            empty: {
              icon: require('../../../../assets/img/mescroll-empty.png'), // 图标,默认null
              tip: '暂无相关数据~' // 提示
            },
            clearEmptyId: clearEmptyId, // 相当于同时设置了clearId和empty.warpId; 简化写法;默认null
            toTop: { // 配置回到顶部按钮
              src: require('../../../../assets/img/mescroll-totop.png') // 默认滚动到1000px显示,可配置offset修改
            }
          }
        });
        return mescroll;
      },
      getListData (page) {
        // 联网加载数据
        let dataIndex = this.tabActive; // 记录当前联网的nav下标,防止快速切换时,联网回来curNavIndex已经改变的情况;
        let _this = this;
        this.getListDataFromNet(dataIndex, page.num, page.size, function (pageData) {
          let totalPage = pageData.data.totalPages;
          pageData = pageData.data.result;
          _this.mescrollArr[dataIndex].endByPage(pageData.length, totalPage); // 必传参数(当前页的数据个数, 总页数)
          // 设置列表数据
          _this.setListData(pageData, dataIndex);
        }, function () {
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          _this.mescrollArr[dataIndex].endErr();
        });
      },
      getListDataFromNet (curNavIndex, pageNum, pageSize, successCallback, errorCallback) {
        let params = {
          url: this.tabList[curNavIndex].tabAjaxUrl,
          data: {
            courseType: curNavIndex,
            pageNo: pageNum,
            pageSize: pageSize,
            courseName: '',
            userAccount: this.userInfo.studentInfo.userAccount,
            ticket: this.userInfo.ticket,
            userId: this.userInfo.studentInfo.id,
            bought: 1,
            equipmentType: 3
          },
          method: 'post',
          successCak (ret) {
            setTimeout(function () {
              if (ret.code === 0) {
                successCallback(ret);
              } else {
                errorCallback(ret);
              }
            }, 500);
          },
          errorCak (ret) {
            errorCallback(ret);
          }
        };
        this.common.ajax(params);
      },
      setListData (pageData, dataIndex) {
        this.tabData[dataIndex].push.apply(this.tabData[dataIndex], pageData);
      }
    }
  };
</script>
<style lang="less" >
  @bgColor: #d73a31;
  @import '../../../../assets/css/mescroll.min.css';
  /*模拟的标题*/
  .myCourse_header{
    z-index: 9990;
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    text-align: center;
    background-color: white;
    .myCourse_nav  {
      display: flex;
      border-bottom: 1px solid #ddd;
      p {
        text-align: center;
        display: inline-block;
        font-size: 30px;
        padding: 30px 0;
        flex: 1;
        &.active{
           border-bottom: 1px solid @bgColor;
           color: @bgColor;
        }
      }
    }
  }
  #myCourse_content{
    /*列表*/
    .mescroll{
      position: fixed;
      top: 195px;
      bottom: 0;
      height: auto;
    }
    #courseList{
      font-size: 0;
    }
    .data-list {
      text-align: left;
    }
    li{
      position: relative;
      display: inline-block;
      overflow: hidden;
      width:49.7%;
      height:3.02rem;
      font-size: 0.24rem;
      margin-right:0.04rem;
      z-index: 99999999999999;
      &:nth-child (2n) {
        margin-right: 0rem;
      }
      .list_image{
        position: relative;
        height:2.02rem;
        margin-bottom: 0.16rem;
        img{
          width:100%;
          height:100%;
        }
        span{
          box-sizing: border-box;
          position: absolute;
          bottom: 0;
          left:0;
          padding-left:0.22rem;
          width:100%;
          height:0.4rem;
          background: rgba(23,20,13,0.3);
          color: #ffffff;
          font-size: 0.16rem;
          line-height:0.4rem;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
      }
      .list_title {
        margin-left: 0.22rem;
        margin-bottom:0.04rem;
        font-size: 0.26rem;
        color: #17140d;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      .list_num{
        margin-left: 0.22rem;
        font-size: 0.24rem;
        color:#8b8b8b;
      }
      &:active{
        background: #f5f5f5;
      }
    }
  }
</style>
<style>
  .hide {
    display: none!important;
  }
  #myCourse_content li:nth-child(2n){
    margin-right: 0;
  }
</style>

