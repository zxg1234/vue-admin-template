import { getToken, setToken, removeToken } from '@/utils/auth'
const state = {
  token: getToken()
}

const mutations = {
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  removeToken(state) {
    state.token = null
    removeToken()
  }
}

const actions = {
  async login(context, data) {
    console.log(11111111111)
    console.log(data)
    // todo 异步调用后台接口生活token
    const linshiToken = '123456'
    context.commit('setToken', linshiToken)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
