import Vue from 'vue'
import App from './App'
import router from './router'
import Element, {Message} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import store from './store'
import dataV from '@jiaminghi/data-view'
import * as echarts from 'echarts'
import fa from 'element-ui/src/locale/lang/fa'
import el from 'element-ui/src/locale/lang/el'

Vue.prototype.$echarts = echarts
Vue.prototype.$store = store
Vue.prototype.$ajax = axios
Vue.use(Element)
Vue.use(dataV)
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    let loginData = JSON.parse(sessionStorage.getItem('loginData'))
    if (loginData === null) {
      next('/login')
      Message.warning('请先登录')
    } else if (!loginData.hasData) {
      next('/login')
      Message.warning('请先登录')
    } else {
      next()
    }
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
