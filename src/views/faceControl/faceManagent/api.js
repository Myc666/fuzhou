/*
 * @Description:
 * @Autor: 张健，dhq
 * @Date: 2022-08-09 11:19:54
 * @LastEditors: fengshiqiang-xphl fengshiqiang-xphl@gome.inc
 * @LastEditTime: 2023-10-31 13:13:02
 */
import request from '@/utils/request'

//人员列表
export function listPage(params) {
  return request({
    url: '/face/user/listPage',
    method: 'post',
    params
  })
}
//删除人员
export function delect(params) {
  return request({
    url: '/face/user/delete',
    method: 'post',
    params
  })
}

//新增保存人员
export function save(data) {
  return request({
    url: '/face/user/save',
    method: 'post',
    data
  })
}
//人员详情
export function detail(params) {
  return request({
    url: '/face/user/detail',
    method: 'get',
    params
  })
}

//新增保存分组
export function saveGroup(data) {
  return request({
    url: '/face/group/save',
    method: 'post',
    data
  })
}

//分组列表
export function listPageDGroup(params) {
  return request({
    url: '/face/group/listData',
    method: 'post',
    params
  })
}

//删除分组
export function delectGroup(params) {
  return request({
    url: '/face/group/delete',
    method: 'post',
    params
  })
}


