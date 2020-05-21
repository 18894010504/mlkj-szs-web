const Template = () => import(/* webpackChunkName: "group-main" */ '@/views/restaurant/Template')
const column = () => import(/* webpackChunkName: "group-main" */ '@/views/restaurant/column')
const PublcUserManagement = () => import(/* webpackChunkName: "group-main" */ '@/views/restaurant/PublcUserManagement')

export default {
  Template: Template, // restaurant 模板管理
  column: column, // restaurant 栏目管理
  PublcUserManagement: PublcUserManagement // 公众号用户管理
}
