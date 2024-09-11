import request from '@/utils/request'

// 获取盒子列表
export function treeBasic(data) {
    return request({
        url: '/aibox/basic/tree',
        method: 'post',
        data
    })
}

// 新增、修改
export function saveBasic(data) {
    return request({
        url: '/aibox/basic/save',
        method: 'post',
        data
    })
}

// 获取组织机构树
export function listTree(data) {
    return request({
        url: '/ap/depart/listTree',
        method: 'post',
        data
    })
}