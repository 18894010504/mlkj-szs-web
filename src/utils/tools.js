/* eslint-disable one-var */
import axios from 'axios'
import store from '../store'

/**
 * 生成随机颜色
 * @returns {string}
 */
export function randomColor () {
  return '#' + Math.floor(Math.random() * 0xffffff).toString(16)
}

/**
 * 数据处理 (为内部关联sendAxios使用方法)
 * @param da
 * @returns {{url: (*|string), data: ({}|URLSearchParams|*|string), params: *, method: (*|string), token: getters.getToken}}
 */
export function disposeData (da) {
  let data = da.data || ''
  let url = da.url || ''
  let method = da.method || 'get'
  let params = {}
  let token = da.token || store.getters.getToken
  if (method === 'post') {
    params = new URLSearchParams()
    for (let i in data) {
      params.append(i, data[i])
    }
    data = params
    params = {}
  } else {
    params = data
    data = {}
  }
  const dataInfo = {
    url: url,
    data: data,
    params: params,
    method: method,
    token: token || ''
  }
  return dataInfo
}

/**
 * axios发送 暂时无用
 * @param da
 * @returns {Promise<any>}
 */
export function sendToolsAxios (data) {
  let da = disposeData(data)
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
            resolve(res.data.data)
            return
          }
        }
        reject(res)
      })
      .catch(res => {
        reject(res)
      })
  })
  return promist
}

export function isEmptyObject (obj) {
  for (let key in obj) {
    return false
  }
  return true
}

/**
 * 对象的属性置空字符串
 * @param obj
 */
export function clearObject (obj) {
  Object.keys(obj).forEach(item => {
    if (obj[item] && typeof obj[item] === 'object') {
      clearObject(obj[item])
    } else {
      obj[item] = ''
    }
  })
}

export function dateDay (day) {
  let date = new Date()
  date.setDate(date.getDate() + day)
  return new Date(date)
}

export function formatDate (time) {
  const date = new Date(time)
  let year = date.getFullYear(),
    month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1,
    day = date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate(),
    hour = date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours(),
    min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
    sec = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return year + '-' +
    month + '-' +
    day + ' ' +
    hour + ':' +
    min + ':' +
    sec
}
