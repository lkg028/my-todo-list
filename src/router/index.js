import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home/Home'
// import Todo from '@/pages/todo/Todo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '首页',
      component: Home
    }
    // {
    //   path: '/',
    //   name: 'Todo',
    //   component: Todo
    // }
  ]
})
