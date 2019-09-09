import Vue from 'vue';
import Router from 'vue-router';

const index = () => import('@/components/index/index');
const home = () => import('@/components/index/home/home');
const resouceCenter = () => import('@/components/index/resouceCenter/resouceCenter');
const live = () => import('@/components/index/live/liveList');
const myself = () => import('@/components/index/myself/myself');
const login = () => import('@/components/user/login');
const catagory = () => import('@/components/index/home/catagory');
const liveDetail = () => import('@/components/index/live/liveDetail');
const book = () => import('@/components/index/myself/book/book');
const credit = () => import('@/components/index/myself/credit/credit');
const exam = () => import('@/components/index/myself/exam/exam');
const homework = () => import('@/components/index/myself/homework/homework');
const myCourse = () => import('@/components/index/myself/myCourse/myCourse');
const myOrder = () => import('@/components/index/myself/myOrder/myOrder');
const personalInfo = () => import('@/components/index/myself/personalInfo/personalInfo');
const record = () => import('@/components/index/myself/record/record');
const score = () => import('@/components/index/myself/score/score');
const courseDetail = () => import('@/components/productDetails/courseDetail');
const errPage = () => import('@/components/common/errPage');

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: index,
      children: [
        {
          path: '/home',
          name: 'home',
          component: home,
          meta: {
            title: '国匠在线'
          }
        },
        {
          path: '/resouceCenter',
          name: 'resouceCenter',
          component: resouceCenter,
          meta: {
            title: '资源中心'
          }
        },
        {
          path: '/live',
          name: 'live',
          component: live,
          meta: {
            title: '直播'
          }
        },
        {
          path: '/myself',
          name: 'myself',
          component: myself,
          meta: {
            requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
            title: '我的'
          }
        }
      ],
      redirect: '/home'
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: {
        title: '国匠在线-登录'
      }
    },
    {
      path: '/catagory',
      name: 'catagory',
      component: catagory,
      meta: {
        title: '国匠在线-分类'
      }
    },
    {
      path: '/liveDetail',
      name: 'liveDetail',
      component: liveDetail,
      meta: {
        title: '国匠在线-直播播放'
      }
    },
    {
      path: '/book',
      name: 'book',
      component: book,
      meta: {
        title: '国匠在线-预定'
      }
    },
    {
      path: '/credit',
      name: 'credit',
      component: credit
    },
    {
      path: '/exam',
      name: 'exam',
      component: exam
    },
    {
      path: '/homework',
      name: 'homework',
      component: homework
    },
    {
      path: '/myCourse',
      name: 'myCourse',
      component: myCourse
    },
    {
      path: '/myOrder',
      name: 'myOrder',
      component: myOrder
    },
    {
      path: '/personalInfo',
      name: 'personalInfo',
      component: personalInfo
    },
    {
      path: '/record',
      name: 'record',
      component: record
    },
    {
      path: '/score',
      name: 'score',
      component: score
    },
    {
      path: '/courseDetail/:courseId',
      name: 'courseDetail',
      component: courseDetail,
      meta: {
        title: '国匠在线-课程详情'
      }
    },
    {
      path: '*',
      name: 'errPage',
      component: errPage,
      meta: {
        title: '国匠在线-404'
      }
    }
  ]
});
