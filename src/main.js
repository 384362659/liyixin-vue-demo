import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/vars.scss'
import VueRouter from 'vue-router'
// import Vuex from 'vuex'
import routes from './router/routes'
import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI)
Vue.use(VueRouter)
// Vue.use(Vuex)

const router = new VueRouter({
  routes
})
/* 登录拦截 */
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    sessionStorage.removeItem('EMPNAME')
  }
  let empNname = sessionStorage.getItem('EMPNAME')
  if (!empNname && to.path !== '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
