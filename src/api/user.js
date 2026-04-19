import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'get'
  })
}

export function updatePassword(data) {
  return request({
    url: '/sys/user/updatePass',
    method: 'put',
    data
  })
}

export function userPageList(data) {
  return request({
    url: `/sys/user?page=${data.page}&pagesize=${data.pagesize}&keyword=${data.keyword}&departmentId=${data.departmentId}`
  })
}
