import state from './state'
module.exports = {
  state,
  mutations: {
      setUserName(state, userName) {
        state.userName = userName
      },
      setRoleId(state, roleId) {
        state.roleId = roleId
      },
      setToken(state, token) {
        state.token = token
      },
  },
  actions: {},
  getters: {}
}