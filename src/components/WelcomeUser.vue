<template>
  <div id="WelcomeUser">
    <NavBarUser></NavBarUser>
    <div class="view-box">
      <router-view />
    </div>
  </div>
</template>
<script>
import NavBarUser from './NavBarUser'
import Bus from '@/utils/bus.js'
export default {
  name: 'WelcomeUser',
  components: {
    NavBarUser
  },
  data () {
    return {
      realName: ''
    }
  },
  mounted () {
    // this.realName = this.$route.query.realName
    // this.$nextTick(function () {
    //   Bus.$emit('realName', this.realName)
    // })
  },
  beforeDestroy () {
    // 销毁监听事件
    Bus.$off('realName')
  }
}
</script>

<style scoped>
#WelcomeUser{
  width: 100%;
  height: 100%;
}
.view-box {
  width: 100%;
  /*height: calc(100vh - 56px);*/
}
</style>
