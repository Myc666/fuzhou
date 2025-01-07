import request from '@/utils/request'


// ivDept树结构
export function deptTree(data) {
  return request({
    url: '/ivuser/dept/tree',
    method: 'post',
    data
  })
}

// 用户列表
export function userList(data) {
    return request({
      url: '/ivuser/user/list',
      method: 'post',
      data
    })
}

// 用户新增
export function saveIvUser(data) {
    return request({
      url: '/ap/account/saveIvUser',
      method: 'post',
      data
    })
}

// 部门新增 v2
export function saveIvOrg(data) {
  return request({
    url: '/ivorg/fast/save',
    method: 'post',
    data
  })
}

// 部门删除 v2
export function delIvOrg(data) {
  return request({
    url: '/ivorg/fast/delete',
    method: 'post',
    data
  })
}

// 部门信息 v2
export function infoIvOrg(data) {
  return request({
    url: '/ivorg/fast/info',
    method: 'post',
    data
  })
}

// 部门树 v2
export function treeIvOrg(data) {
  return request({
    url: '/ivorg/fast/tree',
    method: 'post',
    data
  })
}

// 用户新增 v2
export function saveIvUserV2(data) {
  return request({
    url: '/ivuser/fast/save',
    method: 'post',
    data
  })
}

// 用户删除 v2
export function delIvUserV2(data) {
  return request({
    url: '/ivuser/fast/delete',
    method: 'post',
    data
  })
}

// 用户信息 v2
export function infoIvUserV2(data) {
  return request({
    url: '/ivuser/fast/info',
    method: 'post',
    data
  })
}

// 用户列表 v2
export function listIvUserV2(data) {
  return request({
    url: '/ivuser/fast/list',
    method: 'post',
    data
  })
}