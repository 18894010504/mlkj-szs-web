import Vue from 'vue'

export function deleteDepartment (da) {
  let data = {
    keyValue: da.keyValue || ''
  }
  const promise = new Promise((resolve, reject) => {
    Vue.prototype.sendAxios({
      url: '/api/department/deleteDepartment',
      method: 'post',
      data: data
    })
      .then(e => {
        console.log(e)
        resolve(e)
      })
      .catch(e => {
        reject(e)
        console.log(e)
      })
  })
  return promise
}
