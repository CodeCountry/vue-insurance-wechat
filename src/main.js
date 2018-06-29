// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'vue-ydui/dist/ydui.rem.css'
import App from './App'
import store from './vuex/store';
import router from './router'
import axios from 'axios'
Vue.prototype.$axios = axios

import YDUI from 'vue-ydui'

Vue.use(YDUI);

import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog';
Vue.prototype.$dialog = {
  confirm: Confirm,
  alert: Alert,
  toast: Toast,
  notify: Notify,
  loading: Loading,
};

import api from  './api/index.js'
Vue.prototype.$api = api

Vue.config.productionTip = false

// 全局函数
import base from './js/base'
Vue.use(base);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
