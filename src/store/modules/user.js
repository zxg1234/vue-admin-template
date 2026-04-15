import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getUserInfo } from '@/api/user'
const state = {
  token: getToken(), // token
  userInfo: {} // 用户基本信息
}

const mutations = {
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  removeToken(state) {
    state.token = null
    removeToken()
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  }
}

const actions = {
  // 登录
  async login(context, data) {
    const response = await login(data)
    context.commit('setToken', response)
  },
  // 获取用户信息
  async getUserInfo(context) {
    const userInfo = await getUserInfo()
    context.commit('setUserInfo', userInfo)
  },
  // 退出登录
  logout(context) {
    context.commit('removeToken')
    context.commit('setUserInfo', {})
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
