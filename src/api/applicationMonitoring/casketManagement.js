import request from '@/utils/request'

// 获取盒子列表
export function listPage(params) {
  return request({
    url: '/location/listPage',
    method: 'post',
    params
  })
}
// 获取详细信息
export function detail(data) {
  return request({
    url: '/location/detail',
    method: 'post',
    data
  })
}
// 保存
export function save(params) {
  return request({
    url: '/location/save',
    method: 'post',
    params
  })
}
// 盒子列表--重启
export function restart(params) {
  return request({
    url: '/location/restart',
    method: 'post',
    params
  })
}
// 盒子列表--停止
export function stop(params) {
  return request({
    url: '/location/stop',
    method: 'post',
    params
  })
}
// 盒子列表--同步时间
export function syncTime(params) {
  return request({
    url: '/location/syncTime',
    method: 'post',
    params
  })
}
// 盒子列表--升级
export function upgrade(params) {
  return request({
    url: '/location/upgrade',
    method: 'post',
    params
  })
}
// 获取资源监控信息
export function aiboxStatus(params) {
  return request({
    url: '/aibox/status',
    method: 'post',
    params
  })
}