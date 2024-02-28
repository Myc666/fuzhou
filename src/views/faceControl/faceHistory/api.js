/*
 * @Description:
 * @Autor: 张健，dhq
 * @Date: 2022-08-09 11:19:54
 * @LastEditors: fengshiqiang-xphl fengshiqiang-xphl@gome.inc
 * @LastEditTime: 2024-01-23 22:42:26
 */
import request from '@/utils/request'

//列表
export function listPage(params) {
  return request({
    url: '/face/report/listPage2',
    method: 'post',
    params
  })
}

//列表
export function groupListData(params) {
  return request({
    url: '/face/group/listData',
    method: 'post',
    params
  })
}



//摄像头列表
export function cameraListData(params) {
  return request({
    url: '/camera/listData',
    method: 'post',
    params
  })
}
//算法列表
export function reportImage(params) {
  return request({
    url: '/face/report/image',
    method: 'get',
    responseType:'arraybuffer',
    params
  })
}

export function listByUserId(params) {
  return request({
    url: '/face/report/listByUserId',
    method: 'post',
    params
  })
}



export function save(params) {
  return request({
    url: '/face/user/saveFromStranger',
    method: 'post',
    //responseType:'arraybuffer',
    params
  })
}

