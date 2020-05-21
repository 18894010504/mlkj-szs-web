import gridding from './views/gridding'
import system from './views/system'
import ComplaintsReport from './views/ComplaintsReport'
import shop from './views/shop'
import Restaurant from './views/Restaurant'
import foodSupervision from './views/foodSupervision'

const defaultView = () => import(/* webpackChunkName: "group-main" */ '@/views/error')

const components = Object.assign(
  system,
  gridding,
  ComplaintsReport,
  shop,
  Restaurant,
  foodSupervision,
  {
    default: defaultView
  }
)

export default components
