import request from '@/utils/request'
/***************************厂商订阅 */
/** 提供方 系统List*/
export function providerSysList(data) {
  return request({
    url: '/provider/sysList',
    method: 'post',
    data
  })
}

// 系统接口未订阅
export function providerNotSubscribeInterfaceList(data) {
  return request({
    url: '/provider/notSubscribeInterfaceList',
    method: 'post',
    data
  })
}
// 系统接口已订阅
export function providerSubscribeInterfaceList(data) {
  return request({
    url: '/provider/subscribeInterfaceList',
    method: 'post',
    data
  })
}
// 订阅及取消订阅 button 接口
export function providerUpdateSubscribeInterfaceList(data) {
  return request({
    url: '/provider/updateSubscribeInterfaceList',
    method: 'post',
    data
  })
}

/** 消费方 系统List*/
export function consumerSysList(data) {
  return request({
    url: '/consumer/sysList',
    method: 'post',
    data
  })
}
// 系统接口未订阅
export function consumerNotSubscribeInterfaceList(data) {
  return request({
    url: '/consumer/notSubscribeInterfaceList',
    method: 'post',
    data
  })
}
// 系统接口已订阅
export function consumerSubscribeInterfaceList(data) {
  return request({
    url: '/consumer/subscribeInterfaceList',
    method: 'post',
    data
  })
}
// 订阅及取消订阅 button 接口
export function consumerUpdateSubscribeInterfaceList(data) {
  return request({
    url: '/consumer/updateSubscribeInterfaceList',
    method: 'post',
    data
  })
}

/***************************接口订阅 */
/** 提供方 -------------------------------------- 查询分组列表*/
export function providerGroupList() {
  return request({
    url: '/provider/groupList',
    method: 'get'
  })
}
// 根据分组查询项目列表
export function providerProjectListByGroup(data) {
  return request({
    url: '/provider/projectListByGroup',
    method: 'post',
    data
  })
}
// 根据项目查询未订阅系统列表
export function providerNotInSysListByProject(data) {
  return request({
    url: '/provider/notInSysListByProject',
    method: 'post',
    data
  })
}
// 根据项目查询已订阅系统列表
export function providersysListByProject(data) {
  return request({
    url: '/provider/sysListByProject',
    method: 'post',
    data
  })
}
// 根据项目修改订阅厂商 button 接口
export function providerUpdateSysByProject(data) {
  return request({
    url: '/provider/updateSysByProject',
    method: 'post',
    data
  })
}

/** 消费方 -------------------------------------- 查询分组列表*/
// export function consumerGroupList() {
//   return request({
//     url: '/consumer/groupList',
//     method: 'get',
//   })
// }
// 根据分组查询项目列表
export function consumerProjectListByGroup(data) {
  return request({
    url: '/consumer/projectListByGroup',
    method: 'post',
    data
  })
}
// 根据项目查询未订阅系统列表
export function consumerNotInSysListByProject(data) {
  return request({
    url: '/consumer/notInSysListByProject',
    method: 'post',
    data
  })
}
// 根据项目查询已订阅系统列表
export function consumersysListByProject(data) {
  return request({
    url: '/consumer/sysListByProject',
    method: 'post',
    data
  })
}
// 根据项目修改订阅厂商 button 接口
export function consumerUpdateSysByProject(data) {
  return request({
    url: '/consumer/updateSysByProject',
    method: 'post',
    data
  })
}

/***************************消息日志 */
//  tableData
export function serviceLogList(data) {
  return request({
    url: '/serviceLog/list',
    method: 'post',
    data
  })
}
// xml查询
export function queryXmlByResId(params) {
  return request({
    url: '/serviceLog/queryXmlByResId',
    method: 'get',
    params
  })
}

// xml 下载
export function downloadLog(params) {
  return request({
    url: '/serviceLog/downloadLog',
    method: 'get',
    responseType: 'blob',
    params
  })
}
/***************************订阅查询 */
// 接口分组List
export function consumerGroupList() {
  return request({
    url: '/consumer/groupList',
    method: 'get'
  })
}
//  按服务
export function subscriptionList(data) {
  return request({
    url: '/subscription/list',
    method: 'post',
    data
  })
}
//  按厂商
export function subscriptionListBySystem(data) {
  return request({
    url: '/subscription/listBySystem',
    method: 'post',
    data
  })
}

