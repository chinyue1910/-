import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store/index.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      needLogin: false
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
      needLogin: true
    }
  }
]

const router = new VueRouter({
  routes
})

// 進入每頁前檢查登入狀態
// to 即將訪問的頁面
// from 是來源頁面
// next 採取的導向動作
router.beforeEach((to, from, next) => {
  // 如果要去的頁面需要登入 ，而且 Vuex 有使用者資料
  if (to.meta.needLogin && store.state.user.length === 0) {
    // 跳出訊息
    // 導向首頁
    alert('need login')
    next('/')
  } else {
    // 正常導向
    next()
  }
})

export default router
