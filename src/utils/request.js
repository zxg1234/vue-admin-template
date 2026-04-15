import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000
})

request.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
    // Do something before the request is sent
    return config
  }
  ,
  (error) => { // Do something with the request error
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  function(response) {
    const { data, message, success } = response.data
    console.log(success)
    console.log(message)
    console.log(data)
    if (success === false) {
      Message({
        message: message || '业务错误',
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(new Error(message || 'Error'))
    } else {
      return data
    }
  },
  async function(error) {
    // eslint-disable-next-line no-undef
    Message({
      message: 'token过期，请重新登录',
      type: 'warning'
    })
    if (error.response.status === 401) {
      await store.dispatch('user/logout')
      router.push('/login')
    }
    // Any status codes that fall outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  }
)
export default request