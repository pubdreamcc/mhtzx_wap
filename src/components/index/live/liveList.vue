<template>
<div id="liveList">
  <!--<vHeader :backShow="false">-->
    <!--<div slot="title">直播</div>-->
  <!--</vHeader>-->
  <ul class="pro-group">
    <li v-for="item in LiveList"  class="product-item" @click="toLiveDetail(item)">
        <div class="product-img">
            <img :src="item.image_url" alt="" :onerror="noImg" >
            <span class="mark">{{ item | capitalize }}</span>
        </div>
        <p class="product-name">{{item.title}}</p>
        <p class="product-info">{{item.name}}（{{item.position}}）</p>
    </li>
    <div class="nodata" v-if="isShow">
        <!--<img src="../common/img/no_live.png" alt="">-->
        <p>暂时没有直播内容哦！</p>
    </div>
  </ul>
</div>
</template>

<style lang="less" scoped>
  .pro-group{
    margin-bottom: 1.1rem;
  }
  .pro-group img {
    width: 100%;
    height: 3.74rem;
  }
  .product-item{
    padding-bottom: .4rem;
    margin-bottom: .1rem;
    background-color: #fff;
  }
  .product-img {
    position: relative;
    height: 3.74rem;
    overflow: hidden;
  }
  .product-img .mark {
    display: inline-block;
    position: absolute;
    top: .2rem;
    right: .3rem;
    padding: .1rem .2rem;
    /*height: .38rem;*/
    line-height: .24rem;
    border: 1px solid #fff;
    border-radius: .3rem;
    font-size: .24rem;
    color: #fff;
    background-color: rgba(0,0,0,.4);
  }
  .product-img .mark.living{
    padding-left: .4rem;
  }
  .product-img .mark.living:before{
    content: '';
    display: block;
    position: absolute;
    top: .16rem;
    left:.2rem;
    width: .13rem;
    height: .13rem;
    background-color: #00ff00;
    border-radius: 50%;
  }
  .product-name{
    margin: .3rem 0 .2rem 0;
    padding-left: .4rem;
    font-size: .32rem;
    color: #000;
  }
  .product-info{
    padding-left: .4rem;
    font-size: .24rem;
    color: #999;
  }
  .nodata{
    font-size: 0.3rem;
    margin-top: 3.5rem;
    text-align: center;
    color:#666;
  }
  .nodata img{
    width: 1.7rem;
    height: 1.66rem;
    margin-bottom: 0.3rem;
  }
</style>

<script>
  import header from '../../common/header';
  export default {
    name: '',
    data () {
      return {
        LiveList: [],
        isShow: false,
        livStatus: '',
        noImg: 'this.src="' + require('../../../assets/img/no_live_img.png') + '"'
      };
    },
    created () {
      this.getLiveList();
    },
    activated () {
      this.$emit('setHeader', {
        title: '直播',
        isShowHeader: true
      });
    },
    methods: {
      getLiveList () {
        let self = this;
        this.common.ajax({
          url: 'http://testgxapi.glzxedu.com/anchor/live_list',
          method: 'get',
          successCak (res) {
            if (res.result_code === 1 && res.result_data !== '' && res.result_data !== null && res.result_data.result !== null && res.result_data.result !== '') {
              self.LiveList = res.result_data.result;
            } else {
              this.isShow = true;
            }
          },
          errorCak (res) {
            this.isShow = true;
          }
        });
      },
      toLiveDetail (value) {
        let item = value;
        let liveUrl = '';
        if (item.is_live === '1' && item.record_type !== '1' && item.flv_url !== '') {
          liveUrl = item.flv_url;
        } else if (item.is_live === '0' && item.record_type === '1' && item.record !== '') {
          liveUrl = item.rtmp_url + item.clarity;
        } else {
        }
        if (liveUrl === '') {
          this.common.toast('该直播已结束', 'middle');
        } else {
          this.$router.push({path: '/liveDetail', query: {liveUrl: liveUrl}});
        }
      }
    },
    components: {
      vHeader: header
    },
    filters: {
      capitalize: function (item) {
        let livStatus = '';
        if (item.is_live === '1' && item.record_type !== '1' && item.flv_url !== '') {
          livStatus = '直播中';
        } else if (item.is_live !== '1' && item.record_type !== '1') {
          livStatus = '结束';
        } else if (item.is_live === '0' && item.record_type === '1' && item.record !== '') {
          livStatus = '回放';
        } else {
        }
        return livStatus;
      }
    }
  };
</script>
