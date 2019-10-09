// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store.js'
// 引入基本CSS样式：reset.css,border.css
import 'styles/reset.css'
import 'styles/border.css'
import 'styles/style.css'
// 引入字体图标
import 'styles/iconfont.css'
// 引入fastclick解决移动端300毫秒点击延迟事件
import fastclick from 'fastclick'
fastclick.attach(document.body)
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  localStorage,
  components: { App },
  template: '<App/>'
})
