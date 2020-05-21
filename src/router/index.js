import Vue from 'vue'
import Router from 'vue-router'
import map from './routers/map'
import home from './routers/home'
import login from '@/views/login/login'
import Error from '@/views/error'
import playVideo from '@/views/playVideo'
const dataMap = () => import(/* webpackChunkName: "group-main" */ '@/views/dataMap')

Vue.use(Router)

export default new Router({
  routes: [
    map,
    home,
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/playVideo:url&:title',
      name: 'playVideo',
      component: playVideo
    },
    {
      path: '/dataMap',
      name: 'dataMap',
      component: dataMap
    },
    { path: '*',
      name: 'Error',
      component: Error
    },
  ]
})
