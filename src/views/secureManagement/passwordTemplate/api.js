import request from '@/utils/request'

// 获取密码模板列表
export function templateList(data) {
    return request({
        url: '/ap/pass/template/listData',
        method: 'post',
        data
    })
}

// 获取密码项
export function listData(data) {
    return request({
        url: '/ap/pass/rule/listData',
        method: 'post',
        data
    })
}

// 新增、编辑
export function saveTemplate(data) {
    return request({
        url: '/ap/pass/template/save',
        method: 'post',
        data
    })
}

// 删除
export function deleteTemplate(data) {
    return request({
        url: '/ap/pass/template/delete',
        method: 'post',
        data
    })
}

// 详情
export function detailTemplate(data) {
    return request({
        url: '/ap/pass/template/detail',
        method: 'post',
        data
    })
}