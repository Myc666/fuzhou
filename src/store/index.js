/*
 * @Description:
 * @Autor: 张健，dhq
 * @Date: 2022-09-11 12:58:51
 * @LastEditors: 张健，dhq
 * @LastEditTime: 2022-09-21 17:36:05
 */
import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from "js-cookie";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || null,
    cookies: Cookies.get('X-Token') || '',
    menu: null,
    appInfo: {
      appName: '',
      logoUrl: ''
    },
    afterSalesUrl: '',
    algorithmDownload:{}
  },
  getters: {
  },
  mutations: {
    setAfterSalesUrl(state, newUrl) {
      state.afterSalesUrl = newUrl
    },
    setAlgorithmDownload(state,newUrl){
      state.algorithmDownload = newUrl
    },
  },
  actions: {
  },
  modules: {
  }
})
