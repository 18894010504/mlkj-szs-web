const shopModule = () => import(/* webpackChunkName: "group-main" */ '@/views/shop/index')
const shopDeviceModule = () => import(/* webpackChunkName: "group-main" */ '@/views/shop/shopDevice')
const papers = () => import(/* webpackChunkName: "group-main" */ '@/views/shop/papers')
export default {
  shopModule: shopModule, // system 首页
  shopDeviceModule: shopDeviceModule,
  papers: papers
}
