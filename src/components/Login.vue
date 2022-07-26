<template>
  <div>
    <div v-loading="loading" element-loading-text="登录中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.6)" class="login-container">
      <div class="title-container">
        <h3 class="title">绩效管理系统</h3>
      </div>
      <el-form  :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
        <el-form-item prop="username">
          <el-input ref="username" v-model="loginForm.username" placeholder="Username" name="username" type="text" tabindex="1" auto-complete="on" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input show-password v-model="loginForm.password" placeholder="Password" name="password" tabindex="2" auto-complete="on"/>
        </el-form-item>
        <el-form-item prop="role">
          <el-radio v-model="loginForm.role" label="1" size="medium" tabindex="3" name="role">管理员</el-radio>
          <el-radio v-model="loginForm.role" label="0" size="medium" tabindex="4" name="role">普通用户</el-radio>
        </el-form-item>
        <div>
          <el-button type="primary" style="width:100%;margin-bottom:20px;" @click.native.prevent="handleLogin" tabindex="5">登录</el-button>
        </div>
<!--        <div class="tips">-->
<!--          <span style="margin-right:20px;">如果您还没有账号请先 <span style="color:#409EFF;cursor:pointer" @click="showResiterDialog" tabindex="6">注册</span></span>-->
<!--        </div>-->
      </el-form>
    </div>
<!--    <el-dialog class="register" title="注册" :visible.sync="dialogFormVisible" :append-to-body="true" :show-close="false">-->
<!--      <el-row style="margin-bottom: 10px">-->
<!--        <el-col :span="4"><span>用户名</span></el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-input v-model="registerForm.username" placeholder="username" name="username"/>-->
<!--        </el-col>-->
<!--        <el-col :span="4"><span>真实姓名</span></el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-input v-model="registerForm.realName" placeholder="realName" name="realName"/>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--      <el-row style="margin-bottom: 10px">-->
<!--        <el-col :span="4"><span>密码</span></el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-input show-password v-model="registerForm.password" placeholder="password" name="password"/>-->
<!--        </el-col>-->
<!--        <el-col :span="4"><span>确认密码</span></el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-input show-password v-model="registerForm.confirm" placeholder="confirm password" name="confirm"/>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--      <el-row style="margin-bottom: 10px">-->
<!--        <el-col :span="4"><span>性别</span></el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-input v-model="registerForm.sex" placeholder="sex" name="sex"/>-->
<!--        </el-col>-->
<!--        <el-col :span="4"><span>年龄</span></el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-input v-model="registerForm.sge" placeholder="sge" name="sge"/>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--      <el-row style="margin-bottom: 10px">-->
<!--        <el-col :span="4"><span>邮箱</span></el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-input v-model="registerForm.email" placeholder="email" name="email"/>-->
<!--        </el-col>-->
<!--        <el-col :span="4"><span>联系电话</span></el-col>-->
<!--        <el-col :span="8">-->
<!--          <el-input v-model="registerForm.phoneNumber" placeholder="phoneNumber" name="phoneNumber"/>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--      <el-row style="margin-bottom: 10px">-->
<!--        <el-col :span="4"><span>家庭住址</span></el-col>-->
<!--        <el-col :span="20">-->
<!--          <el-input v-model="registerForm.address" placeholder="address" name="address"/>-->
<!--        </el-col>-->
<!--      </el-row>-->
<!--      <el-row>-->
<!--        <el-col><el-button type="primary" style="width:100%;" size="small" @click="register">注册</el-button></el-col>-->
<!--      </el-row>-->
<!--    </el-dialog>-->
  </div>
</template>
<script>
import {login} from '../api/login/login'
import qs from 'qs'
import {Message} from 'element-ui'
export default{
  name: 'Login',
  data () {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('用户名不能为空！'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码最少为6位字符！'))
      } else {
        callback()
      }
    }
    return {
      // 登陆数据
      loginForm: {
        username: '',
        password: '',
        role: '1'
      },
      // 登录规则
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      registerForm: {
        username: '',
        password: '',
        confirm: '',
        realName: '',
        sex: '',
        sge: '',
        email: '',
        phoneNumber: '',
        address: ''
      },
      dialogFormVisible: false // 注册弹窗
    }
  },
  watch: {
  },
  methods: {
    showResiterDialog () {
      this.dialogFormVisible = true
    },
    // 登录业务
    handleLogin () {
      let that = this // 防止this指向的对象发生了变化，故需要在函数前将this指向的对象提前保存一下
      that.loading = true
      let params = {
        // 'loginForm': this.loginForm
        'username': that.loginForm.username,
        'password': that.loginForm.password,
        'role': that.loginForm.role
      }
      login(qs.stringify(params)).then(res => {
        if (res.data.code === 200) {
          that.loading = false
          Message.success('登陆成功')
          let latestData = {
            hasData: true,
            realName: res.data.data.realName,
            userId: res.data.data.userId
          }
          that.$store.commit('setRealName', latestData)
          if (that.loginForm.role === '1') {
            that.$router.push({path: '/welcomeAdmin/deptList'})
          } else {
            that.$router.push({path: '/welcomeUser/vote'})
          }
        } else {
          that.loading = false
          Message.error('用户名或密码错误')
        }
      }).catch(function (error) { console.log('login error') })
    },
    // 注册业务
    register () {

    }
  }
}
</script>
<style scoped>
.login-container{
  width: 30%;
  height: 350px;
  position: fixed;
  top: 30%;
  left: 30%;
  border: 1px solid gray;
}
 .title-container{
   background: url("../assets/top.png");
   background-size: 520px;
   height: 50px;
   line-height: 50px;
   border-bottom: 1px solid #2c3e50;
}
.login-form {
  padding: 20px;
}
/deep/.register .el-dialog .el-select .el-input {
  width: 50px;
}
/deep/.register .el-dialog__header{
  background: url("../assets/topbox.png");
  background-size: 480px;
}
/deep/.register .el-dialog {
  width: 480px;
  height: 350px;
  font-size: 14px;
  font-family: "微软雅黑";
}
/deep/.register .el-dialog__title {
  position: absolute;
  font-size: 14px;
  font-family: "微软雅黑";
  line-height: 0px;
  margin-top: -3px;
  margin-left: 1%;
  color: #FFFFFF;
}
/deep/.el-dialog__headerbtn .el-dialog__close {
  position: absolute;
  font-size: 14px;
  line-height: 0px;
  margin-top: -3px;
  margin-left: -10px;
  font-weight: bold;
  color: #FFFFFF;
}
.register .el-form-item{
  margin-bottom: 0px;
}
 .login-container .title{

 }
</style>
