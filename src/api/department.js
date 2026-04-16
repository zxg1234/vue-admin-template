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

export function queryDept(id) {
  return request({
    url: `/company/department/${id}`
  })
}

export function updateDepartment(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'PUT',
    data
  })
}

