// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import store from './store'
import './utils/start' // 创建起始类
// 编辑器
import VueKindEditor from 'vue-kindeditor'
import 'kindeditor/kindeditor-all-min.js'
import 'kindeditor/themes/default/default.css'
import echarts from 'echarts'

// element控件
import ElementUI from 'element-ui'
import '../theme/index.css'
// import 'element-ui/lib/theme-chalk/index.css'
// import './assets/theme/element_ui_css/index.css'
import './assets/font/index.css'
// 引入弹出层可拖拽js
import './utils/index.js'
// 高德地图
import VueAMap from 'vue-amap'
// import markerView from '@/components/moude/markerView'
// tools 函数
// 设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false
Vue.use(VueKindEditor)
Vue.prototype.$echarts = echarts
// 开启debug模式
Vue.config.debug = true
Vue.use(VueAMap)
Vue.use(ElementUI)
Vue.use(VueKindEditor)
// 注册
// Vue.component('marker-view', markerView)
VueAMap.initAMapApiLoader({
  key: 'fdc092c091e3eb6685ffcd6dade6b3c5',
  plugin: ['AMap.Autocomplete', 'AMap.MarkerClusterer', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  v: '1.4.4',
  uiVersion: '1.0.11' // 版本号
})
// 日期格式化

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    loading: false,
    base_wechat: 'http://shizhuisutest.szschina.cn',
    // base_wechat: 'http://shizhuisu.szschina.cn',
    baseUrl: 'http://netdisk.szschina.cn/', // kindeditor 图文混排图片上传接口 baseUrl
    calbackUrl: 'http://shizhuisutest.szschina.cn/' // kindeditor 图文混排图片上传接口 calbackUrl
    // calbackUrl: 'http://shizhuisu.szschina.cn/' // kindeditor 图文混排图片上传接口 calbackUrl
  },
  router,
  store,
  render: h => h(App),
  components: { App },
  template: '<App/>',
  created () {
    this.loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
  }
})
