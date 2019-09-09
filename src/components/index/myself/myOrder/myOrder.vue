<template>
  <div id="myOrder">
    <vHeader>
      <div slot="title">我的订单</div>
    </vHeader>
    <div class="tab-pannel">
      <div class="pannel-item" :class="{'active':isActive == index}" v-for="(nav, index) in navList" @click="getOrderType(index)">{{nav.title}}</div>
    </div>
    <div class="tab-content">
      <div id="mescroll" class="mescroll">
        <div class="product" v-for="(order,index) in orderList">
          <div class="order-head">订单编号：<span class="order-num">{{order.id}}</span></div>
          <div class="order-body">
            <div class="simg"><img :src="imgFile + order.cover"> </div>
            <div class="info">
              <p class="title">{{order.courseName}}</p>
              <p class="price"><em title="388.00"><b>￥</b>{{order.price}}</em></p>
            </div>
          </div>
          <div class="order-footer">
            <div class="btn-detail"><a href="#" role="button">查看详情</a></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  #myOrder{
    background: #f3f5f7;
  }
  #header{
    position: fixed;
    top: 0;
    z-index: 999;
  }
  #mescroll{
    position: fixed;
    top: 100px;
    bottom: 0;
  }
  .tab-pannel{
    width: 100%;
    height: 100px;
    line-height: 100px;
    border-bottom: 4px solid #f3f5f7;
    font-size: 34px;
    color: #666;
    background: #fff;
    position: fixed;
    top: 88px;
    z-index: 999;
  }
  .tab-pannel div{
    display: inline-block;
  }
  .pannel-item{
    margin-left: 180px;
  }
  .tab-pannel .active{
    color: #d73a31;
    height: 94px;
    border-bottom: 6px solid  #d73a31;
  }
  .product{
    margin-bottom: 15px;
    background: #fff;
  }
  .order-head{
    height: 79px;
    line-height: 79px;
    border-bottom: 1px solid #d9dde1;
    padding-left: 35px;
    font-size: 26px;
    color: #666;
  }
  .order-body{
    padding: 30px 35px 30px 30px;
    overflow: hidden;
    border-bottom: 1px solid #d9dde1;
  }
  .order-body .simg{
    float: left;
    width: 226px;
    height: 135px;
    display: inline-block;
  }
  .order-body .simg img{
    width: 100%;
    height: 100%;
  }
  .order-body .info{
    float: left;
    margin-left: 30px;
    width: 420px;
  }
  .order-body .info .title{
    font-size: 30px;
    color: #333;
    height: 70px;
    margin-top: 10px;
    line-height: 35px;
  }
  .order-body .info .price{
    font-size: 28px;
    color: #d91a1a;
    margin-top: 15px;
    line-height: 27px;
  }
  .order-footer{
    height: 80px;
    padding: 25px 40px 0 0;
  }
  .order-footer .btn-detail{
    float: right;
    font-size: 24px;
    width: 138px;
    height: 53px;
    line-height: 53px;
    text-align: center;
    overflow: hidden;
    border: 1px solid #666;
  }
  .order-footer .btn-detail a{
    color: #666;
    text-decoration: none;
  }
</style>

<script>
  import vHeader from '../../../common/header.vue';
  import MeScroll from 'mescroll.js';
  import '../../../../assets/css/mescroll.min.css';
  export default {
    name: '',
    data () {
      return {
        isActive: 0,
        navList: [
          {title: '待付款'},
          {title: '已完成'}
        ],
        status: 0,
        userId: this.common.getUserInfo().studentInfo.id,
        imgFile: this.common.BASE_FILE_URL,
        result: {},
        orderList: [],
        paramData: {
          params: {
            userId: this.common.getUserInfo().studentInfo.id,
            status: 0
          },
          page: {
            pageNo: 0,
            pageSize: 4
          }
        }
      };
    },
    components: {
      vHeader
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
    methods: {
      getOrderList (status) {
        let self = this;
        let params = {
          userId: this.userId,
          status: status
        };
        let page = {
          pageNo: '1',
          pageSize: '4'
        };
        this.common.ajax({
          url: '/app-user/rest/v1/order/showMyOrderList',
          method: 'post',
          data: {params: JSON.stringify(params), page: JSON.stringify(page)},
          successCak (res) {
            self.orderList = JSON.parse(res.data);
            console.log(self.orderList);
          }
        });
      },
      getOrderType (num) {
        let self = this;
        self.orderList = [];
        self.isActive = num;
        self.paramData.params.status = num;
        let page = {
          pageNo: self.paramData.page.pageNo,
          pageSize: self.paramData.page.pageSize
        };
        self.upCallback(page);
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
          if (page.num === 1) self.orderList = [];
          // 更新列表数据
          self.orderList = self.orderList.concat(curPageData);
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
          self.common.ajax({
            url: '/app-user/rest/v1/order/showMyOrderList',
            method: 'post',
            params: self.paramData,
            successCak (rec) {
              if (rec.code === 0) {
                let data = JSON.parse(rec.data);
                self.totalPage = data.totalPages;
                let result = data.result;
                successCallback(result);
              }
            }
          });
        }, 1000);
      }
    },
    created () {
    }
  };
</script>
