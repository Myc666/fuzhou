/*
 * @Description:
 * @Autor: 张健，dhq
 * @Date: 2022-08-09 11:19:54
 * @LastEditors: 张健，dhq 327650114@qq.com
 * @LastEditTime: 2022-09-26 14:00:27
 */
import request from '@/utils/request'


// 获取告警列表
export function getListData(params) {
  return request({
    url: '/report/listPage',
    method: 'post',
    params
  })
}

// 获取告警详情
export function getListDataDetail(params) {
  return request({
    url: '/report/detail',
    method: 'post',
    params
  })
}

// 获取摄像头列表
export function getCameraListData(params) {
  return request({
    url: '/camera/listData',
    method: 'post',
    params
  })
}

// 获取算法列表
export function getAlgorithmListData(params) {
  return request({
    url: '/algorithm/listData',
    method: 'post',
    params
  })
}

// 获取告警类型列表
export function getTypeListData(params) {
  return request({
    url: '/report/reportTypes',
    method: 'post',
    params
  })
}

// 推送告警
export function pushData(params) {
  return request({
    url: '/report/pushData',
    method: 'post',
    params
  })
}

// 保存定时任务清除告警信息天数
export function saveclearReportDayConfig(params) {
  return request({
    url: '/config/saveClearReportDayConfig',
    method: 'post',
    params
  })
}