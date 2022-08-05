<template>
  <div class="navbar">
    <div class="logo" id="logo_admin"></div>
    <div class="placeholder">
    </div>
    <div class='navlist'>
      <el-menu  :default-active="activeIndex" mode="horizontal" @select="changeIndex"  router><!--存在问题：页面刷新，路径没刷新-->
        <el-menu-item index="/welcomeAdmin/deptList"><span>部门列表</span></el-menu-item>
        <el-menu-item index="/welcomeAdmin/managerList"><span>部门经理列表</span></el-menu-item>
        <el-menu-item index="/welcomeAdmin/performenceList"><span>绩效列表</span></el-menu-item>
        <el-menu-item index="/welcomeAdmin/performenceDetail"><span>绩效详情</span></el-menu-item>
        <el-menu-item index="/welcomeAdmin/uploadLogo"><span>上传系统logo</span></el-menu-item>
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
  name: 'Navbar',
  data () {
    return {
      activeIndex: '/welcomeAdmin/deptList',
      realName: '',
      dialogFormVisible: false,
      fileList: []
    }
  },
  mounted: function () {
    let loginData = JSON.parse(sessionStorage.getItem('loginData'))
    this.realName = loginData.realName
    // if (this.$store.state.Login.hasData) {
    //   this.realName = this.$store.state.Login.realName
    // } // vuex刷新state数据消失，所以使用sessionStorage持久化数据，vuex主要还是用来做状态管理
  },
  created () { // 解决每次刷新导航栏url不还原的问题
    this.$router.push('/welcomeAdmin/deptList')
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
    },
    showDialog () {
      this.dialogFormVisible = true
    }
  }
}
</script>
<style>
.navbar{
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
  font-family: "Calibri Light";
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
