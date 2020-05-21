import Vue from 'vue'

const actions = {
  /**
   * 部门树接口
   * @returns {Promise<any>}
   */
  getAllDepartment: function () {
    return new Promise((resolve, reject) => {
      Vue.prototype.sendAxios({
        url: '/api/module/getModulesListByUser',
        method: 'post'
      })
        .then(e => {
          resolve(e)
        })
        .catch(res => {
          console.log('getAllDepartment请求出错')
          console.log(res)
          reject()
        })
    })
  },
  /**
   * 更新token 第一个参数 this.sendAxios 必传 不传token不更新token
   * @param store
   * @param res
   * @returns {Promise<any>}
   */
  acquireToken: function (store, token) {
    token && store.commit('setToken', token)
    if (!store.getters.getUserInfo) {
      return new Promise((resolve, reject) => {
        Vue.prototype.sendAxios({
          url: '/api/userCenter/findUser',
          headers: {
            Authorization: store.getters.getToken
          }
        })
          .then(res => {
            store.commit('setUserInfo', res)
            resolve()
          })
          .catch(res => {
            console.log('acquireUserInfo请求出错')
            console.log(res)
            reject()
          })
      })
    }
  }
}
export default actions
