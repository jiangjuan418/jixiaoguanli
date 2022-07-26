export default {
  state: {
    realName: '',
    userId: '',
    hasData: false
  },
  mutations: {
    setRealName (state, latestData) {
      state.hasData = true
      state.realName = latestData.realName
      state.userId = latestData.userId
      sessionStorage.setItem('loginData', JSON.stringify(latestData))
    }
  }
}
