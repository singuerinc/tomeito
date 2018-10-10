import Vue from 'vue'
import Router from 'vue-router'
import Tomatoes from '../components/Tomatoes'
import Intro from '../components/Intro'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'intro',
      component: Intro
    },
    {
      path: '/tomatoes',
      name: 'tomatoes',
      component: Tomatoes
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
