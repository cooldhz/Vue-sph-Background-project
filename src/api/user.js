import request from '@/utils/request'

// POST /admin/acl/index/login
export function login(data) {
  return request({
    url: '/admin/acl/index/login',
    method: 'post',
    data
  })
}

// GET /admin/acl/index/info
export function getInfo(token) {
  return request({
    url: '/admin/acl/index/info',
    method: 'get',
    params: { token }
  })
}

// POST /admin/acl/index/logout
export function logout() {
  return request({
    url: '/admin/acl/index/logout',
    method: 'post'
  })
}
