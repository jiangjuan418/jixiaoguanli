<template>
  <div id="welcomeAdmin">
    <Navbar></Navbar>
    <div class="view-box">
      <router-view />
    </div>
  </div>
</template>
<script>
import Navbar from './Navbar'
import Bus from '@/utils/bus.js'
export default {
  name: 'WelcomeAdmin',
  components: {
    Navbar
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
#welcomeAdmin{
  width: 100%;
  height: 100%;
}
.view-box {
  width: 100%;
  /*height: calc(100vh - 56px);*/
}
</style>
