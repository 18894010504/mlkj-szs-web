const index = () => import(/* webpackChunkName: "group-map" */ '@/views/map/index')
const home = () => import(/* webpackChunkName: "group-map" */ '@/views/map/home')
const district = () => import(/* webpackChunkName: "group-map" */ '@/views/map/district')
const site = () => import(/* webpackChunkName: "group-map" */ '@/views/map/site')

const map = {
  path: '/map',
  component: index,
  children: [
    {
      path: '/',
      name: 'map',
      component: home
    },
    {
      path: '/district',
      name: 'district',
      component: district
    },
    {
      path: '/site',
      name: 'site',
      component: site
    }
  ]
}
export default map
