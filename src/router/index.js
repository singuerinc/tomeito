import Vue from 'vue'
import Router from 'vue-router'
import Tomatoes from '@/components/Tomatoes'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Tomatoes',
      component: Tomatoes
    }
  ]
})
