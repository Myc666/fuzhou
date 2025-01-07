import request from '@/utils/request'
//获取列表数据
export function ledList(data) {
  return request({
    url: '/led/device/list',
    method: 'post',
    data
  })
}
//保存
export function ledSave(data) {
    return request({
      url: '/led/device/save',
      method: 'post',
      data
    })
}
//删除
export function ledDelete(data) {
    return request({
      url: '/led/device/delete',
      method: 'post',
      data
    })
  }
//获取详情
export function ledInfo(data) {
    return request({
      url: '/led/device/info',
      method: 'post',
      data
    })
  }
//获取有效摄像头
export function listData2(data) {
    return request({
      url: '/camera/listData2',
      method: 'post',
      data
    })
  }
// 验证
export function ledCheck(data) {
  return request({
    url: '/led/device/check',
    method: 'post',
    data
  })
}