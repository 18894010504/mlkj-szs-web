import routerViews from './routerViews'
const index = () => import('@/views/Index')
const home = {
  path: '/',
  component: index,
  children: [
    {
      path: '/',
      name: 'index',
      components: routerViews
    }
  ]
}
export default home
