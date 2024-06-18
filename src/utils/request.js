import axios from 'axios'
import {
  MessageBox,
  Message
} from 'element-ui'
import store from '@/store'
import {
  getToken
} from '@/utils/auth'
import router from '../router'
// create an axios instance
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? "/baseapi" : "", // url = base url + request url
  timeout: 50000
})
service.interceptors.request.use(
  config => {
    if (config.url.indexOf("sysUser/checkToken") !== -1) {
      return config
    }
    if (store.getters.token) {
      config.headers['Token'] = getToken()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
service.interceptors.response.use(
  response => {
    const res = response.data
    if (response.status === 200 & response.config.responseType === "blob") {
      return res
    } else if (res.code !== 200) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 1 * 1000
      })
      if (res.code === 510) {
        store.dispatch('user/resetToken').then(() => {
          router.replace({
            path: "/login"
          })
          // location.reload()
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    if (error.message.indexOf("403") != -1) {
      MessageBox.confirm('登录信息已过期，请重新登录！', '确认重新登陆', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
      return Promise.reject(new Error(error.message || 'Error'))
    }
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    // router.replace({ path: "/login" })
    return Promise.reject(error)
  }
)

export default service
