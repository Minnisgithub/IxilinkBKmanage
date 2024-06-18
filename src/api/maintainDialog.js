import request from '@/utils/request'

// 添加
export function insert (data) {
    return request({
        url: '/task/insert',
        method: 'post',
        data
    })
}

// 添加http任务信息
export function insertHttpMsg (data) {
    return request({
        url: '/task/insertHttpMsg',
        method: 'post',
        data
    })
}

// 批量添加
export function insertList (data) {
    return request({
        url: '/task/insertList',
        method: 'post',
        data
    })
}

// 批量添加Http
export function insertHttpList (data) {
    return request({
        url: '/task/insertHttpList ',
        method: 'post',
        data
    })
}

// 查询任务信息列表
export function getTaskInfo (data) {
    return request({
        url: '/task/queryByInterCodeAndSysCode',
        method: 'post',
        data
    })
}

// 查询http任务信息列表
export function getHttpTaskInfo (data) {
    return request({
        url: '/task/queryHttpByInterCodeAndSysCode',
        method: 'post',
        data
    })
}

// 修改任务信息
export function updateList (data) {
    return request({
        url: '/task/update',
        method: 'post',
        data
    })
}
// 修改http任务信息
export function updateHttpMsg (data) {
    return request({
        url: '/task/updateHttpMsg',
        method: 'post',
        data
    })
}

// 删除
export function taskDelete (data) {
    return request({
        url: '/task/delete',
        method: 'delete',
        data
    })
}

// 批量删除
export function taskDeleteList (data) {
    return request({
        url: '/task/deleteByInterCodeAndSysCode',
        method: 'delete',
        data
    })
}

// 批量删除http任务信息
export function httpTaskDeleteList (data) {
    return request({
        url: '/task/deleteHttpByInterCodeAndSysCode',
        method: 'delete',
        data
    })
}
