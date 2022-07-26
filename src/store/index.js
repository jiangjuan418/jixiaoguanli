import Vue from 'vue'
import Vuex from 'vuex'
import Login from './models/Login'
import performence from './models/performence'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    Login,
    performence
  }
})
