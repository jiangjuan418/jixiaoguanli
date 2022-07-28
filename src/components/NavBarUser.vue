<template>
  <div class="NavBarUser">
    <div class="logo" id="logo_user"></div>
    <div class="placeholder"></div>
    <div class='navlist'>
      <el-menu  :default-active="activeIndex" mode="horizontal" @select="changeIndex"  router>
        <el-menu-item index="/welcomeUser/vote"><span>用户首页</span></el-menu-item>
<!--        <el-menu-item index="/welcomeUser/voteDetail"><span>投票详情</span></el-menu-item>-->
      </el-menu>
    </div>
    <div class="title"><span>欢迎回来&nbsp;<span style="border-bottom: 1px solid #2db4f9">{{realName}}&nbsp;</span>!</span></div>
    <div class="exit">
      <el-button type="text" @click="exit">退出登录</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'NavBarUser',
  data () {
    return {
      activeIndex: '/welcomeUser/vote',
      realName: ''
    }
  },
  mounted () {
    let loginData = JSON.parse(sessionStorage.getItem('loginData'))
    this.realName = loginData.realName
  },
  created () { // 解决每次刷新导航栏url不还原的问题
    this.$router.push('/welcomeUser/vote')
  },
  methods: {
    changeIndex (index) {
      this.activeIndex = index
    },
    exit () {
      this.$confirm('确定退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({path: '/login'})
      })
    }
  }
}
</script>
<style>
.NavBarUser{
  width: 100%;
  height: 60px;
  background-color: #007dd8;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.logo{
  margin-left: 20px;
  width: 300px;
  height: 60px;
  background: url("../assets/infogo.png") no-repeat;
  background-size: 100% 100%;
  z-index: 99;
}
.placeholder{
  width: 200px;
  /*margin-right: 20%;*/
}
.title{
  width: 300px;
  height: 71px;
  z-index: 99;
}
.title span{
  font-family: 'DFKai-SB';
  font-size: 20px;
  font-weight: bold;
  line-height: 60px;
  color: #FFFFFF;
}
.exit{
  width: 200px;
  height: 71px;
}
.exit .el-button{
  font-size: 20px;
  font-weight: bold;
  line-height: 40px;
  color: #FFFFFF;
}
.navlist{
  width: 100%;
  height: 60px;
  background-color: #007dd8;
}
.navlist .el-menu{
  height: 60px;
  margin-left: 40px;
  background-color: #007dd8;
}
.navlist .el-menu>.el-menu-item{
  background-color: #007dd8;
  margin-left: 20px;
  color: #FFFFFF;
  border-bottom: none;
}
.navlist .el-menu>.el-menu-item:hover{
  background-color: #007dd8 !important;
  color: #fff;
}
.navlist .el-menu>.el-menu-item.is-active span{
  background: linear-gradient(to right, #aaf3fd, #2db4f9);
  -webkit-background-clip: text;
  color: transparent;
  font-weight: bolder;
}
.navlist .el-menu>.el-menu-item span{
  font-weight: 500;
}
.navlist .el-menu>.el-menu-item.is-active {
  background-color: #007dd8 !important;
  color: #fff;
  background: url("../assets/arrow-bg.png") no-repeat;
  background-size: 100% 100%;
  transition: all 0.2s ease-in-out;
}
.navlist span{
  font-weight: bold;
  font-size: large;
  font-family: "Calibri Light";
}
</style>
