<template>
  <div id="index">
    <!--头部-->
    <vHeader v-if="headerContent.isShowHeader" :backShow="headerContent.showBack" @leftCallBack="headerContent.leftCallBack">
      <div slot="title">{{headerContent.title}}</div>
      <div slot="left">{{headerContent.left}}</div>
    </vHeader>
    <!--主体-->
    <transition :name="transitionName">
      <keep-alive>
          <router-view @setHeader="setHeader" :class="headerContent.isShowHeader?'':'no_header_top'" class="routerAnimation mescroll" @push="push" id="indexBody"></router-view>
      </keep-alive>
    </transition>
    <!--底部-->
    <mt-tabbar v-model="selected" id="indexFooter">
      <mt-tab-item class="tabItem" id="home">
        <img slot="icon" :src="selected!='home'? require('@/assets/img/home.png') : require('@/assets/img/home_active.png') ">
        首页
      </mt-tab-item>
      <mt-tab-item class="tabItem" id="resouceCenter">
        <img slot="icon" :src="selected!='resouceCenter' ? require('@/assets/img/courseCenter.png') : require('@/assets/img/courseCenter_active.png') ">
        资源中心
      </mt-tab-item>
<!--       <mt-tab-item class="tabItem" id="live">
        <img slot="icon" :src="selected!='live' ? require('@/assets/img/live.png') : require('@/assets/img/live_active.png') ">
        直播
      </mt-tab-item> -->
      <mt-tab-item class="tabItem" id="myself">
        <img slot="icon" :src="selected!='myself' ? require('@/assets/img/myself.png') : require('@/assets/img/myself_active.png') ">
        我的
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
  import { Tabbar, TabItem } from 'mint-ui';
  import vHeader from '../common/header';
  export default {
    name: '',
    data () {
      return {
        selected: this.$route.name,
        transitionName: 'slide-left',
        isBack: '',
        preUrlIndex: 0,
        headerContent: {
          title: '',
          left: '',
          showBack: false,
          isShowHeader: true,
          leftCallBack () {

          }
        }
      };
    },
    created () {
      let preUrlIndex = null;
      switch (this.selected) {
        case 'home':
          preUrlIndex = 0;
          break;
        case 'resouceCenter':
          preUrlIndex = 1;
          break;
        case 'live':
          preUrlIndex = 2;
          break;
        case 'myself':
          preUrlIndex = 3;
          break;
      }
      this.preUrlIndex = preUrlIndex;
    },
    watch: {
      $route (newVal) {
        this.selected = newVal.name;
      },
      selected (toUrl) {
        let currentUrlIndex;
        switch (toUrl) {
          case 'home':
            currentUrlIndex = 0;
            break;
          case 'resouceCenter':
            currentUrlIndex = 1;
            break;
          case 'live':
            currentUrlIndex = 2;
            break;
          case 'myself':
            currentUrlIndex = 3;
            break;
        }
        if (currentUrlIndex !== this.preUrlIndex) {
          if (currentUrlIndex > this.preUrlIndex) {
            this.transitionName = 'slide-left';
          } else {
            this.transitionName = 'slide-right';
          }
          this.preUrlIndex = currentUrlIndex;
        }
        if (this.$route.name !== toUrl) {
          this.$router.push(toUrl);
        }
      }
    },
    components: {
      mtTabbar: Tabbar,
      mtTabItem: TabItem,
      vHeader
    },
    methods: {
      push (toUrl) {
        this.selected = toUrl;
      },
      setHeader (params) {
        this.headerContent.title = params.title || '';
        this.headerContent.left = params.left || '';
        if (params.showBack !== undefined) {
          this.headerContent.showBack = params.showBack;
        }
        if (params.isShowHeader !== undefined) {
          this.headerContent.isShowHeader = params.isShowHeader;
        }
        this.headerContent.leftCallBack = params.leftCallBack || function () {};
      }
    }
  };
</script>

<style scoped>
  #index{
    height: 100%;
    overflow: hidden;
    position: relative;
  }
  #indexBody{
    position: absolute;
    top:88px;
    bottom: 92px;
    left: 0;
    right: 0;
    overflow-y: auto;
  }
  #indexFooter{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 92px;
  }
  .mescroll{
    height: auto!important;
  }
  .no_header_top{
    top:0!important;
  }
</style>
<style>
  #index .tabItem .mint-tab-item-icon{
    width: 44px;
    height: 44px;
    margin: 5px auto 5px;
  }
  #index .tabItem .mint-tab-item-label{
    font-size: 20px;
  }
  #index .mint-tabbar{
    background: #141414;
    color: #787775;
  }
  #index .mint-tabbar > .mint-tab-item.is-selected{
    background: inherit!important;
    color: #ffffff;
  }
</style>

