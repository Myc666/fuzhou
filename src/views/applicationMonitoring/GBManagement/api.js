import request from '@/utils/request'


// 获取国标设备列表
export function deviceList(data) {
  return request({
    url: '/wvp/device/listPage',
    method: 'post',
    data
  })
}

// 获取国标设备通道列表
export function channelList(data) {
    return request({
      url: '/wvp/device/channel/listPage',
      method: 'post',
      data
    })
}

// 国标接入
export function getAccessInfo(data) {
    return request({
      url: '/wvp/device/channel/getAccessInfo',
      method: 'post',
      data
    })
}

// 查询国标配置信息
export function getConfigInfo(data) {
    return request({
      url: '/wvp/device/getConfigInfo',
      method: 'post',
      data
    })
}

// 同步通道
export function channelSync(data) {
  return request({
    url: '/wvp/device/sync',
    method: 'post',
    data
  })
}

// 获取通道同步结果
export function channelSyncStatus(data) {
  return request({
    url: '/wvp/device/syncStatus',
    method: 'post',
    data
  })
}