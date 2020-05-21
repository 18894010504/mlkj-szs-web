const mutations = {
  setToken (state, newToken) {
    state.token = newToken
  },
  setUserInfo (state, data) {
    state.userInfo = data.user
    state.userRole = data.role
    state.userPost = data.post
  }
}
export default mutations
