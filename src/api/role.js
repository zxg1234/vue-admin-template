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
