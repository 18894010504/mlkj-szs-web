import Vue from 'vue'
import axios from 'axios'
import { disposeData } from './tools'
/**
 * 日期格式化类
 * @param fmt
 * @returns {*}
 * @constructor
 */
Date.prototype.Format = function (fmt) { // author: meizz
  let o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, // 小时
    'H+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  }
  let week = {
    '0': '/u65e5',
    '1': '/u4e00',
    '2': '/u4e8c',
    '3': '/u4e09',
    '4': '/u56db',
    '5': '/u4e94',
    '6': '/u516d'
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[this.getDay() + ''])
    fmt = unescape(fmt.replace(/\/u/g, '%u'))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}
/**
 * 添加全局网络请求函数
 * {
 *     url: 请求地址
 *     method: 'post' || 'get'
 *     data: 请求参数
 *     token: 上传则改变token值
 * }
 * @param data
 * @returns {Promise<any>}
 */
Vue.prototype.sendAxios = function (data) {
  const vm = Vue.prototype
  let da = disposeData(data)
  // if (vm != nu)
  if (!da.token) {
    vm.$message({
      message: '登录状态过期',
      type: 'error',
      showClose: true
    })
    vm.$router.push({ name: 'login' })
    return
  }
  const promist = new Promise(function (resolve, reject) {
    axios({
      url: da.url,
      method: da.method,
      params: da.params,
      data: da.data,
      headers: {
        Authorization: da.token
      }
    })
      .then(res => {
        if (res.status === 200) {
          if (res.data.code === 200) {
            if (res.data.data) {
              resolve(res.data.data)
            } else {
              resolve(res.data)
            }
            return
          }
        }
        vm.$message({
          message: res.data.message,
          type: 'error',
          showClose: true
        })
        reject(res)
      })
      .catch(res => {
        // vm.$message({
        //   message: res.message,
        //   type: 'error',
        //   showClose: true
        // })
        reject(res)
      })
  })
  return promist
}
