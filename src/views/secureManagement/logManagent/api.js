import request from '@/utils/request'

// 获取日志模块
export function logModules(data) {
    return request({
        url: '/oplog/modules',
        method: 'post',
        data
    })
}

// 获取日志类型
export function logTypes(data) {
    return request({
        url: '/oplog/logtypes',
        method: 'post',
        data
    })
}

// 获取日志操作类型
export function getTypes(data) {
    return request({
        url: '/oplog/types',
        method: 'post',
        data
    })
}

// 获取日志列表
export function listPage(data) {
    return request({
        url: '/oplog/listPage',
        method: 'post',
        data
    })
}