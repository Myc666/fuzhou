/*
 * @Description:
 * @Autor: 张健，dhq
 * @Date: 2022-07-09 10:33:16
 * @LastEditors: fengshiqiang-xphl fengshiqiang-xphl@gome.inc
 * @LastEditTime: 2024-05-06 22:26:50
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import routers from './router/permission'
import store from './store'
import * as echarts from 'echarts'
import * as common from '@/utils/common'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment/moment'

//import './assets/styles/index.scss';
import "./theme/index.css"
import "./utils/rem.js"

Vue.prototype.$echarts = echarts
Vue.prototype.$baseUrl = process.env.VUE_APP_IMGURL
Vue.prototype.$common = common
Vue.prototype.$moment = moment
Vue.use(ElementUI)
Vue.prototype.$ELEMENT = { size: 'small' };
new Vue({
  router,
  routers,
  store,
  render: (h) => h(App)
}).$mount('#app')
