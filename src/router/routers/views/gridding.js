const geographyGriddingArea = () => import(/* webpackChunkName: "group-map1" */ '@/views/gridding/geographyGriddingArea')
const departmentAdministerArea = () => import(/* webpackChunkName: "group-map2" */ '@/views/gridding/departmentAdministerArea')
const griddingAreaConfiguration = () => import(/* webpackChunkName: "group-map3" */ '@/views/gridding/griddingAreaConfiguration')
const shopDistribution = () => import(/* webpackChunkName: "group-map4" */ '@/views/gridding/shopDistribution')
const bingDivide = () => import(/* webpackChunkName: "group-map5" */ '@/views/gridding/bingDivide')

const gridding = {
  geographyGriddingArea: geographyGriddingArea, // gridding 地理行政区域
  departmentAdministerArea: departmentAdministerArea, // gridding 部门管辖区域
  griddingAreaConfiguration: griddingAreaConfiguration, // gridding 网格员区域配置
  shopDistribution: shopDistribution, // gridding 商户分布
  bingDivide: bingDivide // gridding 网格绑定
}
export default gridding
