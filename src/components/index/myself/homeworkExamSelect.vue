<template>
  <div id="homeworkExamSelect">
    <ul class="test_header">
      <li class="test_type" id="type" @click="showMask('type')">
        <div class="typeDiv" :class="isMaskShow == 'type'?'active':''"><span class="header_title" id="t_type">{{selectList[0].name}}</span><span class="top_ico" :class="isMaskShow == 'type'?'red':''"></span></div>
        <div class="mask" v-show="isMaskShow == 'type'" @click.stop="closeMask()">
          <ul class="options">
            <li v-for="item in typeList" class="o-list" @click="setSelectCondition(0,item.name,item.id)">{{item.name}}</li>
          </ul>
        </div>
      </li>
      <li  class="test_type" id="course" @click="showMask('course')">
        <div class="typeDiv" :class="isMaskShow == 'course'?'active':''"><span class="header_title" id="t_course" name="all">{{selectList[1].name}}</span><span class="top_ico" :class="isMaskShow == 'course'?'red':''"></span></div>
        <div class="mask" v-show="isMaskShow == 'course'" @click.stop="closeMask()">
          <ul id="allCourse" class="options">
            <li class="o-list" @click="setSelectCondition(1,'全部课程','')">全部课程</li>
            <li v-for="item in courseList" class="o-list" @click="setSelectCondition(1,item.courseName,item.courseId)">{{item.courseName}}</li>
          </ul>
        </div>
      </li>
      <li  class="test_type" id="status" @click="showMask('status')">
        <div class="typeDiv" :class="isMaskShow == 'status'?'active':''"><span class="header_title" id="t_status">{{selectList[2].name}}</span><span class="top_ico" :class="isMaskShow == 'status'?'red':''"></span></div>
        <div class="mask" v-show="isMaskShow == 'status'" @click.stop="closeMask()">
          <ul class="options">
            <li v-for="item in statusList" class="o-list" @click="setSelectCondition(2,item.name,item.id)">{{item.name}}</li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
    export default {
      name: '',
      props: {
        typeList: Array,
        statusList: Array,
        vName: String
      },
      data () {
        return {
          isMaskShow: '',
          selectList: [{'name': '类型', 'id': '-1'}, {'name': '所属课程', 'id': ''}, {'name': '状态', 'id': '-1'}],
          courseList: [],
          resultList: [],
          studentInfo: this.common.getUserInfo().studentInfo
        };
      },
      created () {
        this.getHomeworkList('-1', '', '-1');
        this.getCourseList();
      },
      methods: {
        showMask (val) {
          if (this.isMaskShow === val) {
            this.isMaskShow = '';
          } else {
            this.isMaskShow = val;
          }
        },
        closeMask () {
          this.isMaskShow = '';
        },
        getCourseList () {
          let self = this;
          this.common.ajax({
            url: '/app-exam/rest/v1/studyProgress/getHasStudiedCourse',
            method: 'post',
            data: {
              userId: this.studentInfo.id
            },
            successCak (res) {
              if (res.code === 0) {
                if (res.data) {
                  self.courseList = JSON.parse(res.data);
                }
              }
            }
          });
        },
        getHomeworkList (examType, courseId, status) {
          let self = this;
          let vUrl = '';
          if (self.vName === 'homework') {
            vUrl = '/app-exam/workAndExam/showWorkList';
          } else if (self.vName === 'exam') {
            vUrl = '/app-exam/workAndExam/showExamList';
          } else if (self.vName === 'book') {
            vUrl = '/app-exam/workAndExam/showExamPaperApplyList';
          }
          let params = {
            pageSize: 10,
            pageNo: 1,
            examType: examType,
            courseId: courseId,
            status: status,
            userId: this.studentInfo.id
          };
          this.common.ajax({
            url: vUrl,
            method: 'post',
            data: {
              params: JSON.stringify(params)
            },
            successCak (res) {
              if (res.code === 0) {
                self.resultList = res.data.result;
                self.$emit('getList', self.resultList);
              }
            }
          });
        },
        setSelectCondition (index, name, id) {
          let self = this;
          self.selectList[index].name = name;
          self.selectList[index].id = id;
          self.getHomeworkList(self.selectList[0].id, self.selectList[1].id, self.selectList[2].id);
        }
      }
    };
</script>

<style lang="less" scoped>
  .mask { //遮罩
      position: fixed;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .5);
    .options {
      margin: 0;
      padding: 10px 0;
      background-color: #fff;
      max-height: 7.2rem;
      overflow: scroll;
      width: 100%;
    }
  }
  .test_header{
    position:absolute;
    top:0.88rem;
    width:100%;
    left:0;
    display: flex;
    z-index: 99;
    border-bottom:1px solid #dbdbdb;
  }
  .active{
    color: #d73a31!important;
  }
  .test_type{
    text-align: center;
    font-size:0.28rem;
    width: 30%;
    background-color: #fff;
  }
  .test_type:nth-of-type(2){
    width: 40%
  }
  .test_type li{
    height:0.88rem;
    line-height: 0.88rem;
  }
  #type li{
    padding-left: 0.6rem;
    text-align: left;
  }
  #course li{
    text-align: center;
  }
  #status li{
    padding-right: 0.6rem;
    text-align: right;
  }
  .test_type li,.header_title{ white-space:nowrap;overflow: hidden;text-overflow:ellipsis;}
  .header_title{display: inline-block;max-width: 80%;}
  .typeDiv{
    padding:0.15rem 0;
  }
  .red{
    border-top: 0.15rem solid #d73a31!important;
    transform: rotate(180deg);
  }
  .top_ico {
    width: 0;
    height: 0;
    border-left: 0.1rem solid transparent;
    border-right: 0.1rem solid transparent;
    border-top: 0.15rem solid #333;
    margin-left: 0.2rem;
    display: inline-block;
    margin-bottom: 0.09rem;
  }
</style>
