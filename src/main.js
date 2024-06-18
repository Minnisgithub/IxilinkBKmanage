import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
//高亮显示
import VueHighlightJS from 'vue-highlightjs'
import 'highlight.js/styles/atom-one-light.css'
Vue.use(VueHighlightJS)
import moment from "moment"
Vue.prototype.$moment = moment;
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
