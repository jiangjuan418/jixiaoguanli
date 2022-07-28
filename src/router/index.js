import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import WelcomeAdmin from '../components/WelcomeAdmin'
import deptList from '../view/welcomeAdmin/deptList'
import managerList from '../view/welcomeAdmin/managerList'
import performenceDetail from '../view/welcomeAdmin/performenceDetail'
import performenceList from '../view/welcomeAdmin/performenceList'
import uploadLogo from '../view/welcomeAdmin/uploadLogo'
import WelcomeUser from '../components/WelcomeUser'
import vote from '../view/welcomeUser/vote'
import voteDetail from '../view/welcomeUser/voteDetail'
Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/welcomeAdmin',
      name: 'welcomeAdmin',
      component: WelcomeAdmin,
      redirect: '/welcomeAdmin/deptList',
      meta: {
        requiresAuth: true // 跳转到此页面之前须验证
      },
      children: [{
        path: '/welcomeAdmin/deptList',
        name: 'deptList',
        component: deptList,
        meta: {
          requiresAuth: true // 跳转到此页面之前须验证
        }
      },
      {
        path: '/welcomeAdmin/managerList',
        name: 'managerList',
        component: managerList,
        meta: {
          requiresAuth: true // 跳转到此页面之前须验证
        }
      },
      {
        path: '/welcomeAdmin/managerList',
        name: 'managerList',
        meta: {
          requiresAuth: true // 跳转到此页面之前须验证
        },
        component: managerList
      },
      {
        path: '/welcomeAdmin/performenceList',
        name: 'performenceList',
        meta: {
          requiresAuth: true // 跳转到此页面之前须验证
        },
        component: performenceList
      },
      {
        path: '/welcomeAdmin/performenceDetail',
        name: 'performenceDetail',
        meta: {
          requiresAuth: true // 跳转到此页面之前须验证
        },
        component: performenceDetail
      },
      {
        path: '/welcomeAdmin/uploadLogo',
        name: 'uploadLogo',
        meta: {
          requiresAuth: true // 跳转到此页面之前须验证
        },
        component: uploadLogo
      }
      ]
    },
    {
      path: '/welcomeUser',
      name: 'welcomeUser',
      component: WelcomeUser,
      meta: {
        requiresAuth: true // 跳转到此页面之前须验证
      },
      redirect: '/welcomeUser/vote',
      children: [
        {
          path: '/welcomeUser/vote',
          name: 'vote',
          meta: {
            requiresAuth: true // 跳转到此页面之前须验证
          },
          component: vote
        },
        {
          path: '/welcomeUser/voteDetail',
          name: 'voteDetail',
          meta: {
            requiresAuth: true // 跳转到此页面之前须验证
          },
          component: voteDetail
        }
      ]
      // redirect: '/welcomeUser/deptList'
    }
  ]
})
