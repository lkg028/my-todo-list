import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '首页',
      component: () => import('@/pages/home/Home')
    },
    {
      path: '/search',
      name: 'todoSearch',
      component: () => import('@/components/todo/todo-search')
    },
    {
      path: '/author',
      name: 'todoSearch',
      component: () => import('@/pages/author/Author')
    }
  ]
})
