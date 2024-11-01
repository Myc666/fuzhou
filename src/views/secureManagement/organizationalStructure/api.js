import request from '@/utils/request'

// 获取组织机构树
export function listTree(data) {
    return request({
        url: '/ap/depart/listTree',
        method: 'post',
        data
    })
}

// 新增、编辑
export function saveData(data) {
    return request({
        url: '/ap/depart/save',
        method: 'post',
        data
    })
}

// 删除
export function deleteData(data) {
    return request({
        url: '/ap/depart/delete',
        method: 'post',
        data
    })
}

// 获取详情
export function detailData(data) {
    return request({
        url: '/ap/depart/detail',
        method: 'post',
        data
    })
}
