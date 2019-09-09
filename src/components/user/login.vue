<template>
  <div id="login">
    <v-header>
      <div slot="title"></div>
    </v-header>
    <div class="login-title">
        账号登录
    </div>
    <div class="username input-wrapper">
      <input type="text" placeholder="请输入用户名" v-model="userName">
      <div class="phone icon icon_left">
        <img src="../../assets/img/phone.png" alt="">
      </div>
      <div class="del icon icon_right" v-if="userName" @click="del">
        <img src="../../assets/img/del.png" alt="">
      </div>
    </div>
    <div class="password input-wrapper">
      <input :type="psdType" placeholder="请输入密码" v-model="password">
      <div class="lock icon icon_left">
        <img src="../../assets/img/lock.png" alt="">
      </div>
      <div class="eye icon icon_right" @click="clickEye" v-if="password">
        <img src="../../assets/img/londing_eye_icom.png" alt="" v-if="passwordShow">
        <img src="../../assets/img/mmkj.png" alt="" v-if="!passwordShow">
      </div>
    </div>
    <div class="btn">
      <button @click="login">登录</button>
    </div>
  </div>
</template>

<style lang="less">
  .login-title{
    text-align:center;
    font-size:52px;
    margin:50px 0 114px;
  }
  .input-wrapper{
    height:88px;
    width:100%;
    padding:0 30px;
    box-sizing:border-box;
    margin-bottom: 30px;
    position:relative;
    input{
      height:100%;
      width:100%;
      border:none;
      border-radius:44px;
      border:1px solid #ccc;
      vertical-align: top;
      font-size: 30px;
      padding-left:100px;
      box-sizing: border-box;
    }
    .phone,.lock{
      position:absolute;
      height:30px;
      width:24px;
      left:80px;
      top:50%;
      transform:translateY(-50%);
    }
    .del{
      height:26px;
      width:26px;
      border-radius:26px;
      right:72px;
      top:50%;
      transform:translateY(-50%);
    }
    .eye{
      height:22px;
      width: 32px;
      right:72px;
      top:50%;
      transform:translateY(-50%);
    }
    .icon{
      position:absolute;
      img{
        height:100%;
        width:100%;
        vertical-align: top;
      }
    }
  }
  .btn{
    width:100%;
    height:90px;
    box-sizing:border-box;
    padding: 0 30px;
    margin-top:114px;
    button{
      height:100%;
      width:100%;
      border:none;
      border-radius:45px;
      background:#d91a1a;
      color:#fff;
      font-size:36px;
      font-weight:700
    }
  }
</style>

<script>
  import header from '../common/header';
  export default {
    name: '',
    data () {
      return {
        userName: '',
        password: '',
        passwordShow: false,
        psdType: 'password',
        preRoute: ''
      };
    },
    created () {
      this.preRoute = this.$route.query.redirect;
    },
    methods: {
      clickEye () {
        this.passwordShow = !this.passwordShow;
        this.psdType = !this.passwordShow ? 'password' : 'text';
      },
      del () {
        this.userName = '';
      },
      login () {
        let self = this;
        let infoReg = /^\w{1,20}$/g;
        if (this.password && this.userName && this.userName.match(infoReg) && this.password.match(infoReg)) {
          self.Indicator.open();
          let params = {
            loginType: 0,
            userAccount: this.userName,
            password: this.password,
            equipmentType: 3
          };
          // let url = 'http://10.1.49.100:8080/app-user/rest/v1/login/mobileLogin';
          this.common.ajax({
            method: 'post',
            url: '/app-user/rest/v1/login/mobileLogin',
            data: {
              params: JSON.stringify(params)
            },
            successCak (res) {
              self.Indicator.close();
              if (res.code === 0) {
                let loginData = res.data;
                self.common.setUserInfo(loginData);
                if (self.preRoute) {
                  self.$router.push(self.preRoute);
                } else {
                  self.$router.back(-1);
                }
              } else {
                self.common.toast(res.msg);
              }
            }
          });
        } else {
          if (!this.userName) {
            this.common.toast('请输入用户名');
          } else if (!this.password) {
            this.common.toast('请输入密码');
          } else if (!this.userName.match(infoReg)) {
            this.common.toast('用户名格式错误');
          } else if (!this.password) {
            this.common.toast('密码格式错误');
          }
        }
      }
    },
    components: {
      vHeader: header
    }
  };
</script>
