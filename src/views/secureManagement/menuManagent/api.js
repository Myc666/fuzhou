import request from '@/utils/request'

// 获取菜单列表
export function listData(data) {
  return request({
      url: '/ap/menus/listTree',
      method: 'post',
      data
  })
}

// 获取菜单列表
export function save(data) {
  return request({
      url: '/ap/menus/save',
      method: 'post',
      data
  })
}

// 获取菜单列表
export function del(data) {
  return request({
      url: '/ap/menus/delete',
      method: 'post',
      data
  })
}

// 获取菜单列表
export function detail(data) {
  return request({
      url: '/ap/menus/detail',
      method: 'post',
      data
  })
}





