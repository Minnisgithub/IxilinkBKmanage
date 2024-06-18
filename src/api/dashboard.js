import request from '@/utils/requestOdin'
const token =
  process.env.NODE_ENV === 'development'
    ? 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGVzIjpbIkFETUlOIl0sImlzcyI6Im9kaW4ifQ.5ggDw7YYZ0FEXT4XOvILodWfo6UIvwnv0oGjPSn0hqI'
    : localStorage.getItem('SETODINTOKEN')
// 平台安全运行时间
export function currentTime() {
  return request({
    url: '/api/v1/license/current?token=' + token,
    method: 'get'
  })
}
// 终端数量
export function terminal() {
  return request({
    url: '/api/v1/endpoint?token=' + token,
    method: 'get'
  })
}
// 项目
export function project() {
  return request({
    url: '/api/v1/project?token=' + token,
    method: 'get'
  })
}
export function esbproject() {
  return request({
    url: '/api/v1/esbproject?token=' + token,
    method: 'get'
  })
}
//历史消息接收发送
export function overallReceiveCount() {
  return request({
    url: '/api/v1/metric/overall/endpoint?token=' + token,
    method: 'get'
  })
}

// 错误数量
// 集成项目
export function jccount(data) {
  return request({
    url: '/api/v1/trace/count?token=' + token,
    method: 'post',
    data: {
      findActionableDeadLetters: true,
      limit: 0
    }
  })
}
// 接口项目
export function jkcount(data) {
  return request({
    url: '/api/v1/trace/count?token=' + token,
    method: 'post',
    data: {
      findNonActionableDeadLetters: true,
      limit: 0
    }
  })
}
// 队列警报
export function jblengths() {
  return request({
    url: '/api/v1/queue/lengths?token=' + token,
    method: 'get'
  })
}
// 所有队列警报阈值
export function alljblengths() {
  return request({
    url: '/api/v1/queue/thresholds?token=' + token,
    method: 'get'
  })
}
// 消息处理数量
export function countSeries(params) {
  return request({
    url: '/api/v1/metric/overall/endpoint/countSeries?token=' + token,
    method: 'get',
    params
  })
}
// 数据清理调度信息
export function computerSearch(data) {
  return request({
    url: '/api/v1/jolokia?token=' + token,
    method: 'post',
    data
  })
}
