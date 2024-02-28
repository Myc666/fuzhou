/*
 * @Description:
 * @Autor: 张健，dhq
 * @Date: 2022-07-09 10:33:16
 * @LastEditors: 张健，dhq
 * @LastEditTime: 2022-09-11 13:40:58
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import allRoutes from './data'
import Cookies from 'js-cookie'

Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}
const whiteList = ['/login']

const router = new VueRouter({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: allRoutes,
});


router.beforeEach(async (to, from, next) => {
  // 路由中如果有token就存储至cookie
  if(to.query.token){
    Cookies.set('X-Token', to.query.token);
    sessionStorage.setItem('path', to.path)
  }

  // next()
  if (Cookies.get('X-Token') || to.query.token) {
    if (to.path !== '/login') {
      next()
    } else {
      next('/')
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      if (to.path !== '/login') {
        next('/login')
      } else {
        next()
      }
    }
  }
})


export default router
