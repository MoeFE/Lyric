import Vue from 'vue'

import './hooks' // This must be imported before any component

import App from './App.vue'
import router from './router'
import store from './store'
import * as Element from 'element-ui'

import 'assets/css/kaomoji.css'
import 'assets/js/evanyou'

Vue.config.productionTip = false
Vue.config.keyCodes = {
  f9: 120,
  f10: 121,
  f11: 122,
  f12: 123,
  v: 86,
  y: 89,
  z: 90
}

// 注册 Vue 插件
Vue.use(Element)

// tslint:disable-next-line:no-unused-expression
new Vue({
  el: 'app',
  router,
  store,
  render: (h) => h(App)
})
