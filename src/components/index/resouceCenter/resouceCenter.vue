<template>
    <div class="resouceCenter" id="resouceCenter">
        <!--<v-header :backShow="false">-->
            <!--<div slot="title">资源中心</div>-->
        <!--</v-header>-->
        <!--模拟的标题-->
        <div class="header tab-wrap">
            <ul class="tab-group">
                <li class="item" v-for="(item,index) in navList" :class="{active:index === num}" @click="tab(index)">{{item.name}}</li>
            </ul>
            <div class="mask" v-show="maskShow" @click="mask()">
                <ol class="options" v-show="olShow === v" v-for="(item,v) in sort">
                    <li class="o-list" v-for="list in item" :value="v" @click="classify(list.classify,v)">{{list.name}}</li>
                </ol>
            </div>
        </div>
        <!--滑动区域-->
        <div class="list-wrap">
            <div id="mescroll" class="mescroll">
                <!--展示上拉加载的数据列表-->
                <ul id="dataList" class="data-list list-group" v-cloak>
                    <router-link class="item cf" v-for="v in pdlist" tag="li" :to="'/courseDetail/'+v.courseId" :key="v.courseId">
                        <div class="left"><img class="c-img" v-lazy="FILE_URL + v.imgUrl"/></div>
                        <dl class="right">
                            <dt class="class-name">{{v.courseName}}</dt>
                            <dd class="class-price">{{v.price | priceFil}}</dd>
                        </dl>
                    </router-link>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
  // import axios from 'axios';
  import header from '../../common/header';
  import MeScroll from 'mescroll.js';
  import '../../../assets/css/mescroll.min.css';

  export default {
    name: 'HelloWorld',
    data () {
      return {
        navList: [{'name': '综合排序', 'id': 0}, {'name': '课程分类', 'id': 1}, {'name': '价格分类', 'id': 2}],
        // 查询  分类
        sort: {
          sort: [{name: '综合排序', classify: -1}, {name: '最新排序', classify: 0}, {name: '人气排序', classify: 1}],
          courseType: [{name: '全部分类', classify: -1}, {name: '公共课程', classify: 0}, {name: '专业课程', classify: 1}],
          price: [{name: '全部课程', classify: -1}, {name: '免费课程', classify: 0}, {name: '付费课程', classify: 1}]
        },
        num: -1,
        maskShow: false,
        olShow: '',
        mescroll: null,
        pdlist: [],
        FILE_URL: '',
        paramData: {
          params: {
            courseType: '-1',
            price: -1,
            sort: -1
          },
          page: {
            pageNo: 0,
            pageSize: 0
          }
        },
        totalPage: 0
      };
    },
    mounted () {
      var self = this;
      // 创建MeScroll对象,down可以不用配置,因为内部已默认开启下拉刷新,重置列表数据为第一页
      // 解析: 下拉回调默认调用mescroll.resetUpScroll(); 而resetUpScroll会将page.num=1,再执行up.callback,从而实现刷新列表数据为第一页;
      self.mescroll = new MeScroll('mescroll', { // 请至少在vue的mounted生命周期初始化mescroll,以确保您配置的id能够被找到
        //   down: {
        //   auto: false, //是否在初始化完毕之后自动执行下拉回调callback; 默认true
        //   callback: self.alert //下拉刷新的回调
        // },
        up: {
          callback: self.upCallback, // 上拉回调
          // 以下参数可删除,不配置
          isBounce: false, // 此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
          // page:{size:8}, // 可配置每页8条数据,默认10
          toTop: { // 配置回到顶部按钮
            // src: 'src/assets/img/mescroll-totop.png'// 默认滚动到1000px显示,可配置offset修改
            // html: null, //html标签内容,默认null; 如果同时设置了src,则优先取src
            // offset : 1000
          },
          page: {
            num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
            size: 10, // 每页数据的数量
            time: null // 加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
          },
          empty: { // 配置列表无任何数据的提示
            warpId: 'dataList',
            icon: 'src/assets/img/mescroll-empty.png',
            tip: '暂时没有你要的内容哦！'
              /* btntext: "去逛逛 >",
               btnClick: function () {
               console.log("点击了去逛逛按钮");
               } */
          }
          // vue的案例请勿配置clearId和clearEmptyId,否则列表的数据模板会被清空
          // vue的案例请勿配置clearId和clearEmptyId,否则列表的数据模板会被清空
          // clearId: "dataList",
          // clearEmptyId: "dataList"
        }
      });
    },
    filters: {
      priceFil: function (value) {
        if (value === (-1)) {
          return '免费';
        } else {
          return '￥' + value;
        }
      }
    },
    activated () {
      this.$emit('setHeader', {
        title: '资源中心',
        isShowHeader: true
      });
    },
    methods: {
      tab (index) {
        this.maskShow = !this.maskShow;
        this.num = index;
        if (index === 0) {
          this.olShow = 'sort';
        } else if (index === 1) {
          this.olShow = 'courseType';
        } else if (index === 2) {
          this.olShow = 'price';
        }
      },
      mask () {
        this.maskShow = !this.maskShow;
        this.num = -1;
      },
      classify (classify, value) {
        let self = this;
        if (value === 'sort') {
          self.paramData.params.sort = classify;
        } else if (value === 'courseType') {
          self.paramData.params.courseType = classify;
        } else if (value === 'price') {
          self.paramData.params.price = classify;
        }
        self.mescroll.resetUpScroll();
      },
        /* imgErr (event) {
         event.target.src = 'src/assets/img/default_course.png';
         }, */
      alert () {
        // console.log(location);
        setTimeout(function () {
          window.location.href = location.origin + location.pathname;
        }, 500);
        // location.reload()
      },
      // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
      upCallback: function (page) {
        // 联网加载数据
        var self = this;
        self.FILE_URL = self.common.BASE_FILE_URL;
        self.paramData.page.pageNo = page.num;
        self.paramData.page.pageSize = page.size;
        self.getListDataFromNet(self, page.num, page.size, function (curPageData) {
          //  curPageData = []; // 打开本行注释,可演示列表无任何数据empty的配置

          // 如果是第一页需手动制空列表 (代替clearId和clearEmptyId的配置)
          if (page.num === 1) self.pdlist = [];

          // 更新列表数据
          self.pdlist = self.pdlist.concat(curPageData);
          // 联网成功的回调,隐藏下拉刷新和上拉加载的状态;
          // mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
          // console.log('page.num=' + page.num + ', page.size=' + page.size + ', curPageData.length=' + curPageData.length + ', self.pdlist.length==' + self.pdlist.length);

          // 方法一(推荐): 后台接口有返回列表的总页数 totalPage
          self.mescroll.endByPage(curPageData.length, self.totalPage); // 必传参数(当前页的数据个数, 总页数)

          // 方法二(推荐): 后台接口有返回列表的总数据量 totalSize
          // self.mescroll.endBySize(curPageData.length, totalSize); // 必传参数(当前页的数据个数, 总数据量)

          // 方法三(推荐): 您有其他方式知道是否有下一页 hasNext
            /* var hasNext;
             if (page.num <= self.totalPage) {
             hasNext = true;
             } else {
             hasNext = false;
             } */
          // self.mescroll.endSuccess(curPageData.length, hasNext); // 必传参数(当前页的数据个数, 是否有下一页true/false)

          // 方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据,如果传了hasNext,则翻到第二页即可显示无更多数据.
          // self.mescroll.endSuccess(curPageData.length);
        }, function () {
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        });
      },
        /* 联网加载列表数据 */
      getListDataFromNet: function (self, pageNum, pageSize, successCallback, errorCallback) {
        // 延时一秒,模拟联网
        setTimeout(function () {
          // console.log(self.paramData)
          self.common.ajax({
            url: '/app-teach/rest/v1/course/resourceCourseInfoPage',
            method: 'get',
            params: self.paramData,
            successCak (rec) {
              // console.log(rec);
              if (rec.code === 0) {
                self.totalPage = rec.data.totalPages;
                let result = rec.data.result;
                successCallback(result);
              }
            }
          });
        }, 1000);
      }
    },
    components: {
      vHeader: header
    }
  };
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    * {
        box-sizing: border-box;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -webkit-tap-highlight-color: transparent;
    }
    .cf:after {
        display: block;
        clear: both;
        content: "";
        visibility: hidden;
        height: 0;
    }
    .cf {
        zoom: 1;
    }
    .hide {
        display: none;
    }
    .show {
        display: block;
    }
    .resouceCenter #header {
        position: fixed;
        top: 0;
        z-index: 99;
    }
    /*模拟的标题*/
    .tab-wrap {
        z-index: 99;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        background-color: #fff;
        border-bottom: 1px solid #d9dde1;
        font-size: 14px;
        .tab-group {
            height: 90px;
            padding-top: 30px;
            text-align: center;
        }
        .item {
            position: relative;
            width: 248px;
            display: inline-block;
            height: 40px;
            border-right: 1px solid #d9dde1;
            font-size: 30px;
            &.active {
                color: #d73a31;
            }
            &.active:after {
                top: 15px;
                border-top-color: #d73a31;
                border-bottom-color: transparent;
            }
            &:last-child {
                border-right: none;
            }
            &:after {
                content: '';
                position: absolute;
                top: 8px;
                right: 30px;
                height: 0;
                border: 10px solid transparent;
                border-bottom-color: #000;
            }
        }
        .mask { //遮罩
            position: fixed;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, .5);
            .options {
                margin: 0;
                padding: 10px 0;
                background-color: #fff;
            }
            .o-list {
                padding: 40px 30px 40px 60px;
                font-size: 30px;
            }
        }
    }
    .list-wrap {
        position: absolute;
        font-size: 14px;
        bottom: 0;
        top: 88px;
        left: 0;
        right: 0;
        .list-group {
            padding-left: 30px;
        }
        .item {
            height: 220px;
            padding: 30px 0;
            border-bottom: 1px solid #d9dde1;
            .left, .right {
                float: left;
            }
            .left {
                width: 260px;
                height: 160px;
                border-radius: 4px;
                overflow: hidden;
            }
            .c-img {
                width: 260px;
                height: 160px;
            }
            .right {
                padding-left: 30px;
                width: 400px;
                font-size: 16px;
            }
            .class-name {
                padding-top: 15px;
                font-size: 30px;
            }
            .class-price {
                padding-top: 15px;
                color: #d91a1a;
                font-size: 28px;
            }
        }
    }
    /*vue*/
    [v-cloak] {
        display: none;
    }
    /*mescroll滚动的区域*/
    .mescroll {
    }
    /*展示上拉加载的数据列表*/
</style>
<style>
    /*.mescroll-empty {
        padding: 310px 30px 0 0;
        width: auto;
    }
    .empty-tip {
        margin-top: 20px;
        font-size: 28px;
    }
    .mescroll-totop {
        bottom: 60px;
    }*/
</style>