// ************** 用户管理
export function userQueryList(data) {
  return request({
    url: '/sysUser/queryList',
    method: 'post',
    data
  })
}
// 新增用户
export function userAdd(data) {
  return request({
    url: '/sysUser/add',
    method: 'post',
    data
  })
}
// 删除用户
export function userDelete(data) {
  return request({
    url: '/sysUser/deleteUser',
    method: 'delete',
    data
  })
}
// 更新用户
export function userUpdate(data) {
  return request({
    url: '/sysUser/updateUser',
    method: 'post',
    data
  })
}
// 重置密码
export function resetPwd(data) {
  return request({
    url: '/user/resetPwd',
    method: 'post',
    data
  })
}

// ************** 角色

// 查询角色列表
export function roleQueryList(params) {
  return request({
    url: '/sysRole/list',
    method: 'get',
    params
  })
}
// 新增角色
export function roleAdd(data) {
  return request({
    url: '/sysRole/add',
    method: 'post',
    data
  })
}
// 删除角色
export function roleDelete(roleId) {
  return request({
    url: '/sysRole/deleteById/' + roleId,
    method: 'delete'
  })
}
// 更新角色
export function roleUpdate(data) {
  return request({
    url: '/sysRole/updateRole',
    method: 'post',
    data
  })
}
// 查询功能权限列表
export function queryPermissionList() {
  return request({
    url: '/sysPermission/list',
    method: 'get'
  })
}
// 系统配置查询
export function queryConfigList(params) {
  return request({
    url: '/SSOConfig/queryList',
    method: 'get',
    params
  })
}
// 系统配置更新
export function updateConfigList(data) {
  return request({
    url: '/SSOConfig/updateList',
    method: 'post',
    data
  })
}
// 系统排序
export function sysListSort(params) {
  return request({
    url: '/sys/list',
    method: 'get',
    params
  })
}
export function sysUpdateSort(data) {
  return request({
    url: '/sys/update',
    method: 'post',
    data
  })
}
// 查询接口日调用信息
export function baseMsg() {
  return request({
    url: '/api/baseMsg',
    method: 'post'
  })
}
//  交互服务

// 今日调用失败数 今日调用总数 今日调用成功数
export function jhBaseMsg() {
  return request({
    url: '/jh/baseMsg',
    method: 'get'
  })
}
// 消息处理数量 选择时间列表
export function jhTimeList(params) {
  return request({
    url: '/jh/timeList',
    method: 'get',
    params
  })
}
// 消息处理数量
export function jhMsgHandleNum(params) {
  return request({
    url: '/jh/msgHandleNum',
    method: 'get',
    params
  })
}
// 接口列表
export function jhList(params) {
  return request({
    url: '/jh/List',
    method: 'get',
    params
  })
}
// 交互服务各服务数据量(接口)(一级)
export function queryInterfaceNum(params) {
  return request({
    url: '/InterfaceNum/queryFirstList',
    method: 'get',
    params
  })
}
// 交互服务各系统数据量(厂商)(一级)
export function queryFirstListBySystem(params) {
  return request({
    url: '/InterfaceNum/queryFirstListBySystem',
    method: 'get',
    params
  })
}

// 导出 各服务模块
export function exportInterfaceNumExcel(params) {
  return request({
    url: '/InterfaceNum/exportExcel',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

// 导出 各系统模块
export function exportExcelBySys(params) {
  return request({
    url: '/InterfaceNum/exportExcelBySys',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

// 交互服务各服务数据量(接口)(二级)
export function querySecondInterfaceNum(params) {
  return request({
    url: '/InterfaceNum/querySecondList',
    method: 'get',
    params
  })
}
// 交互服务各系统数据量(厂商)(二级)
export function querySecondListBySystem(params) {
  return request({
    url: '/InterfaceNum/querySecondListBySystem',
    method: 'get',
    params
  })
}

/**
 * 消息补推
 * */

// 提交消息
export function supplementLog(data) {
  return request({
    url: '/supplementLog',
    method: 'post',
    data
  })
}
// 查询接口编码
export function queryInterfaceList(data) {
  return request({
    url: '/queryInterfaceList',
    method: 'post',
    data
  })
}
// 根据接口编码查询消费方信息
export function queryConsumerListByCode(data) {
  return request({
    url: '/queryConsumerListByCode',
    method: 'post',
    data
  })
}
// 根据接口编码查询提供方信息
export function queryProviderListByCode(data) {
  return request({
    url: '/queryProviderListByCode',
    method: 'post',
    data
  })
}

// 查询消息补推日志
export function queryLogSupplementMessage(data) {
  return request({
    url: '/LogSupplementMessage/queryList',
    method: 'post',
    data
  })
}
