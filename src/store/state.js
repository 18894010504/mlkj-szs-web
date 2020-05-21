import Storage from '../utils/Storage'
import router from '../router'

const token = Storage.get('mlkjToken') || ''
!token && router.push({ name: 'login' })

const state = {
  token: token,
  userInfo: null,
  userRole: [],
  userPost: [],
  company: {
    companyId: ''
    // company
  }
}
export default state
