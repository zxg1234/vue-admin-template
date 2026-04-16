import request from '@/utils/request'

export function getDepartmentList() {
  return request({
    url: '/company/department'
  })
}

export function getManagerList() {
  return request({
    url: '/sys/user/simple'
  })
}

export function addDepartment(data) {
  return request({
    url: '/company/department',
    method: 'POST',
    data
  })
}

