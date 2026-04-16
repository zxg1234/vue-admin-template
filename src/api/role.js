import request from '@/utils/request'

export function getRoleList(data) {
  return request({
    url: `/sys/role?page=${data.page}&pagesize=${data.pageSize}`
  })
}

export function addRole(data) {
  return request({
    url: `/sys/role`,
    method: 'POST',
    data
  })
}

export function editRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'PUT',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'DELETE'
  })
}
