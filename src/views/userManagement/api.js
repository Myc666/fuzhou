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