import request from '@/utils/request'
import requestOdin from '@/utils/requestOdin'

export function login(data) {
  return request({
    url: '/sysUser/login',
    method: 'post',
    data
  })
}

export function getInfo(params) {
  return request({
    url: '/sysUser/getUserInfo',
    method: 'get',
    params
  })
}

export function logout() {
  return request({
    url: '/sysUser/loginOut',
    method: 'post',
  })
}
export function loginForSingleToken(token) {
  return request({
    url: '/sysUser/checkToken',
    method: 'post',
    headers: {
      token
    }
  })
}
// 获取odin接口token
export function getOdinToken(params) {
  return request({
    url: '/firstPage/getOdinToken',
    method: 'get',
    params
  })
}
// 检查用户密码有效期
export function checkUserPwdActiveTime(params) {
  return request({
    url: '/sysUser/checkUserPwdActiveTime',
    method: 'get',
    params
  })
}
// 修改用户密码
export function updateUserPassword(data) {
  return request({
    url: '/sysUser/updateUserPassword',
    method: 'post',
    data
  })
}