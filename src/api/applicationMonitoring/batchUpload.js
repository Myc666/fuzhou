import request from '@/utils/request'

// 上传csv文件
export function upload(data) {
    return request({
      url: '/cameraImport/upload',
      method: 'post',
      data
    })
}
// 清除上传记录
export function deleteAll(data) {
    return request({
      url: '/cameraImport/deleteAll',
      method: 'post',
      data
    })
}
// 开始校验
export function startCheck(data) {
    return request({
      url: '/cameraImport/startCheck',
      method: 'post',
      data
    })
}
// 获取校验进度
export function getCheckSchedule(params) {
    return request({
      url: '/cameraImport/getCheckSchedule',
      method: 'get',
      params
    })
}
// 获取校验结果
export function getCheckResult(params) {
  return request({
    url: '/cameraImport/getCheckResult',
    method: 'get',
    params
  })
}
// 根据校验状态查询列表数据
export function listDataByCheckState(params) {
    return request({
      url: '/cameraImport/listDataByCheckState',
      method: 'get',
      params
    })
}
// 开始导入
export function startImport(data) {
    return request({
      url: '/cameraImport/startImport',
      method: 'post',
      data
    })
}
// 获取导入进度
export function getImportSchedule(params) {
    return request({
      url: '/cameraImport/getImportSchedule',
      method: 'get',
      params
    })
}
// 获取导入结果
export function getImportResult(params) {
  return request({
    url: '/cameraImport/getImportResult',
    method: 'get',
    params
  })
}
// 根据导入状态查询列表数据
export function listDataByImportState(params) {
    return request({
      url: '/cameraImport/listDataByImportState',
      method: 'get',
      params
    })
}
// 获取整体进度
export function getState(params) {
  return request({
    url: '/cameraImport/getState',
    method: 'get',
    params
  })
}
// 校验之后删除数据
export function deleteById(params) {
  return request({
    url: '/cameraImport/deleteById',
    method: 'post',
    params
  })
}
// 修改校验之后的错误数据
export function update(data) {
  return request({
    url: '/cameraImport/update',
    method: 'post',
    data
  })
}
// 单条校验
export function checkBasicById(params) {
  return request({
    url: '/cameraImport/checkBasicById',
    method: 'post',
    params
  })
}
