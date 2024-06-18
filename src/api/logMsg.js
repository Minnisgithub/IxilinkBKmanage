import request from '@/utils/request'

export function querylogLoginList(data) {
  return request({
    url: '/logLogin/queryList',
    method: 'post',
    data
  })
}
export function querylogDoList(data) {
  return request({
    url: '/logDo/list',
    method: 'post',
    data
  })
}
