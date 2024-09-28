import request from '@/utils/request'

// 总数量统计
export function summary(data) {
    return request({
        url: '/tracker/report/summary',
        method: 'post',
        data
    })
}

// 分页查询
export function listPage(data) {
    return request({
        url: '/tracker/report/listPage',
        method: 'post',
        data
    })
}

// 统计图
export function timeline(data) {
    return request({
        url: '/tracker/report/timeline',
        method: 'post',
        data
    })
}

// 数据导出
export function exportData(data) {
    return request({
        url: '/tracker/report/export',
        method: 'post',
        data,
        responseType: 'blob',
    })
}
