import request from '@/utils/request'

// 获取用户列表
export function listData(data) {
    return request({
        url: '/ap/account/listPage',
        method: 'post',
        data
    })
}

// 新增用户
export function saveData(data) {
    return request({
        url: '/ap/account/save',
        method: 'post',
        data
    })
}

// 编辑用户
export function updateData(data) {
    return request({
        url: '/ap/account/update',
        method: 'post',
        data
    })
}

// 删除用户
export function deleteData(data) {
    return request({
        url: '/ap/account/delete',
        method: 'post',
        data
    })
}

// 获取用户详情
export function detailData(data) {
    return request({
        url: '/ap/account/detail',
        method: 'post',
        data
    })
}


export function modifyPassword(params) {
    return request({
        url: 'ap/account/modifyPassword',
        method: 'post',
        params
    })
}
