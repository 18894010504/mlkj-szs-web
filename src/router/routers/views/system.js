const homeDome = () => import(/* webpackChunkName: "group-main" */ '@/views/system/homeDome')
const SystemModule = () => import(/* webpackChunkName: "group-main" */ '@/views/system/SystemModule')
const UserAdmin = () => import(/* webpackChunkName: "group-main" */ '@/views/system/UserManage')
const DepartmentManage = () => import(/* webpackChunkName: "group-main" */ '@/views/system/DepartmentManage')
const DataItemManage = () => import(/* webpackChunkName: "group-main" */ '@/views/system/DictManage')
const CompanyManage = () => import(/* webpackChunkName: "group-main" */ '@/views/system/CompanyManage')
const SystemLog = () => import(/* webpackChunkName: "group-main" */ '@/views/system/SystemLog')
const AreaManage = () => import(/* webpackChunkName: "group-main" */ '@/views/system/AreaManage')
const RoleManage = () => import(/* webpackChunkName: "group-main" */ '@/views/system/RoleManage')
const videoManage = () => import(/* webpackChunkName: "group-main" */ '@/views/system/videoManage')

export default {
  homeDome: homeDome, // system 首页
  SystemModule: SystemModule, // gridding 系统模块
  UserManage: UserAdmin, // gridding 用户管理
  DepartmentManage: DepartmentManage, // gridding 部门管理
  DataItemManage: DataItemManage, // 字典管理
  CompanyManage: CompanyManage, // 公司管理
  SystemLog: SystemLog, // 日志管理
  AreaManage: AreaManage, // 行政区域管理
  RoleManage: RoleManage, // 角色管理
  videoManage: videoManage // 视频管理
}
