/*
 * @Description:
 * @Autor: 张健，dhq
 * @Date: 2022-08-09 11:19:54
 * @LastEditors: fengshiqiang-xphl fengshiqiang-xphl@gome.inc
 * @LastEditTime: 2023-11-06 22:38:36
 */
import request from '@/utils/request'
//第三方
export function saveAlarmPushConfig(params) {
  return request({
    url: '/config/saveAlarmPushConfig',
    method: 'post',
    params
  })
}
//短信
export function saveAlarmSmsConfig(params) {
  return request({
    url: '/config/saveAlarmSmsConfig',
    method: 'post',
    params
  })
}
//微信

export function saveAlarmWeworkConfig(params) {
  return request({
    url: '/config/saveAlarmWeworkConfig',
    method: 'post',
    params
  })
}
