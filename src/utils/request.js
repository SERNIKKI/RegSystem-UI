import axios from 'axios'
import {Message, MessageBox, Loading} from 'element-ui'
import store from '@/store/index'
import router from '@/router'
import {getTokenName,getTokenValue, getRefreshToken, getExpireTime} from '@/utils/auth'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Watermark from "@/utils/waterMark.js";

let loading

function startLoading() {
  loading = Loading.service({text: '正在加载中......', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'})
}

function endLoading() {
  loading.close()
}

let needLoadingRequestCount = 0

export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    // startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    // endLoading()
  }
}

// 请求超时时间，20s
const requestTimeOut = 10 * 60 * 1000
const success = 200
// 更换令牌的时间区间
const checkRegion = 5 * 60 * 1000
// 提示信息显示时长
const messageDuration = 1 * 1000

// 系统全局请求对象
const service = axios.create({
  // baseURL: 'http://localhost:8082/', // 本机
  baseURL: 'http://116.205.179.119:8080', // 线上
  timeout: requestTimeOut,
  responseType: 'json',
  validateStatus(status) {
    return status === success
  }
})

// 系统令牌刷新请求对象
const refresh_service = axios.create({
  // baseURL: 'http://localhost:8082/', // 本机
  baseURL: 'http://116.205.179.119:8080', // 线上
  timeout: requestTimeOut,
  responseType: 'json',
  validateStatus(status) {
    return status === success
  }
})

service.interceptors.request.use(
  config => {
    let _config = config
    const isToken = (_config.headers || {}).isToken === false
    if(!isToken) {
      if (getTokenName() != undefined && getTokenName() != '') {
        _config.headers[getTokenName()] = getTokenValue()
      }
    }
    return _config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use((config) => {
  return config
}, (error) => {
  if (error.response) {
    const errorMessage = error.response.data === null ? '系统内部异常，请联系网站管理员' : error.response.data.message
    switch (error.response.status) {
      case 404:
        Message({
          message: '很抱歉，资源未找到',
          type: 'error',
          duration: messageDuration
        })
        break
      case 403:
        Message({
          message: '很抱歉，您暂无该操作权限',
          type: 'error',
          duration: messageDuration
        })
        break
      case 401:
        Message({
          message: '很抱歉，认证已失效，请重新登录',
          type: 'error',
          duration: messageDuration,
          // callback: action => {
          //   Watermark.out()
          //   router.push('/login')
          // }
        })
        break
      default:
        if (errorMessage === 'refresh token无效') {
          MessageBox.alert('登录已过期，请重新登录', '温馨提示', {
            confirmButtonText: '确定',
            showClose: false,
            callback: action => {
              Watermark.out()
              router.push('/login')
            }
          })
        } else {
          if (!errorMessage || errorMessage == '') {
            return
          }
          Message({
            message: errorMessage,
            type: 'error',
            duration: messageDuration
          })
        }
        break
    }
  }
  return Promise.reject(error)
})

const request = {
  refresh(url, params) {
    params['grant_type'] = 'refresh_token'
    return refresh_service.post(url, params, {
      transformRequest: [(params) => {
        return tansParams(params)
      }],
      headers: {
        'Authorization': ''
      }
    })
  },
  login(url, params) {
    return service.post(url, params, {
      headers: {
        'Content-Type': 'application/json',
        'isToken': false
      }
      }).then(response => {
        tryHideFullScreenLoading()
        return response
      }).catch(error => {
        tryHideFullScreenLoading();
      })
  },
  post(url, params) {
    showFullScreenLoading()
    return service.post(url, params, {
      transformRequest: [(params) => {
        return tansParams(params)
      }],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        // 'Content-Type': 'application/json'

      }
    }).then(response => {
      tryHideFullScreenLoading()
      return response
    }).catch(error => {
      tryHideFullScreenLoading();
    })
  },
  postJson(url, params) {
    showFullScreenLoading()
    return service.post(url, params, {
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/json'
      }
    }).then(response => {
      tryHideFullScreenLoading()
      return response
    }).catch(error => {
      tryHideFullScreenLoading();
    })
  },
  put(url, params) {
    showFullScreenLoading()
    return service.put(url, params, {
      transformRequest: [(params) => {
        return tansParams(params)
      }],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => {
      tryHideFullScreenLoading()
      return response
    }).catch(error => {
      tryHideFullScreenLoading();
    })
  },
  get(url, params) {
    showFullScreenLoading()
    let _params
    if (Object.is(params, undefined)) {
      _params = ''
    } else {
      _params = '?'
      for (const key in params) {
        // eslint-disable-next-line no-prototype-builtins
        if (params.hasOwnProperty(key) && params[key] !== null) {
          _params += `${key}=${params[key]}&`
        }
      }
      _params = _params.substring(0, _params.lastIndexOf(','))
    }
    return service.get(`${url}${_params}`, {}).then(response => {
      tryHideFullScreenLoading()
      return response
    }).catch(error => {
      tryHideFullScreenLoading();
    })
  },
  delete(url, params) {
    showFullScreenLoading()
    let _params
    if (Object.is(params, undefined)) {
      _params = ''
    } else {
      _params = '?'
      for (const key in params) {
        // eslint-disable-next-line no-prototype-builtins
        if (params.hasOwnProperty(key) && params[key] !== null) {
          _params += `${key}=${params[key]}&`
        }
      }
    }
    return service.delete(`${url}${_params}`, {}).then(response => {
      tryHideFullScreenLoading()
      return response
    }).catch(error => {
      tryHideFullScreenLoading();
    })
  },
  download(url, params, filename) {
    NProgress.start()
    return service.post(url, params, {
      transformRequest: [(params) => {
        return tansParams(params)
      }],
      responseType: 'blob'
    }).then((r) => {
      const content = r.data
      const blob = new Blob([content])
      if ('download' in document.createElement('a')) {
        const elink = document.createElement('a')
        elink.download = filename
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href)
        document.body.removeChild(elink)
      } else {
        navigator.msSaveBlob(blob, filename)
      }
      NProgress.done()
    }).catch((r) => {
      console.error(r)
      NProgress.done()
      Message({
        message: '下载失败',
        type: 'error',
        duration: messageDuration
      })
      return
    })
  },
  upload(url, params, fn) {
    return service.post(url, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: fn
    })
  }
}

function tansParams(params) {
  let result = ''
  Object.keys(params).forEach((key) => {
    if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
      result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
    }
  })
  return result
}

async function queryRefreshToken(config, refreshToken) {
  const result = await request.refresh('auth/oauth/token', {
    refresh_token: refreshToken
  })
  if (result.status === success) {
    saveData(result.data)
    config.headers[getTokenName()] = getTokenValue()
  }
  return config
}

function saveData(data) {
  store.commit('account/setAccessToken', data.access_token)
  store.commit('account/setRefreshToken', data.refresh_token)
  const current = new Date()
  const expireTime = current.setTime(current.getTime() + 1000 * data.expires_in)
  store.commit('account/setExpireTime', expireTime)
}

export default request
