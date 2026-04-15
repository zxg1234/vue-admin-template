import router from '@/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'

const WHITE_LIST = ['/login', '/404'] // 不重定向白名单
router.beforeEach(async(to, from, next) => {
  // 开启进度条
  NProgress.start()
  if (store.getters.token) {
    // 有token
    if (!store.getters.userId) {
      await store.dispatch('user/getUserInfo')
    }
    if (to.path === '/login') {
      // 已登录，重定向到主页
      next({ path: '/' })
    } else {
      next()
    }
  } else {
    // 没有token
    if (!WHITE_LIST.includes(to.path)) {
      // 如果目标路由不在白名单中，则重定向到登录页
      next({ path: '/login' })
    } else {
      next()
    }
  }
})

router.afterEach(() => {
  // 结束进度条
  NProgress.done()
})
