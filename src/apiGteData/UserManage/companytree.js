import Vue from 'vue'
/**
 * info:公司信息请求接口
 * @returns {Promise<any>}
 */
export function deleteDepartment () {
  const promise = new Promise((resolve, reject) => {
    Vue.prototype.sendAxios({
      url: '/api/company/companyTree',
      method: 'post'
    })
      .then(e => {
        reject(e)
      })
      .catch(e => {
        reject(e)
      })
  })
  return promise
}
